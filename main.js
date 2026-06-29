const items = document.querySelectorAll('.menu-item');
const label = document.querySelector('.footer-right');
let idx = 0;


function setActive(i) {
  items[idx].classList.remove('active');
  idx = (i + items.length) % items.length;
  items[idx].classList.add('active');
  label.textContent = items[idx].querySelector('span').textContent.toUpperCase() + ' — SÉLECTIONNÉ';
}

const open  = id => document.getElementById('section-' + id)?.classList.add('open');
const close = ()  => document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('open'));

document.querySelectorAll('.section-panel').forEach(p =>
  p.addEventListener('click', e => { if (e.target === p) close(); })
);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape')    { close(); return; }
  if (document.querySelector('.section-panel.open')) return;
  if (e.key === 'ArrowDown') { e.preventDefault(); setActive(idx + 1); }
  if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(idx - 1); }
  if (e.key === 'Enter')     { close(); if (items[idx].dataset.section) open(items[idx].dataset.section); }
});





setActive(0);