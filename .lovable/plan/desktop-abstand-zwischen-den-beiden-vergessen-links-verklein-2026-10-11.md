# Desktop: Abstand zwischen den beiden Vergessen-Links verkleinern

Auf `/de/1822direkt` sitzen die Links „Online-Kennung vergessen?“ und „Neu im Online-Banking?“ auf dem Desktop mit einer Lücke von 24 px nebeneinander. Mobile bleibt wie gehabt.

## Änderung
- `src/pages/Direkt1822.tsx`, Zeile 195: Container-Klasse `gap-0 lg:gap-6` auf `gap-0 lg:gap-2` ändern (Desktop-Abstand ~8 px statt 24 px). Mobile unverändert.
