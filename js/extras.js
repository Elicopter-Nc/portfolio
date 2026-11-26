// Badge de stage et CV : contenu généré depuis data.js, ouverts au premier plan au clic.
import {STAGE, CV, PROJECTS, GITHUB_URL, EMAIL} from "./data.js";
import {esc} from "./utils.js";
import {openOverlay} from "./overlay.js";
import {badgeNumber} from "./visits.js";
import {t, tr, isEn} from "./i18n.js";

// Une ligne qui commence par « À compléter » est mise en évidence pour ne pas l'oublier
const line = t => t.startsWith("À compléter") ? `<span class="todo-mark">${esc(t)}</span>` : esc(t);

function renderBadge() {
  const bars = [3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2]
    .map(w => `<i style="--w:${w}"></i>`).join("");
  document.getElementById("badge-panel").innerHTML = `
    <span class="bb-hole" aria-hidden="true"></span>
    <div class="bb-top"><b>${esc(STAGE.company)}</b><span>${esc(STAGE.place)} · ${esc(STAGE.period)}</span></div>
    <div class="bb-id"><div class="bb-avatar" aria-hidden="true">E</div><div><h2>Eli</h2><p>${esc(tr(STAGE, "role"))}</p></div></div>
    <div class="bb-body">
      <div><h3>${t("Missions")}</h3><ul>${tr(STAGE, "missions").map(m => `<li>${line(m)}</li>`).join("")}</ul></div>
      <div><h3>${t("Technos")}</h3><div class="tags">${STAGE.stack.map(t => `<span>${line(t)}</span>`).join("")}</div></div>
    </div>
    <div class="bb-code" aria-hidden="true">${bars}</div>
    <span class="bb-num" id="badge-num-big" aria-hidden="true">${badgeNumber()}</span>`;
}

function renderCV() {
  const projects = [...CV.extraProjects, ...PROJECTS].map(p => `<div class="item"><b>${esc(tr(p, "name"))}</b><span>${esc(tr(p, "desc").split(/ : |: /)[0].split(". ")[0].replace(/\.$/, ""))}.</span><small>${esc(p.stack)}</small></div>`).join("");
  const skills = Object.entries(tr(CV, "skills")).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");
  document.getElementById("cv-panel").innerHTML = `
    <header>
      <div><h2>Eli</h2><p>${esc(tr(CV, "title"))}</p></div>
      <div class="cv-contact"><span>${esc(tr(CV, "place"))}</span>
        <span class="redacted" aria-label="${t("Numéro de téléphone masqué")}"><i aria-hidden="true">00 00 00</i></span>
        <a href="mailto:${EMAIL}">${EMAIL}</a>
        <a href="${GITHUB_URL}" target="_blank" rel="noopener">${esc(GITHUB_URL.replace("https://", ""))}</a></div>
    </header>
    <p class="cv-profile">${esc(tr(CV, "profile"))}</p>
    <div class="cv-cols">
      <div>
        <section><h3>${t("Expérience")}</h3>
          <div class="item"><b>${esc(tr(STAGE, "role"))} · ${esc(STAGE.company)}</b><span>${esc(STAGE.place)}</span><small>${esc(STAGE.period)}</small></div>
        </section>
        <section><h3>${t("Formation")}</h3>
          ${CV.education.map(e => `<div class="item"><b>${esc(tr(e, "what"))}</b><span>${esc(tr(e, "where"))}</span><small>${esc(tr(e, "when"))}</small></div>`).join("")}
        </section>
        <section><h3>${t("Projets")}</h3>${projects}</section>
      </div>
      <div>
        <section><h3>${t("Compétences")}</h3><dl>${skills}</dl></section>
        <section><h3>${t("Langues")}</h3><p style="margin:0;font-size:14.5px">${esc(tr(CV, "languages"))}</p></section>
        <section><h3>${t("Centres d'intérêt")}</h3><p style="margin:0;font-size:14.5px">${esc(tr(CV, "interests"))}</p></section>
      </div>
    </div>
    <a class="cv-dl" id="cv-dl" href="${CV.pdf}" download hidden>${t("Télécharger le CV en PDF ↓")}</a>`;
  // le bouton n'apparaît que si le PDF existe vraiment
  fetch(CV.pdf, {method: "HEAD"}).then(r => { if (r.ok) document.getElementById("cv-dl").hidden = false; }).catch(() => {});
}

export function initExtras() {
  renderBadge();
  renderCV();
  const deskRole = () => { document.getElementById("badge-role").textContent = isEn() ? "DEV INTERN" : "STAGIAIRE DEV"; };
  deskRole();
  addEventListener("lang:change", () => { renderBadge(); renderCV(); deskRole(); });
  document.getElementById("o-badge").addEventListener("click", e => openOverlay({
    ov: document.getElementById("ov-badge"), panel: document.getElementById("badge-panel"), src: e.currentTarget,
  }));
  document.getElementById("o-cv").addEventListener("click", e => openOverlay({
    ov: document.getElementById("ov-cv"), panel: document.getElementById("cv-panel"), src: e.currentTarget,
  }));
}
