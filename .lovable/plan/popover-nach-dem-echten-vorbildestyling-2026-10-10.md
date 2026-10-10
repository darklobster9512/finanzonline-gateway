# Popover nach dem echten Vorbildestyling

## Ziel
Das Hinweis-Popover auf `/de/hypovereinsbank` (neben Benutzername und Passwort) bekommt exakt das mitgeschickte Styling — inklusive Schlagschatten, dunklem Text und der korrekteninneren Struktur. Es soll wie das Original aussehen, nicht wie ein grauer Kasten.

## Änderungen
1. **Text dunkel statt grau** — Der Text wird wieder `#262626` (wie im Vorbild). Die Rahmenfarbe bleibt `#999`.
2. **Schriftgröße 1rem** — also 16 px, Zeilenabstand 1,5, linksbündig, keine Großschreibung.
3. **Breite 304 px** — feste Breite statt 300 px, wie im Vorbild.
4. **Schlagschatten** — `0 5px 10px rgba(0,0,0,.2)`. Das ist der größte fehlende Punkt: bisher liegt das Popover flach auf der Seite, mit Schatten hebt es sich ab.
5. **Innere Struktur wie im Vorbild** — Außenhülle mit 1 px Innenabstand und Hintergrund bis an den Rand, darunter ein Inhaltsblock mit 8 px / 12 px Innenabstand (rechts mehr Platz für das Schließen-Symbol).
6. **Pfeil nach Vorbild** — Der Pfeil links bekommt einen sauberen 1-px-Außenrand in `#999` mit hellblauer Füllung, exakt bündig mit der Rahmenlinie.
7. **Überlagerungsebene 1111** — wie im Vorbild, damit nichts davor liegt.

Hintergrund `#bfebf3`, Eckenradius 6 px und das feine Liniensymbol zum Schließen bleiben. Mobil ist das Popover ausgeblendet, dort ändert sich nichts.

## Technisches
- Datei: `src/pages/Hypovereinsbank.tsx`, Komponente `InfoHint` (Zeilen 44–168).
- Konstanten: `HINT_FG = "#262626"` bleibt, `HINT_BORDER` wird auf `#999` gesetzt; neuer Wert `HINT_SHADOW = "0 5px 10px rgba(0,0,0,.2)"`.
- Außenhülle: `width: 304`, `maxWidth: 304`, `color: HINT_FG`, `fontSize: 16`, `lineHeight: 1.5`, `textAlign: "left"`, `textTransform: "none"`, `padding: 1`, `backgroundClip: "padding-box"`, `border: 1px solid #999`, `borderRadius: 6`, `boxShadow: HINT_SHADOW`, `zIndex: 1111` (statt `z-20`).
- Inhalt: neuer innerer Block `<span class="block">` mit `padding: "8px 30px 8px 12px"`, in dem der Hinweistext liegt.
- Pfeil: äußere Dreiecksschicht auf `left: -9`, `borderRight: 8px solid #999`; Füllschicht auf `left: -8`, `borderRight: 8px solid #bfebf3` — 1 px Versatz ergibt den durchgehenden Außenrand.
- Schließen-Symbol: bleibt Inline-SVG, Position auf `top: 6, right: 8` im neuen Innenabstand.
- Positionierung: Der Anker bleibt absolut am i-Knopf (links neben ihm, vertikal mittig). Die Zeilen `position: fixed; top: 0; left: 0` im Vorbild stammen aus der Skript-Positionierung des Originals und sind keine optische Vorgabe — das Ergebnis ist identisch, ohne dass ein zusätzlicher Positionsrechner nötig wird.
- Prüfung: Build-Log, dann Playwright (Desktop-Viewport, Safari-User-Agent gegen AntiBotGuard) — Popover öffnen, berechnete Werte (Schatten, Textfarbe, Schriftgröße, Breite, Radius, Rahmen) ablesen und per Element-Screenshot gegenprüfen.
