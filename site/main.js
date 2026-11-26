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

  /* ---------- Kamera ----------
     Akt 1: einmal in den Keller zoomen, dann OHNE Rauszoomen nach oben fahren (Keller → EG → OG → Dach → Außen).
     Akt 2: einmal ruhig zurück aufs ganze Haus, Haus steht links, Rahmen markiert, wo die Firmenleistung stattfindet. */
  const narrow = () => innerWidth <= 700;
  const BLD = { x: .11, y: .04, w: .63, h: .89 }; // ganzes Gebäude inkl. Außenanlage
  const head = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--head')) || 68;
  // Position, an der das Haus-Detail (Anteile im Bild) bei Skalierung s in der Bühne landen soll
  function aim(r, s, tx, ty) {
    const W = house.offsetWidth, H = house.offsetHeight, sh = stage.offsetHeight, sw = stage.offsetWidth;
    const dx = (r.x + r.w / 2 - .5) * W, dy = (r.y + r.h / 2 - .5) * H;
    const cx = sw / 2, cy = sh / 2 + head() / 2; // Mitte der Haus-Box ohne Verschiebung
    return { x: tx - cx - dx * s, y: ty - cy - dy * s, scale: s };
  }
  let sRide = 1;
  function rideScale() {
    const W = house.offsetWidth, H = house.offsetHeight, sw = stage.offsetWidth, sh = stage.offsetHeight, hd = head(), f = FLOORS.eg;
    sRide = narrow() ? Math.min(sw * .98 / (f.w * W), (sh - hd) * .36 / (f.h * H))
                     : Math.min(sw * .52 / (f.w * W), (sh - hd) * .62 / (f.h * H));
    return sRide;
  }
  function camFloor(k) {
    const sw = stage.offsetWidth, sh = stage.offsetHeight, hd = head(), s = rideScale();
    return narrow() ? aim(FLOORS[k], s, sw / 2, hd + (sh - hd) * .22) : aim(FLOORS[k], s, sw * .33, hd + (sh - hd) / 2);
  }
  function camAll() {
    const W = house.offsetWidth, H = house.offsetHeight, sw = stage.offsetWidth, sh = stage.offsetHeight, hd = head();
    if (narrow()) { const s = Math.min(sw * .9 / (BLD.w * W), (sh - hd) * .36 / (BLD.h * H)); return aim(BLD, s, sw / 2, hd + (sh - hd) * .21); }
    const card = innerWidth > 1020 ? Math.min(560, sw * .44) : Math.min(460, sw * .48);
    const free = sw - card - 2 * Math.max(16, Math.min(64, sw * .04)) - 24;
    const s = Math.min(free * .92 / (BLD.w * W), (sh - hd) * .84 / (BLD.h * H));
    return aim(BLD, s, Math.max(16, Math.min(64, sw * .04)) + free / 2, hd + (sh - hd) / 2);
  }
  const C = fn => ({ x: () => fn().x, y: () => fn().y, scale: () => fn().scale });
  const introX = () => innerWidth > 1020 ? stage.offsetWidth * .17 : 0;
  gsap.set(house, { xPercent: -50, yPercent: -50, x: introX(), y: 0, scale: 1 });
  const LEN = mob ? 10000 : 12500;
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
  const at = {}; window.__at = at; // Haltepunkte für Anker
  const cardIn = (id, t) => tl.to(id, { autoAlpha: 1, duration: .02, ease: 'power1.out' }, t).fromTo(id, { y: 24 }, { y: 0, duration: .025, ease: 'power2.out' }, t).fromTo(id + ' > *', { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: .002, duration: .012 }, t + .004);
  const cardOut = (id, t) => tl.to(id, { autoAlpha: 0, y: -16, duration: .016, ease: 'power1.in' }, t);
  const hlTo = (r, t, d = .03) => tl.to(hl, { left: r.x * 100 + '%', top: r.y * 100 + '%', width: r.w * 100 + '%', height: r.h * 100 + '%', opacity: 1, duration: d }, t);

  // Fassade löst sich von oben nach unten auf (Röntgenblick), dann Etagen-Schilder
  tl.fromTo('#house .facade', { clipPath: 'inset(0% 0 0 0)' }, { clipPath: 'inset(100% 0 0 0)', duration: .08, ease: 'none' }, 0)
    .fromTo('#house', { scale: .9, x: introX }, { scale: .96, x: introX, duration: .08, ease: 'none' }, 0)
    .to('.lab', { opacity: 1, duration: .02, stagger: .012 }, .07)
    .fromTo('.lab i', { scaleX: 0 }, { scaleX: 1, duration: .02, stagger: .012 }, .07);

  // Akt 1: Hausmeister-Rundgang
  let t = .14;
  tl.to('#intro', { opacity: 0, y: -20, duration: .03 }, t).to('.labels', { opacity: 0, duration: .02 }, t)
    .to(house, { ...C(() => camFloor('keller')), duration: .06 }, t);
  cardIn('#c-keller', t + .05); at.keller = t + .08;
  const RIDE = ['keller', 'eg', 'og', 'dach', 'aussen'];
  t += .12;
  for (let i = 1; i < RIDE.length; i++) {
    const k = RIDE[i], prev = RIDE[i - 1];
    cardOut('#c-' + prev, t);
    tl.to(house, { ...C(() => camFloor(k)), duration: .05, ease: 'power1.inOut' }, t + .006); // Fahrt, gleiche Zoomstufe
    cardIn('#c-' + k, t + .04); at[k] = t + .07;
    t += .11;
  }
  // Akt 2: einmal zurück aufs ganze Haus, Rahmen zeigt, wo das Bauteam arbeitet
  cardOut('#c-aussen', t);
  tl.to(house, { ...C(camAll), duration: .07 }, t + .006);
  // Überleitung: ab hier Zusatzleistungen, keine Hausmeister-Arbeit
  tl.to('#bridge', { autoAlpha: 1, duration: .02 }, t + .02).fromTo('#bridge > *', { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: .004, duration: .02 }, t + .02);
  at.zusatz = t + .06;
  tl.to('#bridge', { autoAlpha: 0, y: -16, duration: .016 }, t + .09);
  hlTo(FLOORS.eg, t + .1, .02);
  cardIn('#c-umbau', t + .105); at.umbau = t + .135;
  tl.to({ v: 92 }, { v: 50, duration: .05, onUpdate() { setX(this.targets()[0].v); } }, t + .125);
  t += .2;
  cardOut('#c-umbau', t); hlTo(FLOORS.og, t + .01); cardIn('#c-sanierung', t + .03); at.sanierung = t + .065;
  tl.to({ v: 0 }, { v: 2.99, duration: .07, ease: 'none', onUpdate() { setStep3(Math.floor(this.targets()[0].v)); } }, t + .05);
  t += .14;
  cardOut('#c-sanierung', t); hlTo(BLD, t + .01); cardIn('#c-planung', t + .03); at.planung = t + .065;
  t += .12;
  // Koordination: Linien von jeder Etage zum Ansprechpartner
  cardOut('#c-planung', t); tl.to(hl, { opacity: 0, duration: .02 }, t);
  cardIn('#contactCard', t + .02);
  tl.to('#coord', { opacity: 1, duration: .02 }, t + .03)
    .fromTo('#coordSvg path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .05, stagger: .008, ease: 'none' }, t + .035);
  at.koordination = t + .07;
  tl.to({}, { duration: .07 }, t + .09);
  const TOT = tl.duration();
  for (const k in at) at[k] /= TOT;

  const st = ScrollTrigger.create({ trigger: '#haus', start: 'top top', end: '+=' + LEN, pin: '#stage', scrub: true, animation: tl, anticipatePin: 1, invalidateOnRefresh: true, onRefresh: () => drawCoord(), onUpdate: s => { if (s.progress > at.koordination - .12) drawCoord(); } });

  /* Linien von jeder Etage zum Ansprechpartner (live gemessen) */
  function drawCoord() {
    const svg = $('#coordSvg'), card = $('#contactCard img'); if (!svg || !card || card.hidden) return;
    if (!svg.children.length) svg.innerHTML = ['dach', 'og', 'eg', 'keller'].map(() => '<path pathLength="1" stroke-dasharray="1"/><circle r="4"/>').join('');
    const or = $('#coord').getBoundingClientRect(), hr = house.getBoundingClientRect(), cr = card.getBoundingClientRect();
    const nw = narrow();
    const tx = (nw ? cr.left + cr.width / 2 : cr.left) - or.left, ty = (nw ? cr.top : cr.top + cr.height / 2) - or.top;
    const paths = svg.querySelectorAll('path'), dots = svg.querySelectorAll('circle');
    ['dach', 'og', 'eg', 'keller'].forEach((k, i) => {
      const f = FLOORS[k], x = hr.left + (f.x + f.w) * hr.width - or.left, y = hr.top + (f.y + f.h / 2) * hr.height - or.top;
      const d = nw ? `M${x},${y} C${x + 30},${y} ${tx},${(y + ty) / 2} ${tx},${ty}` : `M${x},${y} C${(x + tx) / 2},${y} ${(x + tx) / 2},${ty} ${tx},${ty}`;
      paths[i].setAttribute('d', d); dots[i].setAttribute('cx', x); dots[i].setAttribute('cy', y);
    });
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
