// Dernier commit public sur GitHub, affiché en notification sur le téléphone du bureau.
// API publique de GitHub, sans jeton (60 requêtes par heure) : le résultat est gardé 10 min.
import {GITHUB_URL} from "./data.js";
import {isEn} from "./i18n.js";

const USER = GITHUB_URL.split("/").pop();
const SKIP = [USER];                // le dépôt du profil GitHub n'est pas un projet
const CACHE = "eli-portfolio-github";

function ago(date) {
  const min = Math.round((Date.now() - new Date(date)) / 60000);
  const h = Math.round(min / 60), d = Math.round(h / 24);
  if (isEn()) return min < 60 ? `${Math.max(1, min)} min ago` : h < 24 ? `${h} h ago` : d === 1 ? "yesterday" : `${d} days ago`;
  return min < 60 ? `il y a ${Math.max(1, min)} min` : h < 24 ? `il y a ${h} h` : d === 1 ? "hier" : `il y a ${d} j`;
}

async function latestCommit() {
  try {
    const c = JSON.parse(sessionStorage.getItem(CACHE) || "null");
    if (c && Date.now() - c.at < 10 * 60 * 1000) return c.data;
  } catch (e) {}
  const repos = await (await fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=6`)).json();
  const repo = repos.find(r => !SKIP.includes(r.name) && !r.fork);
  if (!repo) return null;
  const [commit] = await (await fetch(`https://api.github.com/repos/${USER}/${repo.name}/commits?per_page=1`)).json();
  const data = {repo: repo.name, message: commit.commit.message.split("\n")[0], date: commit.commit.author.date};
  try { sessionStorage.setItem(CACHE, JSON.stringify({at: Date.now(), data})); } catch (e) {}
  return data;
}

export async function initGithub() {
  try {
    const c = await latestCommit();
    if (!c) return;
    document.getElementById("gh-app").textContent = c.repo;
    const time = document.getElementById("gh-time");
    time.textContent = ago(c.date);
    addEventListener("lang:change", () => { time.textContent = ago(c.date); });
    document.getElementById("gh-text").textContent = c.message;
  } catch (e) {
    /* pas de réseau ou limite atteinte : on garde la notification par défaut */
  }
}
