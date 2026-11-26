// Easter eggs : quelques mots tapés au clavier déclenchent une petite bulle.
//   « gg »   → message de fin de partie dans le chat
//   « /ff »  → refus de capituler
//   « rock » → Rock and Stone ! (et la pépite d'or s'agite)

const toast = document.getElementById("toast");
let hideTimer = null;

function show(html, cls = "") {
  toast.className = "toast " + cls;
  toast.innerHTML = html;
  toast.hidden = false;
  // relance l'animation d'apparition si une bulle était déjà affichée
  toast.style.animation = "none"; void toast.offsetWidth; toast.style.animation = "";
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => { toast.hidden = true; }, 2600);
}

const EGGS = [
  {word: "/ff", run: () => show('<span class="team">[Équipe]</span> <span class="who">Eli :</span> non, on peut encore gagner !')},
  {word: "gg", run: () => show('<span class="team">[Tous]</span> <span class="who">Eli :</span> gg wp')},
  {word: "rock", run: () => {
    show("ROCK AND STONE !", "rock");
    const nugget = document.getElementById("nugget");
    nugget.classList.remove("burst"); void nugget.offsetWidth; nugget.classList.add("burst");
    setTimeout(() => nugget.classList.remove("burst"), 2100);
  }},
];

export function initEasterEggs() {
  let typed = "";
  addEventListener("keydown", e => {
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
    typed = (typed + e.key.toLowerCase()).slice(-8);
    const egg = EGGS.find(g => typed.endsWith(g.word));
    if (egg) { typed = ""; egg.run(); }
  });
}
