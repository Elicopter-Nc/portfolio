// Ambiance du bureau : lampe (mode nuit), lumière selon l'heure de Nouméa, météo réelle (Open-Meteo).
//
// Pour tester sans attendre la bonne heure ou la bonne météo, ajouter à l'adresse :
//   ?heure=21        (0 à 23, décimales possibles : 17.5 = 17 h 30)
//   ?meteo=pluie     (soleil | nuages | pluie)
import {currentLayout} from "./desk.js";
import {t} from "./i18n.js";

const room = document.getElementById("room");
const lamp = document.getElementById("o-lamp");
const sun = document.getElementById("sunlight");
const tint = document.getElementById("tint");
const glow = document.getElementById("screenglow");
const wxText = document.getElementById("wx");
const params = new URLSearchParams(location.search);

let night = false;          // mode nuit (lampe allumée)
let userChoice = false;     // le visiteur a cliqué sur la lampe : on ne suit plus l'heure pour la nuit
let weather = {kind: "soleil", cloud: 0};
let wxShown = null;         // [température, libellé français] affichés sur le téléphone
const showWx = () => { wxText.textContent = wxShown ? `${wxShown[0]}° · ${t(wxShown[1])}` : ""; };

// Heure de Nouméa en heures décimales (ex. 17.5 = 17 h 30)
function noumeaHour() {
  if (params.has("heure")) return parseFloat(params.get("heure")) || 0;
  try {
    const p = new Intl.DateTimeFormat("fr-FR", {timeZone: "Pacific/Noumea", hour: "numeric", minute: "numeric", hour12: false}).formatToParts(new Date());
    return +p.find(x => x.type === "hour").value % 24 + +p.find(x => x.type === "minute").value / 60;
  } catch (e) { const d = new Date(); return d.getHours() + d.getMinutes() / 60; }
}

// Moment de la journée → teinte de la pièce et force du soleil par la fenêtre
function phase(h) {
  if (h < 5.5 || h >= 19) return {name: "nuit", tint: "transparent", sun: 0};
  if (h < 7) return {name: "aube", tint: "rgba(255,190,190,.22)", sun: .35};
  if (h < 16.5) return {name: "jour", tint: "transparent", sun: 1};
  if (h < 18.25) return {name: "fin d'après-midi", tint: "rgba(255,160,80,.28)", sun: .8};
  return {name: "crépuscule", tint: "rgba(120,90,160,.35)", sun: .15};
}

function placeLights() {
  const L = currentLayout();
  room.style.setProperty("--ax", L.lampAim[0] + "px");
  room.style.setProperty("--ay", L.lampAim[1] + "px");
  const [x, y, w, h] = L.sun;
  Object.assign(sun.style, {left: x + "px", top: y + "px", width: w + "px", height: h + "px"});
  // la lueur de l'écran part du bas de la barre de l'écran et s'étale sur le bureau
  const [mx, my, mw, mh] = L.o.monitor;
  Object.assign(glow.style, {left: mx - mw * .15 + "px", top: my + mh * .3 + "px", width: mw * 1.3 + "px", height: mh * 3 + "px"});
}

function render() {
  const p = phase(noumeaHour());
  if (!userChoice) night = p.name === "nuit";
  room.classList.toggle("is-night", night);
  lamp.setAttribute("aria-pressed", night);
  lamp.setAttribute("aria-label", t(night ? "Éteindre la lampe (rallumer la lumière)" : "Allumer la lampe de bureau (mode nuit)"));

  // pas de teinte ni de soleil en mode nuit : seule la lampe éclaire
  tint.style.backgroundColor = night ? "transparent" : p.tint;
  tint.style.opacity = night || p.tint === "transparent" ? 0 : 1;

  // la lumière de la fenêtre dépend de l'heure et des nuages ; la pluie fait couler des gouttes dedans
  const cloudy = weather.kind === "pluie" ? .55 : weather.kind === "nuages" ? .6 : 1 - weather.cloud / 200;
  const strength = night ? 0 : p.sun * cloudy;
  sun.style.opacity = strength > .05 ? 1 : 0;
  sun.style.setProperty("--sun-a", (.05 + .13 * strength).toFixed(3));
  room.classList.toggle("rain", weather.kind === "pluie" && !night);
}

// Codes météo WMO utilisés par Open-Meteo → type simplifié + texte affiché sur le téléphone
function describe(code) {
  if (code === 0) return ["soleil", "Ensoleillé"];
  if (code <= 2) return ["soleil", "Éclaircies"];
  if (code === 3) return ["nuages", "Couvert"];
  if (code === 45 || code === 48) return ["nuages", "Brouillard"];
  if (code >= 51 && code <= 57) return ["pluie", "Bruine"];
  if (code >= 61 && code <= 67) return ["pluie", "Pluie"];
  if (code >= 80 && code <= 82) return ["pluie", "Averses"];
  if (code >= 95) return ["pluie", "Orage"];
  return ["nuages", "Nuageux"];
}

async function loadWeather() {
  const forced = params.get("meteo");
  if (forced) {
    weather = {kind: forced, cloud: forced === "soleil" ? 0 : 80};
    wxShown = {soleil: [27, "Ensoleillé"], nuages: [24, "Couvert"], pluie: [22, "Pluie"]}[forced] || null;
    showWx();
    render();
    return;
  }
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=-22.2758&longitude=166.4580"
      + "&current=temperature_2m,weather_code,cloud_cover&timezone=Pacific%2FNoumea";
    const data = await (await fetch(url)).json();
    const c = data.current;
    const [kind, label] = describe(c.weather_code);
    weather = {kind, cloud: c.cloud_cover ?? 0};
    wxShown = [Math.round(c.temperature_2m), label];
    showWx();
  } catch (e) {
    wxText.textContent = "";            // pas de réseau : on garde un ciel dégagé, sans afficher de météo
  }
  render();
}

export function initAmbiance() {
  placeLights();
  render();
  loadWeather();
  addEventListener("desk:layout", placeLights);
  addEventListener("lang:change", () => { showWx(); render(); });
  lamp.addEventListener("click", () => {
    userChoice = true;
    night = !night;
    render();
  });
  setInterval(render, 60 * 1000);                 // l'heure avance
  setInterval(loadWeather, 30 * 60 * 1000);       // la météo est relue toutes les 30 min
}
