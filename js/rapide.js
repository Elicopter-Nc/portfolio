// Vue rapide : le portfolio en cartes empilées, générées depuis data.js (mêmes données que le bureau).
import {PROJECTS, STAGE, CV, GITHUB_URL, EMAIL} from "./data.js";
import {t, tr, getLang} from "./i18n.js";
import {esc} from "./utils.js";

const lang = getLang();
document.documentElement.lang = lang;
document.title = lang === "en" ? "Eli · Quick view" : "Eli · Vue rapide";

const chips = list => `<div class="chips">${list.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div>`;

// une carte = un bloc de la pile ; colors = [fond, texte]
const card = (i, [bg, fg], inner) => `<article class="card" style="--i:${i};--c-bg:${bg};--c-fg:${fg}">${inner}</article>`;

const cards = [];

cards.push([["#1f3b73", "#eef2fb"], `
  <div style="grid-column:1/-1">
    <div class="k"><span>${t("Stage")}</span><span>${esc(STAGE.place)} · ${esc(STAGE.period)}</span></div>
    <h2>${esc(STAGE.company)}</h2>
    <p>${esc(tr(STAGE, "role"))}</p>
    <ul>${tr(STAGE, "missions").map(m => `<li>${esc(m)}</li>`).join("")}</ul>
    ${chips(STAGE.stack)}
  </div>`]);

PROJECTS.forEach(p => {
  const orient = p.photo && p.photo.h > p.photo.w ? "portrait" : "landscape";
  cards.push([[p.bg, p.fg], `
    <div>
      <div class="k"><span>${esc(p.type)}</span><span>${esc(p.yr)}</span></div>
      <h2>${esc(tr(p, "name"))}</h2>
      <p>${esc(tr(p, "desc"))}</p>
      ${p.challenge ? `<p class="ch"><b>${t("Défi technique")}${lang === "en" ? ":" : " :"}</b> ${esc(tr(p, "challenge"))}</p>` : ""}
      ${chips(p.stack.split(" · "))}
      ${p.url ? `<a class="btn" href="${p.url}" target="_blank" rel="noopener">${t("Voir le code ↗")}</a>` : ""}
    </div>
    ${p.photo ? `<figure class="shot ${orient}" style="margin:0"><img src="${p.photo.src}" alt="${esc(p.photo.alt)}" width="${p.photo.w}" height="${p.photo.h}" loading="lazy"></figure>` : "<span></span>"}`]);
});

cards.push([["#e9e4d8", "#1b1d20"], `
  <div style="grid-column:1/-1">
    <div class="k"><span>${t("Parcours & compétences")}</span></div>
    <div class="cols">
      <div>
        <h3>${t("Formation")}</h3>
        ${CV.education.map(e => `<div class="item"><b>${esc(tr(e, "what"))}</b><span>${esc(tr(e, "where"))} · ${esc(tr(e, "when"))}</span></div>`).join("")}
        <h3 style="margin-top:18px">${t("Langues")}</h3><p>${esc(tr(CV, "languages"))}</p>
        <h3>${t("Centres d'intérêt")}</h3><p>${esc(tr(CV, "interests"))}</p>
      </div>
      <div>
        <h3>${t("Compétences")}</h3>
        <dl>${Object.entries(tr(CV, "skills")).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
      </div>
    </div>
  </div>`]);

cards.push([["#17191c", "#f3f1ec"], `
  <div>
    <div class="k"><span>${t("Contact")}</span><span>${esc(tr(CV, "place"))}</span></div>
    <h2>${t("On se parle ?")}</h2>
    <p>${esc(tr(CV, "profile"))}</p>
    <div class="actions">
      <a class="btn solid" href="mailto:${EMAIL}">${EMAIL}</a>
      <a class="btn" href="${GITHUB_URL}" target="_blank" rel="noopener">GitHub ↗</a>
      <a class="btn" id="cv-dl" href="${CV.pdf}" download hidden>${t("Télécharger le CV en PDF ↓")}</a>
      <a class="btn" href="index.html">${t("Voir le bureau interactif →")}</a>
    </div>
  </div>
  <div class="big" aria-hidden="true">Eli</div>`]);

document.getElementById("app").innerHTML = `
  <div class="top">
    <a href="index.html">${t("Voir le bureau interactif →")}</a>
    <nav class="langs" aria-label="${t("Choisir la langue")}">
      <a href="?lang=fr" aria-current="${lang === "fr"}">FR</a><a href="?lang=en" aria-current="${lang === "en"}">EN</a>
    </nav>
  </div>
  <header class="hero">
    <h1>Eli <span>${t("conçoit des applis qui ont du caractère.")}</span></h1>
    <p>${esc(tr(CV, "profile"))}</p>
    <p class="meta"><span>${esc(tr(CV, "place"))}</span><a href="${GITHUB_URL}" target="_blank" rel="noopener">${esc(GITHUB_URL.replace("https://", ""))}</a></p>
    <div class="hint">${t("↓ fais défiler, les cartes s'empilent")}</div>
  </header>
  <div class="stack" id="stack">${cards.map(([c, inner], i) => card(i, c, inner)).join("")}</div>`;

fetch(CV.pdf, {method: "HEAD"}).then(r => { if (r.ok) document.getElementById("cv-dl").hidden = false; }).catch(() => {});
try { localStorage.setItem("eli-portfolio-langue", lang); } catch (e) {}

// la carte du dessous rétrécit légèrement quand la suivante se pose dessus
const stack = document.getElementById("stack");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
function shrink() {
  if (reduce || innerWidth <= 760) return;
  const list = [...stack.children];
  list.forEach((c, i) => {
    const next = list[i + 1];
    if (!next) return;
    const gap = next.getBoundingClientRect().top - c.getBoundingClientRect().top;
    const k = Math.max(0, Math.min(1, 1 - gap / c.offsetHeight));
    c.style.transform = `scale(${(1 - k * .05).toFixed(4)})`;
  });
}
addEventListener("scroll", () => requestAnimationFrame(shrink), {passive: true});
shrink();
