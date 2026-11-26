// Calendrier de bureau : une vraie page de calendrier mensuel, où chaque jour est teinté
// selon mes contributions GitHub. En gros plan, on tourne les pages des 12 derniers mois.
// Données publiques via github-contributions-api.jogruber.de (l'API officielle demande un jeton).
import {GITHUB_URL} from "./data.js";
import {isEn, locale} from "./i18n.js";

const USER = GITHUB_URL.split("/").pop();
const CACHE = "eli-portfolio-contribs-v2";   // changer le nom si le format des données change
let data = null;          // {byDate: {"2026-11-26": {count, level}}, total}
let page = null;          // mois affiché en gros plan : {y, m} (m de 0 à 11)

// Date du jour à Nouméa, au format AAAA-MM-JJ
function todayISO() {
  try { return new Intl.DateTimeFormat("en-CA", {timeZone: "Pacific/Noumea"}).format(new Date()); }
  catch (e) { return new Date().toISOString().slice(0, 10); }
}
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const monthName = (y, m) => new Date(y, m, 1).toLocaleDateString(locale(), {month: "long"});
// jours de la semaine en commençant par lundi
const weekdays = form => Array.from({length: 7}, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(locale(), {weekday: form}).replace(".", ""));

/** Cases d'un mois : lundi en premier, avec les jours du mois précédent/suivant pour compléter les semaines. */
function monthCells(y, m) {
  const first = (new Date(y, m, 1).getDay() + 6) % 7;          // 0 = lundi
  const days = new Date(y, m + 1, 0).getDate();
  const total = Math.ceil((first + days) / 7) * 7;
  return Array.from({length: total}, (_, i) => {
    const d = new Date(y, m, i - first + 1);
    const key = iso(d.getFullYear(), d.getMonth(), d.getDate());
    return {day: d.getDate(), key, out: d.getMonth() !== m, we: (i % 7) >= 5, c: data?.byDate?.[key]};
  });
}

// ---------- petit calendrier posé sur le bureau : le mois en cours ----------
function renderDesk() {
  const t = todayISO();
  const [y, m] = t.split("-").map(Number);
  document.getElementById("cal-month").textContent = monthName(y, m - 1);
  document.getElementById("cal-year").textContent = y;
  const head = weekdays("narrow").map(w => `<span class="wd">${w}</span>`).join("");
  const cells = monthCells(y, m - 1).map(c =>
    `<i class="${c.out ? "out" : ""}${c.key === t ? " today" : ""}" data-l="${c.c?.level || 0}">${c.day}</i>`).join("");
  document.getElementById("cal-grid").innerHTML = head + cells;
  document.getElementById("cal-foot").textContent = data
    ? (isEn() ? `${data.total} contributions this year` : `${data.total} contributions sur un an`)
    : "GitHub";
}

// ---------- gros plan : une page par mois, qu'on tourne ----------
function monthTotal(y, m) {
  return monthCells(y, m).filter(c => !c.out).reduce((s, c) => s + (c.c?.count || 0), 0);
}

function renderBig() {
  const en = isEn();
  const t = todayISO();
  const [ty, tm] = t.split("-").map(Number);
  const now = {y: ty, m: tm - 1};
  const idx = p => p.y * 12 + p.m;
  const min = idx(now) - 11;                                      // 12 mois de données
  const {y, m} = page;
  const days = monthCells(y, m).map(c => {
    const n = c.c?.count || 0;
    const label = n ? (en ? `${n} contribution${n > 1 ? "s" : ""}` : `${n} contribution${n > 1 ? "s" : ""}`) : "";
    return `<div class="cm-day${c.out ? " out" : ""}${c.we ? " we" : ""}${c.key === t ? " today" : ""}" data-l="${c.out ? 0 : c.c?.level || 0}"${label && !c.out ? ` title="${label}"` : ""}>
      <b>${c.day}</b>${!c.out && n ? `<small>${label}</small>` : ""}</div>`;
  }).join("");
  const sum = monthTotal(y, m);
  document.getElementById("cal-panel").innerHTML = `
    <span class="cb-rings" aria-hidden="true">${"<i></i>".repeat(12)}</span>
    <header>
      <div class="cm-title"><h2>${monthName(y, m)}</h2><span>${y}</span></div>
      <div class="cm-nav">
        <button type="button" data-step="-1" aria-label="${en ? "Previous month" : "Mois précédent"}" ${idx(page) <= min ? "disabled" : ""}>‹</button>
        <button type="button" data-step="1" aria-label="${en ? "Next month" : "Mois suivant"}" ${idx(page) >= idx(now) ? "disabled" : ""}>›</button>
      </div>
    </header>
    <div class="cm-week" aria-hidden="true">${weekdays("short").map(w => `<span>${w}</span>`).join("")}</div>
    <div class="cm-grid">${days}</div>
    <footer>
      <span class="cm-sum">${data
        ? (en ? `<b>${sum}</b> contributions this month · <b>${data.total}</b> over the year` : `<b>${sum}</b> contributions ce mois-ci · <b>${data.total}</b> sur un an`)
        : (en ? "GitHub data unavailable" : "Données GitHub indisponibles")}</span>
      <a href="${GITHUB_URL}" target="_blank" rel="noopener">${en ? "Open my GitHub profile ↗" : "Ouvrir mon profil GitHub ↗"}</a>
    </footer>`;
}

export function openCalendar(src, openOverlay) {
  const [y, m] = todayISO().split("-").map(Number);
  page = {y, m: m - 1};
  renderBig();
  openOverlay({ov: document.getElementById("ov-cal"), panel: document.getElementById("cal-panel"), src});
}

async function load() {
  try {
    const c = JSON.parse(sessionStorage.getItem(CACHE) || "null");
    // on ne réutilise le cache que s'il a le bon format
    if (c && Date.now() - c.at < 60 * 60 * 1000 && c.data?.byDate) return c.data;
  } catch (e) {}
  const r = await (await fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`)).json();
  const byDate = {};
  r.contributions.forEach(d => { byDate[d.date] = {count: d.count, level: d.level}; });
  const d = {byDate, total: r.total.lastYear};
  try { sessionStorage.setItem(CACHE, JSON.stringify({at: Date.now(), data: d})); } catch (e) {}
  return d;
}

export async function initCalendar() {
  renderDesk();
  addEventListener("lang:change", () => { renderDesk(); if (page) renderBig(); });
  // tourner les pages en gros plan (boutons ‹ › et flèches du clavier)
  const panel = document.getElementById("cal-panel");
  const turn = step => {
    page = {y: page.y + Math.floor((page.m + step) / 12), m: ((page.m + step) % 12 + 12) % 12};
    renderBig();
  };
  panel.addEventListener("click", e => {
    const b = e.target.closest("[data-step]");
    if (b && !b.disabled) turn(+b.dataset.step);
  });
  addEventListener("keydown", e => {
    if (document.getElementById("ov-cal").hidden || !page) return;
    const b = panel.querySelector(`[data-step="${e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0}"]`);
    if (b && !b.disabled) turn(+b.dataset.step);
  });
  try { data = await load(); renderDesk(); } catch (e) { /* hors ligne : calendrier sans pastilles */ }
}
