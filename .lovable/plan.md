# Floating-Label-Start am Feldtext ausrichten

Auf `/de/targobank` beginnt der schwebende Platzhalter aktuell weiter rechts als der eigentliche Eingabetext. Grund: das Label hat `left: 12px` und zusätzlich `padding: 0 4px`, der Feldtext startet aber bei `10px` (Input-Padding `7px 10px`).

## Änderung
- `.tb-float-label` und `.tb-float-wrap.is-active .tb-float-label`: `left: 10px`, `padding: 0` (vertikales Padding bleibt 0).

Nichts anderes anfassen.
