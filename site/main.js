/* BAU Facility Services · W1 „Das Haus im Schnitt“ */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const A = window.ASSETS || { img: {}, video: {} };
  const mob = matchMedia('(max-width:700px)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Lage der Etagen im Schnitt-Bild (Anteile der 16:9-Fläche), nach dem Bild vermessen */
  const FLOORS = window.FLOORS || {
    dach:   { x: .305, y: .06, w: .40, h: .19 },
    og:     { x: .302, y: .27, w: .404, h: .20 },
    eg:     { x: .302, y: .48, w: .404, h: .22 },
    keller: { x: .302, y: .71, w: .404, h: .20 },
    aussen: { x: .125, y: .53, w: .165, h: .31 }
  };
  const SHORT = { dach: 'Dach', og: '1. OG', eg: 'EG', keller: 'Keller', aussen: 'Außen' };

  /* ---------- Medien: fehlende Bilder ausblenden ---------- */
  function srcFor(name) { const e = A.img[name]; if (!e) return null; return { srcset: e.sizes.map(w => `assets/img/${name}-${w}.webp ${w}w`).join(', '), src: `assets/img/${name}-${e.sizes[0]}.webp` }; }
  $$('img[data-img]').forEach(img => {
    const s = srcFor(img.dataset.img); if (!s) { img.hidden = true; return; }
    img.srcset = s.srcset; img.src = s.src; img.decoding = 'async';
    img.sizes = img.closest('.house') ? '(max-width:700px) 240vw, 260vw' : img.closest('.contact-card') ? '240px' : '(max-width:1020px) 100vw, 60vw';
  });
  $$('video[data-video]').forEach(v => { const e = A.video[v.dataset.video]; if (!e) { v.remove(); return; } v.src = (mob && e.mobile) || e.desktop; });
  const hasCut = !!A.img['s1-schnitt'];

  /* ---------- Hero-Film: läuft sofort an, bleibt am Ende an der Tür stehen ---------- */
  const hv = $('.hero__media video');
  if (hv) { const go = () => hv.play().catch(() => {}); hv.addEventListener('canplay', go, { once: true }); if (reduced) hv.removeAttribute('autoplay'); }

  /* ---------- Menü ---------- */
  const burger = $('.burger'), menu = $('#menu');
  burger.addEventListener('click', () => { const o = menu.hidden; menu.hidden = !o; burger.setAttribute('aria-expanded', String(o)); });

  /* ---------- Vorher/Nachher ---------- */
  const wipe = $('#wipe');
  function setX(p) { p = Math.max(0, Math.min(100, p)); wipe.style.setProperty('--x', p + '%'); wipe.setAttribute('aria-valuenow', Math.round(p)); }
  let drag = false; const px = e => { const r = wipe.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; };
  wipe.addEventListener('pointerdown', e => { drag = true; wipe.setPointerCapture(e.pointerId); setX(px(e)); });
  wipe.addEventListener('pointermove', e => { if (drag) setX(px(e)); });
  wipe.addEventListener('pointerup', () => drag = false); wipe.addEventListener('pointercancel', () => drag = false);
  wipe.addEventListener('keydown', e => { const v = +wipe.getAttribute('aria-valuenow'); if (e.key === 'ArrowLeft') setX(v - 5); if (e.key === 'ArrowRight') setX(v + 5); });
  setX(50);

  /* ---------- Vorher · Arbeit · Ergebnis ---------- */
  const s3 = $$('#steps3 img'), pb = $$('#prog button'), pbar = $('#prog i');
  function setStep3(n) { s3.forEach((im, i) => im.classList.toggle('on', i === n)); pb.forEach((b, i) => b.classList.toggle('on', i <= n)); pbar.style.width = `calc(${n * 50}% - ${n ? 8 : 0}px)`; }
  pb.forEach((b, i) => b.addEventListener('click', () => setStep3(i))); setStep3(0);

  /* ---------- Bewertungen (Beispiele) ---------- */
  const REV = ['„Ein Ansprechpartner für das ganze Haus. Genau so haben wir uns das gewünscht.“', '„Umbau termingerecht, alles sauber koordiniert, und danach kümmern sie sich weiter ums Haus.“', '„Schnell, zuverlässig, und man weiß immer, wer zuständig ist.“'];
  let ri = 0; const rt = $('#revTxt');
  setInterval(() => { rt.parentElement.style.opacity = 0; setTimeout(() => { ri = (ri + 1) % REV.length; rt.textContent = REV[ri]; rt.parentElement.style.opacity = 1; }, 600); }, 6500);

  /* ---------- Formulare → E-Mail ---------- */
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault(); const f = new FormData(e.target);
    const body = `Name: ${f.get('name')}\nTelefon: ${f.get('tel')}\nE-Mail: ${f.get('mail')}\nThema: ${f.get('topic')}\n\n${f.get('msg')}`;
    location.href = 'mailto:info@baufacilityservices.de?subject=' + encodeURIComponent('Anfrage: ' + f.get('topic')) + '&body=' + encodeURIComponent(body);
  });
  const modal = $('#apply'); let tm, left;
  const step = i => { $$('fieldset', modal).forEach((f, k) => f.hidden = k !== i); $$('.stepbar i', modal).forEach((s, k) => s.classList.toggle('on', k <= i)); };
  const openApply = () => { modal.hidden = false; left = 60; $('#timer').textContent = left; step(0); clearInterval(tm); tm = setInterval(() => { left = Math.max(0, left - 1); $('#timer').textContent = left; }, 1000); setTimeout(() => $('select', modal).focus(), 50); };
  const closeM = () => { modal.hidden = true; clearInterval(tm); };
  $$('[data-open="apply"]').forEach(b => b.addEventListener('click', openApply));
  $$('[data-next]', modal).forEach((b, i) => b.addEventListener('click', () => step(i + 1)));
  $('[data-close]', modal).addEventListener('click', closeM);
  modal.addEventListener('click', e => { if (e.target === modal) closeM(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeM(); });
  $('#applyForm').addEventListener('submit', e => {
    e.preventDefault(); const f = new FormData(e.target);
    location.href = 'mailto:info@baufacilityservices.de?subject=' + encodeURIComponent('Bewerbung über die Webseite') + '&body=' + encodeURIComponent(`Bereich: ${f.get('job')}\nFührerschein B: ${f.get('fs')}\nStart: ${f.get('ab')}\nName: ${f.get('n')}\nTelefon: ${f.get('t')}`);
    closeM();
  });

  /* ---------- Etagen-Labels + Hervorhebung ---------- */
  const house = $('#house'), stage = $('#stage'), hl = $('#hl');
  function placeLabels() {
    $$('.lab').forEach(l => {
      const f = FLOORS[l.dataset.f]; if (!f) return;
      const narrow = innerWidth < 700;
      if (narrow) l.querySelector('b').textContent = SHORT[l.dataset.f];
      if (l.dataset.f === 'aussen') Object.assign(l.style, { left: 'auto', right: (1 - f.x) * 100 + '%', top: (f.y + f.h * .3) * 100 + '%', transform: 'translateY(-50%)', flexDirection: 'row-reverse' });
      else Object.assign(l.style, { left: (f.x + f.w) * 100 + '%', top: (f.y + f.h / 2) * 100 + '%', transform: 'translateY(-50%)' });
      const hw = house.getBoundingClientRect().width || innerWidth * .9;
      const room = narrow ? 8 : (l.dataset.f === 'aussen' ? hw * f.x - 150 : hw * (1 - f.x - f.w) - 190);
      l.style.setProperty('--len', Math.max(16, Math.min(110, room)) + 'px');
    });
  }
  function showHl(k) { const f = FLOORS[k]; if (!f) { hl.style.opacity = 0; return; } Object.assign(hl.style, { left: f.x * 100 + '%', top: f.y * 100 + '%', width: f.w * 100 + '%', height: f.h * 100 + '%', opacity: 1 }); }
  $$('.lab').forEach(l => { l.addEventListener('mouseenter', () => showHl(l.dataset.f)); l.addEventListener('focus', () => showHl(l.dataset.f)); l.addEventListener('mouseleave', () => showHl()); l.addEventListener('blur', () => showHl()); });
  placeLabels(); addEventListener('resize', placeLabels);
  if (!hasCut) { $('#labels').hidden = true; }

  /* ---------- Scroll-Regie ---------- */
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  let lenis;
  if (window.Lenis && !reduced) { lenis = new Lenis({ lerp: .12 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

  /* Kamera auf eine Etage richten */
  function camTo(k, fill) {
    const f = FLOORS[k], W = house.offsetWidth, H = house.offsetHeight, sw = stage.offsetWidth, sh = stage.offsetHeight;
    const s = Math.min(sw * (fill || .9) / (f.w * W), sh * .75 / (f.h * H));
    const dx = (f.x + f.w / 2 - .5) * W, dy = (f.y + f.h / 2 - .5) * H;
    return { x: -dx * s, y: -dy * s, scale: s };
  }
  const introX = () => innerWidth > 1020 ? stage.offsetWidth * .17 : 0;
  gsap.set(house, { xPercent: -50, yPercent: -50, x: introX(), y: 0, scale: 1 });
  const LEN = mob ? 7000 : 9000;
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
  const at = {}; // Fortschritt je Etage für Anker
  // Fassade löst sich von oben nach unten auf
  tl.fromTo('#house .facade', { clipPath: 'inset(0% 0 0 0)' }, { clipPath: 'inset(100% 0 0 0)', duration: .08, ease: 'none' }, 0)
    .fromTo('#house', { scale: .9, x: introX }, { scale: .96, x: introX, duration: .08, ease: 'none' }, 0)
    .to('.lab', { opacity: 1, duration: .02, stagger: .012 }, .07)
    .fromTo('.lab i', { scaleX: 0 }, { scaleX: 1, duration: .02, stagger: .012 }, .07);
  let t = .15;
  ['keller', 'eg', 'og', 'dach'].forEach(k => {
    const p = '#p-' + k;
    if (k === 'keller') tl.to('#intro', { opacity: 0, y: -20, duration: .03 }, t);
    tl.to('.labels', { opacity: 0, duration: .02 }, t)
      .to(house, { x: () => camTo(k).x, y: () => camTo(k).y, scale: () => camTo(k).scale, duration: .05 }, t)
      .to(p, { autoAlpha: 1, duration: .025, ease: 'power1.out' }, t + .045)
      .fromTo(p + ' .panel__media', { scale: .94 }, { scale: 1, duration: .04, ease: 'power2.out' }, t + .045)
      .fromTo(p + ' .panel__copy > *', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: .005, duration: .025 }, t + .05);
    at[k] = t + .08;
    if (k === 'eg') tl.to({ v: 92 }, { v: 50, duration: .05, ease: 'power2.inOut', onUpdate() { setX(this.targets()[0].v); } }, t + .07);
    if (k === 'og') tl.to({ v: 0 }, { v: 2.99, duration: .07, ease: 'none', onUpdate() { setStep3(Math.floor(this.targets()[0].v)); } }, t + .07);
    tl.to(p, { autoAlpha: 0, duration: .02 }, t + .15)
      .to(house, { x: 0, y: 0, scale: 1, duration: .04 }, t + .155)
      .to('.labels', { opacity: k === 'dach' ? 0 : 1, duration: .02 }, t + .175);
    t += .17;
  });
  // Koordination: Haus rückt nach links, Linien zu einem Ansprechpartner
  at.koordination = t + .06;
  tl.to(house, { x: 0, y: () => mob ? -stage.offsetHeight * .1 : stage.offsetHeight * .04, scale: mob ? .7 : .62, duration: .05 }, t)
    .to('#coord', { opacity: 1, duration: .02 }, t + .045)
    .fromTo('#coordSvg path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .05, stagger: .008, ease: 'none' }, t + .05)
    .to('#contactCard', { opacity: 1, y: 0, duration: .03 }, t + .07)
    .to('#coordCopy', { opacity: 1, duration: .03 }, t + .05)
    .to({}, { duration: .06 }, t + .1);

  const st = ScrollTrigger.create({ trigger: '#haus', start: 'top top', end: '+=' + LEN, pin: '#stage', scrub: true, animation: tl, anticipatePin: 1, onRefresh: drawCoord });

  /* Linien von jeder Etage zum Ansprechpartner (nach Endstellung berechnet) */
  function drawCoord() {
    const svg = $('#coordSvg'), card = $('#contactCard img'); if (!svg || !card) return;
    const sw = stage.offsetWidth, sh = stage.offsetHeight, head = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--head')) || 68;
    const W = house.offsetWidth, H = house.offsetHeight, s = mob ? .7 : .62, cx = sw / 2, cy = (sh + head) / 2 + (mob ? -sh * .1 : sh * .04);
    const cr = card.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    const tx = cr.left - sr.left + (mob ? cr.width / 2 : 0), ty = cr.top - sr.top + (mob ? 0 : cr.height / 2) - head;
    let d = '';
    ['dach', 'og', 'eg', 'keller'].forEach(k => { const f = FLOORS[k]; const x = cx + (f.x + f.w - .5) * W * s, y = cy + (f.y + f.h / 2 - .5) * H * s - head; const mx = (x + tx) / 2; d += `<path pathLength="1" stroke-dasharray="1" d="M${x},${y} C${mx},${y} ${mx},${ty} ${tx},${ty}"/><circle cx="${x}" cy="${y}" r="4"/>`; });
    svg.innerHTML = d;
  }
  drawCoord();

  /* Anker aus Menü/Labels springen an die passende Stelle der Fahrt */
  function goto(id) {
    const k = id.slice(1);
    if (at[k] != null) { const y = st.start + at[k] * (st.end - st.start); lenis ? lenis.scrollTo(y) : scrollTo({ top: y, behavior: 'smooth' }); return true; }
    const el = $(id); if (el) { lenis ? lenis.scrollTo(el) : el.scrollIntoView({ behavior: 'smooth' }); return true; }
    return false;
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const id = a.getAttribute('href'); if (id.length > 1 && goto(id)) { e.preventDefault(); menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); } }));
  if (location.hash) setTimeout(() => goto(location.hash), 400);

  /* Team: Kinetik-Typo */
  ScrollTrigger.create({ trigger: '#team', start: 'top 70%', once: true, onEnter: () => gsap.to('#kin b', { y: 0, stagger: .3, duration: .7, ease: 'power3.out' }) });
  gsap.from('.wert', { y: 40, opacity: 0, stagger: .1, duration: .7, scrollTrigger: { trigger: '#werte', start: 'top 75%' } });
  gsap.from('.hero__media', { scale: .96, opacity: 0, duration: 1.1, ease: 'power3.out' });
  addEventListener('load', () => { placeLabels(); ScrollTrigger.refresh(); });
})();
