// Écran d'accueil : un couloir dans le noir, seule la porte du bureau est éclairée. Affiché seulement à la première visite
// (mémorisé dans le navigateur). Pour le revoir : ajouter ?intro à l'adresse.
import {reduceMotion} from "./utils.js";

const KEY = "eli-portfolio-intro-vue";
const wait = ms => new Promise(r => setTimeout(r, ms));

function alreadySeen() {
  if (new URLSearchParams(location.search).has("intro")) return false;
  try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; }
}
function markSeen() {
  try { localStorage.setItem(KEY, "1"); } catch (e) { /* stockage bloqué : l'accueil reviendra, ce n'est pas grave */ }
}

// Poignée qui s'abaisse, porte qui s'ouvre, puis on « avance » dans l'embrasure
async function enter(intro) {
  if (reduceMotion) return;
  const front = document.getElementById("front-scene");
  const door = document.getElementById("door-wrap").getBoundingClientRect();
  front.style.transformOrigin = `${door.left + door.width / 2}px ${door.top + door.height * .55}px`;
  intro.classList.add("turn");
  await wait(260);
  intro.classList.add("open");
  await wait(750);
  // On avance un peu vers la porte pendant que la lumière de la pièce envahit l'écran depuis l'embrasure.
  // (pas de zoom géant : Firefox laisse des traces à l'écran avec une couche aussi grande)
  const way = document.querySelector("#door-wrap .doorway").getBoundingClientRect();
  const flood = document.getElementById("flood");
  front.animate([{transform: "scale(1)"}, {transform: "scale(1.6)"}], {duration: 900, easing: "cubic-bezier(.5,0,.9,.6)", fill: "forwards"});
  document.getElementById("intro-go").animate([{opacity: 1}, {opacity: 0}], {duration: 300, fill: "forwards"});
  // lueur ronde aux bords flous, centrée sur l'embrasure, qui grandit jusqu'à dépasser l'écran
  const cx = way.left + way.width / 2, cy = way.top + way.height / 2;
  const circle = d => ({left: cx - d / 2 + "px", top: cy - d / 2 + "px", width: d + "px", height: d + "px"});
  const big = Math.hypot(innerWidth, innerHeight) * 2.6;
  await flood.animate([
    {...circle(way.width * 1.4), opacity: 0},
    {...circle(big * .35), opacity: .9, offset: .45},
    {...circle(big), opacity: 1},
  ], {duration: 1000, easing: "cubic-bezier(.5,0,.8,.5)", fill: "forwards"}).finished;
  // le bureau apparaît derrière la lumière
  await intro.animate([{opacity: 1}, {opacity: 0}], {duration: 500, fill: "forwards"}).finished;
}

/** Affiche l'accueil si besoin. La promesse se résout quand le bureau est visible. */
export function runIntro() {
  const intro = document.getElementById("intro");
  if (alreadySeen()) { intro.hidden = true; return Promise.resolve(false); }

  const btn = document.getElementById("intro-go");

  return new Promise(resolve => {
    let done = false;
    const go = async () => {
      if (done) return;
      done = true;
      removeEventListener("keydown", onKey);
      await enter(intro);
      intro.remove();                                   // on retire complètement l'accueil de la page
      markSeen();
      resolve(true);
    };
    const onKey = e => { if (e.key === "Enter" && document.activeElement !== btn) go(); };
    btn.addEventListener("click", go);
    addEventListener("keydown", onKey);
  });
}
