// Compteur de visites caché : c'est le « numéro » imprimé sous le code-barres du badge ISI (N° 00421).
// Service gratuit sans inscription : Abacus (abacus.jasoncameron.dev). Aucune donnée personnelle n'est envoyée par la page.
// On compte une visite par session de navigation, et seulement sur le site en ligne (pas en local).

const API = "https://abacus.jasoncameron.dev";
const KEY = "elicopter-nc-portfolio/visites";
const online = /github\.io$/.test(location.hostname);
let value = null;

/** Numéro formaté pour le badge (« N° 00421 »), ou "" tant qu'il n'est pas connu. */
export const badgeNumber = () => (value === null ? "" : `N° ${String(value).padStart(5, "0")}`);

function render() {
  document.getElementById("badge-num").textContent = badgeNumber();
  const big = document.getElementById("badge-num-big");
  if (big) big.textContent = badgeNumber();
}

export async function initVisits() {
  let counted = false;
  try { counted = sessionStorage.getItem("eli-portfolio-compte") === "1"; } catch (e) {}
  const action = online && !counted ? "hit" : "get";
  try {
    const r = await fetch(`${API}/${action}/${KEY}`);
    if (!r.ok) return;                         // compteur pas encore créé (en local) : le badge reste sans numéro
    value = (await r.json()).value;
    if (action === "hit") { try { sessionStorage.setItem("eli-portfolio-compte", "1"); } catch (e) {} }
    render();
  } catch (e) { /* service indisponible : pas de numéro */ }
}
