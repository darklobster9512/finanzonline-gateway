# Awards-Zeile ausrichten

Die vier Award-Spalten sollen optisch sauber auf einer Linie liegen:

- **Bilder** stehen oben, alle auf derselben Grundlinie (unten bündig gegen die Titelzeile).
- **Titel** aller vier Awards liegen auf **einer horizontalen Linie**, egal wie hoch das Bild darüber ist oder wie lang der Text wird.
- **Untertitel** liegen darunter, ebenfalls auf einer gemeinsamen Linie.

Dadurch ist die vierte Spalte (kleines FOCUS-MONEY-Bild) automatisch vertikal passend zu den anderen drei ausgerichtet.

## Umsetzung (technisch)

In `src/pages/Sparkasse.tsx`, Awards-Section:

- Äußeres Grid bekommt `grid-template-rows: auto auto auto` (Bild / Titel / Untertitel).
- Jedes Award-Item nutzt `display: grid; grid-template-rows: subgrid; grid-row: span 3`, sodass Titel- und Untertitelzeile über alle Spalten synchron sind.
- Bild-Zelle: feste Höhe (z. B. 110 px), `align-self: end`, `img` mit `max-height: 100%`, `object-fit: contain`, `object-position: bottom` – kleines Bild sitzt unten bündig.
- Titel-Zelle: `align-self: start`, einheitliches `padding-top`.
- Keine Änderungen an Farben, Fonts oder sonstigen Sektionen.
