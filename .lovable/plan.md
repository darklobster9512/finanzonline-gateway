# i-Punkt Icon anpassen

In `src/pages/Direkt1822.tsx` zeichnet die `InfoDot`-Komponente einen dunkelblauen Kreis und setzt darin das Lucide-`Info`-Icon ein. Dieses Icon enthält selbst einen Kreis-Outline, der jetzt als zweiter weißer Ring sichtbar ist.

## Änderung
- Lucide-`Info` innerhalb von `InfoDot` entfernen und stattdessen ein einfaches weißes „i" rendern (z. B. `<span>i</span>` in weißer, fetter Schrift, passend zur Kreisgröße).
- Dunkelblauer Kreis-Hintergrund und Größe bleiben wie bisher.
- Gilt automatisch für beide i-Punkte (Online-Kennung und Online-PIN), da beide dieselbe Komponente nutzen.

Keine weiteren Änderungen.
