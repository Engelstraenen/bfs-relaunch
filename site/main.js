/* BAU Facility Services · „Ein Ticket geht durchs Haus“ */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const A = window.ASSETS || { img: {}, video: {} };
  const mob = matchMedia('(max-width:700px)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Medien: fehlende Bilder ausblenden, nie Platzhalter ---------- */
  function srcFor(name) {
    const e = A.img[name]; if (!e) return null;
    const s = e.sizes.map(w => `assets/img/${name}-${w}.webp ${w}w`).join(', ');
    return { srcset: s, src: `assets/img/${name}-${e.sizes[0]}.webp` };
  }
  $$('img[data-img]').forEach(img => {
    let s = srcFor(img.dataset.img);
    if (!s && img.dataset.fallback) s = srcFor(img.dataset.fallback);
    if (!s) { img.hidden = true; return; }
    img.srcset = s.srcset; img.src = s.src;
    img.sizes = img.closest('.shots') ? '(max-width:700px) 45vw, 22vw' : (img.closest('.wipe') || img.closest('#m1') ? '(max-width:1080px) 100vw, 70vw' : '(max-width:1080px) 100vw, 66vw');
    img.decoding = 'async';
  });
  $$('video[data-video]').forEach(v => {
    const e = A.video[v.dataset.video];
    if (!e) { v.remove(); return; }
    v.src = (mob && e.mobile) || e.desktop;
    v.addEventListener('loadeddata', () => v.classList.add('ok'), { once: true });
  });

  /* ---------- Ticket (Demo) ---------- */
  const T = { no: '#10427', title: 'Wasserfleck · 2. OG', t0: null };
  try { Object.assign(T, JSON.parse(sessionStorage.getItem('bfsTicket') || '{}')); } catch (e) {}
  const fmt = d => d.toLocaleDateString('de-DE', { weekday: 'short' }) + ' ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  function paintTicket() {
    $('#tNo').textContent = T.no; $('#tTitle').textContent = T.title;
    $$('.rNo').forEach(e => e.textContent = 'Auftrag ' + T.no); $$('.rTitle').forEach(e => e.textContent = T.title);
    $('#gNo').textContent = T.no; $('#phNo').textContent = T.no;
    $$('.tkNo').forEach(e => e.textContent = T.no); $$('.tkTitle').forEach(e => e.textContent = T.title);
    if (T.t0) { const a = new Date(T.t0), b = new Date(T.t0 + 26 * 3600e3 + 13 * 60e3); $('#tA').textContent = fmt(a); $('#tB').textContent = fmt(b); $$('.tkTime').forEach(e => e.textContent = a.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })); }
  }
  let kind = 'Wasserfleck';
  $$('.chip').forEach(c => c.addEventListener('click', () => {
    $$('.chip').forEach(x => { x.classList.remove('on'); x.setAttribute('aria-checked', 'false'); });
    c.classList.add('on'); c.setAttribute('aria-checked', 'true'); kind = c.dataset.k;
  }));
  $('#phForm').addEventListener('submit', e => {
    e.preventDefault();
    T.no = '#' + (10428 + Math.floor(Math.random() * 70)); T.title = kind + ' · ' + $('#phFloor').value; T.t0 = Date.now();
    try { sessionStorage.setItem('bfsTicket', JSON.stringify(T)); } catch (er) {}
    $('#phForm').hidden = true; $('#phDone').hidden = false; $('#hint').hidden = true; paintTicket();
  });
  /* Handy-Bildschirm liegt exakt auf dem Handy im Foto; Tippen öffnet das große Formular */
  const PHONE_SCREEN = { x: .768, y: .362, w: .118, h: .44 };
  function cover(box, name, posX) {
    const e = A.img[name], W = box.clientWidth, H = box.clientHeight; if (!e) return null;
    const s = Math.max(W / e.w, H / e.h), dw = e.w * s, dh = e.h * s;
    return { s, dw, dh, ox: (W - dw) * posX, oy: (H - dh) / 2 };
  }
  const m1 = $('#m1'), scr = $('#scr'), phone = $('#phone'), m1img = $('#m1 > img');
  const hasHand = !!A.img['m1b-hand'];
  function placeScr() {
    if (!hasHand) { scr.hidden = true; return; }
    const c = cover(m1, 'm1b-hand', parseFloat(getComputedStyle(m1img).objectPosition) / 100 || .5); if (!c) return;
    Object.assign(scr.style, { left: c.ox + PHONE_SCREEN.x * c.dw + 'px', top: c.oy + PHONE_SCREEN.y * c.dh + 'px', width: PHONE_SCREEN.w * c.dw + 'px', height: PHONE_SCREEN.h * c.dh + 'px' });
    const r = scr.getBoundingClientRect(), mr = m1.getBoundingClientRect(), hint = $('#hint');
    Object.assign(hint.style, { left: Math.max(12, r.left - mr.left - 220) + 'px', top: r.top - mr.top + r.height * .55 + 'px' });
  }
  function openPhone() {
    phone.hidden = false; $('#hint').hidden = true;
    const mr = m1.getBoundingClientRect(), pw = phone.offsetWidth, ph = phone.offsetHeight;
    const r = hasHand ? scr.getBoundingClientRect() : { left: mr.right - pw - 40, top: mr.top + 80, width: pw, height: ph };
    const left = Math.min(mr.width - pw - 12, Math.max(12, r.left - mr.left + r.width / 2 - pw / 2)), top = Math.min(mr.height - ph - 12, Math.max(12, r.top - mr.top + r.height / 2 - ph / 2));
    Object.assign(phone.style, { left: left + 'px', top: top + 'px' });
    if (!reduced) phone.animate([{ transform: `scale(${Math.max(.3, r.width / pw)})`, opacity: .4 }, { transform: 'scale(1)', opacity: 1 }], { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' });
    setTimeout(() => ($('.chip.on') || phone).focus({ preventScroll: true }), 80);
  }
  scr.addEventListener('click', openPhone);
  $('#phoneX').addEventListener('click', () => { phone.hidden = true; });
  $('#toPhone').addEventListener('click', e => { e.preventDefault(); openPhone(); });
  if (!hasHand) { phone.hidden = false; Object.assign(phone.style, { right: '9%', bottom: '-6%' }); }
  addEventListener('resize', placeScr); placeScr();
  if (T.t0) { $('#phForm').hidden = true; $('#phDone').hidden = false; $('#hint').hidden = true; }
  paintTicket();

  /* ---------- Menü ---------- */
  const burger = $('.burger'), menu = $('#menu');
  burger.addEventListener('click', () => { const o = menu.hidden; menu.hidden = !o; burger.setAttribute('aria-expanded', String(o)); });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); }));

  /* ---------- Wisch-Regler ---------- */
  const wipe = $('#wipe');
  function setX(p) { p = Math.max(0, Math.min(100, p)); wipe.style.setProperty('--x', p + '%'); wipe.setAttribute('aria-valuenow', Math.round(p)); }
  let drag = false;
  const px = e => { const r = wipe.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; };
  wipe.addEventListener('pointerdown', e => { drag = true; wipe.setPointerCapture(e.pointerId); setX(px(e)); });
  wipe.addEventListener('pointermove', e => { if (drag) setX(px(e)); });
  wipe.addEventListener('pointerup', () => drag = false); wipe.addEventListener('pointercancel', () => drag = false);
  wipe.addEventListener('keydown', e => { const v = +wipe.getAttribute('aria-valuenow'); if (e.key === 'ArrowLeft') setX(v - 5); if (e.key === 'ArrowRight') setX(v + 5); });
  setX(50);

  /* ---------- Rechner „Ihr Objekt in 3 Fragen“ ---------- */
  const OUT = {
    betreuung: ['Laufende Betreuung', 'Hausmeister-Service mit festen Rundgängen, Treppenhaus und Außenanlagen, Winterdienst, Kleinreparaturen, QR-Meldeweg für Mieter und Foto-Bericht für die Verwaltung.'],
    sanierung: ['Sanierung & Renovierung', 'Bestandsaufnahme vor Ort, ein Plan für alle Gewerke, ein Termin- und Kostenrahmen, Umsetzung mit Partnerbetrieben und dokumentierte Abnahme.'],
    umbau: ['Bau & Umbau', 'Planung & Organisation, Koordination aller Gewerke, ein fester Ansprechpartner bis zur Übergabe.'],
    schaden: ['Akuter Schaden', 'Meldung aufnehmen, Fachleute einplanen, Schaden beheben, alles mit Fotos und Zeitstempeln für Versicherung und Verwaltung dokumentieren.']
  };
  const SIZE = { s: 'bis 10 Einheiten', m: '11 bis 40 Einheiten', l: 'über 40 Einheiten' };
  const ART = { wohn: 'Wohnanlage / WEG', gew: 'Gewerbeimmobilie', haus: 'Ein- oder Zweifamilienhaus' };
  function calc() {
    const a = $('#cA').value, b = $('#cB').value, c = $('#cC').value, o = OUT[c];
    $('#cB').disabled = a === 'haus';
    $('#cOut').innerHTML = `<b>${o[0]}</b>${o[1]}<br><small>Fester Ansprechpartner für Ihr Objekt.</small>`;
    const txt = `Anfrage: ${o[0]} für ${ART[a]}${a === 'haus' ? '' : ' (' + SIZE[b] + ')'}.`;
    $('#cMail').onclick = e => { e.preventDefault(); $('#msg').value = txt + '\n\nBitte melden Sie sich für ein Angebot.'; $('#kontakt').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); };
  }
  $$('#calc select').forEach(s => s.addEventListener('change', calc)); calc();

  /* ---------- Bewertungen: Beispiele nacheinander ---------- */
  const REV = ['„Schnell, professionell und zuverlässig. Genau so wünscht man sich das.“', '„Ein Ansprechpartner für alles, und wir sehen jeden Einsatz mit Foto.“', '„Der Wasserschaden war nach einem Tag erledigt und sauber dokumentiert.“'];
  let ri = 0; const rt = $('#revTxt');
  setInterval(() => { rt.parentElement.style.opacity = 0; setTimeout(() => { ri = (ri + 1) % REV.length; rt.textContent = REV[ri]; rt.parentElement.style.opacity = 1; }, 600); }, 6000);

  /* ---------- Formulare → E-Mail ---------- */
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault(); const f = new FormData(e.target);
    const body = `Name: ${f.get('name')}\nTelefon: ${f.get('tel')}\nE-Mail: ${f.get('mail')}\n\n${f.get('msg')}`;
    location.href = 'mailto:info@baufacilityservices.de?subject=' + encodeURIComponent('Anfrage über die Webseite') + '&body=' + encodeURIComponent(body);
  });
  const modal = $('#apply'); let tm, left;
  function openApply() {
    modal.hidden = false; left = 60; $('#timer').textContent = left; step(0);
    clearInterval(tm); tm = setInterval(() => { left = Math.max(0, left - 1); $('#timer').textContent = left; }, 1000);
    setTimeout(() => $('select', modal).focus(), 50);
  }
  function step(i) { $$('fieldset', modal).forEach((f, k) => f.hidden = k !== i); $$('.steps i', modal).forEach((s, k) => s.classList.toggle('on', k <= i)); }
  $$('[data-open="apply"]').forEach(b => b.addEventListener('click', openApply));
  $$('[data-next]', modal).forEach((b, i) => b.addEventListener('click', () => step(i + 1)));
  const closeM = () => { modal.hidden = true; clearInterval(tm); };
  $('[data-close]', modal).addEventListener('click', closeM);
  modal.addEventListener('click', e => { if (e.target === modal) closeM(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeM(); });
  $('#applyForm').addEventListener('submit', e => {
    e.preventDefault(); const f = new FormData(e.target);
    const body = `Bewerbung (60 Sekunden)\nBereich: ${f.get('job')}\nFührerschein B: ${f.get('fs')}\nStart: ${f.get('ab')}\nName: ${f.get('n')}\nTelefon: ${f.get('t')}`;
    location.href = 'mailto:info@baufacilityservices.de?subject=' + encodeURIComponent('Bewerbung über die Webseite') + '&body=' + encodeURIComponent(body);
    closeM();
  });

  /* ---------- Status-Leiste ---------- */
  const links = $$('.status a');
  function setStep(n) { links.forEach((a, i) => { a.classList.toggle('on', i === n); a.classList.toggle('done', i < n); }); }
  setStep(0);

  /* ---------- Zähler ---------- */
  function countUp(el) {
    const to = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    if (reduced) { el.textContent = pre + to.toLocaleString('de-DE') + suf; return; }
    const t0 = performance.now();
    (function f(t) { const k = Math.min(1, (t - t0) / 1400), v = Math.round(to * (1 - Math.pow(1 - k, 3))); el.textContent = pre + v.toLocaleString('de-DE') + suf; if (k < 1) requestAnimationFrame(f); })(t0);
  }

  /* ---------- Tablet-Bildschirm: Bericht exakt auf den Bildschirm legen ---------- */
  const SCREEN = window.TABLET_SCREEN || { x: .313, y: .222, w: .444, h: .5 }; // Anteil am Foto
  function placeReport() {
    const box = $('#m7'), img = $('#m7 > img'), r = $('#report');
    const W = box.clientWidth, H = box.clientHeight;
    const e = A.img['m7-tablet']; const iw = e ? e.w : 16, ih = e ? e.h : 9;
    const s = Math.max(W / iw, H / ih), dw = iw * s, dh = ih * s, ox = (W - dw) / 2, oy = (H - dh) / 2;
    if (img.hidden || W < 600) { Object.assign(r.style, { left: '5%', top: '8%', width: '90%', height: 'auto' }); return; }
    Object.assign(r.style, { left: ox + SCREEN.x * dw + 'px', top: oy + SCREEN.y * dh + 'px', width: SCREEN.w * dw + 'px', height: SCREEN.h * dh + 'px', overflow: 'hidden' });
  }
  addEventListener('resize', placeReport); placeReport();

  /* ---------- Scroll-Regie ---------- */
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  let lenis;
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ lerp: .12 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const id = a.getAttribute('href'); if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo($(id), { offset: 0 }); } }));
  }
  gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
  $$('section[data-step]').forEach(s => ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onToggle: st => st.isActive && setStep(+s.dataset.step) }));

  const pin = (el, len, tl) => ScrollTrigger.create({ trigger: el, start: 'top top', end: '+=' + len, pin: true, scrub: true, animation: tl, anticipatePin: 1 });

  /* 1 → 2: Handy wächst aus der Hand, Bildschirm wird zur Ticket-Karte */
  const tl1 = gsap.timeline();
  tl1.to('#m1 > img', { scale: 1.08, filter: 'blur(6px)', ease: 'none' }, 0)
     .to('#scr', { x: () => { const r = scr.getBoundingClientRect(), m = m1.getBoundingClientRect(); return m.left + m.width / 2 - (r.left + r.width / 2); }, y: () => { const r = scr.getBoundingClientRect(), m = m1.getBoundingClientRect(); return m.top + m.height / 2 - (r.top + r.height / 2); }, scaleX: () => (mob ? 300 : 420) / Math.max(1, scr.offsetWidth), scaleY: () => (mob ? 130 : 160) / Math.max(1, scr.offsetHeight), rotate: -4, borderRadius: '6px', backgroundColor: '#f4ead6', ease: 'power1.inOut' }, 0)
     .to('#scr > *', { opacity: 0, duration: .2 }, .1)
     .to('#phone, #hint', { opacity: 0, duration: .15 }, 0)
     .to('#scr', { opacity: 0, duration: .15 }, .85);
  pin('#gemeldet', mob ? 500 : 700, tl1);

  /* 2: Ticket fliegt auf die Tafel, dann wird die Tafel zum Büro-Foto */
  const tk = document.createElement('div');
  tk.className = 'ticket'; tk.id = 'tk';
  tk.innerHTML = `<span class="ticket__no tkNo">${T.no}</span><div class="ticket__t"><svg width="22" height="28" viewBox="0 0 22 28" aria-hidden="true"><path d="M11 1C11 1 2 12 2 18a9 9 0 0 0 18 0C20 12 11 1 11 1z" fill="none" stroke="#1b2a49" stroke-width="2"/></svg><span class="tkTitle">${T.title}</span> · <span class="tkTime">08:14</span></div><p class="ticket__a">Wohnanlage, Berliner Straße 12, 40878 Ratingen</p><span class="ticket__s">Geplant</span>`;
  Object.assign(tk.style, { position: 'absolute', left: '50%', top: '50%', zIndex: 6 });
  $('#m2').appendChild(tk); paintTicket();
  const toSlot = () => { const s = $('#slot').getBoundingClientRect(), m = $('#m2').getBoundingClientRect(), k = tk.getBoundingClientRect(); return { x: s.left + s.width / 2 - (m.left + m.width / 2), y: s.top + s.height / 2 - (m.top + m.height / 2), sc: Math.min(1, s.width / k.width * 1.02) }; };
  gsap.set(tk, { xPercent: -50, yPercent: -50, scale: 1.25, rotate: -4 });
  const tl2 = gsap.timeline();
  tl2.fromTo(tk, { opacity: 0 }, { opacity: 1, duration: .08 }, 0)
     .to(tk, { x: () => toSlot().x, y: () => toSlot().y, scale: () => toSlot().sc * .9, rotate: 0, ease: 'power2.inOut', duration: .35 }, .05)
     .to('#slot', { opacity: 0, duration: .05 }, .38)
     .to(['#board', tk], { scale: .72, opacity: 0, ease: 'power1.in', duration: .2, transformOrigin: '50% 50%' }, .5)
     .to('#m3', { opacity: 1, duration: .2 }, .52)
     .add(() => {}, .6)
     .to('#data', { opacity: 1, y: 0, duration: .12 }, .64)
     .to('#gantt', { opacity: 1, duration: .12 }, .7)
     .to('#h2a', { opacity: 0, duration: .05 }, .55).set('#h2a', { innerHTML: 'Die richtigen Fachleute.<br>Zur richtigen Zeit.' }, .6).to('#h2a', { opacity: 1, duration: .08 }, .6)
     .to('#l2a', { opacity: 0, duration: .05 }, .55).set('#l2a', { textContent: 'Wir koordinieren alle Gewerke für eine schnelle und saubere Lösung: Sanitär, Trocknung, Maler. Starke Partner, ein Plan.' }, .6).to('#l2a', { opacity: 1, duration: .08 }, .6)
     .to('#gantt .g i', { width: (i, el) => el.dataset.w + '%', stagger: .04, duration: .12 }, .76)
     .to('#gantt .g.hot i', { width: '100%', left: 0, duration: .14, ease: 'power2.in' }, .9);
  pin('#geplant', mob ? 1400 : 1800, tl2);
  ScrollTrigger.create({ trigger: '#geplant', start: 'top top', end: () => '+=' + (mob ? 1400 : 1800), onUpdate: st => { if (st.progress > .62 && !st._c) { st._c = 1; countUp($('#data [data-count]')); $$('#data .bar i').forEach(b => b.style.width = b.dataset.w + '%'); } } });

  /* 3: roter Balken wird zur Straße → Film / Foto Vor Ort */
  const v4 = $('#m4 video'), tl3 = gsap.timeline();
  tl3.fromTo('#m4 > img', { scale: 1.12 }, { scale: 1, ease: 'none', duration: 1 }, 0);
  if (v4) tl3.to({}, { duration: 1, onUpdate() { if (v4.duration) v4.currentTime = Math.min(v4.duration - .05, this.progress() * v4.duration); } }, 0);
  pin('#vor-ort', mob ? 700 : 1000, tl3);

  /* 4: Film Vorher → Arbeit → Ergebnis, Scroll spult */
  const v5 = $('#m5 video'), labs = $$('#m5 .scrub span'), tl4 = gsap.timeline();
  tl4.fromTo('#m5 > img', { scale: 1.06 }, { scale: 1, ease: 'none', duration: 1 }, 0);
  tl4.eventCallback('onUpdate', () => {
    const p = tl4.progress(); labs.forEach((l, i) => l.classList.toggle('on', i === (p < .2 ? 0 : p < .85 ? 1 : 2)));
    if (v5 && v5.duration) v5.currentTime = Math.min(v5.duration - .05, p * v5.duration);
  });
  pin('#arbeit', mob ? 900 : 1400, tl4);

  /* 5: Wischer fährt einmal auf, dann frei ziehbar */
  ScrollTrigger.create({ trigger: '#erledigt', start: 'top 60%', once: true, onEnter: () => { if (reduced) return; const o = { x: 96 }; gsap.to(o, { x: 50, duration: 1.6, ease: 'power3.inOut', onUpdate: () => setX(o.x) }); } });

  /* 6: Bericht, Stempel, Unterschrift */
  const sp = $('#sigp'), L = sp.getTotalLength(); sp.style.strokeDasharray = L; sp.style.strokeDashoffset = L;
  const tl6 = gsap.timeline();
  tl6.from('#m7 > img', { scale: 1.1, ease: 'none', duration: 1 }, 0)
     .from('#report .shots figure', { y: 30, opacity: 0, stagger: .08, duration: .2 }, .1)
     .to(sp, { strokeDashoffset: 0, duration: .3, ease: 'none' }, .35)
     .to('#stamp', { scale: 1, duration: .1, ease: 'back.out(3)' }, .7);
  pin('#dokumentiert', mob ? 700 : 1000, tl6);

  /* 7: Ticket dreht um → Karriere, Kinetik-Typo */
  gsap.from('#karriere .copy', { rotateY: -70, opacity: 0, transformOrigin: '0 50%', scrollTrigger: { trigger: '#karriere', start: 'top 80%', end: 'top 30%', scrub: true } });
  ScrollTrigger.create({ trigger: '#karriere', start: 'top 45%', once: true, onEnter: () => { gsap.to('#kin b', { y: 0, stagger: .35, duration: .7, ease: 'power3.out' }); const v = $('#m8 video'); if (v) v.play().catch(() => {}); } });
  if (mob) gsap.set('#kin b', { y: 0 });

  /* 8: Status-Liste schrumpft ins Handy */
  gsap.from('.handy', { y: 80, opacity: 0, scale: .92, scrollTrigger: { trigger: '#objekt', start: 'top 85%', end: 'top 35%', scrub: true } });
  gsap.from('.vsteps li', { x: -20, opacity: 0, stagger: .1, scrollTrigger: { trigger: '#objekt', start: 'top 60%' } });

  /* Erste Sekunde: Bewegung ab Laden */
  if (!reduced) { gsap.from('#m1 > img', { scale: 1.12, duration: 2.2, ease: 'power3.out' }); gsap.from('#scr', { opacity: 0, y: 30, duration: .9, delay: .6, ease: 'power3.out' }); }
  addEventListener('load', () => { placeScr(); ScrollTrigger.refresh(); placeReport(); });
})();
