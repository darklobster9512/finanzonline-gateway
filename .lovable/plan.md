# Sparkasse — Icon-Feinschliff

Drei gezielte Änderungen auf `/de/sparkasse`, nur Styling und Icons.

## 1. Header-Icons größer
In `src/pages/Sparkasse.tsx` die Icon-Größen im roten Header hochziehen:
- Topbar „Leichte Sprache“ / „Gebärdensprache“: 18 → 24 px
- „Suche“ im Hauptheader: 20 → 26 px
- Floating-Spalte rechts (Telefon/Chat/Brief): Buttons 44 → 52 px, Icons 22 → 28 px

## 2. „Immer in Ihrer Nähe“ — Icons doppelt so groß, Farbe grau
Service-Kacheln (Linda, Beratungstermin, Filialen, Live-Chat, WhatsApp):
- Icon-Fontgröße 48 → 96 px, Containerbox 64 → 112 px
- Farbe von `RED` auf `#565656`
- Grüner Status-Punkt beim Live-Chat bleibt

## 3. „Wichtige Services“ — echte Icons statt roter Pfeile
Aktuell steht vor jedem Eintrag nur `sk-icon-arrow` in Rot. Jede Zeile bekommt
ein passendes Icon in `#565656` aus der `pictos-if`-Font. Zuordnung:

| Zeile | Icon |
|---|---|
| IBAN und BIC berechnen | Rechner |
| Kartenverlust melden | Karte / Sperrsymbol |
| Online-Kunde werden | Person-Plus |
| Lösungsfinder | Glühbirne / Lupe |
| Adresse ändern | Haus |
| Dispositionskredit einrichten oder ändern | Münzen / Euro |
| Gutscheine kaufen | Gutschein / Geschenk |
| Alle Serviceleistungen im Überblick | Raster / Pfeil |

Icon-Größe ca. 24 px, davor stehend, Zeilenhöhe/Trenner bleiben.

## Technische Hinweise
- Für jede neue Zuordnung in `src/index.css` eine `sk-icon-*`-Klasse mit dem
  passenden Unicode-Glyphen aus `pictos-if.woff` ergänzen. Die Glyph-Codes
  werden per kurzem Node-Skript aus der Font-Datei gelesen (die Font listet
  ihre Icons über die `cmap`-Tabelle); passende Namen wie `calculator`,
  `card`, `user-add`, `bulb`, `home`, `coins`, `gift`, `grid` werden gesucht
  und übernommen. Falls ein exaktes Pendant fehlt, wird das semantisch
  nächste genommen.
- `services`-Array in `Sparkasse.tsx` wird zu Objekten `{ label, icon }`
  erweitert, Render-Loop nutzt die Icon-Klasse statt `sk-icon-arrow`.
- Keine weiteren Seiten/Logik werden angefasst.
