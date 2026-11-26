import {PROJECTS} from "./data.js";
import {initI18n} from "./i18n.js";
import {initDesk, placeDesk, typeName} from "./desk.js";
import {runIntro} from "./intro.js";
import {initOverlays} from "./overlay.js";
import {initFolder, layoutFolder} from "./folder.js";
import {initNotebook, renderNotebook} from "./notebook.js";
import {initEasterEggs} from "./eastereggs.js";
import {initExtras} from "./extras.js";
import {initAmbiance} from "./ambiance.js";
import {initDrag} from "./drag.js";
import {initGithub} from "./github.js";
import {initCalendar} from "./calendar.js";
import {initVisits} from "./visits.js";
import {initSeasons} from "./seasons.js";
import {initCloseups} from "./closeups.js";

// nombre de fiches affiché sur le dossier, calculé depuis data.js
document.querySelectorAll("[data-count]").forEach(el => { el.textContent = PROJECTS.length; });

initI18n();          // en premier : traduit les textes fixes avant que les modules écrivent les leurs
initDesk();
initOverlays();
initFolder();
initNotebook();
initEasterEggs();
initExtras();
initAmbiance();
initDrag();
initGithub();
initCalendar();
initVisits();
initSeasons();
initCloseups();

// écran d'accueil (première visite seulement), puis le clavier tape « ELI »
runIntro().then(shown => typeName(shown ? 250 : 900));

// la bulle d'aide disparaît dès que le visiteur a cliqué quelque part
addEventListener("pointerdown", () => document.querySelector(".hint")?.classList.add("gone"), {once: true});

addEventListener("resize", () => {
  placeDesk();
  layoutFolder();
  renderNotebook();
});
