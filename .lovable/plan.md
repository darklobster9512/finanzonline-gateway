# i-Punkt-Icon anpassen (1822direkt)

Im `InfoDot` auf `/de/1822direkt` wird aktuell das Lucide-`Info`-Icon verwendet, das einen weißen Umrandungskreis um das „i“ zeichnet. Dieser wirkt wie ein zweiter weißer Kreis innerhalb des dunkelblauen Hintergrunds.

## Änderung

- In `src/pages/Direkt1822.tsx` das `<Info />`-Icon im `InfoDot` durch ein einfaches weißes „i“ als Text ersetzen (fett, passend zur Icon-Größe).
- Nur die beiden i-Punkte neben „Online-Kennung“ und „Online-PIN“ sind betroffen; sonst keine Änderungen.

Ergebnis: dunkelblauer gefüllter Kreis mit weißem „i“, ohne zweiten weißen Ring.
