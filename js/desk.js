// Le bureau vu de dessus : placement des objets, clavier, plante, horloge.
import {PROJECTS} from "./data.js";
import {reduceMotion} from "./utils.js";
import {locale} from "./i18n.js";

// Positions dans la scène : [x, y, largeur, hauteur, rotation]. null = objet masqué.
const LAYOUT = {
  // lampAim = point du bureau éclairé par la lampe ; sun = zone où tombe la lumière de la fenêtre [x, y, largeur, hauteur]
  land: {W: 1600, H: 1000, loop: [1434, 695], lampAim: [560, 300], sun: [150, 200, 620, 430], o: {
    plant: [30, 30, 250, 250, 0], monitor: [440, 0, 720, 150, 0], mat: [300, 150, 1000, 470, 0],
    keyboard: [440, 230, 620, 215, -1], mouse: [1090, 270, 76, 124, 6],
    folder: [300, 500, 560, 400, -3], notebook: [930, 470, 380, 480, 5], pen: [880, 600, 22, 230, -14],
    postit: [1350, 100, 230, 230, 4], todo: [1370, 370, 200, 180, -5], mug: [1360, 620, 180, 150, 0],
    ring: [1370, 820, 110, 110, 0], phone: [258, 205, 140, 280, 4], card: [30, 740, 330, 190, -6],
    headset: [20, 300, 210, 210, -14], nugget: [236, 756, 54, 45, -10],
    car: [1500, 820, 60, 116, -15], lamp: [282, 6, 150, 150, 0], flags: [1212, 300, 132, 108, -6], cv: [1172, 22, 180, 250, 7], badge: [55, 530, 160, 198, 9]}},
  port: {W: 900, H: 1720, loop: [316, 1177], lampAim: [600, 330], sun: [80, 560, 560, 520], o: {
    plant: [10, 10, 200, 200, 0], monitor: [260, 0, 540, 120, 0], mat: [40, 130, 820, 390, 0],
    keyboard: [80, 190, 580, 200, -1], mouse: [710, 220, 72, 118, 6],
    folder: [30, 560, 540, 390, -3], postit: [600, 560, 260, 260, 4], todo: [630, 850, 210, 180, -5],
    notebook: [430, 1000, 400, 470, 5], phone: [50, 990, 170, 330, -8], mug: [250, 1110, 160, 134, 0],
    card: [30, 1320, 360, 160, -6], pen: null, ring: null,
    headset: null, nugget: [318, 1328, 50, 42, -10], car: [250, 966, 56, 108, 70],
    cv: [440, 1492, 200, 220, 5], badge: [690, 1500, 150, 186, -8], lamp: [790, 6, 110, 110, 70], flags: [690, 360, 130, 110, -6]}},
};

// Clavier AZERTY : [touche, largeur, surlignée]. E, L et I sont surlignées.
const KEYBOARD = [
  [["²", 1], ["&", 1], ["é", 1], ['"', 1], ["'", 1], ["(", 1], ["-", 1], ["è", 1], ["_", 1], ["ç", 1], ["à", 1], [")", 1], ["=", 1], ["⌫", 2]],
  [["⇥", 1.5], ["A", 1], ["Z", 1], ["E", 1, 1], ["R", 1], ["T", 1], ["Y", 1], ["U", 1], ["I", 1, 1], ["O", 1], ["P", 1], ["^", 1], ["$", 1], ["↵", 1.5]],
  [["⇪", 1.8], ["Q", 1], ["S", 1], ["D", 1], ["F", 1], ["G", 1], ["H", 1], ["J", 1], ["K", 1], ["L", 1, 1], ["M", 1], ["ù", 1], ["*", 1.2]],
  [["⇧", 1.3], ["<", 1], ["W", 1], ["X", 1], ["C", 1], ["V", 1], ["B", 1], ["N", 1], [",", 1], [";", 1], [":", 1], ["!", 1], ["⇧", 2.2]],
  [["Ctrl", 1.4], ["⊞", 1.2], ["Alt", 1.2], ["", 6.4], ["AltGr", 1.4], ["Ctrl", 1.4]],
];

const scene = document.getElementById("scene");
let current = LAYOUT.land;   // disposition en cours (large ou mobile)
let scale = 1;
export const deskScale = () => scale;
// décalages appliqués par le visiteur en déplaçant les objets : {land: {objet: [dx, dy]}, port: {...}}
let moved = {};
try { moved = JSON.parse(localStorage.getItem("eli-portfolio-bureau") || "{}"); } catch (e) { moved = {}; }
export const layoutName = () => current === LAYOUT.port ? "port" : "land";
export function getOffset(name) { return (moved[layoutName()] || {})[name] || [0, 0]; }
export function setOffset(name, off) {
  (moved[layoutName()] ||= {})[name] = off;
  try { localStorage.setItem("eli-portfolio-bureau", JSON.stringify(moved)); } catch (e) {}
}
export function hasMoved() { return Object.keys(moved[layoutName()] || {}).length > 0; }
export function resetMoved() {
  delete moved[layoutName()];
  try { localStorage.setItem("eli-portfolio-bureau", JSON.stringify(moved)); } catch (e) {}
  placeDesk();
}
export const currentLayout = () => current;
const room = document.getElementById("room");

export function placeDesk() {
  const vw = room.clientWidth, vh = room.clientHeight;
  const L = vw / vh < .85 ? LAYOUT.port : LAYOUT.land;
  current = L;
  const s = Math.min(vw / L.W, vh / L.H) * .97;
  scale = s;
  scene.style.width = L.W + "px";
  scene.style.height = L.H + "px";
  scene.style.transform = `scale(${s}) translate(-50%,-50%)`;
  dispatchEvent(new CustomEvent("desk:layout"));
  scene.querySelectorAll("[data-o]").forEach(el => {
    const p = L.o[el.dataset.o];
    el.hidden = !p;
    if (!p) return;
    const [dx, dy] = getOffset(el.dataset.o);
    Object.assign(el.style, {left: p[0] + dx + "px", top: p[1] + dy + "px", width: p[2] + "px", height: p[3] + "px"});
    el.style.setProperty("--r", p[4] + "deg");
  });
}

// Correspondance entre les touches du vrai clavier (event.key) et les étiquettes du clavier dessiné
const SPECIAL_KEYS = {" ": "", Enter: "↵", Backspace: "⌫", Tab: "⇥", Shift: "⇧", CapsLock: "⇪", Control: "Ctrl", Alt: "Alt", AltGraph: "AltGr", Meta: "⊞"};

function buildKeyboard() {
  const kb = document.getElementById("kb");
  kb.innerHTML = KEYBOARD.map(row =>
    `<div class="krow">${row.map(([k, w, hl]) =>
      `<span class="key" data-k="${k.toUpperCase().replace(/"/g, "&quot;")}"${hl ? " data-hl" : ""} style="--k:${w}">${k}</span>`).join("")}</div>`
  ).join("");
  return kb;
}

function pressKey(key, ms = 130) {
  key.classList.add("press");
  setTimeout(() => key.classList.remove("press"), ms);
}

// Au chargement, le clavier « tape » E, L, I : chaque touche s'enfonce puis s'allume
// (appelée par main.js une fois l'écran d'accueil passé)
export function typeName(delay = 900) {
  const kb = document.getElementById("kb");
  const keys = ["E", "L", "I"].map(k => kb.querySelector(`.key[data-k="${k}"][data-hl]`));
  if (reduceMotion) { keys.forEach(k => k.classList.add("hl")); return; }
  keys.forEach((k, i) => setTimeout(() => { pressKey(k, 160); k.classList.add("hl"); }, delay + i * 320));
}

// Les touches tapées sur le vrai clavier s'enfoncent aussi sur le clavier du bureau
function mirrorRealKeyboard(kb) {
  addEventListener("keydown", e => {
    if (e.repeat) return;
    const label = e.key in SPECIAL_KEYS ? SPECIAL_KEYS[e.key] : e.key.length === 1 ? e.key.toUpperCase() : null;
    if (label === null) return;
    const matches = kb.querySelectorAll(`.key[data-k="${CSS.escape(label)}"]`);
    // pour Maj et Ctrl il y a deux touches : on prend celle de gauche ou de droite selon e.location
    const key = matches.length > 1 && e.location === 2 ? matches[1] : matches[0];
    if (key) pressKey(key);
  });
}

function buildPlant() {
  const plant = scene.querySelector(".plant");
  for (let i = 0; i < 11; i++) {
    const leaf = document.createElement("i");
    leaf.className = "leaf";
    leaf.style.setProperty("--rot", `${i * 33 + (i % 2) * 9}deg`);
    leaf.style.setProperty("--s", .8 + (i % 3) * .14);
    leaf.style.setProperty("--d", `${-(i * .45).toFixed(2)}s`);   // délais négatifs : les feuilles ne bougent pas en même temps
    plant.appendChild(leaf);
  }
}

// Heure réelle de Nouméa sur le téléphone posé sur le bureau
function startClock() {
  const clock = document.getElementById("clock"), day = document.getElementById("day");
  const tick = () => {
    const d = new Date();
    try {
      clock.textContent = d.toLocaleTimeString(locale(), {timeZone: "Pacific/Noumea", hour: "2-digit", minute: "2-digit", hour12: false});
      day.textContent = d.toLocaleDateString(locale(), {timeZone: "Pacific/Noumea", weekday: "long", day: "numeric", month: "long"}) + " · Nouméa";
    } catch (e) { /* fuseau inconnu : on garde le texte par défaut */ }
  };
  tick();
  setInterval(tick, 20000);
  addEventListener("lang:change", tick);
}

// Clic sur la tasse : une onde se forme dans le café
function initMug() {
  const mug = scene.querySelector(".mug");
  mug.addEventListener("click", () => {
    const r = document.createElement("span");
    r.className = "ripple";
    mug.appendChild(r);
    r.addEventListener("animationend", () => r.remove());
  });
}

// Post-it TODO : un clic coche (ou décoche) « finir le portfolio »
function initTodo() {
  const btn = document.getElementById("o-todo"), last = document.getElementById("todo-last");
  btn.addEventListener("click", () => {
    const done = last.classList.toggle("done");
    btn.setAttribute("aria-pressed", done);
  });
}

// Voiture miniature : au clic, un tour en drift autour de la tasse puis retour à sa place
let driving = false;
function initCar() {
  const car = document.getElementById("o-car");
  car.addEventListener("click", () => {
    if (driving || reduceMotion || !car.animate) return;
    const [bx, by, w, h, park] = current.o.car;
    const [ox, oy] = getOffset("car");
    const x = bx + ox, y = by + oy;
    const [cx, cy] = current.loop;
    const px = x + w / 2, py = y + h / 2;
    const R = Math.hypot(px - cx, py - cy);
    const t0 = Math.atan2(py - cy, px - cx);
    const deg = a => a * 180 / Math.PI;
    // la voiture pointe vers le haut à rotation 0 : sur un cercle parcouru dans le sens horaire, son cap vaut θ + 180°
    let start = deg(t0) + 180;
    while (start - park > 180) start -= 360;
    while (park - start > 180) start += 360;
    const frames = [{offset: 0, transform: `translate(0px,0px) rotate(${park}deg)`}];
    const n = 48, DRIFT = 22;
    for (let i = 0; i <= n; i++) {
      const t = t0 + 2 * Math.PI * i / n;
      const dx = cx + R * Math.cos(t) - px, dy = cy + R * Math.sin(t) - py;
      const drift = i === 0 || i === n ? 0 : DRIFT * Math.sin(Math.PI * i / n);   // le drift monte puis retombe
      frames.push({offset: .1 + .8 * i / n, transform: `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) rotate(${(start + 360 * i / n + drift).toFixed(1)}deg)`});
    }
    frames.push({offset: 1, transform: `translate(0px,0px) rotate(${park + 360}deg)`});
    driving = true;
    car.classList.add("driving");
    car.animate(frames, {duration: 3400, easing: "ease-in-out"}).finished.finally(() => {
      driving = false;
      car.classList.remove("driving");
    });
  });
}

export function initDesk() {
  const kb = buildKeyboard();
  mirrorRealKeyboard(kb);
  initTodo();
  initCar();
  buildPlant();
  initMug();
  document.getElementById("mini-tabs").innerHTML = PROJECTS.map(p => `<i style="--c:${p.bg}"></i>`).join("");
  startClock();
  placeDesk();
  if (document.fonts) document.fonts.ready.then(placeDesk);
}
