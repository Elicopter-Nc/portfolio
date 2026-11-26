// Version anglaise du portfolio.
// - Les textes fixes de index.html sont traduits automatiquement grâce au dictionnaire ci-dessous
//   (clé = texte français exact, valeur = anglais). Un texte absent du dictionnaire reste en français.
// - Les textes générés en JavaScript passent par t("texte français").
// - Le contenu de data.js utilise des champs « _en » (desc_en, missions_en…) lus avec tr().
// Langue choisie : ?lang=en dans l'adresse, sinon le dernier choix du visiteur, sinon la langue du navigateur.

const EN = {
  // bureau
  "Développeur fullstack": "Full-stack developer",
  "Étudiant en info": "CS student",
  "Développeur fullstack en devenir": "Aspiring full-stack developer",
  "Formation": "Education",
  "Expérience": "Experience",
  "Compétences": "Skills",
  "Stage chez ISI · 8 h 00": "Internship at ISI · 8:00",
  "DOSSIER ·": "FOLDER ·",
  "FICHES": "FILES",
  "Projets": "Projects",
  "Clique pour ouvrir →": "Click to open →",
  "À propos": "About me",
  "& COMPÉTENCES": "& SKILLS",
  "Parcours": "Background",
  "Licence Info · UNC": "CS degree · UNC",
  "Projets perso, 2025-26": "Side projects, 2025-26",
  "Stage dev · ISI": "Dev intern · ISI",
  "finir la L3": "finish my degree",
  "trouver un stage": "find an internship",
  "finir le portfolio": "finish the portfolio",
  "Clique sur les objets du bureau, ou déplace-les": "Click the objects on the desk, or move them around",
  "Ranger le bureau": "Tidy up the desk",
  "Entrez sans frapper !": "Come in, no need to knock!",
  "Diplôme du baccalauréat général, spécialités Mathématiques et NSI, 2023": "French high school diploma (baccalauréat), Maths and Computer Science, 2023",
  "Cadre vide réservé à la licence informatique, bientôt": "Empty frame saved for my Computer Science degree, coming soon",
  "Vue rapide": "Quick view",

  // dossier
  "← Retour au bureau": "← Back to the desk",
  "Dossier fermé": "Folder closed",
  "Dossier ouvert": "Folder open",
  "Toutes les fiches lues": "All files read",
  "Dossier · Projets": "Folder · Projects",
  "fiches projet. Mobile et desktop.": "project files. Mobile and desktop.",
  "↓ Fais défiler pour sortir les fiches, ou clique sur un onglet": "↓ Scroll to pull out the files, or click a tab",
  "Fin du dossier.": "End of the folder.",
  "Tu peux aussi lire le carnet ou le post-it sur le bureau.": "You can also read the notebook or the sticky note on the desk.",
  "Fiche": "File",
  "Réf.": "Ref.",
  "Type": "Type",
  "Stack": "Stack",
  "Année": "Year",
  "Voir le code ↗": "View the code ↗",
  "Dépôt privé · démo sur demande": "Private repo · demo on request",
  "EN COURS": "IN PROGRESS",
  "PRIVÉ": "PRIVATE",
  "Défi technique": "Technical challenge",
  "Ce que j'ai appris": "What I learned",

  // carnet
  "Salut, moi c'est Eli": "Hi, I'm Eli",
  "Page 1 · À propos": "Page 1 · About me",
  "Je viens de terminer ma 3e année de Licence Informatique à l'Université de la Nouvelle-Calédonie, parcours TREC 7. Je suis en stage chez ISI, une entreprise de développement à Nouméa.":
    "I just finished the third year of my Computer Science degree at the University of New Caledonia (TREC 7 track). I'm currently an intern at ISI, a software company in Nouméa.",
  "J'aime construire des applis complètes, de l'interface jusqu'à la base de données, en soignant autant le code que le rendu visuel.":
    "I like building complete apps, from the interface down to the database, caring as much about the code as about how it looks.",
  "Mes projets perso ont un point commun : ce sont des outils que j'utilise moi-même. Hors-ligne quand c'est utile, sans compte et sans pub.":
    "My side projects have one thing in common: they are tools I use myself. Offline when it helps, no account and no ads.",
  "objectif : dev fullstack, web et app !": "goal: full-stack dev, web and apps!",
  "Page 2 · Ce que j'utilise": "Page 2 · What I use",
  "Données": "Data",
  "Outils": "Tools",
  "Ce que j'aime": "What I enjoy",
  "Page 3 · En dehors du code": "Page 3 · Away from code",
  "La F1": "Formula 1",
  "Je suis les Grands Prix en direct, chronos et stratégie compris.": "I follow the Grands Prix live, timing and strategy included.",
  "La course à pied": "Running",
  "Pour souffler et me vider la tête entre deux sessions de code.": "To breathe and clear my head between coding sessions.",
  "Les jeux vidéo": "Video games",
  "Ce qui m'a donné envie de comprendre ce qu'il y a derrière l'écran.": "What made me want to understand what happens behind the screen.",
  "On se parle ?": "Let's talk",
  "J'apprends en ce moment": "What I'm learning now",
  "Page 4 · En cours": "Page 4 · In progress",
  "Une API structurée en modules, avec validation et Swagger": "A modular API with validation and Swagger",
  "Angular et les signals": "Angular and signals",
  "Des écrans réactifs avec Angular Material": "Reactive screens with Angular Material",
  "Keycloak et OpenID Connect": "Keycloak and OpenID Connect",
  "La connexion sécurisée pilotée par le serveur": "Secure sign-in driven by the server",
  "Docker et Kubernetes": "Docker and Kubernetes",
  "Conteneurs, déploiement, kubectl": "Containers, deployment, kubectl",
  "Les tests": "Testing",
  "Jest et tests de bout en bout dans la CI GitLab": "Jest and end-to-end tests in GitLab CI",
  "Prochaines étapes": "Next steps",
  "Page 5 · Objectifs": "Page 5 · Goals",
  "Créer mon portfolio": "Build my portfolio",
  "Finir mon stage chez ISI": "Finish my internship at ISI",
  "Valider ma licence": "Complete my degree",
  "Entrer en master": "Start a master's degree",
  "Devenir Challenger sur LoL": "Reach Challenger in LoL",
  "la suite au prochain commit…": "to be continued in the next commit…",
  "Page 6 · Contact": "Page 6 · Contact",
  "Je termine ma licence et je pense poursuivre en master. En attendant, mon code est sur GitHub : n'hésite pas à y jeter un œil ou à me contacter.":
    "I'm finishing my degree and plan to go on to a master's. In the meantime, my code is on GitHub: feel free to take a look or get in touch.",
  "Copier": "Copy",
  "Copié": "Copied",
  "Ouvrir mon GitHub ↗": "Open my GitHub ↗",
  "basé à Nouméa (UTC+11)": "based in Nouméa (UTC+11)",
  "← Page précédente": "← Previous page",
  "Page suivante →": "Next page →",

  // post-it parcours
  "Bac général · Maths et NSI": "High school diploma · Maths & CS",
  "Licence Informatique · UNC": "CS degree · UNC",
  "depuis 2024, parcours TREC 7": "since 2024, TREC 7 track",
  "Cours : Java, Spring, Angular, React": "Courses: Java, Spring, Angular, React",
  "+ BDD avancées, réseaux, sécu": "+ advanced databases, networks, security",
  "Projets perso, 2025-2026": "Side projects, 2025-2026",
  "Stage dev · ISI Nouméa": "Dev intern · ISI Nouméa",
  "Box Box, Kairos, Focus, ce portfolio": "Box Box, Kairos, Focus, this portfolio",

  // badge et CV
  "Missions": "Missions",
  "Technos": "Tech stack",
  "Langues": "Languages",
  "Centres d'intérêt": "Interests",
  "Télécharger le CV en PDF ↓": "Download my CV (PDF, in French) ↓",

  // libellés d'accessibilité
  "Allumer la lampe de bureau (mode nuit)": "Turn on the desk lamp (night mode)",
  "Éteindre la lampe (rallumer la lumière)": "Turn off the lamp (lights back on)",
  "Lire mon CV": "Read my CV",
  "Touiller le café": "Stir the coffee",
  "Voir mon badge de stage chez ISI": "See my ISI internship badge",
  "Ouvrir le dossier des projets": "Open the projects folder",
  "Ouvrir le carnet : à propos et compétences": "Open the notebook: about me and skills",
  "Agrandir le post-it Parcours": "Enlarge the Background sticky note",
  "Faire rouler la voiture miniature": "Drive the toy car",
  "Cocher « finir le portfolio »": "Tick “finish the portfolio”",
  "Entrée du bureau d'Eli": "Entrance to Eli's office",
  "Ouvrir la porte et entrer dans le bureau d'Eli": "Open the door and step into Eli's office",
  "Dossier des projets": "Projects folder",
  "Carnet : à propos et compétences": "Notebook: about me and skills",
  "Mon stage chez ISI": "My internship at ISI",
  "Mon CV": "My CV",
  "Voir le téléphone en grand": "See the phone up close",
  "Voir mon activité GitHub en grand": "See my GitHub activity up close",
  "Mon téléphone": "My phone",
  "Mon activité GitHub": "My GitHub activity",
  "Mon activité GitHub sur un an (ouvre mon profil GitHub)": "My GitHub activity over a year (opens my GitHub profile)",
  "Numéro de téléphone masqué": "Phone number hidden",
  "Choisir la langue": "Choose the language",

  // vue rapide
  "Le portfolio d'Eli en une minute": "Eli's portfolio in one minute",
  "Voir le bureau interactif →": "See the interactive desk →",
  "Contact": "Contact",
  "Stage en cours": "Current internship",
  "Stage": "Internship",
  "Parcours & compétences": "Background & skills",
  "↓ fais défiler, les cartes s'empilent": "↓ scroll, the cards stack up",
  "étudiant en info, code ses projets perso.": "CS student who builds side projects.",

  // météo
  "Ensoleillé": "Sunny", "Éclaircies": "Partly sunny", "Couvert": "Overcast", "Brouillard": "Fog",
  "Bruine": "Drizzle", "Pluie": "Rain", "Averses": "Showers", "Orage": "Thunderstorm", "Nuageux": "Cloudy",
};

const KEY = "eli-portfolio-langue";
let lang = pickLang();

function pickLang() {
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "en" || q === "fr") return q;
  try { const s = localStorage.getItem(KEY); if (s === "en" || s === "fr") return s; } catch (e) {}
  return (navigator.language || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";
}

export const getLang = () => lang;
export const isEn = () => lang === "en";
export const locale = () => (lang === "en" ? "en-GB" : "fr-FR");

/** Traduit un texte français fixe (renvoie le français si pas de traduction ou si la langue est le français). */
export const t = fr => (lang === "en" && EN[fr]) || fr;

/** Lit un champ de data.js dans la bonne langue : tr(projet, "desc") → projet.desc_en en anglais s'il existe. */
export const tr = (obj, field) => (lang === "en" && obj[field + "_en"] !== undefined ? obj[field + "_en"] : obj[field]);

// --- traduction des textes fixes de la page ---
// éléments dont le texte est écrit par le JavaScript (heure, météo, compteurs…) : on n'y touche pas ici
const SKIP = "script,style,svg,#docs,#badge-panel,#cv-panel,#kb,#clock,#day,#wx,#gh-notif,#count,#nb-pos,#copygh,#toast,#cal-month,#cal-grid,#cal-foot,#season,[data-count],[data-lang]";
let textNodes = null, attrEls = null;

function collect() {
  textNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.nodeValue.trim() || n.parentElement.closest(SKIP)) continue;
    n.__fr = n.nodeValue;
    textNodes.push(n);
  }
  attrEls = [...document.querySelectorAll("[aria-label],[title]")].filter(el => !el.closest(SKIP));
  attrEls.forEach(el => {
    el.__fr = {};
    ["aria-label", "title"].forEach(a => { if (el.hasAttribute(a)) el.__fr[a] = el.getAttribute(a); });
  });
}

function translateDom() {
  if (!textNodes) collect();
  textNodes.forEach(n => {
    const fr = n.__fr, key = fr.trim();
    n.nodeValue = fr.replace(key, t(key));
  });
  attrEls.forEach(el => Object.entries(el.__fr).forEach(([a, fr]) => el.setAttribute(a, t(fr))));
  document.documentElement.lang = lang;
  document.title = lang === "en" ? "Eli's desk · Portfolio" : "Le bureau d'Eli · Portfolio";
  document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  const quick = document.getElementById("quick");
  if (quick) quick.href = `rapide.html?lang=${lang}`;
}

export function setLang(l) {
  if (l === lang) return;
  lang = l;
  try { localStorage.setItem(KEY, l); } catch (e) {}
  translateDom();
  dispatchEvent(new CustomEvent("lang:change"));
}

export function initI18n() {
  translateDom();
  document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
}
