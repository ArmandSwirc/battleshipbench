// Saves every played board as an SVG (ships revealed, shots numbered) plus a run.json per model in results/<model>/.
//   node results.mjs watch     follow bench-live*.json and save boards of runs started before this existed
//   node results.mjs publish   commit and push results/, bench.jsonl, shots.jsonl
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("./", import.meta.url)), DIR = ROOT + "results/";
const COLS = "ABCDEFGHIJ", CELL = 40, PAD = 28;
export const slug = (name) => name.replace(/[/:\\]+/g, "_");
const cellRC = (c) => [Number(c.slice(1)) - 1, COLS.indexOf(c[0])];

export function renderSvg({ model, seed, ships, shots, finished }) {
  const W = PAD + 10 * CELL + 8, H = PAD + 10 * CELL + 36, own = new Map();
  ships.forEach((s, i) => s.cells.forEach(([r, c]) => own.set(r * 10 + c, i)));
  const hits = shots.filter((s) => s.result !== "miss").length;
  let g = `<rect width="${W}" height="${H}" fill="#fff"/>`;
  for (let i = 0; i < 10; i++) g += `<text x="${PAD + i * CELL + CELL / 2}" y="18" text-anchor="middle" font-size="13" fill="#555">${COLS[i]}</text><text x="${PAD - 8}" y="${PAD + i * CELL + CELL / 2 + 5}" text-anchor="end" font-size="13" fill="#555">${i + 1}</text>`;
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) g += `<rect x="${PAD + c * CELL}" y="${PAD + r * CELL}" width="${CELL}" height="${CELL}" fill="${own.has(r * 10 + c) ? "#bcd3ee" : "#f4f7fa"}" stroke="#c5ced8"/>`;
  shots.forEach((s, i) => {
    const [r, c] = cellRC(s.cell), x = PAD + c * CELL + CELL / 2, y = PAD + r * CELL + CELL / 2, hit = s.result !== "miss";
    g += hit ? `<circle cx="${x}" cy="${y}" r="15" fill="#d9362b"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">${i + 1}</text>`
      : `<circle cx="${x}" cy="${y}" r="13" fill="none" stroke="#7b8794" stroke-width="1.5"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" fill="#5b6672">${i + 1}</text>`;
  });
  g += `<text x="${PAD}" y="${PAD + 10 * CELL + 24}" font-size="13" fill="#222">${esc(model.replace(/^[^/]+\//, ""))} · board ${seed} · ${shots.length} shots, ${hits} hits${finished ? "" : " (not finished)"}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="-apple-system,Helvetica,Arial,sans-serif">${g}</svg>\n`;
}
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

// board = { model, seed, ships:[{name,len,cells}], shots:[{cell,result}], finished, fallbacks, startedAt }
export function saveBoard(board) {
  const dir = DIR + slug(board.model) + "/"; mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}board-${board.seed}.svg`, renderSvg(board));
  const f = dir + "run.json", run = existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : { model: board.model, startedAt: board.startedAt, boards: [] };
  const rec = { seed: board.seed, shots: board.shots.length, finished: board.finished, fallbacks: board.fallbacks ?? 0, sequence: board.shots.map((s, i) => ({ n: i + 1, cell: s.cell, result: s.result })) };
  const i = run.boards.findIndex((b) => b.seed === board.seed);
  if (i >= 0) run.boards[i] = rec; else run.boards.push(rec);
  writeFileSync(f, JSON.stringify(run, null, 1));
}

export function publish(msg = "results: saved boards and runs") {
  const git = (...a) => execFileSync("git", a, { cwd: ROOT, stdio: "pipe" }).toString();
  const paths = ["results", "bench.jsonl", "shots.jsonl", "README.md"].filter((p) => existsSync(ROOT + p));
  git("add", ...paths);
  if (!git("status", "--porcelain", "--", ...paths).trim()) return "nothing to publish";
  git("commit", "-m", msg, "--", ...paths); git("push");
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
