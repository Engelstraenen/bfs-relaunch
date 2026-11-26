#!/usr/bin/env python3
"""Erzeugt die Leistungs-Unterseiten (W1, weiß). Inhalte aus der alten BFS-Seite, ausgebaut."""
import os
OUT = 'site'
HEAD = '''<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{title} · BAU Facility Services</title><meta name="description" content="{desc}"><link rel="icon" href="assets/logo.svg"><link rel="stylesheet" href="styles.css"><script src="assets/manifest.js"></script></head><body>
<header class="nav"><a class="nav__logo" href="index.html" aria-label="Zur Startseite"><img src="assets/logo.svg" alt="BAU Facility Services" width="170" height="61"></a><a class="btn btn--ghost btn--sm" href="index.html#{anchor}" style="margin-left:auto">← Zurück ins Haus</a></header>
<main class="sub">
<a class="back" href="index.html#{anchor}">← Zurück zu „{floor}“</a>
<div class="sub__hero"><div style="display:grid;gap:16px"><p class="eyebrow">{floor}</p><h1>{h1}</h1><p class="lead">{lead}</p><div class="row"><a class="btn btn--or" href="#kontakt">Anfrage stellen</a></div></div><img data-img="{img}" alt="{alt}"></div>
'''
FOOT = '''<nav class="subnav" aria-label="Weitere Leistungen">{links}</nav>
</main>
<section class="contact" id="kontakt"><div style="display:grid;gap:14px;align-content:start"><p class="eyebrow">Kontakt</p><h2>Sprechen Sie uns an.</h2><p class="lead">Persönlich, zuverlässig und unkompliziert.</p></div><p style="font-size:18px;line-height:1.7"><a href="tel:+4917623815829">+49 176 23815829</a><br><a href="mailto:info@baufacilityservices.de">info@baufacilityservices.de</a><br>Alter Kirchweg 9, 40880 Ratingen</p></section>
<footer class="foot"><img src="assets/logo-w.svg" alt="BAU Facility Services" width="200" height="72"><nav aria-label="Seiten"><a href="index.html">Start</a><a href="impressum.html">Impressum</a><a href="datenschutz.html">Datenschutz</a></nav><small>© 2026 BAU Facility Services GmbH i. G. · Ratingen</small></footer>
<script src="sub.js"></script></body></html>
'''
PAGES = [
 ('hausmeister', 'Hausmeister-Leistungen', 'keller', 'Vom Keller bis zum Dach', 'Damit im Hintergrund alles reibungslos läuft.',
  'Wir kümmern uns um die laufende Betreuung Ihrer Immobilie und sorgen dafür, dass Gebäude und Außenbereiche gepflegt bleiben. Mit festen Rundgängen, einem festen Ansprechpartner und dokumentierten Einsätzen.', 'k1-keller', 'Techniker prüft die Heizung im Keller',
  '''<h2>Was wir übernehmen</h2><div class="grid3">
<article class="card"><h3>Kontrolle & Haustechnik</h3><ul><li>Kontrollgänge: Gebäude und Außenanlage</li><li>Funktionskontrolle Heizung, Aufzug, Beleuchtung</li><li>Zählerstände ablesen</li><li>Brandschutz: Fluchtwege frei, Türen schließen</li><li>Schäden mit Foto an die Verwaltung melden</li></ul></article>
<article class="card"><h3>Gebäude & Treppenhaus</h3><ul><li>Treppenhaus- und Gebäudereinigung</li><li>Schließdienst: Türen, Schlüssel, Schließanlage</li><li>Kleine Reparaturen: Schlösser, Dichtungen, Leuchtmittel</li><li>Keller- und Müllräume, Sperrmüll entsorgen</li><li>Handwerker einlassen und begleiten</li></ul></article>
<article class="card"><h3>Dach & Außenanlagen</h3><ul><li>Dachrinnen und Fallrohre reinigen</li><li>Gartenpflege: Rasen, Hecken, Laub</li><li>Müllservice: Tonnen raus- und reinstellen</li><li>Winterdienst mit Protokoll</li><li>Parkplätze und Tiefgarage kontrollieren</li></ul></article></div>
<h2>Warum regelmäßige Kontrollgänge sich lohnen</h2><div class="grid3">
<article class="card"><span class="n" data-count="4600" data-prefix="über " data-suffix=" €">0</span><p>kostet ein Leitungswasserschaden im Schnitt (2025, +7,5 % zum Vorjahr).</p></article>
<article class="card"><span class="n">1,07 Mio.</span><p>Leitungswasserschäden wurden 2025 in der Wohngebäudeversicherung gemeldet, rund 2 pro Minute.</p></article>
<article class="card"><span class="n">rund 50 %</span><p>des Schadenaufwands in der Wohngebäudeversicherung gehen über 20 Jahre betrachtet auf Leitungswasser zurück.</p></article></div>
<p class="note" style="margin-top:14px">Quelle: Gesamtverband der Deutschen Versicherungswirtschaft (GDV), Mitteilung November 2026.</p>
<h2>Häufige Fragen</h2>
<details><summary>Wie oft kommt der Hausmeister?</summary><p>Das legen wir mit Ihnen je Objekt fest, zum Beispiel wöchentlich oder zweiwöchentlich, im Winter nach Wetterlage.</p></details>
<details><summary>Haben wir einen festen Ansprechpartner?</summary><p>Ja. Ein fester Ansprechpartner kennt Ihr Objekt und hält Sie auf dem Laufenden.</p></details>'''),
 ('bau-umbau', 'Bau & Umbau', 'umbau', 'Zusatzleistung · Bau & Umbau', 'Aus Räumen Chancen machen.',
  'Ob neue Raumaufteilung, Modernisierung oder umfangreicher Umbau: Wir setzen Ihre Vorstellungen fachgerecht und zuverlässig um, mit passenden Fachbetrieben und einem Ansprechpartner.', 'e2-eg-nachher', 'Umgebauter heller Wohnraum',
  '''<h2>Typische Umbauten</h2><div class="grid3">
<article class="card"><h3>Grundriss ändern</h3><p>Wände versetzen oder öffnen, aus Büro wird Wohnung, aus zwei Räumen einer.</p></article>
<article class="card"><h3>Modernisieren</h3><p>Böden, Türen, Elektro, Licht und Oberflächen auf den heutigen Stand bringen.</p></article>
<article class="card"><h3>Ausbau</h3><p>Trockenbau, Dachausbau, neue Nutzungen für bestehende Flächen.</p></article></div>
<h2>So läuft ein Umbau</h2><ol class="timeline"><li><b>Besichtigung</b><p>Wir sehen uns Raum und Ziel vor Ort an.</p></li><li><b>Planung</b><p>Ablauf, Gewerke, Termine und Kosten klar festgelegt.</p></li><li><b>Umsetzung</b><p>Koordiniert, sauber, termintreu.</p></li><li><b>Übergabe</b><p>Gemeinsame Abnahme, danach auf Wunsch laufende Betreuung.</p></li></ol>'''),
 ('sanierung', 'Sanierung & Renovierung', 'sanierung', 'Zusatzleistung · Sanierung & Renovierung', 'Für Immobilien mit Zukunft.',
  'Wir bringen Immobilien wieder in Bestform und schaffen moderne, funktionale Räume, die langfristig ihren Wert behalten. Vom einzelnen Bad bis zur kompletten Wohnung.', 'o3-bad-ergebnis', 'Renoviertes Bad',
  '''<h2>Leistungen</h2><div class="grid3">
<article class="card"><h3>Bad & Sanitär</h3><p>Komplettsanierung mit Fliesen, Sanitär und Elektro aus einer Hand.</p></article>
<article class="card"><h3>Wohnungen</h3><p>Renovierung bei Mieterwechsel: Wände, Böden, Türen, Licht.</p></article>
<article class="card"><h3>Schäden beheben</h3><p>Nach Wasser- oder Feuchteschäden: trocknen, instand setzen, dokumentieren.</p></article></div>
<h2>Vorher · Arbeit · Ergebnis</h2><div class="grid3"><img data-img="o1-bad-vorher" alt="Vorher" style="border-radius:14px;aspect-ratio:4/3;object-fit:cover;width:100%"><img data-img="o2-bad-arbeit" alt="Arbeit" style="border-radius:14px;aspect-ratio:4/3;object-fit:cover;width:100%"><img data-img="o3-bad-ergebnis" alt="Ergebnis" style="border-radius:14px;aspect-ratio:4/3;object-fit:cover;width:100%"></div>'''),
 ('planung', 'Planung & Organisation', 'planung', 'Zusatzleistung · Planung & Organisation', 'Strukturiert. Wirtschaftlich. Verlässlich.',
  'Wir planen Ihr Projekt von Anfang an strukturiert und sorgen für klare Abläufe, verlässliche Termine und eine effiziente Umsetzung.', 'd1-dach', 'Planer mit Grundrissen',
  '''<h2>Vier Phasen</h2><ol class="timeline"><li><b>Analyse</b><p>Bestand erfassen, Bedarf und Budget klären.</p></li><li><b>Konzeption</b><p>Lösung entwickeln, Gewerke und Termine planen.</p></li><li><b>Umsetzung</b><p>Arbeiten koordinieren, Qualität sichern.</p></li><li><b>Übergabe</b><p>Abnahme und Übergabe in die laufende Betreuung.</p></li></ol>
<h2>Was Sie bekommen</h2><div class="grid3"><article class="card"><h3>Klarer Zeitplan</h3><p>Wann welches Gewerk wo arbeitet.</p></article><article class="card"><h3>Ein Budget</h3><p>Alle Leistungen in einem Rahmen.</p></article><article class="card"><h3>Ein Ansprechpartner</h3><p>Für alle Fragen, vom Start bis zur Übergabe.</p></article></div>'''),
 ('koordination', 'Koordination & Durchführung', 'koordination', 'Koordination & Durchführung', 'Ein Ansprechpartner. Alle Gewerke.',
  'Wir koordinieren alle beteiligten Gewerke und begleiten die Arbeiten zuverlässig bis zur erfolgreichen Fertigstellung. Für Sie heißt das: klare Zuständigkeiten und kurze Wege.', 'a1-ansprechpartner', 'Ihr fester Ansprechpartner (Symbolbild)',
  '''<h2>Wir bündeln</h2><div class="grid3"><article class="card"><h3>Gewerke</h3><p>Sanitär, Elektro, Maler, Trockenbau, Fliesen, Boden, Garten: abgestimmt in einem Plan.</p></article><article class="card"><h3>Partner</h3><p>Ausgewählte Fachbetriebe, passend zu Ihrem Projekt.</p></article><article class="card"><h3>Überblick</h3><p>Sie bekommen Termine und Fortschritt von einer Stelle.</p></article></div>'''),
]
links = ''.join(f'<a class="btn btn--ghost btn--sm" href="{p[0]}.html">{p[1]}</a>' for p in PAGES)
for slug, title, anchor, floor, h1, lead, img, alt, body in PAGES:
    html = HEAD.format(title=title, desc=f'{title} von BAU Facility Services in Ratingen. {h1}', anchor=anchor, floor=floor, h1=h1, lead=lead, img=img, alt=alt) + body + FOOT.format(links=links)
    open(os.path.join(OUT, slug + '.html'), 'w').write(html)
print('ok', len(PAGES))
