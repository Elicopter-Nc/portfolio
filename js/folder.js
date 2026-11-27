// Le dossier des projets : le scroll ouvre la chemise puis sort les fiches une à une, qui s'empilent.
import {PROJECTS} from "./data.js";
import {esc, pad, clamp, ease, reduceMotion} from "./utils.js";
import {openOverlay} from "./overlay.js";
import {t, tr} from "./i18n.js";

const N = PROJECTS.length;
const PHASES = N + 1.3;          // 1 phase d'ouverture + 1 par fiche + un peu de marge pour lire la dernière

const ov = document.getElementById("ov-folder");
const sec = document.getElementById("dossier");
const stage = document.getElementById("stage");
const fdesk = document.getElementById("fdesk");
const back = document.getElementById("back");
const front = document.getElementById("front");
const count = document.getElementById("count");
const barfill = document.getElementById("barfill");
const fhint = document.getElementById("fhint");
let docs = [];
let S = 0, docH = 0, frontH = 0, rest = [];

// Photo « papier » tenue par un trombone ; orientation déduite de ses dimensions
function photoTemplate(p) {
  if (!p.photo) return "";
  const {src, w, h, alt} = p.photo;
  const orient = h > w ? "portrait" : "landscape";
  return `<figure class="photo ${orient}" style="--ratio:${w}/${h}">
          <img src="${src}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy">
        </figure>`;
}

function docTemplate(p, i) {
  const stamp = p.wip ? `<span class="stamp">${t("EN COURS")}</span>` : p.priv ? `<span class="stamp">${t("PRIVÉ")}</span>` : "";
  const link = p.url
    ? `<a class="btn" href="${p.url}" target="_blank" rel="noopener">${t("Voir le code ↗")}</a>`
    : `<span class="btn off">${t("Dépôt privé · démo sur demande")}</span>`;
  return `
  <article class="doc" data-up="0" style="--c-bg:${p.bg};--c-fg:${p.fg};--a:${p.a};--b:${p.b}" aria-label="${t("Fiche")} ${esc(tr(p, "name"))}">
    <button class="d-tab" data-i="${i}">${esc(tr(p, "name"))} <span>${pad(i + 1)}</span></button>
    <div class="sheet">
      <div class="band"><span>${t("Fiche")} ${pad(i + 1)} / ${pad(N)}</span><span>${t("Réf.")} ${esc(p.id)}</span></div>
      <div class="content${p.photo ? "" : " no-photo"}">
        ${stamp}
        <div>
          <h3>${esc(tr(p, "name"))}</h3>
          <p>${esc(tr(p, "desc"))}</p>
          <dl class="fields">
            <div><dt>${t("Type")}</dt><span class="lead"></span><dd>${esc(p.type)}</dd></div>
            <div><dt>${t("Stack")}</dt><span class="lead"></span><dd>${esc(p.stack)}</dd></div>
            <div><dt>${t("Année")}</dt><span class="lead"></span><dd>${esc(p.yr)}</dd></div>
          </dl>
          ${p.challenge ? `<div class="learn"><h4>${t("Défi technique")}</h4><p>${esc(tr(p, "challenge"))}</p></div>` : ""}
          ${p.learned ? `<div class="learn"><h4>${t("Ce que j'ai appris")}</h4><ul>${tr(p, "learned").map(l => `<li>${esc(l)}</li>`).join("")}</ul></div>` : ""}
          ${link}
        </div>
        ${photoTemplate(p)}
      </div>
    </div>
  </article>`;
}

// Calcule les tailles et positions en fonction de l'écran
let dy = 0, readTop = 0, backTop = 0;
export function layoutFolder() {
  if (reduceMotion || ov.hidden) return;
  S = ov.clientHeight;
  stage.style.height = S + "px";
  const W = fdesk.clientWidth, narrow = W < 640;
  const folderH = Math.min(S * .56, 420);
  backTop = S - folderH;
  frontH = folderH * .72;
  back.style.top = backTop + "px";
  back.style.height = folderH + "px";
  front.style.height = frontH + "px";
  // la fiche lue se pose en haut ; le dossier descend pour que son rabat avant arrive juste sous elle
  readTop = (narrow ? 100 : 64) + 30;
  docH = Math.min(S - readTop - 64, narrow ? 680 : 640);
  const frontTop = Math.min(readTop + docH + 14, S - 50);
  dy = frontTop - (S - frontH);
  const inner = W - (narrow ? 20 : 48);
  const tabsW = inner - (narrow ? 6 : 24);          // les onglets s'arrêtent avant le bord du dossier
  const tabW = narrow ? Math.max(64, tabsW / N + 26) : Math.min(170, tabsW / N + 44);
  const step = (tabsW - tabW) / (N - 1);
  docs.forEach((d, i) => {
    d.style.left = (narrow ? 10 : 24) + "px";
    d.style.width = inner + "px";
    d.style.height = docH + "px";
    const tab = d.querySelector(".d-tab");
    tab.style.left = (i * step) + "px";
    tab.style.width = tabW + "px";
    rest[i] = backTop + 46 + i * 4;
  });
  sec.style.height = (S + PHASES * S * .85) + "px";
  shown = target();
  draw();
}

// Progression lue dans le scroll (0 → 1)
const target = () => clamp(ov.scrollTop / Math.max(1, sec.offsetHeight - S), 0, 1);

// Dessine le dossier pour une progression donnée :
// phase 0 = le dossier s'ouvre et descend ; phase 1 + i = la fiche i sort de la poche et se pose par-dessus les précédentes
function draw() {
  const prog = shown;
  const u = prog * PHASES;
  const opening = ease(clamp(u, 0, 1));
  const shift = dy * opening;
  back.style.transform = `translate3d(0,${shift.toFixed(1)}px,0)`;
  front.style.transform = `translate3d(0,${(shift + opening * 10).toFixed(1)}px,0)`;
  const lifts = docs.map((_, i) => ease(clamp((u - 1 - i) / .8, 0, 1)));
  let cur = -1;
  docs.forEach((d, i) => {
    const l = lifts[i];
    // fiches posées par-dessus celle-ci : elle recule un peu, comme les cartes de la vue rapide
    const above = Math.min(lifts.slice(i + 1).reduce((a, b) => a + b, 0), 3);
    const r = rest[i] + shift;
    const y = r + (readTop - r) * l - above * 14 * l;
    const sc = 1 - above * .035 * l;
    // droite dans le dossier et une fois posée ; elle penche juste un peu pendant qu'on la sort
    d.style.transform = `translate3d(0,${y.toFixed(1)}px,0) rotate(${(Math.sin(l * Math.PI) * (i % 2 ? .8 : -.8)).toFixed(2)}deg) scale(${sc.toFixed(4)})`;
    // toujours derrière le rabat avant (z 20) : on voit la fiche sortir de la poche
    d.style.zIndex = l > .001 ? 10 + i : i + 1;
    d.dataset.up = l > .001 ? 1 : 0;
    d.style.setProperty("--lift", l.toFixed(3));
    if (l > .5) cur = i;
  });
  count.innerHTML = cur >= 0 ? `${t("Fiche")} <b>${pad(cur + 1)}</b> / ${pad(N)} · ${esc(tr(PROJECTS[cur], "name"))}`
    : u < .5 ? `<b>${t("Dossier fermé")}</b>`
    : `<b>${t("Dossier ouvert")}</b>`;
  barfill.style.width = (prog * 100) + "%";
  fhint.style.opacity = 1 - opening;
}

// Lissage : l'affichage rattrape le scroll en douceur (la molette avance par crans, l'animation non)
let shown = 0, raf = 0;
function update() {
  if (reduceMotion || ov.hidden || raf) return;
  const step = () => {
    const goal = target();
    shown += (goal - shown) * .16;
    if (Math.abs(goal - shown) < .0003) shown = goal;
    draw();
    raf = shown === goal ? 0 : requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}

export function initFolder() {
  const holder = document.getElementById("docs");
  const render = () => {
    holder.innerHTML = PROJECTS.map(docTemplate).join("");
    docs = [...holder.querySelectorAll(".doc")];
  };
  render();
  addEventListener("lang:change", () => { render(); layoutFolder(); });
  if (reduceMotion) document.documentElement.classList.add("static");

  ov.addEventListener("scroll", update, {passive: true});

  // clic sur un onglet : on fait défiler jusqu'à cette fiche
  holder.addEventListener("click", e => {
    const tab = e.target.closest(".d-tab");
    if (!tab) return;
    if (reduceMotion) { tab.parentElement.scrollIntoView(); return; }
    const len = sec.offsetHeight - S;
    ov.scrollTo({top: ((1 + Number(tab.dataset.i) + .85) / PHASES) * len, behavior: "smooth"});
  });

  document.getElementById("o-folder").addEventListener("click", e => openOverlay({
    ov, panel: fdesk, src: e.currentTarget, target: () => back,
    onOpen: () => { ov.scrollTop = 0; layoutFolder(); },
    onClose: () => { ov.scrollTop = 0; shown = 0; draw(); },
  }));
}
