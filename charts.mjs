// Leaderboard graphics for the README (assets/leaderboard-gauntlet.svg, assets/leaderboard-arena.svg). Pure functions, same look as assets/banner.svg.
const C = { bg: "#0c0c0b", line: "#34332f", cell: "#171716", cellLine: "#232220", ink: "#ebe9e4", ink2: "#aeaca5", ink3: "#8f8d86", green: "#2fc08d", orange: "#ee7a45", bot: "#6b685f", gold: "#e3b341", silver: "#b8bcc4", bronze: "#c8875a" };
const W = 1200, MONO = "IBM Plex Mono, ui-monospace, Menlo, monospace", SANS = "IBM Plex Sans, system-ui, -apple-system, sans-serif";
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
export const label = (m) => String(m).replace(/^.*\//, "").replace(/-GGUF:/, " · ");
const medal = (i) => [C.gold, C.silver, C.bronze][i];
const svg = (h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" font-family="${MONO}">\n<rect width="${W}" height="${h}" rx="10" fill="${C.bg}"/><rect x=".5" y=".5" width="${W - 1}" height="${h - 1}" rx="10" fill="none" stroke="${C.line}"/>\n${body}</svg>\n`;
const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size ?? 13}" fill="${o.fill ?? C.ink2}"${o.anchor ? ` text-anchor="${o.anchor}"` : ""}${o.weight ? ` font-weight="${o.weight}"` : ""}${o.sans ? ` font-family="${SANS}"` : ""}>${esc(s)}</text>`;

// A bar made of grid cells (like the board): `frac` of the N cells is filled.
function cells(x, y, frac, color, N = 50, width = 520, h = 18) {
  const step = width / N, on = Math.round(Math.max(0, Math.min(1, frac)) * N);
  let g = "";
  for (let i = 0; i < N; i++) g += `<rect x="${(x + i * step).toFixed(1)}" y="${y}" width="${(step - 2).toFixed(1)}" height="${h}" rx="2" fill="${i < on ? color : C.cell}"${i < on ? "" : ` stroke="${C.cellLine}"`}${i < on ? ` fill-opacity="${(0.55 + 0.45 * (i / N)).toFixed(2)}"` : ""}/>`;
  return g;
}
const head = (dot, title, sub) => `<circle cx="48" cy="46" r="6" fill="${dot}"/>${t(64, 52, title, { size: 22, fill: C.ink, weight: 700, sans: true })}${t(48, 78, sub, { size: 13, fill: C.ink3 })}`;
const rank = (i, y) => `<circle cx="62" cy="${y}" r="13" fill="${i < 3 ? medal(i) : C.cell}"${i < 3 ? "" : ` stroke="${C.cellLine}"`}/>${t(62, y + 5, i + 1, { size: 13, anchor: "middle", weight: 700, fill: i < 3 ? C.bg : C.ink3 })}`;

// rows: [{ name, score, avgShots, fallbacks, bot }] sorted best first
export function gauntletSvg(rows) {
  const X0 = 440, BW = 520, RH = 44, top = 112, probBot = rows.find((r) => /probability/i.test(r.name));
  let b = head(C.green, "GAUNTLET", "solo · same 3 fixed boards for every model · score = 100 × (100 − avg shots) / 83 · higher is better");
  b += t(X0, top - 16, "0", { size: 11, fill: C.ink3 }) + t(X0 + BW, top - 16, "100", { size: 11, fill: C.ink3, anchor: "end" });
  b += t(1020, top - 16, "SCORE", { size: 11, fill: C.ink3, anchor: "end" }) + t(1100, top - 16, "AVG SHOTS", { size: 11, fill: C.ink3, anchor: "end" }) + t(1170, top - 16, "AUTO", { size: 11, fill: C.ink3, anchor: "end" });
  rows.forEach((r, i) => {
    const y = top + i * RH, cy = y + 14;
    if (i % 2 === 0) b += `<rect x="24" y="${y - 8}" width="${W - 48}" height="${RH - 4}" rx="6" fill="#111110"/>`;
    b += rank(i, cy + 1) + t(92, cy + 5, label(r.name), { size: 15, fill: r.bot ? C.ink3 : C.ink, sans: true, weight: i === 0 ? 700 : 500 });
    if (r.bot) b += `<rect x="${92 + Math.min(label(r.name).length, 30) * 8.4 + 8}" y="${cy - 9}" width="34" height="17" rx="8" fill="none" stroke="${C.bot}"/>${t(92 + Math.min(label(r.name).length, 30) * 8.4 + 25, cy + 3, "BOT", { size: 10, fill: C.ink3, anchor: "middle" })}`;
    b += cells(X0, cy - 9, r.score / 100, r.bot ? C.bot : C.green, 50, BW);
    b += t(1020, cy + 5, r.score.toFixed(1), { size: 17, fill: r.bot ? C.ink3 : i === 0 ? C.green : C.ink, anchor: "end", weight: 700 });
    b += t(1100, cy + 5, r.avgShots, { size: 14, fill: C.ink2, anchor: "end" }) + t(1170, cy + 5, r.fallbacks || "–", { size: 14, fill: r.fallbacks ? C.orange : C.ink3, anchor: "end" });
  });
  const h = top + rows.length * RH + 30;
  if (probBot) { const x = X0 + (probBot.score / 100) * BW; b += `<line x1="${x}" y1="${top - 10}" x2="${x}" y2="${h - 40}" stroke="${C.ink3}" stroke-dasharray="3 4" opacity=".7"/>` + t(x + 6, top - 16, "probability bot", { size: 10, fill: C.ink3 }); }
  b += t(48, h - 12, "Auto = random moves played after an invalid answer (lower is better). Bots are the yardstick.", { size: 11, fill: C.ink3 });
  return svg(h, b);
}

// rows: [{ model, elo, wins, games, winRate, avgShotsToWin, accuracy }] sorted by Elo; h2h: Map<"a|b", wins of a over b>
export function arenaSvg(rows, h2h) {
  const sub = "head-to-head · each model places its own fleet · Elo starts at 1000, K = 32 · cells show the rating";
  if (!rows.length) {
    let b = head(C.orange, "ARENA", sub);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 16; c++) b += `<rect x="${760 + c * 24}" y="${112 + r * 24}" width="20" height="20" rx="2" fill="${C.cell}" stroke="${C.cellLine}"/>`;
    b += t(48, 150, "No games played yet.", { size: 20, fill: C.ink, sans: true, weight: 600 }) + t(48, 178, "Start  node server.mjs  and let two models play each other.", { size: 13 });
    return svg(240, b);
  }
  const X0 = 440, BW = 360, RH = 44, top = 112;
  const lo = Math.min(900, Math.min(...rows.map((r) => r.elo)) - 25), hi = Math.max(1100, Math.max(...rows.map((r) => r.elo)) + 25);
  let b = head(C.orange, "ARENA", sub);
  b += t(X0 + BW + 56, top - 16, "ELO", { size: 11, fill: C.ink3, anchor: "end" }) + t(950, top - 16, "WIN–LOSS", { size: 11, fill: C.ink3, anchor: "end" }) + t(1020, top - 16, "WIN %", { size: 11, fill: C.ink3, anchor: "end" }) + t(1100, top - 16, "SHOTS/WIN", { size: 11, fill: C.ink3, anchor: "end" }) + t(1170, top - 16, "ACC", { size: 11, fill: C.ink3, anchor: "end" });
  rows.forEach((r, i) => {
    const y = top + i * RH, cy = y + 14;
    if (i % 2 === 0) b += `<rect x="24" y="${y - 8}" width="${W - 48}" height="${RH - 4}" rx="6" fill="#111110"/>`;
    b += rank(i, cy + 1) + t(92, cy + 5, label(r.model), { size: 15, fill: C.ink, sans: true, weight: i === 0 ? 700 : 500 });
    b += cells(X0, cy - 9, (r.elo - lo) / (hi - lo), C.orange, 40, BW);
    b += t(X0 + BW + 56, cy + 5, r.elo, { size: 17, fill: i === 0 ? C.orange : C.ink, anchor: "end", weight: 700 });
    b += t(950, cy + 5, `${r.wins}–${r.games - r.wins}`, { size: 14, anchor: "end" }) + t(1020, cy + 5, `${Math.round(r.winRate * 100)}%`, { size: 14, anchor: "end" });
    b += t(1100, cy + 5, r.avgShotsToWin ? r.avgShotsToWin.toFixed(1) : "–", { size: 14, anchor: "end" }) + t(1170, cy + 5, `${Math.round(r.accuracy * 100)}%`, { size: 14, anchor: "end" });
  });
  let h = top + rows.length * RH + 20;
  if (rows.length > 1) { // head-to-head matrix: wins of row model over column model
    const M = rows.slice(0, 8), S = 64, mx = 440, my = h + 56;
    b += t(48, h + 20, "HEAD TO HEAD", { size: 12, fill: C.ink3 }) + t(48, h + 38, "wins of the row model over the column model", { size: 11, fill: C.ink3 });
    M.forEach((c, j) => { b += `<text transform="translate(${mx + j * S + S / 2 + 4},${my - 8}) rotate(-30)" font-size="11" fill="${C.ink2}">${esc(label(c.model).slice(0, 18))}</text>`; });
    M.forEach((rw, i) => {
      b += t(mx - 12, my + i * S + S / 2 + 4, label(rw.model).slice(0, 26), { size: 12, fill: C.ink2, anchor: "end" });
      M.forEach((c, j) => {
        const x = mx + j * S, y = my + i * S;
        if (i === j) { b += `<rect x="${x}" y="${y}" width="${S - 4}" height="${S - 4}" rx="4" fill="#111110" stroke="${C.cellLine}"/>`; return; }
        const w = h2h.get(`${rw.model}|${c.model}`) ?? 0, l = h2h.get(`${c.model}|${rw.model}`) ?? 0, tot = w + l;
        const col = !tot ? C.cell : w > l ? C.green : w < l ? C.orange : C.ink3;
        b += `<rect x="${x}" y="${y}" width="${S - 4}" height="${S - 4}" rx="4" fill="${col}" fill-opacity="${tot ? (0.2 + 0.5 * Math.abs(w - l) / tot).toFixed(2) : 1}" stroke="${tot ? col : C.cellLine}"/>`;
        b += t(x + (S - 4) / 2, y + (S - 4) / 2 + 6, tot ? `${w}–${l}` : "·", { size: 16, fill: tot ? C.ink : C.ink3, anchor: "middle", weight: 600 });
      });
    });
    h = my + M.length * S + 24;
  } else h += 10;
  return svg(h, b);
}
