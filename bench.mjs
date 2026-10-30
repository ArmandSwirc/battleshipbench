// BattleshipBench "Gauntlet": every model shoots solo on the same seeded boards; fewer shots = better.
// Absolute score, independent of opponents, reproducible and cheap. Bots are the yardstick.
//   node bench.mjs bots                         bots meten en opslaan
//   node bench.mjs run anthropic/claude-haiku-5-5 [--boards 5]   (server.mjs moet draaien; sleutels blijven daar)
//   node bench.mjs readme                       leaderboard in README.md bijwerken
import { readFileSync, writeFileSync, appendFileSync, existsSync, renameSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { saveBoard, publish, slug } from "./results.mjs";
import { gauntletSvg, arenaSvg, label } from "./charts.mjs";

const SIZE = 10, FLEET = [["Carrier", 5], ["Battleship", 4], ["Cruiser", 3], ["Submarine", 3], ["Destroyer", 2]];
const MAX_SHOTS = 100, MIN_SHOTS = 17, SEEDS = [11, 23, 37, 41, 59, 61, 73, 89, 97, 101], GAUNTLET = 3; // Gauntlet = de eerste 3 borden
const SERVER = process.env.BENCH_SERVER ?? "http://127.0.0.1:8793";
const BENCH = fileURLToPath(new URL("./bench.jsonl", import.meta.url));
const MATCHES = fileURLToPath(new URL("./matches.jsonl", import.meta.url));
const README = fileURLToPath(new URL("./README.md", import.meta.url));
// Live stand voor het benchmark-scherm (server.mjs serveert /bench en /api/bench/live)
const SLOT = process.argv.includes("--slot") ? process.argv[process.argv.indexOf("--slot") + 1] : "a"; // a | b: twee benches naast elkaar
const SHOTS = fileURLToPath(new URL("./shots.jsonl", import.meta.url)); // één regel per schot: raak/mis, afgekapt of niet
const LIVE_FILE = fileURLToPath(new URL(SLOT === "b" ? "./bench-live-b.json" : "./bench-live.json", import.meta.url));
const LIVE = { status: "idle", shots: [], results: [], think: "", pid: process.pid };
for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => { LIVE.status = "stopped"; flush(true); process.exit(130); });
let lastFlush = 0;
function flush(force) {
  if (process.argv[2] === "bots") return; // bots mogen de live-bestanden van lopende benches niet overschrijven
  const t = Date.now(); if (!force && t - lastFlush < 300) return; lastFlush = t;
  LIVE.updatedAt = new Date().toISOString();
  try { writeFileSync(LIVE_FILE + ".tmp", JSON.stringify(LIVE)); renameSync(LIVE_FILE + ".tmp", LIVE_FILE); } catch {}
}
const COLS = "ABCDEFGHIJ", cell = (r, c) => COLS[c] + (r + 1);
const parse = (s) => { const m = /^\s*([A-Ja-j])\s*(10|[1-9])\s*$/.exec(String(s ?? "")); return m ? [Number(m[2]) - 1, COLS.indexOf(m[1].toUpperCase())] : null; };

function rng(seed) { let a = seed; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ---- borden: vast in boards.json (node bench.mjs boards), gekozen op moeilijkheid maar realistisch ----
const BOARDS = fileURLToPath(new URL("./boards.json", import.meta.url));
function randomFleet(rand) { // legale vloot; realistisch: gemengde richting, hooguit 2 schepen tegen de rand, schepen mogen elkaar raken
  for (;;) {
    const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(-1)), ships = []; let ok = true;
    for (const [name, len] of FLEET) {
      let placed = false;
      for (let t = 0; t < 200 && !placed; t++) {
        const h = rand() < 0.5, r = Math.floor(rand() * (h ? SIZE : SIZE - len + 1)), c = Math.floor(rand() * (h ? SIZE - len + 1 : SIZE));
        const cells = Array.from({ length: len }, (_, i) => (h ? [r, c + i] : [r + i, c]));
        if (cells.some(([y, x]) => grid[y][x] >= 0)) continue;
        cells.forEach(([y, x]) => (grid[y][x] = ships.length)); ships.push({ name, len, h, cells }); placed = true;
      }
      if (!placed) { ok = false; break; }
    }
    const edge = ships.filter((s) => s.cells.every(([y]) => y === 0) || s.cells.every(([y]) => y === SIZE - 1) || s.cells.every(([, x]) => x === 0) || s.cells.every(([, x]) => x === SIZE - 1)).length;
    const hs = ships.filter((s) => s.h).length;
    if (ok && edge <= 2 && hs >= 2 && hs <= 3) return ships;
  }
}
const fromShips = (ships) => {
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(-1));
  ships.forEach((s, i) => s.cells.forEach(([y, x]) => (grid[y][x] = i)));
  return { grid, ships: ships.map((s) => ({ name: s.name, len: s.len, hits: 0, cells: s.cells })), shots: Array.from({ length: SIZE }, () => Array(SIZE).fill(null)), count: 0 };
};
async function genBoards() { // per seed: 300 kandidaten; kies de vloot waar de kansdichtheid-bot het langst over doet
  const out = [];
  for (const seed of SEEDS) {
    const rand = rng(seed); let best = null;
    for (let k = 0; k < 300; k++) {
      const ships = randomFleet(rand); let tot = 0;
      for (let t = 0; t < 3; t++) { const b = fromShips(ships), r2 = rng(seed * 31 + t); while (!done(b)) { const [y, x] = botProb(b, r2); fire(b, y, x); } tot += b.count; }
      if (!best || tot / 3 > best.botShots) best = { seed, botShots: Math.round((tot / 3) * 10) / 10, ships: ships.map(({ name, len, cells }) => ({ name, len, cells })) };
    }
    out.push(best); console.log(`seed ${seed}: prob-bot ${best.botShots} shots`);
  }
  writeFileSync(BOARDS, JSON.stringify(out));
}
function newBoard(seed) {
  const all = existsSync(BOARDS) ? JSON.parse(readFileSync(BOARDS, "utf8")) : [], e = all.find((x) => x.seed === seed);
  if (!e) throw new Error("boards.json ontbreekt: draai eerst `node bench.mjs boards`");
  return fromShips(e.ships);
}
function fire(b, r, c) {
  b.count++;
  const i = b.grid[r][c];
  if (i < 0) return (b.shots[r][c] = { result: "miss" });
  const s = b.ships[i]; s.hits++;
  return (b.shots[r][c] = s.hits === s.len ? { result: "sunk", ship: s.name } : { result: "hit" });
}
const done = (b) => b.ships.every((s) => s.hits === s.len);
const free = (b) => { const f = []; for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) if (!b.shots[y][x]) f.push([y, x]); return f; };

// ---- bots (de meetlat) ----
const botRandom = (b, rand) => { const f = free(b); return f[Math.floor(rand() * f.length)]; };
function botProb(b, rand) { // kansdichtheid: tel alle plaatsingen van de resterende schepen die nog kunnen
  const w = Array.from({ length: SIZE }, () => Array(SIZE).fill(0)), live = b.ships.filter((s) => s.hits < s.len);
  const open = (y, x) => { const s = b.shots[y][x]; return !s || s.result === "hit"; };
  for (const s of live) for (const h of [true, false]) for (let r = 0; r < SIZE - (h ? 0 : s.len - 1); r++) for (let c = 0; c < SIZE - (h ? s.len - 1 : 0); c++) {
    const cs = Array.from({ length: s.len }, (_, i) => (h ? [r, c + i] : [r + i, c]));
    if (!cs.every(([y, x]) => open(y, x))) continue;
    const hot = cs.filter(([y, x]) => b.shots[y][x]).length;
    for (const [y, x] of cs) if (!b.shots[y][x]) w[y][x] += 1 + 20 * hot;
  }
  const f = free(b), best = Math.max(...f.map(([y, x]) => w[y][x])), top = f.filter(([y, x]) => w[y][x] === best);
  return top[Math.floor(rand() * top.length)];
}

async function playBot(fn, seed) {
  const b = newBoard(seed), rand = rng(seed + 7);
  while (!done(b)) { const [r, c] = fn(b, rand); fire(b, r, c); }
  return { shots: b.count, fallbacks: 0 };
}

// ---- model-speler (via server.mjs) ----
const THINK = Number(process.env.BENCH_THINK ?? 0); // denk-tokens per schot; 0 = onbeperkt (zoals 1v1 Vrij spel: geen budget, geen lusbewaking). BENCH_THINK=8000 zet het budget terug.
// Twee fasen, zoals in de 1v1 Vrij spel: eerst schrijft het model één keer zijn eigen strategie (staat daarna vast voor alle borden),
// daarna speelt het elk bord in volledige vrijheid, zonder stappen, modi of tips van de benchmark. Plaatsing vervalt: de borden liggen vast.
const RULES = `GAME: Battleship, solo. Board 10x10. Columns A-J (left to right), rows 1-10 (top to bottom). A cell is written like "E5" (column E, row 5).
A hidden fleet of 5 ships is placed on the board: straight lines, horizontal or vertical (never diagonal), fully on the board, never overlapping (ships MAY touch each other side by side):
  Carrier 5 cells, Battleship 4, Cruiser 3, Submarine 3, Destroyer 2.
You fire one shot per turn at a cell you have not fired at yet. A shot is a miss, a hit, or a hit that sinks a ship (you are told which ship). The goal is to sink the whole fleet in as few shots as possible. Your score is the number of shots you need.`;
const OUTPUT = `OUTPUT: your final answer must be exactly one JSON object and nothing else (no markdown fences, no text before or after). Take all the time and space you need to think; there is no limit on your thinking or on the length of your answer.`;
const STRATEGY_SYSTEM = `${RULES}

PHASE: STRATEGY. Before the first shot you write your own game plan. You are completely free: nobody prescribes how to play. Work out what you believe is the strongest way to find and sink the fleet in the fewest shots, then commit to it. The plan is fixed: it is shown back to you on every turn of every board, and you cannot change it later, so write it so that future-you can follow it without any other help. You will not see the fleet in advance and you do not place it; the boards are fixed.
Cover the two parts of the game: (1) how you search while nothing is hit, (2) how you follow up on a hit until the ship is sunk. Add anything else you find valuable (parity or spacing patterns, using the remaining ship lengths, how to handle several open hits, when to deviate, and so on).

${OUTPUT}
Schema: {"name":"a short catchy name for your strategy","strategy":"your complete plan, as long as it needs to be, concrete and actionable"}`;
const TURN_SYSTEM = (strategy) => `${RULES}

PHASE: SHOOTING. Every turn you receive the board of your previous shots and fire ONE new cell. The hidden fleet stays hidden; you only see the results of your own shots.

Board legend: . unknown, o miss, X hit on a ship that is not sunk yet, S hit on a ship that is sunk (finished, but an X next to an S can belong to another ship). You may only fire at a cell shown as "."; every cell you already fired at is listed again each turn.

Before the first shot you wrote this strategy for yourself:
--- YOUR STRATEGY ---
${strategy}
--- END ---
You decide how to play. Follow your strategy, and deviate whenever the board gives you a reason to. Nobody checks your reasoning, only the number of shots counts.

Every turn also contains a MATCH DOSSIER: your own running notes of this board so far. Use it to adapt your search; your strategy is a starting plan, not a script.

${THINK ? `${OUTPUT.replace(/ Take all the time[^`]*$/, "")} Thinking: you have about ${THINK} tokens per shot. Decide quickly and keep a current best move in mind; if the budget runs out your reasoning is cut off and you must answer from it.` : OUTPUT}
Schema: {"move":"E5","why":"one short sentence on why this cell"}`;
const FALLBACK_STRATEGY = "No own strategy was received. Play sensibly: search with a checkerboard pattern, follow a hit until the ship is sunk and use the lengths of the ships that are still afloat.";
const validStrategy = (j) => { const s = String(j?.strategy ?? "").trim(); return s.length >= 40 ? { name: String(j.name ?? "").trim().slice(0, 60), strategy: s.slice(0, 20000) } : null; };
// eerste JSON-object in een antwoord (ook met geneste accolades in de tekst)
function parseJSON(text) {
  const s = String(text ?? "").replace(/```(?:json)?/g, ""), a = s.indexOf("{");
  for (let b = s.lastIndexOf("}"); a >= 0 && b > a; b = s.lastIndexOf("}", b - 1)) { try { return JSON.parse(s.slice(a, b + 1)); } catch {} }
  return null;
}
// Dossier: per bord één logboek dat na elk schot wordt aangevuld (niet elke beurt opnieuw opgebouwd). Begint blanco op elk nieuw bord.
const dossierText = (dos) => `MATCH DOSSIER (this board), one entry per shot you fired:\n${dos.length ? dos.join("\n") : "(no entries yet)"}`;
const render = (b) => {
  const rows = ["   " + COLS.split("").join(" ")], open_ = [], fired = [], sunkCell = (y, x) => b.grid[y][x] >= 0 && b.ships[b.grid[y][x]].hits === b.ships[b.grid[y][x]].len;
  for (let y = 0; y < SIZE; y++) rows.push(String(y + 1).padStart(2) + " " + b.shots[y].map((s, x) => { if (!s) return "."; fired.push(cell(y, x)); if (s.result === "miss") return "o"; if (sunkCell(y, x)) return "S"; open_.push(cell(y, x)); return "X"; }).join(" "));
  const sunk = b.ships.filter((s) => s.hits === s.len).map((s) => s.name);
  return `Board (. unknown, o miss, X hit on a ship not yet sunk, S hit on a sunk ship):\n${rows.join("\n")}\nSunk: ${sunk.join(", ") || "none"}. Remaining: ${b.ships.filter((s) => s.hits < s.len).map((s) => `${s.name}(${s.len})`).join(", ")}.\nUnresolved hits: ${open_.join(", ") || "none"}. Smallest remaining ship: ${Math.min(...b.ships.filter((s) => s.hits < s.len).map((s) => s.len))}.\nAlready fired (never fire these again): ${fired.join(", ") || "none"}.\nShots fired: ${b.count}. Your move: a cell that is "." on the board. JSON only.`;
};
let lastAsk = { cut: false, tok: 0, ms: 0 };
// Decision-modellen (provider met "decision": true, bv. Laya via Unsloth /v1/systemone) kiezen i.p.v. praten, zoals zo'n model bedoeld is:
// state = de stand in gewone taal; per vrije cel één ja/nee-vraag ("is dit een goed volgend schot?") met feiten over die cel en korte
// ja/nee-criteria. Het schot met de hoogste kans op ja wordt gespeeld; de zet is dus altijd geldig. Laya leest maar 1024 tokens per vraag.
const DECISION = new Set();
try { for (const p of await (await fetch(`${SERVER}/api/providers`)).json()) if (p.decision) for (const m of p.models) DECISION.add(`${p.id}/${m}`); } catch {}
const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
function decisionView(b) {
  const inB = (y, x) => y >= 0 && y < SIZE && x >= 0 && x < SIZE, open_ = [];
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) { const s = b.shots[y][x]; if (!s) continue; if (s.result !== "miss") { const sh = b.ships[b.grid[y][x]]; if (sh.hits < sh.len) open_.push([y, x]); } }
  const left = b.ships.filter((s) => s.hits < s.len), small = Math.min(...left.map((s) => s.len));
  const isOpen = (y, x) => open_.some(([a, c]) => a === y && c === x), names = open_.map(([y, x]) => cell(y, x));
  const state = names.length ? `Battleship. We hit a ship at ${names.join(" and ")} and it is not sunk yet.` : "Battleship. We are searching for a ship. No open hits.";
  // Laya reageert alleen op korte, directe vragen over één eigenschap; lange of dubbele vragen maken de scores vlak.
  const facts = (y, x) => {
    const nb = DIRS.map(([dy, dx]) => [y + dy, x + dx]).filter(([a, c]) => inB(a, c)), me = cell(y, x);
    if (open_.length) {
      const touch = nb.filter(([a, c]) => isOpen(a, c));
      return touch.length ? `${me} touches the open hit ${touch.map(([a, c]) => cell(a, c)).join(" and ")}` : `${me} is ${Math.min(...open_.map(([a, c]) => Math.abs(a - y) + Math.abs(c - x)))} cells from the nearest open hit`;
    }
    const on = small === 2 ? (x + y + 2) % 2 === 0 : (x + y + 2) % 3 === 0, edge = nb.length < 4 ? (nb.length < 3 ? ", in a corner" : ", near the edge") : "";
    return `${me} is ${on ? "on" : "off"} the search pattern${edge}`;
  };
  const q = open_.length ? "Is this shot right next to an open hit?" : "Is this shot on the search pattern?";
  const criteria = open_.length
    ? { true: "It touches an open hit", false: "It does not touch an open hit" }
    : { true: "It is on the search pattern", false: "It is off the search pattern" };
  return { state, facts, q, criteria, mode: open_.length ? "target" : "hunt" };
}
async function decide(model, b) {
  const t0 = Date.now(), v = decisionView(b), cands = [];
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) if (!b.shots[y][x]) cands.push([y, x]);
  let best = null;
  for (let i = 0; i < cands.length; i += 64) { // max 64 vragen per aanroep
    const questions = Object.fromEntries(cands.slice(i, i + 64).map(([y, x]) => [cell(y, x), { type: "noul", instructions: `Shot ${v.facts(y, x)}. ${v.q}`, criteria: v.criteria }]));
    const res = await fetch(`${SERVER}/api/decide`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ model, state: v.state, questions }) });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    for (const [k, a] of Object.entries((await res.json()).answers ?? {})) if (typeof a.noul === "number" && (!best || a.noul > best.p)) best = { k, p: a.noul };
  }
  const mv = best && parse(best.k);
  if (!mv) throw new Error("no valid choice");
  return { mv, why: `${v.mode}: ${best.k} scores ${Math.round(100 * best.p)}% yes of ${cands.length} open cells`, ms: Date.now() - t0 };
}
async function ask(model, system, user, budget = THINK) {
  LIVE.think = ""; LIVE.thinkChars = 0; LIVE.thinkTok = 0; LIVE.thinkMax = budget; LIVE.askStart = Date.now(); LIVE.status = "thinking"; flush(true);
  const body = { model, think_budget: budget, stream: true, temperature: 0.6, reasoning_effort: "high", chat_template_kwargs: { enable_thinking: true }, messages: [{ role: "system", content: system }, { role: "user", content: user }] };
  const res = await fetch(`${SERVER}/api/chat`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const dec = new TextDecoder(); let buf = "", out = "", cut = false;
  for await (const chunk of res.body) {
    buf += dec.decode(chunk, { stream: true });
    for (let i; (i = buf.indexOf("\n")) >= 0;) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line.startsWith("data:") || line.includes("[DONE]")) continue;
      try {
        const d = JSON.parse(line.slice(5)).choices?.[0]?.delta ?? {};
        if (d.content) out += d.content;
        if (d.reasoning_content) { if (d.reasoning_content.includes("[proxy: denken afgebroken")) cut = true; LIVE.think = (LIVE.think + d.reasoning_content).slice(-20000); LIVE.thinkChars = (LIVE.thinkChars ?? 0) + d.reasoning_content.length; LIVE.thinkTok++; }
        if (d.content || d.reasoning_content) flush();
      } catch {}
    }
  }
  lastAsk = { cut, tok: LIVE.thinkTok, ms: Date.now() - LIVE.askStart };
  return out;
}
async function askRetry(model, system, user, budget) {
  for (let n = 1; ; n++) try { return await ask(model, system, user, budget); } catch (e) { if (n >= 5) throw e; await new Promise((r) => setTimeout(r, 1500 * n)); }
}
let STRATEGY = { name: "", text: FALLBACK_STRATEGY }; // per run: één strategie voor alle borden
async function writeStrategy(model) {
  Object.assign(LIVE, { phase: "strategy", seed: null, turn: 0, shots: [], cells: Array.from({ length: SIZE }, () => Array(SIZE).fill("")), shipGrid: Array.from({ length: SIZE }, () => Array(SIZE).fill(-1)), fleet: FLEET.map(([name, len]) => ({ name, len })), fallbacks: 0, sunk: [], strategy: "", strategyName: "", status: "thinking" }); flush(true);
  STRATEGY = { name: "", text: FALLBACK_STRATEGY, own: false };
  if (DECISION.has(model)) { LIVE.strategy = "Decision model: it answers yes/no questions per cell and does not write a plan."; LIVE.phase = null; return; }
  let extra = "";
  for (let t = 0; t < 3; t++) {
    let text = ""; try { text = await askRetry(model, STRATEGY_SYSTEM, "Write your strategy now. JSON only." + extra, 0); } catch (e) { console.log(`\n${e.message}`); break; }
    const v = validStrategy(parseJSON(text));
    if (v) { STRATEGY = { name: v.name, text: v.strategy, own: true }; break; }
    extra = '\n\nINVALID: answer with one JSON object {"name":"...","strategy":"..."} where "strategy" is a concrete plan of at least a few sentences.';
  }
  LIVE.strategy = STRATEGY.text; LIVE.strategyName = STRATEGY.name || (STRATEGY.own ? "" : "no answer, standard plan"); LIVE.phase = null; LIVE.think = ""; flush(true);
  console.log(`strategy: ${STRATEGY.name || (STRATEGY.own ? "own plan" : "no valid answer, standard plan")}`);
}
async function playModel(model, seed) {
  const b = newBoard(seed), rand = rng(seed + 7), dos = []; let fallbacks = 0, streak = 0;
  Object.assign(LIVE, { phase: null, seed, shots: [], cells: Array.from({ length: SIZE }, () => Array(SIZE).fill("")), shipGrid: b.grid, fleet: b.ships.map((x) => ({ name: x.name, len: x.len })), fallbacks: 0, sunk: [], status: "thinking" }); flush(true);
  while (!done(b) && b.count < MAX_SHOTS) {
    let mv = null, extra = "", tries = 0, ask1 = null, fb = false, why = ""; LIVE.turn = b.count + 1;
    for (let t = 0; t < 3 && !mv; t++) {
      tries++;
      if (DECISION.has(model)) { try { const d = await decide(model, b); mv = d.mv; why = d.why; ask1 = { cut: false, tok: 0, ms: d.ms }; } catch (e) { console.log(`\n${e.message}`); } continue; }
      let text = ""; try { text = await askRetry(model, TURN_SYSTEM(STRATEGY.text), render(b) + "\n\n" + dossierText(dos) + extra); ask1 = { ...lastAsk }; } catch (e) { console.log(`\n${e.message}`); break; }
      const j = parseJSON(text);
      const rc = parse(j?.move);
      if (rc && !b.shots[rc[0]][rc[1]]) { mv = rc; why = String(j?.why ?? "").slice(0, 600); } else extra = `\n\nINVALID: "${j?.move ?? "no JSON"}" is not an unfired cell A1-J10. Pick a "." cell.`;
    }
    if (!mv) { mv = botRandom(b, rand); fallbacks++; fb = true; streak++; } else streak = 0;
    if (streak >= 5) { console.log("\n5 auto-moves in a row: model gives no usable answers, run stopped to avoid wasted API cost."); process.exit(1); }
    const fr = fire(b, ...mv);
    try { appendFileSync(SHOTS, JSON.stringify({ ts: new Date().toISOString(), model, seed, n: b.count, cell: cell(...mv), result: fr.result, fallback: fb, tries, cut: ask1?.cut ?? null, think: ask1?.tok ?? null, ms: ask1?.ms ?? null, budget: THINK }) + "\n"); } catch {}
    LIVE.cells[mv[0]][mv[1]] = fr.result === "miss" ? "o" : "X"; LIVE.fallbacks = fallbacks;
    LIVE.shots.push({ cell: cell(...mv), result: fr.result === "sunk" ? `sunk ${fr.ship}` : fr.result, why });
    if (fr.ship) LIVE.sunk.push(fr.ship);
    dos.push(`#${b.count} ${cell(...mv)} → ${fr.result === "sunk" ? `sunk ${fr.ship}` : fr.result}${fb ? " (auto-move)" : why ? `: ${why}` : ""}`);
    LIVE.status = "firing"; flush(true);
    process.stdout.write(done(b) ? "!" : b.shots[mv[0]][mv[1]].result === "miss" ? "." : "X");
  }
  try { saveBoard({ model, seed, ships: b.ships, shots: LIVE.shots, fallbacks, finished: done(b), startedAt: LIVE.startedAt, strategy: STRATEGY.own ? STRATEGY.text : "", strategyName: STRATEGY.name }); } catch (e) { console.log(`\nresults: ${e.message}`); }
  console.log(` board ${seed}: ${b.count} shots${done(b) ? "" : " (not finished)"} · ${fallbacks} auto-moves`);
  return { shots: done(b) ? b.count : MAX_SHOTS, fallbacks };
}

// score 0-100: 100 = perfect (17 schoten), 0 = 100 schoten (of niet uitgespeeld)
const score = (avg) => Math.max(0, Math.round((100 * (MAX_SHOTS - avg)) / (MAX_SHOTS - MIN_SHOTS) * 10) / 10);

async function bench(name, fn, boards, prep) {
  const seeds = SEEDS.slice(0, boards), res = [];
  Object.assign(LIVE, { name, boards: seeds.length, results: [], startedAt: new Date().toISOString(), status: "starting", phase: null, strategy: "", strategyName: "" });
  if (prep) await prep();
  for (const [i, s] of seeds.entries()) {
    LIVE.boardIdx = i + 1; const r = await fn(s); res.push(r);
    LIVE.results.push({ seed: s, shots: r.shots, fallbacks: r.fallbacks }); flush(true);
  }
  const avg = res.reduce((a, r) => a + r.shots, 0) / res.length;
  const rec = { ts: new Date().toISOString(), name, boards: seeds.length, avgShots: Math.round(avg * 10) / 10, score: score(avg), fallbacks: res.reduce((a, r) => a + r.fallbacks, 0), bot: !name.includes("/"), perSeed: LIVE.results };
  appendFileSync(BENCH, JSON.stringify(rec) + "\n");
  Object.assign(LIVE, { status: "done", final: rec }); flush(true);
  console.log(`${name}: avg ${rec.avgShots} shots · score ${rec.score}`);
}

function readJsonl(f) { return existsSync(f) ? readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []; }
function readme() {
  const best = new Map(), liveFinals = ["./bench-live.json", "./bench-live-b.json"].map((f) => { try { return JSON.parse(readFileSync(fileURLToPath(new URL(f, import.meta.url)), "utf8")); } catch { return {}; } });
  const recs = readJsonl(BENCH); // gestopte runs (geen record) tellen mee zodra de eerste GAUNTLET borden klaar zijn
  for (const l of liveFinals) if (l.name && l.status === "stopped" && !recs.some((r) => r.name === l.name && r.ts > l.startedAt)) recs.push({ ts: l.updatedAt, name: l.name, boards: l.results?.length, bot: !l.name.includes("/"), perSeed: l.results });
  for (let r of recs) { // altijd scoren op de eerste GAUNTLET borden, ook voor runs die met meer borden gespeeld zijn
    if (r.boards !== GAUNTLET || !r.perSeed) {
      const per = r.perSeed ?? liveFinals.find((l) => l.final?.ts === r.ts && l.final?.name === r.name)?.results;
      if (per) { const p = SEEDS.slice(0, GAUNTLET).map((s) => per.find((x) => x.seed === s)); if (p.every(Boolean)) { const avg = p.reduce((a, x) => a + x.shots, 0) / GAUNTLET; r = { ...r, boards: GAUNTLET, avgShots: Math.round(avg * 10) / 10, score: score(avg), fallbacks: p.reduce((a, x) => a + x.fallbacks, 0) }; } }
    }
    if (r.boards !== GAUNTLET) continue;
    const o = best.get(r.name); if (!o || r.ts > o.ts) best.set(r.name, r);
  }
  const g = [...best.values()].sort((a, b) => b.score - a.score);
  const ROOT = fileURLToPath(new URL("./", import.meta.url)), replay = (n) => (existsSync(`${ROOT}results/${slug(n)}/overview.svg`) ? `[boards](results/${slug(n)}/overview.svg)${existsSync(`${ROOT}results/${slug(n)}/strategy.md`) ? ` · [strategy & shots](results/${slug(n)}/strategy.md)` : ""}` : "");
  writeFileSync(ROOT + "assets/leaderboard-gauntlet.svg", gauntletSvg(g));
  const gauntlet = ["| # | Model | Score | Avg shots | Boards | Auto-moves | Replay |", "|--:|---|--:|--:|--:|--:|---|",
    ...g.map((r, i) => `| ${i + 1} | ${r.bot ? "🤖 " : ""}${r.name.replace(/^[^/]+\//, "")} | **${r.score}** | ${r.avgShots} | ${r.boards} | ${r.fallbacks} | ${replay(r.name)} |`)].join("\n");
  // Arena: matches.jsonl plus the games saved in results/arena/*/run.json (deduplicated on timestamp)
  const games = new Map(readJsonl(MATCHES).map((m) => [m.ts, m])), pairs = [], AD = ROOT + "results/arena/";
  for (const d of existsSync(AD) ? readdirSync(AD) : []) {
    try {
      const run = JSON.parse(readFileSync(`${AD}${d}/run.json`, "utf8"));
      pairs.push({ dir: d, run });
      for (const x of run.games) if (!games.has(x.ts)) games.set(x.ts, { ts: x.ts, a: { model: x.a.model, shots: x.a.moves.length, hits: x.a.hits }, b: { model: x.b.model, shots: x.b.moves.length, hits: x.b.hits }, winner: x.winner });
    } catch {}
  }
  const M = new Map(), elo = new Map(), h2h = new Map();
  for (const m of [...games.values()].sort((a, b) => a.ts.localeCompare(b.ts))) {
    const w = m.winner === "A" ? m.a : m.b, l = m.winner === "A" ? m.b : m.a;
    for (const x of [m.a, m.b]) { const r = M.get(x.model) ?? { g: 0, w: 0, shots: 0, hits: 0, winShots: 0 }; r.g++; r.shots += x.shots ?? 0; r.hits += x.hits ?? 0; M.set(x.model, r); }
    M.get(w.model).w++; M.get(w.model).winShots += w.shots ?? 0;
    h2h.set(`${w.model}|${l.model}`, (h2h.get(`${w.model}|${l.model}`) ?? 0) + 1);
    const ew = elo.get(w.model) ?? 1000, el = elo.get(l.model) ?? 1000, e = 1 / (1 + 10 ** ((el - ew) / 400));
    elo.set(w.model, ew + 32 * (1 - e)); elo.set(l.model, el - 32 * (1 - e));
  }
  const arena = [...M].map(([k, v]) => ({ model: k, wins: v.w, games: v.g, winRate: v.w / v.g, avgShotsToWin: v.w ? v.winShots / v.w : null, accuracy: v.shots ? v.hits / v.shots : 0, elo: Math.round(elo.get(k) ?? 1000) })).sort((a, b) => b.elo - a.elo);
  writeFileSync(ROOT + "assets/leaderboard-arena.svg", arenaSvg(arena, h2h));
  const arenaT = arena.length ? ["| # | Model | Elo | Wins | Games |", "|--:|---|--:|--:|--:|", ...arena.map((r, i) => `| ${i + 1} | ${label(r.model)} | **${r.elo}** | ${r.wins} | ${r.games} |`)].join("\n") : "_No games played yet._";
  const replays = pairs.length ? "\n\n**Game replays** (strategy, reasoning and every shot per game):\n\n| Match-up | Games | Replay |\n|---|--:|---|\n" + pairs.map(({ dir, run }) => `| ${run.model} | ${run.games.length} | [strategy & shots](results/arena/${dir}/games.md) · [boards](results/arena/${dir}/overview.svg) |`).join("\n") : "";
  const block = `<!-- LEADERBOARD:START -->\n### 🎯 Gauntlet (solo, fixed boards, 0-100)\n\n<p align="center"><img src="assets/leaderboard-gauntlet.svg" alt="Gauntlet leaderboard" width="100%"></p>\n\n<details><summary>Table</summary>\n\n${gauntlet}\n\n</details>\n\n### ⚔️ Arena (head-to-head, Elo)\n\n<p align="center"><img src="assets/leaderboard-arena.svg" alt="Arena leaderboard" width="100%"></p>\n\n<details><summary>Table</summary>\n\n${arenaT}${replays}\n\n</details>\n<!-- LEADERBOARD:END -->`;
  let t = readFileSync(README, "utf8");
  t = /<!-- LEADERBOARD:START -->[\s\S]*<!-- LEADERBOARD:END -->/.test(t) ? t.replace(/<!-- LEADERBOARD:START -->[\s\S]*<!-- LEADERBOARD:END -->/, () => block) : t.replace("## Leaderboard", () => `## Leaderboard\n\n${block}`);
  writeFileSync(README, t);
  console.log("README updated");
}

const [cmd, model, ...rest] = process.argv.slice(2);
const boards = Math.min(SEEDS.length, Number(rest[rest.indexOf("--boards") + 1]) || GAUNTLET);
if (cmd === "bots") {
  await bench("Random bot", (s) => playBot(botRandom, s), GAUNTLET);
  await bench("Probability bot", (s) => playBot(botProb, s), GAUNTLET);
  readme();
} else if (cmd === "run" && model) { await bench(model, (s) => playModel(model, s), boards, () => writeStrategy(model)); readme(); try { console.log(publish(`results: ${model}`)); } catch (e) { console.log(`publish failed: ${e.message.split("\n")[0]}`); } }
else if (cmd === "boards") await genBoards();
else if (cmd === "readme") readme();
else console.log("usage: node bench.mjs boards | bots | run <provider/model> [--boards N] [--slot a|b] | readme");
