// BattleshipBench "Gauntlet": every model shoots solo on the same seeded boards; fewer shots = better.
// Absolute score, independent of opponents, reproducible and cheap. Bots are the yardstick.
//   node bench.mjs bots                         bots meten en opslaan
//   node bench.mjs run anthropic/claude-haiku-5-5 [--boards 5]   (server.mjs moet draaien; sleutels blijven daar)
//   node bench.mjs readme                       leaderboard in README.md bijwerken
import { readFileSync, writeFileSync, appendFileSync, existsSync, renameSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SIZE = 10, FLEET = [["Carrier", 5], ["Battleship", 4], ["Cruiser", 3], ["Submarine", 3], ["Destroyer", 2]];
const MAX_SHOTS = 100, MIN_SHOTS = 17, SEEDS = [11, 23, 37, 41, 59, 61, 73, 89, 97, 101];
const SERVER = process.env.BENCH_SERVER ?? "http://127.0.0.1:8791";
const BENCH = fileURLToPath(new URL("./bench.jsonl", import.meta.url));
const MATCHES = fileURLToPath(new URL("./matches.jsonl", import.meta.url));
const README = fileURLToPath(new URL("./README.md", import.meta.url));
// Live stand voor het benchmark-scherm (server.mjs serveert /bench en /api/bench/live)
const LIVE_FILE = fileURLToPath(new URL("./bench-live.json", import.meta.url));
const LIVE = { status: "idle", shots: [], results: [], think: "" };
let lastFlush = 0;
function flush(force) {
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
const SYSTEM = `You play Battleship (10x10, columns A-J, rows 1-10) against a hidden fleet: Carrier 5, Battleship 4, Cruiser 3, Submarine 3, Destroyer 2. Ships are straight, never overlap, and may touch. Fire one shot per turn at a cell not yet fired at. Reply with ONLY a JSON object: {"move":"E5"}`;
const render = (b) => {
  const rows = ["   " + COLS.split("").join(" ")];
  for (let y = 0; y < SIZE; y++) rows.push(String(y + 1).padStart(2) + " " + b.shots[y].map((s) => (!s ? "." : s.result === "miss" ? "o" : "X")).join(" "));
  const sunk = b.ships.filter((s) => s.hits === s.len).map((s) => s.name);
  return `Board (. unknown, o miss, X hit):\n${rows.join("\n")}\nSunk: ${sunk.join(", ") || "none"}. Remaining: ${b.ships.filter((s) => s.hits < s.len).map((s) => `${s.name}(${s.len})`).join(", ")}.\nShots fired: ${b.count}. Your move, JSON only.`;
};
async function ask(model, user) {
  LIVE.think = ""; LIVE.thinkChars = 0; LIVE.askStart = Date.now(); LIVE.status = "thinking"; flush(true);
  const body = { model, stream: true, temperature: 0.6, reasoning_effort: "high", chat_template_kwargs: { enable_thinking: true }, messages: [{ role: "system", content: SYSTEM }, { role: "user", content: user }] };
  const res = await fetch(`${SERVER}/api/chat`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const dec = new TextDecoder(); let buf = "", out = "";
  for await (const chunk of res.body) {
    buf += dec.decode(chunk, { stream: true });
    for (let i; (i = buf.indexOf("\n")) >= 0;) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line.startsWith("data:") || line.includes("[DONE]")) continue;
      try {
        const d = JSON.parse(line.slice(5)).choices?.[0]?.delta ?? {};
        if (d.content) out += d.content;
        if (d.reasoning_content) { LIVE.think = (LIVE.think + d.reasoning_content).slice(-3000); LIVE.thinkChars = (LIVE.thinkChars ?? 0) + d.reasoning_content.length; }
        if (d.content || d.reasoning_content) flush();
      } catch {}
    }
  }
  return out;
}
async function askRetry(model, user) {
  for (let n = 1; ; n++) try { return await ask(model, user); } catch (e) { if (n >= 5) throw e; await new Promise((r) => setTimeout(r, 1500 * n)); }
}
async function playModel(model, seed) {
  const b = newBoard(seed), rand = rng(seed + 7); let fallbacks = 0;
  Object.assign(LIVE, { seed, shots: [], cells: Array.from({ length: SIZE }, () => Array(SIZE).fill("")), shipGrid: b.grid, fleet: b.ships.map((x) => ({ name: x.name, len: x.len })), fallbacks: 0, sunk: [], status: "thinking" }); flush(true);
  while (!done(b) && b.count < MAX_SHOTS) {
    let mv = null, extra = "";
    for (let t = 0; t < 3 && !mv; t++) {
      let text = ""; try { text = await askRetry(model, render(b) + extra); } catch (e) { console.log(`\n${e.message}`); break; }
      const m = /\{[^{}]*\}/.exec(text.replace(/```(?:json)?/g, "")); let j = null; try { j = m && JSON.parse(m[0]); } catch {}
      const rc = parse(j?.move);
      if (rc && !b.shots[rc[0]][rc[1]]) mv = rc; else extra = `\n\nINVALID: "${j?.move ?? "no JSON"}" is not an unfired cell A1-J10. Pick a "." cell.`;
    }
    if (!mv) { mv = botRandom(b, rand); fallbacks++; }
    const fr = fire(b, ...mv);
    LIVE.cells[mv[0]][mv[1]] = fr.result === "miss" ? "o" : "X"; LIVE.fallbacks = fallbacks;
    LIVE.shots.push({ cell: cell(...mv), result: fr.result === "sunk" ? `sunk ${fr.ship}` : fr.result });
    if (fr.ship) LIVE.sunk.push(fr.ship);
    LIVE.status = "firing"; flush(true);
    process.stdout.write(done(b) ? "!" : b.shots[mv[0]][mv[1]].result === "miss" ? "." : "X");
  }
  console.log(` board ${seed}: ${b.count} shots${done(b) ? "" : " (not finished)"} · ${fallbacks} auto-moves`);
  return { shots: done(b) ? b.count : MAX_SHOTS, fallbacks };
}

// score 0-100: 100 = perfect (17 schoten), 0 = 100 schoten (of niet uitgespeeld)
const score = (avg) => Math.max(0, Math.round((100 * (MAX_SHOTS - avg)) / (MAX_SHOTS - MIN_SHOTS) * 10) / 10);

async function bench(name, fn, boards) {
  const seeds = SEEDS.slice(0, boards), res = [];
  Object.assign(LIVE, { name, boards: seeds.length, results: [], startedAt: new Date().toISOString(), status: "starting" });
  for (const [i, s] of seeds.entries()) {
    LIVE.boardIdx = i + 1; const r = await fn(s); res.push(r);
    LIVE.results.push({ seed: s, shots: r.shots, fallbacks: r.fallbacks }); flush(true);
  }
  const avg = res.reduce((a, r) => a + r.shots, 0) / res.length;
  const rec = { ts: new Date().toISOString(), name, boards: seeds.length, avgShots: Math.round(avg * 10) / 10, score: score(avg), fallbacks: res.reduce((a, r) => a + r.fallbacks, 0), bot: !name.includes("/") };
  appendFileSync(BENCH, JSON.stringify(rec) + "\n");
  Object.assign(LIVE, { status: "done", final: rec }); flush(true);
  console.log(`${name}: avg ${rec.avgShots} shots · score ${rec.score}`);
}

function readJsonl(f) { return existsSync(f) ? readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []; }
function readme() {
  const best = new Map();
  for (const r of readJsonl(BENCH)) { const o = best.get(r.name); if (!o || r.boards > o.boards || (r.boards === o.boards && r.ts > o.ts)) best.set(r.name, r); }
  const g = [...best.values()].sort((a, b) => b.score - a.score);
  const gauntlet = ["| # | Model | Score | Avg shots | Boards | Auto-moves |", "|--:|---|--:|--:|--:|--:|",
    ...g.map((r, i) => `| ${i + 1} | ${r.bot ? "🤖 " : ""}${r.name.replace(/^[^/]+\//, "")} | **${r.score}** | ${r.avgShots} | ${r.boards} | ${r.fallbacks} |`)].join("\n");
  const M = new Map(), elo = new Map();
  for (const m of readJsonl(MATCHES)) {
    const w = m.winner === "A" ? m.a : m.b, l = m.winner === "A" ? m.b : m.a;
    for (const x of [m.a, m.b]) M.set(x.model, M.get(x.model) ?? { g: 0, w: 0 });
    M.get(w.model).w++; M.get(m.a.model).g++; M.get(m.b.model).g++;
    const ew = elo.get(w.model) ?? 1000, el = elo.get(l.model) ?? 1000, e = 1 / (1 + 10 ** ((el - ew) / 400));
    elo.set(w.model, ew + 32 * (1 - e)); elo.set(l.model, el - 32 * (1 - e));
  }
  const arena = [...M].map(([k, v]) => ({ k, ...v, elo: Math.round(elo.get(k) ?? 1000) })).sort((a, b) => b.elo - a.elo);
  const arenaT = arena.length ? ["| # | Model | Elo | Wins | Games |", "|--:|---|--:|--:|--:|", ...arena.map((r, i) => `| ${i + 1} | ${r.k.replace(/^[^/]+\//, "")} | **${r.elo}** | ${r.w} | ${r.g} |`)].join("\n") : "_No games played yet._";
  const block = `<!-- LEADERBOARD:START -->\n### 🎯 Gauntlet (solo, fixed boards, 0-100)\n\n${gauntlet}\n\n### ⚔️ Arena (head-to-head, Elo)\n\n${arenaT}\n<!-- LEADERBOARD:END -->`;
  let t = readFileSync(README, "utf8");
  t = /<!-- LEADERBOARD:START -->[\s\S]*<!-- LEADERBOARD:END -->/.test(t) ? t.replace(/<!-- LEADERBOARD:START -->[\s\S]*<!-- LEADERBOARD:END -->/, () => block) : t.replace("## Leaderboard", () => `## Leaderboard\n\n${block}`);
  writeFileSync(README, t);
  console.log("README updated");
}

const [cmd, model, ...rest] = process.argv.slice(2);
const boards = Math.min(SEEDS.length, Number(rest[rest.indexOf("--boards") + 1]) || 5);
if (cmd === "bots") {
  await bench("Random bot", (s) => playBot(botRandom, s), SEEDS.length);
  await bench("Probability bot", (s) => playBot(botProb, s), SEEDS.length);
  readme();
} else if (cmd === "run" && model) { await bench(model, (s) => playModel(model, s), boards); readme(); }
else if (cmd === "boards") await genBoards();
else if (cmd === "readme") readme();
else console.log("usage: node bench.mjs boards | bots | run <provider/model> [--boards N] | readme");
