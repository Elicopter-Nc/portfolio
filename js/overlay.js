// Passage d'un objet du bureau au premier plan (et retour), avec une animation FLIP.
import {reduceMotion} from "./utils.js";

let current = null;

// Anime `panel` depuis le rectangle de l'objet `srcEl` vers sa place finale (ou l'inverse).
// `targetEl` : partie du panneau qui doit coïncider avec l'objet (par défaut le panneau entier).
function flip(panel, srcEl, targetEl, reverse) {
  if (reduceMotion || !panel.animate) return Promise.resolve();
  const src = srcEl.getBoundingClientRect();
  const tgt = (targetEl || panel).getBoundingClientRect();
  const base = panel.getBoundingClientRect();
  const s = src.width / tgt.width;
  const tx = src.left - base.left - s * (tgt.left - base.left);
  const ty = src.top - base.top - s * (tgt.top - base.top);
  const from = {transformOrigin: "0 0", transform: `translate(${tx}px,${ty}px) scale(${s})`, opacity: .6};
  const to = {transformOrigin: "0 0", transform: "none", opacity: 1};
  return panel.animate(reverse ? [to, from] : [from, to],
    {duration: reverse ? 320 : 480, easing: "cubic-bezier(.2,.8,.2,1)"}).finished;
}

/**
 * Ouvre une surcouche.
 * @param {object} o
 * @param {HTMLElement} o.ov       la surcouche
 * @param {HTMLElement} o.panel    l'élément animé
 * @param {HTMLElement} o.src      l'objet cliqué sur le bureau
 * @param {() => HTMLElement} [o.target]
 * @param {() => void} [o.onOpen]  appelé une fois la surcouche visible (avant l'animation)
 * @param {() => void} [o.onClose] appelé au début de la fermeture
 */
export function openOverlay(o) {
  current = o;
  o.ov.hidden = false;
  o.onOpen?.();
  if (!reduceMotion && o.ov.animate) o.ov.animate([{opacity: 0}, {opacity: 1}], {duration: 300});
  flip(o.panel, o.src, o.target?.(), false);
  o.src.classList.add("away");
  o.ov.querySelector(".close").focus();
}

export async function closeOverlay() {
  if (!current) return;
  const o = current;
  current = null;
  o.onClose?.();
  o.src.classList.remove("away");
  o.src.style.visibility = "hidden";
  const fade = !reduceMotion && o.ov.animate
    ? o.ov.animate([{opacity: 1}, {opacity: 0}], {duration: 320, fill: "forwards"})
    : null;
  await flip(o.panel, o.src, o.target?.(), true);
  if (fade) await fade.finished.catch(() => {});
  o.ov.hidden = true;
  fade?.cancel();
  o.src.style.visibility = "";
  o.src.focus();
}

export function initOverlays() {
  document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", closeOverlay));
  // clic en dehors du panneau (carnet, post-it) : on ferme
  document.querySelectorAll(".overlay.center").forEach(ov =>
    ov.addEventListener("click", e => { if (e.target === ov) closeOverlay(); }));
  addEventListener("keydown", e => { if (e.key === "Escape") closeOverlay(); });
}
