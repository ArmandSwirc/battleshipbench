// Saves per model results/<model>/overview.svg (all boards, ships revealed, shots numbered) and run.json (shot order only).
//   node results.mjs watch     follow bench-live*.json and save boards of runs started before this existed
//   node results.mjs publish   commit and push results/, bench.jsonl, shots.jsonl
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("./", import.meta.url)), DIR = ROOT + "results/";
const COLS = "ABCDEFGHIJ", CELL = 40, PAD = 28;
export const slug = (name) => name.replace(/[/:\\]+/g, "_");
const cellRC = (c) => [Number(c.slice(1)) - 1, COLS.indexOf(c[0])];

const SC = { Carrier: "#6f9be0", Battleship: "#a98be0", Cruiser: "#3fb8a4", Submarine: "#d9b24a", Destroyer: "#e07aa8" };
const STYLE = `:root{--page:#f3f2ee;--raised:#fbfaf7;--sunk:#eae8e2;--ink:#121211;--ink-3:#6b685f;--line:#dcd9d1;--bad:#c8372d;--water:#e6e3db}
@media(prefers-color-scheme:dark){:root{--page:#0c0c0b;--raised:#151514;--sunk:#161615;--ink:#ebe9e4;--ink-3:#8f8d86;--line:#232220;--bad:#e5564b;--water:#171716}}
text{font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace;fill:var(--ink-3);font-size:11px}.t{fill:var(--ink);font-weight:600}.h{font-family:"IBM Plex Sans",system-ui,sans-serif;font-size:20px;font-weight:600;fill:var(--ink)}
.w{fill:var(--water)}.n{fill:var(--ink-3);font-size:10px;font-weight:600}.hit{fill:var(--bad)}.hn{fill:#fff;font-size:10px;font-weight:600}.mis{fill:var(--ink-3)}.lh{fill:var(--bad);font-weight:600}`;
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const CS = 28, GX = 22, GY = 52, CW = 352, TOK = 56, LINE = 15;

function card(b, x, y) {
  const own = new Map(); b.ships.forEach((s) => s.cells.forEach(([r, c]) => own.set(r * 10 + c, s.name)));
  const hits = b.sequence.filter((q) => q.result !== "miss").length;
  let g = `<text class="t" x="${x + 16}" y="${y + 26}" style="font-size:13px">${esc(b.label ?? "Board " + b.seed)}</text><text x="${x + CW - 16}" y="${y + 26}" text-anchor="end">${b.sequence.length} shots · ${hits} hits${b.finished ? "" : " · not finished"}</text>`;
  for (let i = 0; i < 10; i++) g += `<text x="${x + GX + 16 + i * CS + CS / 2}" y="${y + GY - 6}" text-anchor="middle" style="font-size:10px">${COLS[i]}</text><text x="${x + GX + 8}" y="${y + GY + 16 + i * CS + 4}" text-anchor="end" style="font-size:10px">${i + 1}</text>`;
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
    const nm = own.get(r * 10 + c), px = x + GX + 16 + c * CS - 0, py = y + GY + r * CS;
    g += nm ? `<rect x="${px}" y="${py}" width="${CS - 2}" height="${CS - 2}" rx="2" fill="${SC[nm]}" fill-opacity=".35" stroke="${SC[nm]}" stroke-opacity=".7"/>` : `<rect class="w" x="${px}" y="${py}" width="${CS - 2}" height="${CS - 2}" rx="2"/>`;
  }
  b.sequence.forEach((q) => {
    const [r, c] = cellRC(q.cell), px = x + GX + 16 + c * CS, py = y + GY + r * CS, cx = px + (CS - 2) / 2, cy = py + (CS - 2) / 2;
    g += q.result === "miss" ? `<circle class="mis" cx="${cx}" cy="${cy - 5}" r="3"/><text class="n" x="${cx}" y="${cy + 9}" text-anchor="middle">${q.n}</text>`
      : `<rect class="hit" x="${px}" y="${py}" width="${CS - 2}" height="${CS - 2}" rx="2"/><text class="hn" x="${cx}" y="${cy + 4}" text-anchor="middle">${q.n}</text>`;
  });
  const per = Math.floor((CW - 32) / TOK), ly = y + GY + 10 * CS + 28;
  b.sequence.forEach((q, i) => { g += `<text class="${q.result === "miss" ? "" : "lh"}" x="${x + 16 + (i % per) * TOK}" y="${ly + Math.floor(i / per) * LINE}">${q.n}·${q.cell}</text>`; });
  const h = GY + 10 * CS + 28 + Math.ceil(b.sequence.length / per) * LINE + 12;
  return { h, g: `<rect x="${x}" y="${y}" width="${CW}" height="${h}" rx="6" fill="var(--raised)" stroke="var(--line)"/>${g}` };
}

export function renderOverview(run) {
  const boards = [...run.boards].sort((a, b) => (a.seed ?? 0) - (b.seed ?? 0) || String(a.id).localeCompare(String(b.id)));
  let y = 76, body = "";
  for (let i = 0; i < boards.length; i += 2) {
    const row = boards.slice(i, i + 2).map((b, k) => card(b, 20 + k * (CW + 16), y)), h = Math.max(...row.map((c) => c.h));
    row.forEach((c) => (body += c.g)); y += h + 16;
  }
  const tot = boards.reduce((a, b) => a + (b.finished || run.kind === "arena" ? b.sequence.length : 100), 0), W = 40 + 2 * CW + 16;
  const head = `<text class="h" x="20" y="38">${esc(run.kind === "arena" ? run.model : run.model.replace(/^[^/]+\//, ""))}</text><text x="20" y="58">${run.kind === "arena" ? boards.length / 2 + " arena games" : boards.length + " boards"} · avg ${Math.round((tot / boards.length) * 10) / 10} shots · numbers show the order of the shots, red = hit</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${y}" width="${W}" height="${y}"><style>${STYLE}</style><rect width="${W}" height="${y}" fill="var(--page)"/>${head}${body}</svg>\n`;
}

// board = { seed, model, ships:[{name,len,cells}], shots:[{cell,result,why}], finished, fallbacks, startedAt, strategy, strategyName }
// Also writes strategy.md: the model's own plan (written once per run, before the first board) and the reasoning of every shot per board.
function strategyMd(run) {
  let md = `# ${run.model}\n\n**Strategy${run.strategyName ? `: ${run.strategyName}` : ""}**\n\n${quote(run.strategy)}\n\n`;
  for (const b of [...run.boards].sort((a, c) => a.seed - c.seed)) md += `## Board ${b.seed} · ${b.shots} shots${b.finished ? "" : " (not finished)"}${b.fallbacks ? ` · ${b.fallbacks} auto-moves` : ""}\n\n| # | Cell | Result | Reasoning |\n|---|---|---|---|\n` + b.sequence.map((q) => `| ${q.n} | ${q.cell} | ${q.result} | ${cellMd(q.why)} |`).join("\n") + "\n\n";
  return md;
}
export function saveBoard(board) {
  const dir = DIR + slug(board.model) + "/"; mkdirSync(dir, { recursive: true });
  const f = dir + "run.json", run = existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : { model: board.model, kind: "gauntlet", startedAt: board.startedAt, boards: [] };
  const rec = { seed: board.seed, shots: board.shots.length, finished: board.finished, fallbacks: board.fallbacks ?? 0, ships: board.ships.map(({ name, len, cells }) => ({ name, len, cells })), sequence: board.shots.map((s, i) => ({ n: i + 1, cell: s.cell, result: s.result, ...(s.why ? { why: s.why } : {}) })) };
  if (board.strategy) { run.strategy = board.strategy; run.strategyName = board.strategyName ?? ""; }
  const i = run.boards.findIndex((b) => b.seed === board.seed);
  if (i >= 0) run.boards[i] = rec; else run.boards.push(rec);
  writeFileSync(f, JSON.stringify(run, null, 1));
  writeFileSync(dir + "overview.svg", renderOverview(run));
  if (run.strategy) writeFileSync(dir + "strategy.md", strategyMd(run));
}

// 1v1 game -> results/arena/<model A>_vs_<model B>/ { run.json, overview.svg, games.md }, same files as a bench run plus strategy and reasoning per shot.
// game = { ts, mode, winner:"A"|"B", a, b } with a/b = { model, strategyName, strategy, placement, ownPlacement, fallbacks, hits, foeFleet, moves:[{cell,result,why,fallback}] }
const short = (m) => String(m).replace(/^.*\//, "").replace(/-GGUF:.*/, "");
const cellMd = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ").trim();
const quote = (t) => String(t).trim().split("\n").map((l) => "> " + l).join("\n");
function gameMd(g) {
  let md = `## ${g.ts} · ${g.mode === "free" ? "free play" : "standard"} · ${short(g[g.winner.toLowerCase()].model)} won in ${g[g.winner.toLowerCase()].moves.length} shots\n\n`;
  for (const k of ["a", "b"]) {
    const x = g[k], won = g.winner === k.toUpperCase();
    md += `### ${short(x.model)} (${k.toUpperCase()}) · ${won ? "won" : "lost"} · ${x.moves.length} shots · ${x.hits} hits${x.fallbacks ? ` · ${x.fallbacks} auto-moves` : ""}\n\n`;
    if (x.dossier) md += `**Dossier it received on its opponent**\n\n${quote(x.dossier)}\n\n`;
    md += x.strategy ? `**Strategy${x.strategyName ? `: ${x.strategyName}` : ""}**\n\n${quote(x.strategy)}\n\n` : "_No own strategy (standard mode)._\n\n";
    md += `**Fleet placement:** ${x.ownPlacement ? "own placement" : "random"}${x.placement ? `\n\n${quote(x.placement)}` : ""}\n\n`;
    if (x.lesson) md += `**Lesson it wrote after the game**\n\n${quote(x.lesson)}\n\n`;
    md += "| # | Cell | Result | Reasoning |\n|---|---|---|---|\n" + x.moves.map((m, i) => `| ${i + 1} | ${m.cell} | ${m.result}${m.fallback ? " (auto-move)" : ""} | ${cellMd(m.why)} |`).join("\n") + "\n\n";
  }
  return md;
}
// Dossier on an opponent, built only from what `me` could observe in earlier games against `foe`: where the foe placed its fleet,
// how it shot, how those games ended, plus me's own lessons. Never the foe's strategy text or reasoning.
const cellName = ([r, c]) => COLS[c] + (r + 1);
function shipLine(s) {
  const cs = [...s.cells].sort((x, y) => x[0] - y[0] || x[1] - y[1]), horiz = cs.length > 1 && cs[0][0] === cs[1][0];
  return `${s.name} ${cellName(cs[0])}-${cellName(cs[cs.length - 1])} ${horiz ? "H" : "V"}`;
}
export function dossier(me, foe) {
  const dir = DIR + "arena/", games = [];
  for (const d of existsSync(dir) ? readdirSync(dir) : []) {
    try {
      const run = JSON.parse(readFileSync(`${dir}${d}/run.json`, "utf8"));
      if (run.models?.includes(me) && run.models.includes(foe)) for (const g of run.games) { // my side and the foe's side of each game
        const m = g.a.model === me ? ["a", "b"] : ["b", "a"];
        games.push({ ts: g.ts, won: g.winner === m[0].toUpperCase(), mine: g[m[0]], theirs: g[m[1]] });
      }
    } catch {}
  }
  games.sort((x, y) => y.ts.localeCompare(x.ts));
  const name = short(foe);
  if (!games.length) return `You have not played ${name} before. No dossier yet.`;
  const out = [`DOSSIER ON YOUR OPPONENT (${name}), from ${games.length} earlier game${games.length === 1 ? "" : "s"} against it, newest first. Everything below is what you observed; it is not a promise that ${name} plays the same way again.`];
  out.push(`Results: you won ${games.filter((g) => g.won).length} of ${games.length}.`);
  games.slice(0, 4).forEach((g, i) => {
    const sh = g.theirs.moves, par = sh.length ? sh.filter((q) => { const m = /^([A-J])(\d+)$/.exec(q.cell); return m && (COLS.indexOf(m[1]) + Number(m[2]) - 1) % 2 === 0; }).length / sh.length : 0;
    const border = g.mine.foeFleet.filter((s) => s.cells.some(([r, c]) => r === 0 || r === 9 || c === 0 || c === 9)).length;
    out.push(`Game ${i + 1} (${g.won ? "you won" : "you lost"}, you needed ${g.mine.moves.length} shots, ${name} needed ${sh.length}):`);
    out.push(`  Its fleet placement: ${g.mine.foeFleet.map(shipLine).join("; ")} (${border} of 5 ships touch the border).`);
    out.push(`  Its shooting: first 8 shots ${sh.slice(0, 8).map((q) => `${q.cell}${q.result === "miss" ? "" : "*"}`).join(" ")} (* = hit), hit rate ${Math.round((g.theirs.hits / Math.max(1, sh.length)) * 100)}%, ${Math.round(par * 100)}% of its shots on checkerboard parity.`);
    if (g.mine.lesson) out.push(`  Your own note after that game: ${g.mine.lesson}`);
  });
  return out.join("\n");
}

export function saveArena(game) {
  const names = [game.a.model, game.b.model].sort(), pair = names.map(slug).join("_vs_");
  const dir = DIR + "arena/" + pair + "/"; mkdirSync(dir, { recursive: true });
  const f = dir + "run.json", run = existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : { model: names.map(short).join(" vs "), kind: "arena", models: names, games: [] };
  run.games = run.games.filter((g) => g.ts !== game.ts).concat(game);
  const boards = run.games.flatMap((g) => ["a", "b"].map((k) => { // board of side k = the fleet it shot at, with its shots numbered
    const x = g[k];
    return { id: `${g.ts}-${k}`, label: `${short(x.model)} · ${g.winner === k.toUpperCase() ? "won" : "lost"}`, ships: x.foeFleet, sequence: x.moves.map((m, i) => ({ n: i + 1, cell: m.cell, result: m.result })), finished: g.winner === k.toUpperCase() };
  }));
  writeFileSync(f, JSON.stringify(run, null, 1));
  writeFileSync(dir + "overview.svg", renderOverview({ ...run, boards }));
  writeFileSync(dir + "games.md", `# ${run.model}\n\n${run.games.length} game${run.games.length === 1 ? "" : "s"}, newest first. Board images: [overview.svg](overview.svg), raw data: [run.json](run.json).\n\n` + [...run.games].reverse().map(gameMd).join("\n---\n\n"));
}

export function publish(msg = "results: saved boards and runs") {
  const git = (...a) => execFileSync("git", a, { cwd: ROOT, stdio: "pipe" }).toString();
  const paths = ["results", "assets", "bench.jsonl", "shots.jsonl", "README.md"].filter((p) => existsSync(ROOT + p));
  git("add", ...paths);
  if (!git("status", "--porcelain", "--", ...paths).trim()) return "nothing to publish";
  git("commit", "-m", msg, "--", ...paths);
  try { git("push"); } catch { git("pull", "--rebase", "--autostash"); git("push"); } // remote moved on (e.g. a manual edit on GitHub): rebase once, then push
  return "published";
}

// ---- watcher for runs started before bench.mjs saved boards itself ----
function fromLive(j) {
  if (!j.shipGrid || !j.fleet || !j.name) return null;
  const ships = j.fleet.map((f) => ({ ...f, cells: [] }));
  j.shipGrid.forEach((row, r) => row.forEach((i, c) => { if (i >= 0) ships[i].cells.push([r, c]); }));
  return { model: j.name, seed: j.seed, ships, shots: [...j.shots], fallbacks: j.fallbacks, startedAt: j.startedAt, finished: false };
}
function finalize(snap, total) { // the last shot is flushed right before the next board resets the file: rebuild it from the one ship cell left
  if (!snap || total == null || total >= 100) return snap;
  if (snap.shots.length === total - 1) {
    const shot = new Set(snap.shots.map((s) => s.cell));
    const left = snap.ships.flatMap((s) => s.cells.map(([r, c]) => [COLS[c] + (r + 1), s.name])).filter(([c]) => !shot.has(c));
    if (left.length === 1) snap.shots.push({ cell: left[0][0], result: `sunk ${left[0][1]}` });
  }
  snap.finished = snap.shots.length === total; return snap;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cmd = process.argv[2];
  if (cmd === "publish") console.log(publish());
  else if (cmd === "watch") {
    const files = readdirSync(ROOT).filter((f) => /^bench-live(-b)?\.json$/.test(f)), last = {};
    console.log("watching", files.join(", "));
    setInterval(() => {
      for (const f of files) {
        let j; try { j = JSON.parse(readFileSync(ROOT + f, "utf8")); } catch { continue; }
        const snap = fromLive(j), prev = last[f];
        if (prev && (!snap || snap.seed !== prev.seed || snap.model !== prev.model)) { // board over: write final version
          const done = (j.results ?? []).find((r) => r.seed === prev.seed);
          if (done) { saveBoard(finalize(prev, done.shots)); console.log("saved", prev.model, prev.seed); }
        }
        if (snap) { last[f] = snap; if (snap.shots.length && snap.shots.length % 10 === 0) saveBoard(snap); }
      }
    }, 500);
  }
}
