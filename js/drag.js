// Objets déplaçables : on attrape un objet du bureau et on le pose ailleurs.
// Les positions sont retenues dans le navigateur ; « Ranger le bureau » remet tout en place.
import {deskScale, getOffset, setOffset, hasMoved, resetMoved} from "./desk.js";

const FIXED = ["monitor", "mat"];   // trop lourds pour être déplacés
const THRESHOLD = 6;                // en dessous de 6 px, c'est un clic, pas un déplacement

const tidy = document.getElementById("tidy");
const showTidy = () => { tidy.hidden = !hasMoved(); };
let top = null;                     // dernier objet déplacé : il passe au-dessus des autres

export function initDrag() {
  const objs = [...document.querySelectorAll("#scene [data-o]")].filter(el => !FIXED.includes(el.dataset.o));
  objs.forEach(el => {
    el.classList.add("drag");
    let start = null, moved = false;

    el.addEventListener("pointerdown", e => {
      if (e.button !== 0) return;
      start = {x: e.clientX, y: e.clientY, off: getOffset(el.dataset.o), left: parseFloat(el.style.left), top: parseFloat(el.style.top)};
      moved = false;
    });

    el.addEventListener("pointermove", e => {
      if (!start) return;
      const s = deskScale();
      const dx = (e.clientX - start.x) / s, dy = (e.clientY - start.y) / s;   // la scène est mise à l'échelle
      if (!moved && Math.hypot(dx * s, dy * s) < THRESHOLD) return;
      // on ne capture le pointeur qu'au début d'un vrai déplacement : un simple clic garde sa cible
      // (sinon les boutons à l'intérieur d'un objet, comme les drapeaux du pot, ne recevraient plus le clic)
      if (!moved) el.setPointerCapture(e.pointerId);
      moved = true;
      el.classList.add("dragging");
      el.style.left = start.left + dx + "px";
      el.style.top = start.top + dy + "px";
    });

    const end = e => {
      if (!start) return;
      if (moved) {
        const s = deskScale();
        setOffset(el.dataset.o, [start.off[0] + (e.clientX - start.x) / s, start.off[1] + (e.clientY - start.y) / s]);
        el.classList.remove("dragging");
        if (top && top !== el) top.style.zIndex = "";
        if (el.dataset.o !== "lamp") el.style.zIndex = 3;     // reste sous la couche de nuit (4)
        top = el;
        showTidy();
      }
      start = null;
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);

    // un déplacement ne doit pas ouvrir l'objet : on annule le clic qui suit
    el.addEventListener("click", e => {
      if (moved) { e.stopImmediatePropagation(); e.preventDefault(); moved = false; }
    }, true);
  });

  tidy.addEventListener("click", () => {
    objs.forEach(el => { el.style.zIndex = ""; });
    resetMoved();
    showTidy();
  });
  addEventListener("desk:layout", () => requestAnimationFrame(showTidy));
  showTidy();
}
