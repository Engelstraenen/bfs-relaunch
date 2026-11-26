#!/usr/bin/env python3
"""Einmal-Patch 26.11.2026: Umschalter Privat (Wohnanlage) / Gewerblich (Firmenanlage) in main.js."""
p = 'site/main.js'; s = open(p).read()
a = s.index('  /* Lage der Etagen im Schnitt-Bild'); b = s.index('  /* ---------- Medien: fehlende Bilder ausblenden')
s = s[:a] + r'''  /* ---------- Objektart: Privat (Wohnanlage) / Gewerblich (Firmenanlage) ----------
     Je Objektart eigenes Schnitt-Bild, eigene Etagen-Lage (Anteile der 16:9-Fläche, nach dem Bild vermessen)
     und eigene Hausmeister-Aufgaben. */
  const MODES = window.MODES || {
    wohn: {
      cut: 'w1-schnitt', facade: 'w2-fassade', intro: 'Die ganze Wohnanlage. Vom Keller bis zum Dach.', crumb: 'Hausmeister · Wohnanlage',
      floors: { dach: { x: .305, y: .06, w: .40, h: .19 }, og: { x: .302, y: .27, w: .404, h: .20 }, eg: { x: .302, y: .48, w: .404, h: .22 }, keller: { x: .302, y: .71, w: .404, h: .20 }, aussen: { x: .125, y: .53, w: .165, h: .31 } },
      bld: { x: .11, y: .04, w: .63, h: .89 },
      names: { keller: 'Keller', eg: 'Eingang & Treppenhaus', og: 'Wohnetagen', dach: 'Dach', aussen: 'Außenanlage' },
      short: { keller: 'Keller', eg: 'Eingang', og: 'Wohnetagen', dach: 'Dach', aussen: 'Außen' },
      cards: {
        keller: ['Haustechnik im Blick.', ['Heizung kontrollieren: Druck, Störungen', 'Zählerstände ablesen und dokumentieren', 'Waschküche, Fahrrad- und Kellerräume in Ordnung', 'Sperrmüll und Gerümpel entsorgen'], 'Ein Leitungswasserschaden kostet im Schnitt über 4.600 € (GDV 2025). Wer regelmäßig nachsieht, entdeckt ihn früher.'],
        eg: ['Der erste Eindruck stimmt.', ['Treppenhausreinigung, Eingang sauber und sicher', 'Briefkasten-, Klingel- und Schließanlage', 'Beleuchtung prüfen, Leuchtmittel tauschen', 'Aufzug kontrollieren, Störungen melden']],
        og: ['Ansprechpartner für die Mieter.', ['Kleine Reparaturen: Schlösser, Dichtungen, Türschließer', 'Brandschutz-Kontrollgang: Fluchtwege frei', 'Handwerker in Wohnungen einlassen und begleiten', 'Schäden mit Foto an die Hausverwaltung melden']],
        dach: ['Dicht, bevor es regnet.', ['Dachrinnen und Fallrohre reinigen', 'Sichtkontrolle nach Sturm und Unwetter', 'Dachausstieg und Dachboden kontrollieren', 'Schäden sofort melden, bevor Wasser eindringt']],
        aussen: ['Draußen gepflegt, im Winter sicher.', ['Winterdienst: räumen, streuen, mit Protokoll', 'Grünpflege: Rasen, Hecken, Laub', 'Müllplatz sauber, Tonnen raus und rein', 'Spielplatz, Wege und Parkplätze kontrollieren']]
      }
    },
    firma: {
      cut: 'f1-schnitt', facade: 'f2-fassade', intro: 'Die ganze Firmenanlage. Vom Technikraum bis zum Dach.', crumb: 'Hausmeister · Firmenanlage',
      floors: { dach: { x: .305, y: .06, w: .40, h: .19 }, og: { x: .302, y: .27, w: .404, h: .20 }, eg: { x: .302, y: .48, w: .404, h: .22 }, keller: { x: .302, y: .71, w: .404, h: .20 }, aussen: { x: .125, y: .53, w: .165, h: .31 } },
      bld: { x: .11, y: .04, w: .63, h: .89 },
      names: { keller: 'Technikräume', eg: 'Empfang & Eingang', og: 'Büroetagen', dach: 'Dach & Anlagen', aussen: 'Parkplatz & Gelände' },
      short: { keller: 'Technik', eg: 'Empfang', og: 'Büros', dach: 'Dach', aussen: 'Gelände' },
      cards: {
        keller: ['Technik läuft, bevor jemand fragt.', ['Funktionskontrolle Heizung, Lüftung und Klima', 'Zählerstände ablesen und dokumentieren', 'Wartungstermine der Fachfirmen begleiten', 'Technikräume frei und ordentlich halten']],
        eg: ['Jeden Morgen startklar.', ['Schließdienst: auf- und abschließen, Schlüsselverwaltung', 'Eingang, Türen und Automatiktüren prüfen', 'Beleuchtung und Aufzug kontrollieren', 'Ansprechpartner vor Ort für Mitarbeiter und Besucher']],
        og: ['Kleine Störungen, schnell behoben.', ['Kleine Reparaturen und Leuchtmittelwechsel', 'Möbel aufbauen, Büros umräumen', 'Brandschutz-Kontrollgang: Fluchtwege, Feuerlöscher-Standorte', 'Handwerker und Prüfdienste begleiten']],
        dach: ['Dach und Anlagen im Blick.', ['Dachrinnen und Lichtkuppeln reinigen', 'Sichtkontrolle von Klima- und Solaranlagen', 'Kontrolle nach Sturm und Unwetter', 'Schäden sofort melden']],
        aussen: ['Gelände sicher, Zufahrt frei.', ['Winterdienst für Parkplätze und Zufahrten, mit Protokoll', 'Grünflächen und Hecken pflegen', 'Müll- und Wertstoffcontainer im Blick', 'Schranke, Tore und Anlieferzone kontrollieren']]
      }
    }
  };
  const qMode = new URLSearchParams(location.search).get('anlage');
  let mode = qMode === 'firma' || qMode === 'gewerblich' ? 'firma' : 'wohn';
  try { if (!qMode && localStorage.getItem('bfs-anlage') === 'firma') mode = 'firma'; } catch (_) {}
  let FLOORS = MODES[mode].floors;
  let SHORT = MODES[mode].short;

''' + s[b:]

s = s.replace('  /* ---------- Etagen-Labels + Hervorhebung ---------- */', '''  /* ---------- Hausmeister-Karten je Objektart ---------- */
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  function renderCards() {
    const M = MODES[mode];
    ['keller', 'eg', 'og', 'dach', 'aussen'].forEach(k => {
      const el = $('#c-' + k); if (!el) return; const [h, li, note] = M.cards[k];
      el.setAttribute('aria-labelledby', 't-' + k);
      el.innerHTML = `<p class="crumb">${M.crumb} · <b>${M.names[k]}</b></p><h2 id="t-${k}">${esc(h)}</h2><ul class="ticks">${li.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` +
        (note ? `<p class="hm-note">${esc(note)}</p>` : '') + (k === 'aussen' ? '<a class="more" href="hausmeister.html">Alle Hausmeister-Leistungen <span class="arrow">→</span></a>' : '');
    });
    const ih = $('#introH'); if (ih) ih.textContent = M.intro;
    $$('.lab').forEach(l => { const k = l.dataset.f; l.querySelector('b').textContent = innerWidth < 700 ? M.short[k] : M.names[k]; });
  }
  function setImgs() {
    const M = MODES[mode];
    [['.house .cut', M.cut], ['.house .facade', M.facade]].forEach(([sel, name]) => { const im = $(sel); if (!im) return; im.dataset.img = name; const s = srcFor(name); if (!s) { im.hidden = true; return; } im.hidden = false; im.srcset = s.srcset; im.src = s.src; });
  }
  renderCards();

  /* ---------- Etagen-Labels + Hervorhebung ---------- */''')
s = s.replace("      if (narrow) l.querySelector('b').textContent = SHORT[l.dataset.f];\n", "")
s = s.replace("  const hasCut = !!A.img['s1-schnitt'];", "  const hasCut = !!A.img[MODES[mode].cut];")
s = s.replace("  const BLD = { x: .11, y: .04, w: .63, h: .89 }; // ganzes Gebäude inkl. Außenanlage", "  let BLD = MODES[mode].bld; // ganzes Gebäude inkl. Außenanlage")
s = s.replace("  const hlTo = (r, t, d = .03) => tl.to(hl, { left: r.x * 100 + '%', top: r.y * 100 + '%', width: r.w * 100 + '%', height: r.h * 100 + '%', opacity: 1, duration: d }, t);",
              "  const R = k => k === 'bld' ? BLD : FLOORS[k];\n  const hlTo = (k, t, d = .03) => tl.to(hl, { left: () => R(k).x * 100 + '%', top: () => R(k).y * 100 + '%', width: () => R(k).w * 100 + '%', height: () => R(k).h * 100 + '%', opacity: 1, duration: d }, t);")
for x, y in [("hlTo(FLOORS.eg, t + .1, .02);", "hlTo('eg', t + .1, .02);"), ("hlTo(FLOORS.og, t + .01);", "hlTo('og', t + .01);"), ("hlTo(BLD, t + .01);", "hlTo('bld', t + .01);")]:
    assert x in s, x; s = s.replace(x, y)
s = s.replace("  drawCoord();\n\n  /* Anker", """  drawCoord();

  /* Umschalter Privat / Gewerblich: Bild, Etagen, Aufgaben tauschen, Fahrt neu berechnen */
  function setMode(m) {
    if (m === mode || !MODES[m]) return; mode = m;
    try { localStorage.setItem('bfs-anlage', m); } catch (_) {}
    $$('.seg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
    house.classList.add('swap');
    setTimeout(() => {
      FLOORS = MODES[m].floors; SHORT = MODES[m].short; BLD = MODES[m].bld;
      setImgs(); renderCards(); placeLabels();
      const p = st.progress; tl.invalidate(); ScrollTrigger.refresh(); tl.progress(p);
      house.classList.remove('swap');
    }, 300);
  }
  $$('.seg button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $$('.seg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));

  /* Anker""", 1)
assert 'function setMode' in s and 'renderCards();' in s
open(p, 'w').write(s)
print('ok')
