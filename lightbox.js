/* lightbox.js — click-to-enlarge for allentompkins.com
   Drop-in: <script src="lightbox.js" defer></script>
   Every image inside .figure and .gallery enlarges to fit the screen. Desktop and tablet only. */
(() => {
  if (window.matchMedia('(max-width: 720px)').matches) return;
  const figs = [...document.querySelectorAll('.figure img, .gallery img')];
  if (!figs.length) return;

  const style = document.createElement('style');
  style.textContent = `
  .figure img, .gallery img { cursor: zoom-in; }
  .lb { position: fixed; inset: 0; z-index: 40; background: rgba(0,0,0,0.74); overflow-y: auto; overflow-x: hidden; padding: 32px var(--gutter, 56px) 48px; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0s linear 0.3s; -webkit-overflow-scrolling: touch; }
  .lb.open { opacity: 1; visibility: visible; transition-delay: 0s; }
  .lb-frame { position: relative; width: 100%; }
  .lb-img { display: block; width: 100%; height: auto; opacity: 0; transition: opacity 0.4s ease; }
  .lb-img.show { opacity: 1; }
  .lb-close { position: fixed; top: 44px; right: calc(var(--gutter, 56px) + 12px); width: 40px; height: 40px; border-radius: 50%; border: 0; padding: 0; cursor: pointer; background: rgba(0,0,0,0.6); box-shadow: 0 0 0 1.5px rgba(255,255,255,0.9), 0 2px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; transition: background 0.2s; z-index: 41; }
  .lb-close:hover { background: rgba(0,0,0,0.85); }
  .lb-close svg { width: 16px; height: 16px; display: block; }
  body.lb-open { overflow: hidden; }`;
  document.head.appendChild(style);

  const lb = document.createElement('div');
  lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Enlarged image'); lb.setAttribute('aria-hidden', 'true');
  lb.innerHTML = `<div class="lb-frame"><img class="lb-img" alt=""><button type="button" class="lb-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>`;
  document.body.appendChild(lb);
  const img = lb.querySelector('.lb-img'), btn = lb.querySelector('.lb-close');
  let opener = null;

  function open(el) {
    opener = el;
    img.classList.remove('show');
    img.src = el.currentSrc || el.src; img.alt = el.alt;
    const reveal = () => requestAnimationFrame(() => img.classList.add('show'));
    if (img.complete) reveal(); else img.onload = reveal;
    lb.scrollTop = 0; lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.classList.add('lb-open'); btn.focus();
  }
  function close() {
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lb-open'); img.classList.remove('show');
    if (opener) opener.focus();
  }
  figs.forEach(el => {
    el.tabIndex = 0; el.setAttribute('role', 'button');
    el.addEventListener('click', () => open(el));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el); } });
  });
  btn.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
})();
