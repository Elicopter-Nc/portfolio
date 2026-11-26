// Gros plans du téléphone et du calendrier.
import {openOverlay} from "./overlay.js";
import {openCalendar} from "./calendar.js";
import {commits, ago} from "./github.js";
import {isEn} from "./i18n.js";
import {esc} from "./utils.js";

// Écran de verrouillage : on reprend l'heure, la date et la météo affichées sur le petit téléphone,
// puis on liste les derniers commits GitHub et le rappel du stage.
function renderPhone() {
  const en = isEn();
  const txt = id => document.getElementById(id).textContent;
  const notif = (ico, color, app, when, body) => `
    <div class="pb-n"><span class="pb-ico" style="background:${color}">${ico}</span>
      <span class="pb-top"><b>${esc(app)}</b><span>${esc(when)}</span></span>
      <span>${esc(body)}</span></div>`;
  const list = commits.map(c => notif("&lt;/&gt;", "#24292f", `GitHub · ${c.repo}`, ago(c.date), c.message)).join("");
  document.getElementById("phone-panel").innerHTML = `
    <div class="pb-scr">
      <span class="pb-island" aria-hidden="true"></span>
      <span class="pb-day">${esc(txt("day"))}</span>
      <span class="pb-time">${esc(txt("clock"))}</span>
      <span class="pb-wx">${esc(txt("wx"))}</span>
      <div class="pb-list">
        ${list}
        ${notif("K", "#6f8a63", "Kairos", en ? "tomorrow" : "demain", en ? "Internship at ISI · 8:00" : "Stage chez ISI · 8 h 00")}
      </div>
      <span class="pb-bar" aria-hidden="true"></span>
    </div>`;
}

export function initCloseups() {
  document.getElementById("o-phone").addEventListener("click", e => {
    renderPhone();
    openOverlay({ov: document.getElementById("ov-phone"), panel: document.getElementById("phone-panel"), src: e.currentTarget});
  });
  document.getElementById("o-calendar").addEventListener("click", e => openCalendar(e.currentTarget, openOverlay));
}
