// Le carnet (à propos, compétences, motivations, contact) et le post-it du parcours.
import {clamp} from "./utils.js";
import {GITHUB_URL} from "./data.js";
import {openOverlay} from "./overlay.js";
import {t} from "./i18n.js";

const ov = document.getElementById("ov-nb");
const pages = [...document.querySelectorAll(".page")];
const prev = document.getElementById("nb-prev");
const next = document.getElementById("nb-next");
const pos = document.getElementById("nb-pos");
let at = 0;

const isSpread = () => innerWidth > 760;   // double page sur grand écran, simple page sur mobile

export function renderNotebook() {
  const per = isSpread() ? 2 : 1, max = pages.length - per;
  at = clamp(isSpread() ? at - at % 2 : at, 0, max);
  pages.forEach((p, i) => { p.hidden = !(i >= at && i < at + per); });
  prev.disabled = at === 0;
  next.disabled = at >= max;
  pos.textContent = isSpread() ? `${at + 1}-${at + 2} / ${pages.length}` : `${at + 1} / ${pages.length}`;
}

function turn(dir) {
  at += dir * (isSpread() ? 2 : 1);
  renderNotebook();
}

function initCopy() {
  const btn = document.getElementById("copygh");
  const selectText = () => getSelection().selectAllChildren(btn.parentElement);
  btn.addEventListener("click", () => {
    const ok = () => { btn.textContent = t("Copié"); setTimeout(() => { btn.textContent = t("Copier"); }, 1600); };
    try { navigator.clipboard.writeText(GITHUB_URL).then(ok, selectText); }
    catch (e) { selectText(); }
  });
}

export function initNotebook() {
  prev.addEventListener("click", () => turn(-1));
  next.addEventListener("click", () => turn(1));
  initCopy();
  const copy = document.getElementById("copygh");
  copy.textContent = t("Copier");
  addEventListener("lang:change", () => { copy.textContent = t("Copier"); });

  document.getElementById("o-nb").addEventListener("click", e => openOverlay({
    ov, panel: document.getElementById("nb-panel"), src: e.currentTarget,
    onOpen: () => { at = 0; renderNotebook(); },
  }));

  document.getElementById("o-postit").addEventListener("click", e => openOverlay({
    ov: document.getElementById("ov-postit"), panel: document.getElementById("pi-panel"), src: e.currentTarget,
  }));
}
