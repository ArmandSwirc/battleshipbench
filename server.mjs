// Zeeslag-server: serveert index.html, beheert API-providers (providers.json, sleutels blijven hier) en stuurt
// chatverzoeken door naar de lokale Splash-gateway of naar een provider (OpenAI-compatibel).
// Start: node server.mjs   ->  http://127.0.0.1:8791/
import { createServer } from "node:http";
import { spawn, execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, chmodSync, appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { saveArena, publish } from "./results.mjs";

const PORT = Number(process.env.PORT ?? 8791);
const GATEWAY = (process.env.QWEN_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
const FILE = fileURLToPath(new URL("./providers.json", import.meta.url));
const page = () => readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)));

const load = () => (existsSync(FILE) ? JSON.parse(readFileSync(FILE, "utf8")).providers ?? [] : []);
const save = (providers) => {
  writeFileSync(FILE, JSON.stringify({ providers }, null, 2));
  chmodSync(FILE, 0o600);
};
const pub = (p) => ({ id: p.id, name: p.name, baseUrl: p.baseUrl, models: p.models, hasKey: !!p.apiKey, decision: !!p.decision });
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32);
const json = (res, code, obj) => res.writeHead(code, { "content-type": "application/json", "cache-control": "no-store" }).end(JSON.stringify(obj));
const readBody = async (req) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const t = Buffer.concat(chunks).toString("utf8");
  return t ? JSON.parse(t) : {};
};
// Anthropic heeft een eigen API (/v1/messages, x-api-key); de proxy vertaalt die naar OpenAI-stijl SSE voor de pagina.
const isAnthropic = (p) => /^https?:\/\/api\.anthropic\.com(\/|$)/.test(p.baseUrl);
const baseOf = (p) => { const b = p.baseUrl.replace(/\/+$/, ""); return isAnthropic(p) ? b.replace(/\/messages$/, "") : b; };
const authHeaders = (p) => !p.apiKey ? {} : isAnthropic(p) ? { "x-api-key": p.apiKey, "anthropic-version": "2023-06-01" } : { authorization: `Bearer ${p.apiKey}` };

function toAnthropic(body) {
  const system = body.messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
  const out = { model: body.model, max_tokens: body.max_tokens ?? 4096, stream: true, messages: body.messages.filter((m) => m.role !== "system") };
  // Expliciet breekpunt op de system-prompt (vast deel). Wordt stil genegeerd onder de minimumlengte van het model (512-4096 tokens).
  // Bewust geen automatische cache_control bovenaan: die zou het wisselende bord elke beurt als 1,25x-schrijfactie cachen zonder ooit te lezen.
  if (system) out.system = [{ type: "text", text: system, cache_control: { type: "ephemeral" } }];
  // temperature wordt door nieuwere Claude-modellen geweigerd (deprecated), dus niet doorgestuurd
  return out;
}
// Anthropic-SSE -> OpenAI-SSE (content / reasoning_content), zodat relay() en de pagina ongewijzigd blijven.
async function* fromAnthropic(up) {
  const dec = new TextDecoder(); let buf = "";
  for await (const chunk of up.body) {
    buf += dec.decode(chunk, { stream: true });
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line.startsWith("data:")) continue;
      let j; try { j = JSON.parse(line.slice(5)); } catch { continue; }
      if (j.type === "message_start" && j.message?.usage) {
        const u = j.message.usage;
        console.error(`[cache] ${j.message.model} in=${u.input_tokens} write=${u.cache_creation_input_tokens ?? 0} read=${u.cache_read_input_tokens ?? 0}`);
      } else if (j.type === "content_block_delta") {
        if (j.delta?.text) yield sse({ content: j.delta.text });
        else if (j.delta?.thinking) yield sse({ reasoning_content: j.delta.thinking });
      } else if (j.type === "error") yield sse({ content: `[Anthropic-fout: ${j.error?.message ?? "onbekend"}]` });
    }
  }
  yield "data: [DONE]\n\n";
}

async function listModels(p) {
  const r = await fetch(`${baseOf(p)}/models`, { headers: authHeaders(p), signal: AbortSignal.timeout(10000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  return (j.data ?? j.models ?? []).map((m) => m.id ?? m.name).filter(Boolean).sort();
}

// Denk-bewaking: het model mag hoog redeneren, maar niet eindeloos. Loopt het denken over het budget (chunks ~ tokens)
// of herhaalt het zichzelf, dan breekt de proxy de call af en vraagt dezelfde vraag opnieuw zonder denken, met het
// begin van de redenering erbij. De pagina ziet één doorlopende stream.
const THINK_BUDGET = Number(process.env.THINK_BUDGET ?? 6000);
const THINK_KEEP = 6000; // tekens redenering die meegaan naar de afgedwongen call
const sse = (delta) => `data: ${JSON.stringify({ choices: [{ index: 0, delta }] })}\n\n`;
const looping = (think) => {
  if (think.length < 2000) return false;
  const tail = think.slice(-400);
  let n = 0, at = -1;
  while ((at = think.indexOf(tail, at + 1)) >= 0 && n < 3) n++;
  return n >= 3;
};

// SSE-verwerking per call: verzamelt denken en antwoord en bewaakt de denklengte (alleen met guard, zolang er geen antwoord is).
const newState = (guard, budget = THINK_BUDGET) => ({ dec: new TextDecoder(), buf: "", think: "", content: "", chunks: 0, guard, budget, why: "" });
function feed(st, chunk) {
  st.buf += typeof chunk === "string" ? chunk : st.dec.decode(chunk, { stream: true }); // fromAnthropic levert strings
  let i;
  while ((i = st.buf.indexOf("\n")) >= 0) {
    const line = st.buf.slice(0, i).trim(); st.buf = st.buf.slice(i + 1);
    if (!line.startsWith("data:")) continue;
    let j; try { j = JSON.parse(line.slice(5)); } catch { continue; }
    const dl = j.choices?.[0]?.delta ?? {};
    if (dl.content) { st.content += dl.content; continue; }
    const rt = dl.reasoning_content ?? dl.reasoning ?? "";
    if (!rt) continue;
    st.think += rt; st.chunks++;
    if (!st.guard || st.content) continue;
    st.why = st.chunks > st.budget ? `budget van ${st.budget} denk-tokens op` : st.chunks % 100 === 0 && looping(st.think) ? "herhaling in het denken" : "";
    if (st.why) return true;
  }
  return false;
}
// Geeft de stream door aan de pagina; stopt bij afbreken (de for-await sluit dan de upstream-verbinding).
async function relay(up, res, st) {
  for await (const chunk of up.src ?? up.body) { res.write(chunk); if (feed(st, chunk)) return; }
}

// Bench-slots (a | b): live-bestand per slot, bench.mjs draait als los proces en schrijft zijn pid mee.
const slotOf = (req) => (new URL(req.url, "http://x").searchParams.get("slot") === "b" ? "b" : "a");
const liveFile = (slot) => fileURLToPath(new URL(slot === "b" ? "./bench-live-b.json" : "./bench-live.json", import.meta.url));
const readLive = (slot) => { try { return JSON.parse(readFileSync(liveFile(slot), "utf8")); } catch { return null; } };
const alive = (pid) => { try { return !!pid && process.kill(pid, 0); } catch { return false; } };

// Logboek per call (calls.jsonl): voor het vergelijken van modellen achteraf.
const LOG = fileURLToPath(new URL("./calls.jsonl", import.meta.url));
function logCall(e) {
  try { appendFileSync(LOG, JSON.stringify(e) + "\n"); } catch {}
}

// Scores (matches.jsonl): één regel per afgeronde partij; /api/scores telt ze op per model (incl. Elo, K=32, start 1000).
const MATCHES = fileURLToPath(new URL("./matches.jsonl", import.meta.url));
const loadMatches = () => (existsSync(MATCHES) ? readFileSync(MATCHES, "utf8").split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean) : []);
function scoreboard(matches) {
  const M = new Map(), elo = new Map();
  const row = (m) => M.get(m) ?? (M.set(m, { model: m, games: 0, wins: 0, shots: 0, hits: 0, winShots: 0, fallbacks: 0, ownPlace: 0 }), M.get(m));
  for (const g of matches) {
    const ms = [g.a, g.b];
    for (const x of ms) {
      const r = row(x.model);
      r.games++; r.shots += x.shots; r.hits += x.hits; r.fallbacks += x.fallbacks ?? 0; r.ownPlace += x.ownPlacement ? 1 : 0;
    }
    const w = g.winner === "A" ? g.a : g.b, l = g.winner === "A" ? g.b : g.a;
    row(w.model).wins++; row(w.model).winShots += w.shots;
    const ew = elo.get(w.model) ?? 1000, el = elo.get(l.model) ?? 1000, exp = 1 / (1 + 10 ** ((el - ew) / 400));
    elo.set(w.model, ew + 32 * (1 - exp)); elo.set(l.model, el - 32 * (1 - exp));
  }
  return [...M.values()].map((r) => ({ ...r, elo: Math.round(elo.get(r.model) ?? 1000), winRate: r.wins / r.games, accuracy: r.shots ? r.hits / r.shots : 0, avgShotsToWin: r.wins ? r.winShots / r.wins : null })).sort((a, b) => b.elo - a.elo);
}
const side = (x) => ({ model: String(x?.model ?? ""), shots: Number(x?.shots) || 0, hits: Number(x?.hits) || 0, fallbacks: Number(x?.fallbacks) || 0, ownPlacement: !!x?.ownPlacement, placement: String(x?.placement ?? "").slice(0, 2000), ...(x?.strategy ? { strategyName: String(x.strategyName ?? "").slice(0, 60), strategy: String(x.strategy).slice(0, 20000) } : {}) });
const firstJSON = (t) => { const a = t.indexOf("{"), b = t.lastIndexOf("}"); if (a < 0 || b < a) return null; try { return JSON.parse(t.slice(a, b + 1)); } catch { return null; } };

async function handle(req, res) {
  const path = new URL(req.url, "http://x").pathname;

  if (req.method === "GET" && (path === "/" || path === "/index.html"))
    return void res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }).end(page());

  if (req.method === "POST" && path === "/api/matches") {
    const b = await readBody(req), a = side(b.a), c = side(b.b);
    if (!a.model || !c.model || (b.winner !== "A" && b.winner !== "B")) return json(res, 400, { error: "a.model, b.model en winner (A|B) zijn verplicht" });
    const rec = { ts: new Date().toISOString(), mode: b.mode === "free" ? "free" : "bench", a, b: c, winner: b.winner };
    appendFileSync(MATCHES, JSON.stringify(rec) + "\n");
    try { // strategy, shots and board images per pairing in results/arena/<A>_vs_<B>/, then push
      const full = (x) => ({ ...side(x), hits: Number(x?.hits) || 0, foeFleet: x?.foeFleet, moves: (x?.moves ?? []).map((m) => ({ cell: String(m.cell), result: String(m.result), ...(m.why ? { why: String(m.why).slice(0, 500) } : {}), ...(m.fallback ? { fallback: true } : {}) })) });
      if (Array.isArray(b.a?.moves) && Array.isArray(b.a?.foeFleet) && Array.isArray(b.b?.moves) && Array.isArray(b.b?.foeFleet)) {
        saveArena({ ts: rec.ts, mode: rec.mode, winner: b.winner, a: full(b.a), b: full(b.b) });
        try { execFileSync(process.execPath, ["bench.mjs", "readme"], { cwd: fileURLToPath(new URL(".", import.meta.url)), stdio: "pipe" }); } catch (e) { console.error("readme:", e.message.split("\n")[0]); } // leaderboard graphics + tables
        try { publish(`results: arena ${rec.a.model} vs ${rec.b.model}`); } catch {}
      }
    } catch (e) { console.error("results:", e.message); }
    return json(res, 200, rec);
  }
  if (req.method === "GET" && path === "/api/scores") return json(res, 200, { scores: scoreboard(loadMatches()), matches: loadMatches().slice(-30).reverse() });

  if (req.method === "GET" && path === "/bench") return void res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }).end(readFileSync(fileURLToPath(new URL("./bench.html", import.meta.url))));
  if (req.method === "GET" && path === "/api/bench/live") {
    const live = readLive(slotOf(req));
    return void res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" }).end(JSON.stringify(live ? { ...live, alive: alive(live.pid) } : { status: "idle", alive: false }));
  }
  if (req.method === "POST" && path === "/api/bench/stop") {
    const slot = slotOf(req), live = readLive(slot);
    if (live && alive(live.pid)) process.kill(live.pid, "SIGTERM");
    else if (live && !["done", "stopped"].includes(live.status)) { live.status = "stopped"; writeFileSync(liveFile(slot), JSON.stringify(live)); }
    return json(res, 200, { ok: true });
  }
  if (req.method === "POST" && path === "/api/bench/start") {
    const slot = slotOf(req), body = await readBody(req), live = readLive(slot);
    if (live && alive(live.pid)) return json(res, 409, { error: { message: `slot ${slot} draait al` } });
    if (!/^[\w.\-]+\/\S+$/.test(String(body.model ?? ""))) return json(res, 400, { error: { message: "model ontbreekt" } });
    const boards = Math.min(10, Math.max(1, Number(body.boards) || 3));
    try { writeFileSync(liveFile(slot), JSON.stringify({ status: "starting", name: body.model, shots: [], results: [], think: "" })); } catch {}
    const child = spawn(process.execPath, ["bench.mjs", "run", body.model, "--boards", String(boards), "--slot", slot], { cwd: fileURLToPath(new URL(".", import.meta.url)), detached: true, stdio: "ignore", env: { ...process.env, BENCH_SERVER: `http://127.0.0.1:${PORT}` } });
    child.unref();
    return json(res, 200, { started: child.pid });
  }

  if (req.method === "GET" && path === "/api/providers") return json(res, 200, load().map(pub));

  if (req.method === "POST" && path === "/api/providers") {
    const b = await readBody(req);
    const name = String(b.name ?? "").trim(), baseUrl = String(b.baseUrl ?? "").trim();
    if (!name || !/^https?:\/\//.test(baseUrl)) return json(res, 400, { error: "naam en base-URL (http…) zijn verplicht" });
    const id = slug(name);
    if (!id || id === "local") return json(res, 400, { error: "ongeldige naam" });
    const all = load(), old = all.find((p) => p.id === id);
    const models = Array.isArray(b.models) ? b.models.map(String).map((s) => s.trim()).filter(Boolean) : old?.models ?? [];
    const next = { id, name, baseUrl, apiKey: b.apiKey ? String(b.apiKey) : old?.apiKey ?? "", models, ...(old?.decision ? { decision: true } : {}) };
    save(old ? all.map((p) => (p.id === id ? next : p)) : [...all, next]);
    return json(res, 200, pub(next));
  }

  const m = /^\/api\/providers\/([a-z0-9-]+)(\/models)?$/.exec(path);
  if (m) {
    const all = load(), p = all.find((x) => x.id === m[1]);
    if (!p) return json(res, 404, { error: "provider onbekend" });
    if (req.method === "DELETE" && !m[2]) {
      save(all.filter((x) => x.id !== p.id));
      return json(res, 200, { ok: true });
    }
    if (req.method === "POST" && m[2]) {
      try {
        p.models = await listModels(p);
        save(all);
        return json(res, 200, pub(p));
      } catch (e) {
        return json(res, 502, { error: `modellen ophalen mislukt: ${e.message}` });
      }
    }
  }

  if (req.method === "GET" && path === "/api/models") {
    const groups = [];
    try {
      const j = await (await fetch(`${GATEWAY}/v1/models`, { signal: AbortSignal.timeout(3000) })).json();
      groups.push({ id: "local", name: "Splash (lokaal)", models: (j.data ?? []).map((x) => x.id) });
    } catch {
      groups.push({ id: "local", name: "Splash (lokaal)", models: [], error: "niet bereikbaar" });
    }
    for (const p of load()) groups.push({ id: p.id, name: p.name, models: p.models, ...(p.decision ? { decision: true } : {}) });
    return json(res, 200, groups);
  }

  // Decision-modellen (Unsloth /v1/systemone, Jev-stijl): geen chat, maar getypte vragen (choice/noul/score); de sleutel blijft hier.
  if (req.method === "POST" && path === "/api/decide") {
    const b = await readBody(req), ref = String(b.model ?? ""), i = ref.indexOf("/");
    const p = load().find((x) => x.id === ref.slice(0, i));
    if (!p?.decision) return json(res, 400, { error: `'${ref.slice(0, i)}' is geen decision-provider` });
    try {
      const up = await fetch(`${baseOf(p)}/systemone`, { method: "POST", headers: { "content-type": "application/json", ...authHeaders(p) }, body: JSON.stringify({ model: ref.slice(i + 1), state: b.state, questions: b.questions }), signal: AbortSignal.timeout(180000) });
      res.writeHead(up.status, { "content-type": "application/json", "cache-control": "no-store" }).end(await up.text());
    } catch (e) { json(res, 502, { error: `${p.id} niet bereikbaar: ${e.message}` }); }
    return;
  }

  if (req.method === "POST" && path === "/api/chat") {
    const body = await readBody(req);
    const unlimited = body.think_budget === 0; // 1v1 Vrij spel: geen denkbudget, geen lusbewaking, geen max_tokens
    const budget = Math.min(THINK_BUDGET * 2, Math.max(200, Number(body.think_budget) || THINK_BUDGET)); delete body.think_budget; // de bench mag strenger dan de standaard
    const ref = String(body.model ?? ""), i = ref.indexOf("/");
    const pid = ref.slice(0, i);
    let target, anth = false;
    const headers = { "content-type": "application/json" };
    if (pid === "local") {
      target = `${GATEWAY}/v1/chat/completions`;
      headers["x-qwen-client"] = "battleship";
      if (!unlimited) body.max_tokens = 8192 + 1024; // 8K denken + ruimte voor het JSON-antwoord
    } else {
      const p = load().find((x) => x.id === pid);
      if (!p) return json(res, 400, { error: { message: `provider '${pid}' onbekend` } });
      anth = isAnthropic(p);
      target = `${baseOf(p)}/${anth ? "messages" : "chat/completions"}`;
      Object.assign(headers, authHeaders(p));
      delete body.chat_template_kwargs; // alleen Splash kent deze parameter
      if (unlimited && anth) body.max_tokens = 32000; // Anthropic eist een waarde: zo ruim mogelijk
    }
    body.model = ref.slice(i + 1);
    const payload = (b) => JSON.stringify(anth ? toAnthropic(b) : b);
    const wrap = (u) => { if (anth && u.ok) u.src = fromAnthropic(u); return u; };
    let ctl = new AbortController(), gone = false; const t0 = Date.now();
    res.on("close", () => { gone = true; ctl.abort(); });
    try {
      const up = wrap(await fetch(target, { method: "POST", headers, body: payload(body), signal: ctl.signal }));
      res.writeHead(up.status, { "content-type": up.headers.get("content-type") ?? "application/json", "cache-control": "no-store" });
      const st = newState(!unlimited, budget); let st2 = null;
      if ((body.stream || anth) && up.ok) await relay(up, res, st);
      else for await (const c of up.body) res.write(c);
      if (st.why && !gone) {
        // tweede call: zelfde vraag, denken uit, met het begin van de redenering als kladblok
        const msgs = body.messages.map((m) => ({ ...m }));
        const last = msgs[msgs.length - 1];
        last.content += `\n\nYOUR THINKING SO FAR (cut off: ${st.why}):\n${st.think.slice(-THINK_KEEP)}\n\nTime is up. Do not think any further. Take the best move your reasoning had reached (the latest one if it changed), and give the final JSON object now, nothing else.`;
        const body2 = { ...body, messages: msgs, max_tokens: 1500 };
        if (pid === "local") body2.chat_template_kwargs = { enable_thinking: false };
        else if (anth) body2.reasoning_effort = "low";
        else { delete body2.reasoning_effort; body2.thinking = { type: "disabled" }; body2.max_tokens = 3000; } // OpenAI-compatibel (DeepSeek): denken echt uit, anders eet het de antwoordruimte op
        res.write(sse({ reasoning_content: `\n\n[proxy: denken afgebroken (${st.why}); antwoord afgedwongen]\n` }));
        ctl = new AbortController();
        const up2 = wrap(await fetch(target, { method: "POST", headers, body: payload(body2), signal: ctl.signal }));
        st2 = newState(false);
        for await (const chunk of up2.src ?? up2.body) { res.write(chunk); feed(st2, chunk); }
      }
      const answer = (st2 ?? st).content, parsed = firstJSON(answer);
      logCall({ ts: new Date().toISOString(), model: ref, phase: String(body.messages[0]?.content).includes("PHASE: PLACEMENT") ? "plaatsing" : "schot", status: up.status, ms: Date.now() - t0, think_tokens: st.chunks, cut: st.why || null, aborted: gone, json_ok: !!parsed, move: parsed?.move ?? null, answer: answer.slice(0, 1500), think: st.think.slice(0, 20000) });
      res.end();
    } catch (e) {
      if (ctl.signal.aborted) return;
      if (!res.headersSent) json(res, 502, { error: { message: `${pid} niet bereikbaar: ${e.message}` } });
      else res.end();
    }
    return;
  }

  res.writeHead(404).end("niet gevonden");
}

createServer((req, res) => {
  handle(req, res).catch((e) => {
    if (!res.headersSent) json(res, 500, { error: e.message });
    else res.end();
  });
}).listen(PORT, "127.0.0.1", () => console.log(`Zeeslag op http://127.0.0.1:${PORT}/`));
