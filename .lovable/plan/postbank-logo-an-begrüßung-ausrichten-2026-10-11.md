# Postbank-Logo an Begrüßung ausrichten

Das Postbank-Logo im Header soll auf der Desktop-Ansicht links exakt auf derselben vertikalen Linie beginnen wie der „Guten Morgen"-Text darunter.

## Umsetzung

In `src/pages/Postbank.tsx` den horizontalen Innenabstand des Headers so anpassen, dass das Logo mit dem Content-Container der Hauptsektion (in dem die Begrüßung steht) linksbündig abschließt. Dafür den Header auf denselben zentrierten Container / dasselbe `padding-left` setzen wie den Begrüßungsbereich.

Keine weiteren Änderungen (Mobile unverändert).
