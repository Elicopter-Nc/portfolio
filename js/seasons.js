// Décorations selon la date (heure de Nouméa) :
//   décembre               → guirlande lumineuse au bord du bureau
//   31 décembre → 2 janvier → confettis
//   24 → 31 octobre        → citrouille près de la plante
// Pour tester : ?date=2026-12-15, ?date=2027-01-01, ?date=2026-10-31
import {currentLayout} from "./desk.js";

const box = document.getElementById("season");

function today() {
  const q = new URLSearchParams(location.search).get("date");
  if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) { const [y, m, d] = q.split("-").map(Number); return {m, d, y}; }
  try {
    const p = new Intl.DateTimeFormat("en-CA", {timeZone: "Pacific/Noumea", year: "numeric", month: "numeric", day: "numeric"}).formatToParts(new Date());
    const get = t => +p.find(x => x.type === t).value;
    return {y: get("year"), m: get("month"), d: get("day")};
  } catch (e) { const n = new Date(); return {y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate()}; }
}

function garland(W) {
  const colors = ["#ff5a5a", "#ffd23f", "#4fd1c5", "#7aa2ff", "#ff8fd8"];
  const n = Math.round(W / 70);
  let path = `M0 6`, bulbs = "";
  for (let i = 0; i < n; i++) {
    const x0 = i * W / n, x1 = (i + 1) * W / n, mx = (x0 + x1) / 2;
    path += ` Q ${mx} 44 ${x1} 6`;
    const bx = mx, by = 25;
    const c = colors[i % colors.length];
    bulbs += `<g class="bulb" style="animation-delay:${(i % 4) * .4}s"><circle cx="${bx}" cy="${by + 9}" r="12" fill="${c}" opacity=".35"/><rect x="${bx - 4}" y="${by - 2}" width="8" height="6" rx="1" fill="#3b3f45"/><ellipse cx="${bx}" cy="${by + 9}" rx="6" ry="8" fill="${c}"/></g>`;
  }
  return `<svg style="left:0;top:0" width="${W}" height="60" viewBox="0 0 ${W} 60"><path d="${path}" fill="none" stroke="#2c4a2f" stroke-width="3"/>${bulbs}</svg>`;
}

function pumpkin(x, y) {
  return `<svg style="left:${x}px;top:${y}px;filter:drop-shadow(0 6px 6px rgba(0,0,0,.35))" width="74" height="66" viewBox="0 0 74 66">
    <ellipse cx="37" cy="38" rx="34" ry="26" fill="#e8751a"/>
    <ellipse cx="37" cy="38" rx="20" ry="26" fill="#f08a2c"/>
    <ellipse cx="37" cy="38" rx="7" ry="26" fill="#f39b43"/>
    <path d="M34 14 q2 -10 8 -12" stroke="#4d6b2e" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M42 8 q10 -6 16 2" stroke="#6b8f3e" stroke-width="3" fill="none"/></svg>`;
}

function confetti(W, H) {
  const colors = ["#ff5a5a", "#ffd23f", "#4fd1c5", "#7aa2ff", "#ff8fd8", "#ffffff"];
  let s = "", seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;   // pseudo-aléatoire fixe : même dessin à chaque visite
  for (let i = 0; i < 90; i++) {
    s += `<i class="confetti" style="left:${(rnd() * W).toFixed(0)}px;top:${(rnd() * H).toFixed(0)}px;background:${colors[i % colors.length]};transform:rotate(${(rnd() * 180).toFixed(0)}deg)"></i>`;
  }
  return s;
}

function render() {
  const L = currentLayout();
  const {m, d} = today();
  let html = "";
  if (m === 12) html += garland(L.W);
  if ((m === 12 && d === 31) || (m === 1 && d <= 2)) html += confetti(L.W, L.H);
  if (m === 10 && d >= 24) {
    const [x, y, w, h] = L.o.plant;
    html += pumpkin(x + w * .45, y + h - 40);
  }
  box.innerHTML = html;
}

export function initSeasons() {
  render();
  addEventListener("desk:layout", render);
}
