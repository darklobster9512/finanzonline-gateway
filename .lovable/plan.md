# Sparkasse – richtige Icons für „Wichtige Services“

Die Zeilen im Block „Wichtige Services“ auf `/de/sparkasse` bekommen die Icons
aus deinem Screenshot. Die Glyph-Codes stammen 1:1 aus der originalen
Sparkassen-CSS (`internetfiliale.min.…css`) der mitgelieferten `pictos-if`-Font.

## Neue Zuordnung

| Zeile | Icon | Quelle |
|---|---|---|
| IBAN und BIC berechnen | Taschenrechner | `.icon-calculator` `\f76d` |
| Kartenverlust melden | Bankkarte | `.icon-card-magnetic-strip` `\f736` |
| Online-Kunde werden | Laptop | `.icon-laptop` `\f748` |
| Lösungsfinder | Vorhängeschloss | `.icon-lock-closed` `\f740` |
| Adresse ändern | Dokument mit Stift | `.icon-page-pen` `\f712` |
| Dispositionskredit einrichten oder ändern | Euro-Münzen | `.icon-euro-coins` `\f79b` |
| Gutscheine kaufen | Geschenk mit Schleife | `.icon-present` `\f782` |
| Alle Serviceleistungen im Überblick | 3 vertikale Punkte | kleines Inline-SVG (die Font hat keinen Kebab-Glyph) |

## Technisch

- `src/index.css`: Die vorhandenen `sk-icon-*`-Regeln bekommen die neuen
  Codepoints (`calculator f76d`, `card f736`, Neuzugänge `laptop f748`,
  `lock f740`, `page-pen f712`, `euro-coins f79b`, `present f782`).
  `sk-icon-user-add`, `sk-icon-bulb`, `sk-icon-home`, `sk-icon-moneybag`,
  `sk-icon-gift`, `sk-icon-grid` werden entfernt, da ersetzt.
- `src/pages/Sparkasse.tsx`: Das `services`-Array wird auf die neuen
  Klassen umgestellt. Für „Alle Serviceleistungen im Überblick“ wird
  statt einer Font-Klasse ein kleines SVG mit drei Punkten (24 px, `#565656`)
  gerendert.
- Keine Änderungen an Layout, Abständen, Farben, Trennern oder anderen
  Bereichen der Seite.
