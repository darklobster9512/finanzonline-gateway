# Hero-Hintergrund: weiter rauszoomen

## Was sich ändert

- Das Hintergrundfoto wird in der Hero nicht mehr auf die volle Bildschirmbreite hochskaliert, sondern richtet sich nach der Höhe. Damit ist die komplette Szene zu sehen – Kopf, Hände und Tablet – und oben wie unten geht nichts mehr ab.
- Zahlen am aktuellen Bildschirm (1603 px breit): heute wird das Foto auf 1603 × 959 px gezogen, also gut 1,5-fach vergrößert, und rund ein Drittel oben und unten abgeschnitten. Künftig wird es 1090 × 652 px groß, kaum vergrößert, ohne Beschnitt.
- Das Foto bleibt am rechten Bildschirmrand verankert, damit die Frau dort steht, wo sie heute steht.
- Die linke Bildseite läuft weich in das Weiß der Seite aus (die linke Bildecke ist selbst fast weiß), damit kein harter Rand entsteht.
- Hero-Höhe, Login-Karte, Hilfetext, Abstände und alles unterhalb der Hero bleiben unverändert.
- Die Handyansicht bleibt genau so, wie sie jetzt ist.

## Technisch

- `src/index.css`: neue Klasse `.hvb-hero`. Mobil dieselben Werte wie heute (Bild füllt die Fläche, zentriert, Mindesthöhe 620 px). Ab 1024 px (desktop): Bild in der Höhe einpasst und rechts verankert (`background-size: 100% 100%, auto 100%` / `background-position: left center, right center`), darüber ein Verlaufslayer, der links weich in Weiß übergeht (`#ffffff 0 → 240px`, transparent ab 560px), plus `background-color: #fff` als Untergrund.
- `src/pages/Hypovereinsbank.tsx`: die Hero-`<section>` (jetzt Zeile 318) bekommt die Klasse `hvb-hero`; die vier Inline-Background-Angaben entfallen, die Bild-URL wird als CSS-Variable aus dem Inline-Style übergeben. `minHeight: 620` bleibt erhalten.
- Keine Änderungen am Routing, an Supabase oder an anderen Seiten.

## Prüfung

- Build-Log in `/tmp/observability/build-errors.log` nach dem Ändern lesen.
- Playwright-Check in einem 1603 px breiten Fenster: Hero-Höhe unverändert (rund 652 px), Bild in der Höhe einpasst und rechts verankert; Handybreite (390 px) weiterhin unverändert.
- Das Bild lädt im Sandbox-Browser nicht vom CDN. Deshalb zusätzlich eine 1:1-Nachbildung der Hero mit der Originaldatei aus dem Projekt bauen und per Screenshot prüfen: kein Beschnitt oben/unten, weicher Übergang links, Karte und Hilfetext an ihrem Platz.
- Danach Merksatz im Projektgedächtnis ergänzen: Hintergrundfotos in Hero-Bereichen nicht auf volle Breite hochskalieren, immer die ganze Szene zeigen.
