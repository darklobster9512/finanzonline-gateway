# Awards-Reihe ausrichten (`/de/sparkasse`)

Die vier Award-Kacheln sollen in einer sauberen Reihe stehen: Titel aller vier Spalten auf einer Linie, Bilder darüber, Untertitel darunter.

## Änderung

In `src/pages/Sparkasse.tsx` die Awards-Grid-Einträge dreizeilig layouten:

- Zeile 1: Bild (feste Höhe, z. B. 100 px). Jedes Bild wird in einem Container mit fester Höhe vertikal mittig/am unteren Rand ausgerichtet, damit kleinere Bilder (FOCUS MONEY, scale 0.6) optisch zentriert erscheinen und die Titelzeile trotzdem auf gleicher Höhe sitzt.
- Zeile 2: Titel – alle vier auf exakt einer Linie, da jede Spalte dieselbe Bildzeilenhöhe hat.
- Zeile 3: Untertitel.

Umsetzung: aus dem bisherigen `flex flex-col`-Item wird ein 3-Zeilen-Grid pro Kachel (`grid grid-rows-[100px_auto_auto]`), das Bild zentriert in seiner Zeile. Keine weiteren Änderungen (Fonts, Farben, Abstände, Scales bleiben).

## Dateien

- `src/pages/Sparkasse.tsx` – Awards-Kacheln auf dreizeiliges Grid umstellen.
