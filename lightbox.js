/* lightbox.js — image carousel for allentompkins.com
   Drop-in: <script src="lightbox.js" defer></script>
   Picks up every image inside .figure and .gallery on the page. Desktop and tablet only. */
(() => {
  if (window.matchMedia('(max-width: 720px)').matches) return;
  const figs = [...document.querySelectorAll('.figure img, .gallery img')];
  if (!figs.length) return;

  const css = `
  .figure img, .gallery img { cursor: zoom-in; }
  .lb { position: fixed; inset: 0; z-index: 40; background: rgba(0,0,0,0.74); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 72px var(--gutter, 56px) 48px; opacity: 0; visibility: hidden; transition: opacity 0.35s ease, visibility 0s linear 0.35s; }
  .lb.open { opacity: 1; visibility: visible; transition-delay: 0s; }
  .lb-stage { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .lb-frame { position: relative; width: 100%; display: flex; justify-content: center; }
  .lb-img { width: 100%; max-height: calc(100vh - 220px); object-fit: contain; display: block; border: 1px solid var(--line, #232326); background: var(--bg-2, #111113); opacity: 0; transition: opacity 0.45s ease; }
  .lb-img.show { opacity: 1; }
  .lb-cap { font-family: var(--mono, monospace); font-size: 12px; color: var(--ink, #ecebe7); display: flex; gap: 16px; justify-content: space-between; width: 100%; padding: 0 16px; box-sizing: border-box; }
  .lb-cap span:last-child { color: var(--ink-2, #9a9893); }
  .lb-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; margin: 0; padding: 0; border: 0; background: none; cursor: pointer; }
  .lb-btn img { position: absolute; inset: 0; width: 48px; height: 48px; display: block; border: 0; }
  .lb-btn .hov { opacity: 0; transition: opacity 0.3s ease; }
  .lb-btn:hover .hov, .lb-btn:focus-visible .hov { opacity: 1; }
  .lb-btn.lb-prev { left: 16px; } .lb-btn.lb-next { right: 16px; }
  .lb-close { position: fixed; top: 20px; right: 20px; width: 48px; height: 48px; border-radius: 50%; border: 0; background: rgba(0,0,0,0.55); cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 41; }
  .lb-close:hover { background: rgba(0,0,0,0.8); }
  .lb-close svg { width: 18px; height: 18px; }
  .lb[data-count="1"] .lb-btn { display: none; }
  body.lb-open { overflow: hidden; }`;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  const B = 'img/button-';
  const lb = document.createElement('div');
  lb.className = 'lb'; lb.id = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image viewer'); lb.setAttribute('aria-hidden', 'true');
  lb.innerHTML = `
    <button type="button" class="lb-close" aria-label="Close and return to top"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
    <div class="lb-stage">
      <div class="lb-frame">
        <button type="button" class="lb-btn lb-prev" aria-label="Previous image"><img class="base" src="${B}left.png" alt=""><img class="hov" src="${B}left-hov.png" alt=""></button>
        <img class="lb-img" alt="">
        <button type="button" class="lb-btn lb-next" aria-label="Next image"><img class="base" src="${B}right.png" alt=""><img class="hov" src="${B}right-hov.png" alt=""></button>
      </div>
      <div class="lb-cap"><span class="lb-text"></span><span class="lb-n"></span></div>
    </div>`;
  document.body.appendChild(lb);

  const img = lb.querySelector('.lb-img'), cap = lb.querySelector('.lb-text'), num = lb.querySelector('.lb-n');
  const items = figs.map(el => ({ src: el.currentSrc || el.src, alt: el.alt, cap: (el.closest('figure')?.querySelector('figcaption span, figcaption')?.textContent || '').trim() }));
  lb.dataset.count = items.length;
  let i = 0;
  const pad = n => String(n).padStart(2, '0');
  function show(n) {
    i = (n + items.length) % items.length;
    img.classList.remove('show');
    const swap = () => {
      img.src = items[i].src; img.alt = items[i].alt; cap.textContent = items[i].cap; num.textContent = pad(i + 1) + ' / ' + pad(items.length);
      if (img.complete) requestAnimationFrame(() => img.classList.add('show')); else img.onload = () => img.classList.add('show');
    };
    setTimeout(swap, lb.classList.contains('open') ? 180 : 0);
  }
  function open(n) { show(n); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.classList.add('lb-open'); lb.querySelector('.lb-close').focus(); }
  function close() {
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lb-open'); img.classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  figs.forEach((el, n) => {
    el.tabIndex = 0; el.setAttribute('role', 'button');
    el.addEventListener('click', () => open(n));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(n); } });
  });
  lb.querySelector('.lb-prev').addEventListener('click', () => show(i - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(i + 1));
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1);
  });
})();
