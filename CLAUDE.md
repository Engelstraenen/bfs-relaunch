# PROJEKT-MASTERFILE – HAUSWERK
Gilt zusätzlich zur globalen Masterfile (~/.claude/CLAUDE.md).

## 1. Ziel und Endprodukt
RELAUNCH (seit 23.11.2026 ~10:15) für einen Kollegen von Eugen: BAU Facility Services GmbH i. G., Alter Kirchweg 9, 40880 Ratingen, GF Osman Yilmaz, info@baufacilityservices.de, alte Seite https://baufacilityservices.de/ (WordPress/Elementor One-Pager).
Leistungen (alte Seite): Planung & Organisation, Koordination & Durchführung (Gewerke bündeln), Bau & Umbau, Sanierung & Renovierung, Hausmeister-Leistungen. Claim: „Alles für Ihre Immobilie – aus einer Hand“. Werte: Alles aus einer Hand, Zuverlässig umgesetzt, Starke Partner, Persönlich betreut.
CI: Navy #1b2a49, Bronze #9d7a42, Grau #6f747a, Logo `alt-seite/ref/BFS_Logo.svg` (+ _w weiß). Alte Fotos sind KI (Eugen: dürfen genutzt werden), nur als Referenz/Edit, nicht in Git.
Ordnername HAUSWERK bleibt vorerst (ursprünglich fiktive Demo-Marke).

## 2. Qualitätsanspruch & Referenzen
- Aufbau wie FLUTLICHT27/FARBKANTE: Film-Kapitel (Scroll spult Video, Vorher → Arbeit → Ergebnis) im Wechsel mit Motion-Design-Kapiteln.
- Branchenprobleme, die die Seite löst: Foto-Leistungsnachweis für Hausverwaltungen, QR-Schadensmeldung für Mieter, dokumentierter Winterdienst (Haftung), fester Ansprechpartner, Objekt-/Paket-Rechner, Notdienst-Reaktionszeit, Recruiting in 60 s.
- Bewertungsbereich nur mit „Beispiel“-Karten (Demo, keine echten Noten).

## 3. Regeln
Globale Regeln. Bilder/Videos gratis über sjinn Unlimited, bezahlt nur nach OK.

## 4. Skills/Plugins
– (noch keine projektbezogenen)

## 6. Workflow & Freigabepunkte
1. 3 Storyboards (HWSB-1/2/3) → Eugen wählt. 2. First Frames 4K + Drafts. 3. Seite bauen, Mobil-Check 4 Größen. 4. GitHub Pages.

## 7. Befehle
- Vorschau: `cd site && python3 -m http.server 4370 --bind 127.0.0.1` → http://127.0.0.1:4370/ (Port 4370 = HAUSWERK, vor Link <title> prüfen)
- Bilder W1: `assets-roh/<name>.png` (s1-schnitt, s2-fassade, k1-keller, e1-eg-vorher, e2-eg-nachher, o1/o2/o3-bad-*, d1-dach, a1-ansprechpartner, t1-team, m4-vorort), dann `python3 tools/assets.py` (schärft nach, WebP 1800/2560/nativ + manifest.js). Etagen-Lage im Schnitt-Bild: FLOORS in site/main.js. Unterseiten: `python3 tools/subpages.py`. Abnahme: `python3 tools/abnahme.py` → abnahme/. Download Dreamina: tools/dl.sh <hash8> <name>.
- Videos: `site/assets/video/vorort-desktop.mp4` (+ `-mobile.mp4`) = Film B Hero; danach assets.py
- Prüfen: `python3 tools/check.py http://127.0.0.1:4370/` (6 Größen, Konsole, Querscroll, Kopfzeile, Schrift <14 px, Screens in Scratchpad)
- Repo: github.com/Engelstraenen/bfs-relaunch (öffentlich). Pages über gh-pages (V2.77, nie push $(subtree split)): `C=$(git commit-tree $(git rev-parse main:site) -m pages); [ ${#C} = 40 ] && git -c http.postBuffer=524288000 push -f origin "${C}:refs/heads/gh-pages"`
- sjinn-Zuordnung Auftrag → Datei: BFS-K1 keys · BFS-G1 house · BFS-G2 house-exploded · BFS-R1 room-before · BFS-H1 caretaker · BFS-J1 recruit · BFS-S1/S3/S4 step-beratung/-umsetzung/-betreuung · BFS-T1..T4 tile-umbau/-sanierung/-hausmeister/-planung · room-after = Edit von R1 (Referenz-Upload)

## 8. Offene Fragen
- Kein Google-Profil gefunden (23.11.2026, Maps-Suche „BAU Facility Services Ratingen“) → Bewertungsbereich nur mit „Beispiel“-Karten + Hinweis, Google-Profil anlegen empfehlen. Kundenstimmen der alten Seite (Markus Schneider usw.) wirken erfunden → NICHT übernehmen.
- Echte Telefonnummer/Mail aus Impressum verwenden, Handelsregister folgt.
- Datenschutz der alten Seite hat Lücken ([Name des Hosting-Anbieters] usw.) → Kollege muss ergänzen. Teilleistungen (Winterdienst, Trockenbau …) mit Kollegen abgleichen.

## 9. Entschieden
- 26.11.2026 00:20: Eugen wählt W1 „Das Haus im Schnitt“ (konzepte/v4-1-schnitt.png, Plan konzepte/w1-plan.md), weiß + CI Navy/Bronze. Gebaut + geprüft, live auf GitHub Pages.
- 25.11.2026 23:20: Eugen lehnt Ticket-Seite ab („das ist gar nix“): Overlays auf iPad/Handy schlecht, Hausmeister = ganzes Haus, Hintergrund WEISS, Aufbau nach den Leistungen der alten Seite (Planung & Organisation, Koordination & Durchführung, Bau & Umbau, Sanierung & Renovierung, Hausmeister-Leistungen + Werte, Über uns, Kontakt). Film B (Transporter) darf bleiben. → 3 neue Storyboards.
- 25.11.2026: NEUBAU nach V2.75. Eugen wählt Storyboard 2 „Ein Ticket geht durchs Haus“ (konzepte/v3-2-ticket.png, Sand #e9e0d0 + Ziegelrot #b5452f, Navy-Tinte). Plan: konzepte/ticket-plan.md. Alte B+-Seite wird ersetzt.
- 23.11.2026 11:45: Eugen wählt B (hell), „cooler, nicht langweilig“ → Bau als B+ (Storyboard BFSB-PLUS in Arbeit). 12:15 Eugen: andere sjinn-Sitzungen NICHT pausieren, warten.
- 23.11.2026: Eugen wählt Mix aus 1 (Schlüsselbund) + 2 (Das Objekt) → BFSMIX-A (dunkel Navy) / BFSMIX-B (hell) für BAU Facility Services.
- 23.11.2026: Projektname HAUSWERK, 3 Storyboard-Varianten (Prompts: konzepte/prompts.md).

## 10. Ablage
konzepte/ (Storyboards), tools/ (sjinn_queue.js), site/, verlauf/
