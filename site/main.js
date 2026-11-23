/* BAU Facility Services – Relaunch · Scrollytelling */
(() => {
  const A = window.ASSETS || { img: {}, video: {} };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const mq = (q) => window.matchMedia(q).matches;
  const isMobile = () => mq('(max-width:700px)');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));

  /* ---------- Bilder: nur echte Dateien, nie Platzhalter ---------- */
  function loadImages() {
    $$('img[data-src]').forEach((img) => {
      const key = img.dataset.src.split('/').pop();
      const meta = A.img[key];
      if (!meta) { img.classList.add('is-missing'); return; }
      const base = img.dataset.src;
      img.srcset = meta.sizes.map((w) => `${base}-${w}.webp ${w}w`).join(', ');
      img.sizes = img.closest('.pick') ? '(max-width:700px) 50vw, 25vw'
        : img.closest('.dial__photo') ? '(max-width:700px) 70vw, 40vw' : '100vw';
      img.src = `${base}-${meta.sizes[meta.sizes.length - 1]}.webp`;
      img.width = meta.w; img.height = meta.h;
      img.decoding = 'async';
      if (!img.closest('.stage')) img.loading = 'lazy';
      const done = () => img.classList.add('is-in');
      img.complete ? done() : img.addEventListener('load', done, { once: true });
      img.addEventListener('error', () => img.classList.add('is-missing'), { once: true });
    });
    // Bereiche ohne Kernbild ganz ausblenden
    if (!A.img['room-before'] && !A.video.renovation) $('#vorher-nachher')?.classList.add('is-missing');
    if (!A.img.caretaker) $('.dial__photo')?.classList.add('is-missing');
    $$('.flow__panel').forEach((p) => { const im = $('.flow__img img', p); if (im && im.classList.contains('is-missing')) $('.flow__img', p).classList.add('is-missing'); });
    $$('.pick').forEach((p) => { if ($('img', p).classList.contains('is-missing')) p.classList.add('no-img'); });
  }
  loadImages();

  /* ---------- Navigation ---------- */
  const nav = $('#nav'), burger = $('.nav__burger'), menu = $('#menu');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    menu.hidden = !open; document.body.style.overflow = open ? 'hidden' : '';
    nav.classList.toggle('is-dark', open || nav.dataset.dark === '1');
  };
  burger.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

  /* ---------- Leistungs-Karten ---------- */
  const SVC = {
    planung: { no: '01', h: 'Planung & Organisation', p: 'Ein Ansprechpartner, alle Leistungen: Wir planen Ihr Projekt strukturiert, bündeln die Arbeiten und behalten den gesamten Ablauf im Blick.', l: ['Bestandsaufnahme', 'Zeitplan', 'Gewerke koordinieren', 'Ein Ansprechpartner'] },
    bau: { no: '02', h: 'Bau & Umbau', p: 'Ob neue Raumaufteilung, Modernisierung oder umfangreicher Umbau – wir setzen Ihre Vorstellungen fachgerecht und zuverlässig um.', l: ['Raumaufteilung', 'Trockenbau', 'Modernisierung', 'Innenausbau'] },
    sanierung: { no: '03', h: 'Sanierung & Renovierung', p: 'Wir bringen Immobilien wieder in Bestform und schaffen moderne, funktionale Räume, die langfristig ihren Wert behalten.', l: ['Bad', 'Böden', 'Elektrik', 'Malerarbeiten'] },
    hausmeister: { no: '04', h: 'Hausmeister-Service', p: 'Wir kümmern uns um die laufende Betreuung Ihrer Immobilie und sorgen dafür, dass Gebäude und Außenbereiche gepflegt bleiben.', l: ['Treppenhaus', 'Heizung', 'Außenanlage', 'Winterdienst'] },
  };
  const card = $('.svc-card');
  let cardPinned = false;
  function showCard(key, byUser) {
    const d = SVC[key]; if (!d) return;
    if (byUser) cardPinned = true;
    $('.svc-card__no', card).textContent = d.no;
    $('.svc-card__h', card).textContent = d.h;
    $('.svc-card__p', card).textContent = d.p;
    $('.svc-card__list', card).innerHTML = d.l.map((x) => `<li>${x}</li>`).join('');
    $('.btn', card).dataset.pick = key === 'bau' ? 'umbau' : key;
    card.hidden = false;
    $$('.tag').forEach((t) => t.classList.toggle('is-active', $('button', t).dataset.service === key));
  }
  function hideCard() { card.hidden = true; cardPinned = false; $$('.tag').forEach((t) => t.classList.remove('is-active')); }
  $$('.tag button').forEach((b) => b.addEventListener('click', () => showCard(b.dataset.service, true)));
  $('.svc-card__x').addEventListener('click', hideCard);

  /* ---------- Vorauswahl im Kontakt ---------- */
  function pick(key, on = true) {
    const b = $(`.pick[data-pick="${key}"]`); if (b) b.setAttribute('aria-pressed', on);
  }
  $$('.pick').forEach((b) => b.addEventListener('click', () => b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true')));
  document.addEventListener('click', (e) => { const a = e.target.closest('a[data-pick]'); if (a) pick(a.dataset.pick); });

  /* ---------- Formulare -> E-Mail ---------- */
  $('.contact').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target, fd = new FormData(f);
    if (!fd.get('name') || !/^\S+@\S+\.\S+$/.test(fd.get('mail') || '')) { f.reportValidity?.(); (f.name.value ? f.mail : f.name).focus(); return; }
    const picks = $$('.pick[aria-pressed=true] span').map((s) => s.textContent).join(', ') || 'noch offen';
    const body = `Leistung: ${picks}\nObjekt: ${fd.get('objekt')}\nZeitraum: ${fd.get('zeit')}\nName: ${fd.get('name')}\nTelefon: ${fd.get('tel') || '-'}\nE-Mail: ${fd.get('mail')}\n\n${fd.get('msg') || ''}`;
    location.href = `mailto:info@baufacilityservices.de?subject=${encodeURIComponent('Projektanfrage: ' + picks)}&body=${encodeURIComponent(body)}`;
  });

  /* ---------- Bewerbung in 60 Sekunden ---------- */
  const Q = [
    ['Schule fertig – oder bald?', ['Fertig', 'Bald']],
    ['Lieber drinnen oder draußen?', ['Drinnen', 'Draußen']],
    ['Ausbildung oder direkt einsteigen?', ['Ausbildung', 'Einstieg']],
    ['Führerschein Klasse B?', ['Ja', 'Noch nicht']],
  ];
  const ans = []; const sw = $('.swipe');
  function renderQ() {
    const i = ans.length;
    if (i >= Q.length) {
      $('.swipe__card', sw).textContent = 'Stark. Wie erreichen wir dich?';
      $('.swipe__btns', sw).innerHTML = ''; $('.swipe__form', sw).hidden = false;
      $('.swipe__step', sw).innerHTML = 'Bewerben in 60 Sekunden · <b>Fast geschafft</b>'; return;
    }
    $('.swipe__n', sw).textContent = i + 1;
    const c = $('.swipe__card', sw); c.textContent = Q[i][0];
    if (window.gsap) gsap.fromTo(c, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: .45, ease: 'power3.out' });
    $('.swipe__btns', sw).innerHTML = Q[i][1].map((t) => `<button type="button">${t}</button>`).join('');
    $$('.swipe__btns button', sw).forEach((b) => b.addEventListener('click', () => { ans.push(`${Q[i][0]} ${b.textContent}`); renderQ(); }));
  }
  renderQ();
  $('.swipe__form').addEventListener('submit', (e) => {
    e.preventDefault(); const fd = new FormData(e.target);
    if (!fd.get('name') || !fd.get('tel')) { e.target.reportValidity?.(); return; }
    const body = `${ans.join('\n')}\n\nName: ${fd.get('name')}\nTelefon: ${fd.get('tel')}`;
    location.href = `mailto:info@baufacilityservices.de?subject=${encodeURIComponent('Bewerbung über die Webseite')}&body=${encodeURIComponent(body)}`;
  });

  /* ---------- Bewertungen: Beispielkarten nacheinander ---------- */
  const rc = $$('.rcard'); let ri = 0;
  if (rc.length) { rc[0].classList.add('is-on'); setInterval(() => { rc[ri].classList.remove('is-on'); ri = (ri + 1) % rc.length; rc[ri].classList.add('is-on'); }, 4800); }

  /* ---------- Uhr: Striche ---------- */
  const ticks = $('.dial__ticks');
  if (ticks) for (let h = 0; h < 24; h++) {
    const a = (h / 24) * Math.PI * 2, r1 = h % 6 === 0 ? 164 : 172, r2 = 178;
    ticks.insertAdjacentHTML('beforeend', `<line class="${h % 6 === 0 ? 'major' : ''}" x1="${200 + r1 * Math.cos(a)}" y1="${200 + r1 * Math.sin(a)}" x2="${200 + r2 * Math.cos(a)}" y2="${200 + r2 * Math.sin(a)}"/>`);
  }

  /* ---------- Zitat in Wörter ---------- */
  const qt = $('.quote__text');
  if (qt) qt.innerHTML = qt.textContent.split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');

  /* ---------- Blaupause aus dem fertigen Raum (Kanten) ---------- */
  function drawBlueprint() {
    const cv = $('.blueprint'), photo = $('.blueprint__photo');
    if (!cv || !photo || photo.classList.contains('is-missing')) return;
    const run = () => {
      const W = 960, H = Math.round(W * photo.naturalHeight / photo.naturalWidth) || 540;
      const t = document.createElement('canvas'); t.width = W; t.height = H;
      const tx = t.getContext('2d'); tx.drawImage(photo, 0, 0, W, H);
      let src; try { src = tx.getImageData(0, 0, W, H).data; } catch { return; }
      const g = new Float32Array(W * H);
      for (let i = 0; i < W * H; i++) g[i] = src[i * 4] * .3 + src[i * 4 + 1] * .59 + src[i * 4 + 2] * .11;
      cv.width = W; cv.height = H; const cx = cv.getContext('2d');
      const out = cx.createImageData(W, H); const o = out.data;
      for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        const gx = -g[i - W - 1] - 2 * g[i - 1] - g[i + W - 1] + g[i - W + 1] + 2 * g[i + 1] + g[i + W + 1];
        const gy = -g[i - W - 1] - 2 * g[i - W] - g[i - W + 1] + g[i + W - 1] + 2 * g[i + W] + g[i + W + 1];
        const m = Math.min(255, Math.hypot(gx, gy) * 1.6);
        const k = i * 4; o[k] = 27 + m * .88; o[k + 1] = 42 + m * .83; o[k + 2] = 73 + m * .72; o[k + 3] = 255;
      }
      cx.putImageData(out, 0, 0);
      cx.strokeStyle = 'rgba(255,255,255,.08)'; cx.lineWidth = 1;
      for (let x = 0; x < W; x += 24) { cx.beginPath(); cx.moveTo(x, 0); cx.lineTo(x, H); cx.stroke(); }
      for (let y = 0; y < H; y += 24) { cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke(); }
    };
    photo.complete && photo.naturalWidth ? run() : photo.addEventListener('load', run, { once: true });
  }
  drawBlueprint();

  /* ---------- Video (Vorher → Arbeit → Nachher) ---------- */
  const fv = $('.film__video'); let fvDur = 0;
  if (A.video.renovation && fv) {
    const v = A.video.renovation;
    fv.src = isMobile() && v.mobile ? v.mobile : v.desktop;
    fv.addEventListener('loadedmetadata', () => { fvDur = fv.duration; fv.classList.add('is-ready'); fv.pause(); });
    fv.load();
  }
  const jv = $('.jobs__video');
  if (A.video.recruit && jv) {
    jv.src = isMobile() && A.video.recruit.mobile ? A.video.recruit.mobile : A.video.recruit.desktop;
    jv.addEventListener('canplay', () => jv.classList.add('is-ready'), { once: true });
  }

  /* ---------- Ohne GSAP: statische, aber vollständige Seite ---------- */
  if (!window.gsap || !window.ScrollTrigger) { document.documentElement.classList.add('no-motion'); return; }
  gsap.registerPlugin(ScrollTrigger);

  let lenis = null;
  if (window.Lenis && !mq('(prefers-reduced-motion: reduce)')) {
    lenis = new Lenis({ lerp: .11, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href'); if (id.length < 2) return;
      const t = $(id); if (!t) return; e.preventDefault(); lenis.scrollTo(t, { offset: 0, duration: 1.4 });
    }));
  }

  /* Navigation hell/dunkel */
  $$('.film, .jobs, .foot').forEach((s) => ScrollTrigger.create({
    trigger: s, start: 'top 60px', end: 'bottom 60px',
    onToggle: (st) => { nav.dataset.dark = st.isActive ? '1' : ''; nav.classList.toggle('is-dark', st.isActive || !menu.hidden); },
  }));
  const mbar = $('.mbar');
  ScrollTrigger.create({ trigger: '#kontakt', start: 'top 80%', end: 'max', onToggle: (st) => mbar.classList.toggle('is-hidden', st.isActive) });

  /* ---------- Bühne ---------- */
  const keys = $('.keys'), hA = $('.house__img--a'), hB = $('.house__img--b'), title = $('.stage__title'), tags = $$('.tag'), hint = $('.stage__hint');
  const hasB = A.img['house-exploded'];
  function tagSpots() {
    const m = isMobile();
    // Fliegen-Phase: Bogen ums Haus · Explosions-Phase: an den Etagen (unten Planung, oben Hausmeister)
    return {
      ring: m ? [[8, 20], [52, 26], [10, 62], [50, 68]] : [[54, 22], [74, 30], [56, 70], [76, 62]],
      floors: m ? [[6, 66], [6, 52], [6, 38], [6, 24]] : [[70, 70], [70, 56], [70, 42], [70, 28]],
    };
  }
  let stageP = 0;
  function renderStage(p) {
    stageP = p;
    const m = isMobile(), S = tagSpots();
    // Titel
    const tOut = seg(p, .1, .24);
    title.style.opacity = 1 - tOut; title.style.transform = `translateY(calc(${m ? 0 : -50}% - ${tOut * 80}px))`;
    title.style.pointerEvents = tOut > .5 ? 'none' : '';
    hint.style.opacity = 1 - seg(p, 0, .05);
    // Schlüssel: Drehen, Schrumpfen, Wegfliegen
    const k1 = seg(p, 0, .3);
    keys.style.transform = `translate(${-k1 * (m ? 30 : 34)}vw, calc(-50% - ${k1 * 6}vh)) rotate(${-k1 * 38}deg) scale(${1 - k1 * .55})`;
    keys.style.opacity = 1 - seg(p, .24, .34);
    keys.style.filter = `blur(${seg(p, .18, .32) * 6}px)`;
    // Haus
    const h1 = seg(p, .2, .4), hx = seg(p, .52, .72);
    if (!hA.classList.contains('is-missing')) {
      hA.style.opacity = h1 * (hasB ? 1 - hx : 1);
      hA.style.transform = `translate(-50%,-50%) scale(${.6 + h1 * .4 + hx * .04})`;
    }
    if (hasB) { hB.style.opacity = hx; hB.style.transform = `translate(-50%,-50%) scale(${.97 + hx * .07})`; }
    // Tags: aus dem Schlüssel → Ring → Etagen
    tags.forEach((t, i) => {
      const fly = seg(p, .16 + i * .035, .36 + i * .035), dock = seg(p, .56 + i * .02, .72 + i * .02);
      const sx = m ? 60 : 66, sy = m ? 28 : 46;
      const r = S.ring[i], f = S.floors[i];
      const ease = (x) => 1 - Math.pow(1 - x, 3);
      const e1 = ease(fly), e2 = ease(dock);
      const arc = Math.sin(e1 * Math.PI) * (i % 2 ? -10 : 10);
      let x = sx + (r[0] - sx) * e1, y = sy + (r[1] - sy) * e1 + arc;
      x += (f[0] - x) * e2; y += (f[1] - y) * e2;
      t.style.left = x + '%'; t.style.top = y + '%';
      t.style.opacity = seg(p, .14 + i * .035, .22 + i * .035);
      t.style.transform = `rotate(${(1 - e1) * (i % 2 ? 40 : -40) + (1 - e2) * (i % 2 ? -4 : 4) * e1}deg) scale(${.6 + e1 * .4})`;
      t.style.pointerEvents = fly > .9 ? 'auto' : 'none';
    });
    // Erzählung: Etagen nacheinander erklären
    if (!cardPinned) {
      const order = ['planung', 'bau', 'sanierung', 'hausmeister'];
      const k = p < .74 ? -1 : Math.min(3, Math.floor(seg(p, .74, .98) * 4));
      if (k < 0) { if (!card.hidden) hideCard(); } else showCard(order[k], false);
    }
  }
  ScrollTrigger.create({ trigger: '.stage', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: (st) => renderStage(st.progress), onLeave: () => { if (!cardPinned) hideCard(); } });
  renderStage(0);
  window.addEventListener('resize', () => renderStage(stageP));

  /* ---------- Laufband + Zähler ---------- */
  gsap.to('.band__row--a', { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.band__row--b', { xPercent: -30 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'bottom top', scrub: true } });
  $$('.counter b').forEach((b) => {
    const to = +b.dataset.to, from = +(b.dataset.from || 0), o = { v: from };
    gsap.to(o, { v: to, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: b, start: 'top 85%', once: true }, onUpdate: () => { b.textContent = Math.round(o.v); } });
  });

  /* ---------- Film ---------- */
  const fBefore = $('.film__beforewrap'), wipe = $('.film__wipe'), steps = $$('.film__steps li'), bar = $('.film__bar'), fb = $('.f-before'), fa = $('.f-after');
  let dragX = null, filmP = 0;
  function setWipe(x) { // x = Anteil vom linken Rand, der "Vorher" zeigt
    fBefore.style.clipPath = `inset(0 ${100 - x * 100}% 0 0)`; wipe.style.left = x * 100 + '%';
    wipe.setAttribute('aria-valuenow', Math.round(x * 100));
  }
  function renderFilm(p) {
    filmP = p;
    const hasV = fvDur > 0;
    let x;
    if (hasV) {
      const vp = seg(p, 0, .78);
      if (Math.abs(fv.currentTime - vp * fvDur) > .03) fv.currentTime = Math.min(fvDur - .05, vp * fvDur);
      x = 1 - seg(p, .8, .92) * .5; // Am Ende: Regler auf die Mitte → Vergleich
    } else x = 1 - seg(p, .08, .9);
    if (dragX !== null && p > .9) x = dragX;
    setWipe(x);
    wipe.style.opacity = hasV ? seg(p, .8, .86) : (p > .02 && p < .99 ? 1 : 0);
    const prog = Math.round(seg(p, .02, .9) * 100);
    bar.style.setProperty('--p', prog / 100); $('b', bar).textContent = prog + '%';
    steps.forEach((s, i) => s.classList.toggle('is-on', prog >= i * 20 + 5));
    const sw = seg(p, .45, .6); fb.style.opacity = 1 - sw; fa.style.opacity = sw;
    fb.style.transform = `translateY(${-sw * 30}px)`; fa.style.transform = `translateY(${(1 - sw) * 30}px)`;
  }
  if (!$('#vorher-nachher').classList.contains('is-missing')) {
    ScrollTrigger.create({ trigger: '.film', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: (st) => renderFilm(st.progress) });
    renderFilm(0);
    const media = $('.film__media');
    const move = (cx) => { const r = media.getBoundingClientRect(); dragX = clamp((cx - r.left) / r.width, .02, .98); setWipe(dragX); };
    wipe.addEventListener('pointerdown', (e) => { wipe.setPointerCapture(e.pointerId); move(e.clientX); const mv = (ev) => move(ev.clientX); wipe.addEventListener('pointermove', mv); wipe.addEventListener('pointerup', () => wipe.removeEventListener('pointermove', mv), { once: true }); });
    wipe.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { dragX = clamp((dragX ?? .5) + (e.key === 'ArrowLeft' ? -.05 : .05), .02, .98); setWipe(dragX); } });
  }

  /* ---------- Ablauf horizontal ---------- */
  const track = $('.flow__track'), panels = $$('.flow__panel'), fprog = $('.flow__progress i'), bpPhoto = $('.blueprint__photo');
  const flowTween = gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth), ease: 'none',
    scrollTrigger: {
      trigger: '.flow', pin: '.flow__pin', start: 'top top', end: () => '+=' + (track.scrollWidth - window.innerWidth) * 1.1, scrub: .6, invalidateOnRefresh: true,
      onUpdate: (st) => {
        fprog.style.transform = `scaleX(${st.progress})`;
        const n = panels.length - 1, pos = st.progress * n; // 1 = Panel „Plan“ zentriert
        const morph = seg(pos, .55, 1.25);
        if (bpPhoto) bpPhoto.style.clipPath = `inset(0 0 0 ${100 - morph * 100}%)`;
      },
    },
  });
  panels.forEach((pnl) => {
    gsap.from($('.flow__text', pnl), { y: 60, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: pnl, containerAnimation: flowTween, start: 'left 75%' } });
    gsap.fromTo($('.flow__img', pnl), { scale: .86, rotate: 2 }, { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: pnl, containerAnimation: flowTween, start: 'left right', end: 'center center', scrub: true } });
  });

  /* ---------- Uhr ---------- */
  const arc = $('.dial__arc'), tEl = $('.dial__time b'), dot = $('.dial__dot'), tasks = $$('.clock__tasks li'), dial = $('.dial');
  function renderClock(p) {
    const hours = 4 + p * 16; // 04:00 → 20:00
    const hh = Math.floor(hours), mm = Math.floor((hours - hh) * 60 / 5) * 5;
    tEl.textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    arc.style.strokeDashoffset = 1000 - (hours / 24) * 1000;
    const a = (hours / 24) * Math.PI * 2 - Math.PI / 2, R = dial.clientWidth / 2 * (186 / 200);
    dot.style.transform = `translate(${Math.cos(a) * R}px, ${Math.sin(a) * R}px)`;
    let on = 0; tasks.forEach((t, i) => { if (hours >= +t.dataset.at - .01) on = i; });
    tasks.forEach((t, i) => t.classList.toggle('is-on', i === on));
  }
  ScrollTrigger.create({ trigger: '.clock', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: (st) => renderClock(st.progress) });
  renderClock(0);

  /* ---------- Zitat, Werte ---------- */
  const words = $$('.quote__text .w');
  ScrollTrigger.create({ trigger: '.quote', start: 'top 80%', end: 'bottom 45%', scrub: true, onUpdate: (st) => { const n = Math.round(st.progress * words.length); words.forEach((w, i) => { w.style.opacity = i < n ? 1 : .12; }); } });
  gsap.from('.value', { y: 80, opacity: 0, stagger: .12, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.values', start: 'top 80%' } });

  /* ---------- Karriere ---------- */
  gsap.from('.jobs__words span', { yPercent: 110, opacity: 0, rotate: 4, stagger: .14, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: '.jobs', start: 'top 65%' } });
  gsap.fromTo('.jobs__media', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.jobs', start: 'top bottom', end: 'bottom top', scrub: true } });
  if (jv && jv.src) ScrollTrigger.create({ trigger: '.jobs', start: 'top bottom', end: 'bottom top', onToggle: (st) => (st.isActive ? jv.play().catch(() => {}) : jv.pause()) });

  /* ---------- Bewertungen: Sterne füllen ---------- */
  $$('.stars i').forEach((s, i) => gsap.to(s, { '--f': '100%', duration: .5, delay: i * .12, ease: 'power2.out', scrollTrigger: { trigger: '.reviews', start: 'top 70%', once: true } }));

  /* ---------- Kontakt-Kacheln ---------- */
  gsap.from('.pick', { y: 70, opacity: 0, stagger: .1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.picks', start: 'top 85%' } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
