// Contenu du portfolio : c'est ici qu'on ajoute ou modifie les projets, le stage et le CV.
// Seuls les dépôts publics sont affichés : un projet passé en public peut être rajouté ici.
// bg/fg = couleurs de l'onglet et du bandeau.
// photo (facultatif) = capture accrochée à la fiche ; w/h servent à savoir si elle est verticale ou horizontale.
// challenge = la difficulté technique principale ; learned = ce que le projet m'a appris.
export const PROJECTS = [
  {id: "box-box", name: "Box Box", type: "Mobile", yr: "2026", url: "https://github.com/Elicopter-Nc/box-box", stack: "TypeScript · Expo · Android",
   bg: "#1b130e", fg: "#f1e4cf", a: "#e4572e", b: "#2f8f9d",
   photo: {src: "assets/projets/box-box.jpg", w: 449, h: 820, alt: "Écran Live de Box Box : tracé de Las Vegas par secteurs et classement"},
   desc: "La Formule 1 en direct, façon affiche de course des années 70 : classement live, stratégie, replay GPS du peloton et télémétrie. Sans compte et sans serveur.",
   challenge: "Afficher le direct à partir d'un flux de chronométrage non documenté, et placer les voitures sur le circuit entre deux passages chronométrés, sans GPS.",
   learned: ["Consommer plusieurs API temps réel et les recouper (live timing, OpenF1)", "Écrire un widget Android natif dans une app Expo", "Compiler l'APK automatiquement avec GitHub Actions"],
   desc_en: "Formula 1 live, styled like a 1970s race poster: live standings, strategy, GPS replay of the field and telemetry. No account, no server.",
   challenge_en: "Showing the race live from an undocumented timing feed, and placing the cars on the track between two timing points without any GPS.",
   learned_en: ["Consuming several real-time APIs and cross-checking them (live timing, OpenF1)", "Writing a native Android widget inside an Expo app", "Building the APK automatically with GitHub Actions"]},
  {id: "kairos", name: "Kairos", type: "Mobile", yr: "2026", url: "https://github.com/Elicopter-Nc/kairos", stack: "TypeScript · Expo · Android",
   bg: "#2e372d", fg: "#e9efe2", a: "#6f8a63", b: "#c9b27c",
   photo: {src: "assets/projets/kairos.jpg", w: 480, h: 953, alt: "Écran Jour de Kairos : date, météo heure par heure et saisie rapide"},
   desc: "Agenda, tâches, notes, rituels et météo, hors-ligne. On tape « dentiste demain 14h30 » et l'événement se crée. Les ombres de feuillage suivent le vrai soleil.",
   challenge: "Une app entièrement hors-ligne : toutes les données et tous les rappels vivent sur le téléphone, sans serveur pour les synchroniser.",
   learned: ["Analyser une saisie en langage naturel (dates, heures, récurrences)", "Programmer des notifications locales et les reprogrammer à chaque changement", "Animer un shader de lumière avec Skia et Reanimated"],
   desc_en: "Calendar, tasks, notes, routines and weather, fully offline. Type “dentist tomorrow 2:30pm” and the event is created. The leaf shadows follow the real sun.",
   challenge_en: "A fully offline app: all the data and every reminder live on the phone, with no server to sync them.",
   learned_en: ["Parsing natural-language input (dates, times, recurrences)", "Scheduling local notifications and rescheduling them on every change", "Animating a light shader with Skia and Reanimated"]},
  {id: "focus", name: "Focus", type: "Desktop", yr: "2026", url: "https://github.com/Elicopter-Nc/Focus", stack: "React · Vite · Electron",
   bg: "#202020", fg: "#f4f4f2", a: "#111111", b: "#9a9a9a",
   photo: {src: "assets/projets/focus.jpg", w: 960, h: 540, alt: "Minuteur Pomodoro de Focus, 25:00 sur fond noir"},
   desc: "Agenda, Pomodoro et notes pour étudiants, en noir et blanc. Disponible en web et en application desktop.",
   challenge: "Faire tourner la même application React dans le navigateur et en application desktop, avec les notifications du système.",
   learned: ["Empaqueter une app web avec Electron (Linux et Windows)", "Persister les données côté client avec localStorage", "Afficher du Markdown dans les notes"],
   desc_en: "Calendar, Pomodoro timer and notes for students, in black and white. Available on the web and as a desktop app.",
   challenge_en: "Running the same React app in the browser and as a desktop app, with system notifications.",
   learned_en: ["Packaging a web app with Electron (Linux and Windows)", "Persisting data client-side with localStorage", "Rendering Markdown in notes"]},
  {id: "bureau", name: "Le bureau d'Eli", name_en: "Eli's desk", type: "Web", yr: "2026", url: "https://github.com/Elicopter-Nc/portfolio", stack: "HTML · CSS · JavaScript",
   bg: "#8a6a3f", fg: "#fbf3e4", a: "#dcb676", b: "#2f3b38",
   // photo: {src: "assets/projets/bureau.jpg", w: 1200, h: 630, alt: "…"},   ← à ajouter quand tu auras l'image
   desc: "Ce portfolio : un bureau vu de dessus où chaque objet s'ouvre. Dossier de projets au défilement, carnet, CV, météo et heure réelles de Nouméa, mode nuit et objets déplaçables.",
   challenge: "Tout faire tenir dans une seule scène animée, fluide et lisible, sans framework ni étape de build, en restant accessible au clavier et sur mobile.",
   learned: ["Animer au scroll et en FLIP avec l'API Web Animations", "Consommer des API publiques côté client (GitHub, Open-Meteo)", "Rendre une page bilingue sans bibliothèque"],
   desc_en: "This portfolio: a top-down desk where every object opens. A scroll-driven projects folder, a notebook, a CV, real Nouméa time and weather, night mode and draggable objects.",
   challenge_en: "Fitting everything into one animated scene that stays smooth and readable, with no framework or build step, while staying keyboard- and mobile-friendly.",
   learned_en: ["Scroll-driven and FLIP animations with the Web Animations API", "Consuming public APIs client-side (GitHub, Open-Meteo)", "Making a page bilingual without a library"]},
];

export const GITHUB_URL = "https://github.com/Elicopter-Nc";
export const EMAIL = "eli.grosseau21@gmail.com";

// Stage : affiché quand on clique sur le badge posé sur le bureau.
export const STAGE = {
  company: "ISI",
  place: "Nouméa",
  role: "Stagiaire développeur",
  role_en: "Developer intern",
  period: "2026",
  missions: [
    "Développement d'une application web interne de suivi des clients, des contrats d'hébergement et des contacts",
    "Connexion sécurisée avec Keycloak (OpenID Connect) gérée côté serveur, avec des droits différents selon le rôle",
    "Campagnes d'emails : modèles, choix des destinataires, envoi et reprise d'un envoi interrompu",
    "Travail en tickets avec relecture du lead tech, tests automatisés et intégration continue GitLab",
  ],
  missions_en: [
    "Building an internal web app to track clients, hosting contracts and contacts",
    "Secure Keycloak sign-in (OpenID Connect) handled server-side, with role-based permissions",
    "Email campaigns: templates, recipient selection, sending and resuming an interrupted send",
    "Ticket-based workflow with lead-tech code review, automated tests and GitLab CI",
  ],
  stack: ["Angular", "NestJS", "TypeScript", "PostgreSQL", "TypeORM", "Keycloak", "Docker", "GitLab CI", "Jest"],
};

// CV : affiché quand on clique sur la feuille posée sur le bureau.
// pdf = chemin d'un CV en PDF ; le bouton « Télécharger » n'apparaît que si le fichier existe.
export const CV = {
  pdf: "assets/cv-eli.pdf",
  title: "Développeur fullstack en devenir",
  title_en: "Aspiring full-stack developer",
  place: "Koutio, Dumbéa · Nouvelle-Calédonie",
  place_en: "Koutio, Dumbéa · New Caledonia",
  profile: "Étudiant en 3e année de Licence Informatique à l'Université de la Nouvelle-Calédonie, passionné par le développement web. Curieux et motivé, je cherche à approfondir mes compétences en développement full stack.",
  profile_en: "Third-year Computer Science student at the University of New Caledonia, passionate about web development. Curious and motivated, I want to deepen my full-stack development skills.",
  education: [
    {when: "2024 – en cours", what: "Licence Informatique", where: "Université de la Nouvelle-Calédonie",
     when_en: "2024 – present", what_en: "Bachelor's degree in Computer Science", where_en: "University of New Caledonia"},
    {when: "2021 – 2023", what: "Bac général, spécialités Maths et NSI", where: "Lycée Dick Ukeiwë",
     what_en: "French high school diploma, Maths and Computer Science"},
  ],
  // projets présents sur le CV mais pas dans le dossier (dépôt privé)
  extraProjects: [
    {name: "DataGate (projet tutoré)", desc: "Passage du hachage des mots de passe de MD5 à bcrypt, confirmation par email, amélioration de la création de projet.", stack: "PHP · PostgreSQL · Docker",
     name_en: "DataGate (university team project)", desc_en: "Moved password hashing from MD5 to bcrypt, added email confirmation, improved project creation."},
  ],
  skills: {
    "Langages": "PHP, HTML, CSS, JavaScript, TypeScript, Python, SQL",
    "Frameworks": "React, Vite, Tailwind CSS, Electron, Expo, Angular, Spring Boot",
    "Bases de données": "PostgreSQL, SQLite",
    "Outils & OS": "Git, Docker, Linux",
  },
  skills_en: {
    "Languages": "PHP, HTML, CSS, JavaScript, TypeScript, Python, SQL",
    "Frameworks": "React, Vite, Tailwind CSS, Electron, Expo, Angular, Spring Boot",
    "Databases": "PostgreSQL, SQLite",
    "Tools & OS": "Git, Docker, Linux",
  },
  languages: "Français, anglais",
  languages_en: "French, English",
  interests: "F1, course à pied, jeux vidéo",
  interests_en: "Formula 1, running, video games",
};
