#!/usr/bin/env python3
"""Patch 26.11.2026 (2): Haus-Fahrt als reine Funktion des Scroll-Fortschritts (kein GSAP-Timeline-Zustand mehr,
damit beim Umschalten Privat/Gewerblich und beim Größenwechsel nichts hängen bleibt), Zusatzleistungen raus aus der
Bühne (eigene Seite), Hausmeister-Karten mit Foto."""
import re
P = 'site/'

# ---------------- index.html ----------------
s = open(P + 'index.html').read()
a = s.index('    <div class="bridge" id="bridge"'); b = s.index('    <!-- Koordination -->')
s = s[:a] + s[b:]
a = s.index('    <article class="sc sc--coord" id="contactCard"'); b = s.index('    </div>\n  </div>\n</section>\n<span id="keller"')
s = s[:a] + '''    <article class="sc sc--coord" id="contactCard" aria-labelledby="t-coord">
      <img data-img="a1-ansprechpartner" alt="Ihr fester Ansprechpartner bei BAU Facility Services (Symbolbild)">
      <p class="crumb">Ein Objekt · ein Ansprechpartner</p>
      <h2 id="t-coord">Ein fester Ansprechpartner für Ihre Anlage.</h2>
      <p class="lead">Ihr Hausmeister kennt jede Etage. Sie haben eine Nummer für alles, mit Foto-Protokoll nach jedem Einsatz.</p>
      <div class="row"><a class="more" href="#kontakt">Hausmeister anfragen <span class="arrow">→</span></a><a class="more" href="zusatzleistungen.html">Zusatzleistungen <span class="arrow">→</span></a></div>
    </article>
''' + s[b:]
s = s.replace('<span id="keller" class="sr"></span><span id="eg" class="sr"></span><span id="og" class="sr"></span><span id="dach" class="sr"></span><span id="aussen" class="sr"></span><span id="umbau" class="sr"></span><span id="sanierung" class="sr"></span><span id="planung" class="sr"></span><span id="koordination" class="sr"></span>',
              '<span id="keller" class="sr"></span><span id="eg" class="sr"></span><span id="og" class="sr"></span><span id="dach" class="sr"></span><span id="aussen" class="sr"></span><span id="koordination" class="sr"></span>')
# Teaser Zusatzleistungen direkt nach der Bühne
s = s.replace('<!-- 8 · AUSSEN / TEAM -->', '''<!-- ZUSATZLEISTUNGEN (Teaser, eigene Seite) -->
<section class="zteaser" id="zusatz" aria-labelledby="zt-h">
  <div class="zteaser__head">
    <p class="eyebrow">Zusätzlich zum Hausmeisterdienst</p>
    <h2 id="zt-h">Wenn mehr ansteht als der Hausmeister.</h2>
    <p class="lead">Umbau, Sanierung, Planung und die Koordination aller Gewerke übernehmen unsere Bauteams und Fachbetriebe. Alles erklärt, mit Vorher und Nachher.</p>
  </div>
  <div class="zteaser__grid">
    <a class="ztile" href="zusatzleistungen.html#umbau"><img data-img="e2-eg-nachher" alt="Umgebauter, heller Wohnraum" loading="lazy"><span>Bau & Umbau</span></a>
    <a class="ztile" href="zusatzleistungen.html#sanierung"><img data-img="o3-bad-ergebnis" alt="Saniertes Bad" loading="lazy"><span>Sanierung & Renovierung</span></a>
    <a class="ztile" href="zusatzleistungen.html#planung"><img data-img="d1-dach" alt="Projektleiter plant mit Grundrissen" loading="lazy"><span>Planung & Organisation</span></a>
    <a class="ztile ztile--svg" href="zusatzleistungen.html#koordination"><svg viewBox="0 0 200 120" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M100 60 40 22M100 60 160 22M100 60 30 78M100 60 170 78M100 60 72 108M100 60 128 108"/></g><g fill="currentColor"><circle cx="40" cy="22" r="6"/><circle cx="160" cy="22" r="6"/><circle cx="30" cy="78" r="6"/><circle cx="170" cy="78" r="6"/><circle cx="72" cy="108" r="6"/><circle cx="128" cy="108" r="6"/></g><circle cx="100" cy="60" r="14" fill="#9d7a42"/></svg><span>Koordination & Durchführung</span></a>
  </div>
  <a class="btn btn--or" href="zusatzleistungen.html">Alle Zusatzleistungen ansehen <span class="arrow">→</span></a>
</section>

<!-- 8 · AUSSEN / TEAM -->''', 1)
s = s.replace('<li><a href="#umbau">Zusatzleistungen</a></li>', '<li><a href="zusatzleistungen.html">Zusatzleistungen</a></li>')
s = s.replace('<a href="#umbau">Zusätzlich: Bau & Umbau</a><a href="#sanierung">Zusätzlich: Sanierung & Renovierung</a><a href="#planung">Zusätzlich: Planung & Organisation</a><a href="#koordination">Koordination & Ansprechpartner</a>',
              '<a href="#koordination">Ihr Ansprechpartner</a><a href="zusatzleistungen.html">Zusatzleistungen: Bau, Sanierung, Planung</a>')
open(P + 'index.html', 'w').write(s)

# ---------------- main.js ----------------
m = open(P + 'main.js').read()
# Vorher/Nachher + Schritte nur, wenn vorhanden (stehen jetzt auf zusatzleistungen.html)
a = m.index('  /* ---------- Vorher/Nachher ---------- */'); b = m.index('  /* ---------- Bewertungen (Beispiele) ---------- */')
m = m[:a] + m[b:]
# Karten mit Foto
m = m.replace("      el.innerHTML = `<p class=\"crumb\">",
              "      const ph = M.photos && M.photos[k] && srcFor(M.photos[k][0]);\n      el.innerHTML = (ph ? `<div class=\"sc__media\"><img src=\"${ph.src}\" srcset=\"${ph.srcset}\" sizes=\"(max-width:700px) 92vw, 480px\" alt=\"${esc(M.photos[k][1])}\" decoding=\"async\"></div>` : '') + `<p class=\"crumb\">")
m = m.replace("      cut: 'w1-schnitt', facade: 'w2-fassade',",
              "      cut: 'w1-schnitt', facade: 'w2-fassade',\n      photos: { keller: ['hk1', 'Hausmeister liest im Kellerraum die Zähler ab'], eg: ['hk2', 'Hausmeister reinigt den Eingangsbereich mit Briefkastenanlage'], og: ['hk3', 'Hausmeister stellt einen Türschließer im Treppenhaus ein'], dach: ['hk4', 'Hausmeister mit Absturzsicherung reinigt die Dachrinne'], aussen: ['hk5', 'Hausmeister räumt und streut den Weg vor dem Eingang'] },")
m = m.replace("      cut: 'f1-schnitt', facade: 'f2-fassade',",
              "      cut: 'f1-schnitt', facade: 'f2-fassade',\n      photos: { keller: ['hf1', 'Hausmeister prüft die Lüftungsanlage im Technikraum'], eg: ['hf2', 'Hausmeister schließt morgens den Eingang des Bürogebäudes auf'], og: ['hf3', 'Hausmeister tauscht eine Deckenleuchte im Büro'], dach: ['hf4', 'Hausmeister prüft die Klimaanlagen auf dem Dach'], aussen: ['hf5', 'Hausmeister räumt den Firmenparkplatz mit der Schneefräse'] },")
# Fahrt neu
a = m.index("  const C = fn => ({ x: () => fn().x"); b = m.index("  /* Linien von jeder Etage zum Ansprechpartner (live gemessen) */")
ride = r'''  const introX = () => innerWidth > 1020 ? stage.offsetWidth * .15 : 0;
  const introS = () => innerWidth > 1020 ? .74 : .8;
  const LEN = mob ? 9000 : 11000;
  /* Die ganze Fahrt ist eine reine Funktion des Fortschritts p (0..1): kein gespeicherter Animations-Zustand,
     darum kann nichts hängen bleiben (Umschalten, Größenwechsel, Zurückscrollen). */
  const clamp = v => Math.max(0, Math.min(1, v));
  const ramp = (p, a, b) => clamp((p - a) / (b - a));
  const ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  const lerp = (a, b, k) => a + (b - a) * k;
  const RIDE = ['keller', 'eg', 'og', 'dach', 'aussen'];
  // Zeitplan: [Kamera-Start, Kamera-Ende] je Station, Karte sichtbar danach bis zur nächsten Fahrt
  const T = { facade: [0, .08], labels: [.06, .10], zoom: [.12, .18], ride: { eg: [.27, .32], og: [.41, .46], dach: [.55, .60], aussen: [.69, .74] }, out: [.83, .89], coord: [.88, .96] };
  const CARDS = { keller: [.17, .27], eg: [.31, .41], og: [.45, .55], dach: [.59, .69], aussen: [.73, .83] };
  const at = { keller: .22, eg: .36, og: .50, dach: .64, aussen: .78, koordination: .95 }; window.__at = at;
  const introCam = p => ({ x: introX(), y: 0, scale: introS() + .04 * ramp(p, 0, .08) });
  function camAt(p) {
    if (p < T.zoom[0]) return introCam(p);
    const mix = (A, B, k) => ({ x: lerp(A.x, B.x, k), y: lerp(A.y, B.y, k), scale: lerp(A.scale, B.scale, k) });
    if (p < T.zoom[1]) return mix(introCam(p), camFloor('keller'), ease(ramp(p, T.zoom[0], T.zoom[1])));
    let cur = camFloor('keller');
    for (const k of ['eg', 'og', 'dach', 'aussen']) {
      const [a, b] = T.ride[k];
      if (p < a) return cur;
      const nxt = camFloor(k);
      if (p < b) return mix(cur, nxt, ease(ramp(p, a, b)));
      cur = nxt;
    }
    if (p < T.out[0]) return cur;
    return mix(cur, camAll(), ease(ramp(p, T.out[0], T.out[1])));
  }
  const cardEls = Object.fromEntries(Object.keys(CARDS).map(k => [k, $('#c-' + k)]));
  const coordCard = $('#contactCard'), coordEl = $('#coord'), introEl = $('#intro'), labelsEl = $('#labels'), facadeEl = $('#house .facade');
  function show(el, a, b, p, fade = .015) {
    if (!el) return;
    const o = Math.min(ramp(p, a, a + fade), 1 - ramp(p, b - fade, b));
    const y = p < a + fade ? 24 * (1 - ramp(p, a, a + fade)) : -16 * ramp(p, b - fade, b);
    el.style.opacity = o; el.style.visibility = o > .01 ? 'visible' : 'hidden'; el.style.transform = `translateY(${y}px)`;
  }
  function render(p) {
    const c = camAt(p);
    house.style.transform = `translate(-50%,-50%) translate(${c.x}px,${c.y}px) scale(${c.scale})`;
    if (facadeEl) facadeEl.style.clipPath = `inset(${ramp(p, T.facade[0], T.facade[1]) * 100}% 0 0 0)`;
    const lab = Math.min(ramp(p, T.labels[0], T.labels[1]), 1 - ramp(p, T.zoom[0], T.zoom[0] + .03));
    labelsEl.style.opacity = lab; labelsEl.style.visibility = lab > .01 ? 'visible' : 'hidden';
    $$('.lab').forEach(l => l.style.opacity = 1);
    $$('.lab i').forEach(i => i.style.transform = `scaleX(${ramp(p, T.labels[0], T.labels[1])})`);
    const io = 1 - ramp(p, T.zoom[0], T.zoom[0] + .03);
    introEl.style.opacity = io; introEl.style.transform = `translateY(${-20 * (1 - io)}px)`; introEl.style.visibility = io > .01 ? 'visible' : 'hidden';
    for (const k in CARDS) show(cardEls[k], CARDS[k][0], CARDS[k][1], p);
    show(coordCard, T.coord[0], 2, p, .02);
    const co = ramp(p, T.coord[0], T.coord[0] + .02); coordEl.style.opacity = co;
    const paths = $$('#coordSvg path');
    paths.forEach((pa, i) => pa.style.strokeDashoffset = 1 - ramp(p, T.coord[0] + .01 + i * .008, T.coord[0] + .05 + i * .008));
    if (p > T.out[0]) drawCoord();
  }
  hl.style.opacity = 0;
  const st = ScrollTrigger.create({ trigger: '#haus', start: 'top top', end: '+=' + LEN, pin: '#stage', anticipatePin: 1,
    onUpdate: s => render(s.progress), onRefresh: s => render(s.progress) });
  render(0);

'''
m = m[:a] + ride + m[b:]
# alte Reste entfernen
m = m.replace("  gsap.set(house, { xPercent: -50, yPercent: -50, x: introX(), y: 0, scale: introS() });\n", "")
m = re.sub(r"  const introX = \(\) => innerWidth > 1020 \? stage\.offsetWidth \* \.15 : 0;\n  const introS = \(\) => innerWidth > 1020 \? \.74 : \.8;\n(?=  /\* Die ganze Fahrt)", "", m)
# Umschalten: nur Daten tauschen und neu zeichnen
a = m.index("    setTimeout(() => {\n      FLOORS = MODES[m].floors;"); b = m.index("    }, 300);\n  }", a)
m = m[:a] + """    setTimeout(() => {
      FLOORS = MODES[m].floors; SHORT = MODES[m].short; BLD = MODES[m].bld;
      setImgs(); renderCards(); placeLabels(); render(st.progress); drawCoord();
      house.classList.remove('swap');
""" + m[b:]
m = m.replace("addEventListener('load', () => { placeLabels(); ScrollTrigger.refresh(); });", "addEventListener('load', () => { placeLabels(); ScrollTrigger.refresh(); render(st.progress); });\n  addEventListener('resize', () => render(st.progress));")
open(P + 'main.js', 'w').write(m)

# ---------------- styles.css ----------------
c = open(P + 'styles.css').read()
c = c.replace('.sc--svc{width:min(560px,44vw)}', '.sc--hm{width:min(480px,38vw)}\n.sc--hm .sc__media{aspect-ratio:16/9}')
c += '''
/* Teaser Zusatzleistungen */
.zteaser{padding:clamp(70px,9vw,130px) var(--pad);display:grid;gap:clamp(24px,3vw,40px);justify-items:start}
.zteaser__head{display:grid;gap:14px;max-width:760px}
.zteaser__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;width:100%}
.ztile{position:relative;display:block;aspect-ratio:4/5;border-radius:var(--r);overflow:hidden;background:var(--bg2);text-decoration:none;color:#fff}
.ztile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .6s}
.ztile:hover img{transform:scale(1.05)}
.ztile::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(27,42,73,.85))}
.ztile span{position:absolute;left:18px;right:18px;bottom:16px;z-index:2;font:700 20px/1.15 var(--f-d)}
.ztile--svg{background:var(--ink);color:#fff}.ztile--svg svg{position:absolute;inset:18% 10% auto;width:80%;color:rgba(255,255,255,.55)}
@media (max-width:1020px){.zteaser__grid{grid-template-columns:1fr 1fr}}
@media (max-width:700px){.sc--hm .sc__media{aspect-ratio:21/9}.ztile{aspect-ratio:1}.ztile span{font-size:17px}}
@media (max-height:500px) and (orientation:landscape){.sc--hm .sc__media{display:none}}
'''
open(P + 'styles.css', 'w').write(c)
print('ok')
