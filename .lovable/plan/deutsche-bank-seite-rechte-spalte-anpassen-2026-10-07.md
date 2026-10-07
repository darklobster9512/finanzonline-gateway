# Deutsche Bank Seite – rechte Spalte anpassen

Nur `src/pages/DeutscheBank.tsx` (rechte Teaser/Info-Spalte). Login-Karte und Hintergrund bleiben unverändert.

## Änderungen

1. **Rechte Spalte fixieren:** vom oberen bis zum unteren Seitenrand durchgehend, weißer Hintergrund, keine Lücke oben/unten. Umsetzung als `fixed right-0 top-0 bottom-0` mit interner Scroll-Fähigkeit, Breite wie bisher.
2. **Weißer Platz oben:** über dem 3,0 %-Bild gleicher weißer Innenabstand wie an den Seiten (padding top), damit das Bild nicht am Rand klebt.
3. **3,0 %-Bild verkleinern:** nicht mehr full-width der Karte, sondern nur so breit wie der Textblock darunter (z. B. `max-w-[260px]`), zentriert bzw. links bündig mit dem Text, mit sichtbaren weißen Rändern links/rechts.
4. Footer-Links bleiben in dieser Spalte unten; Seite scrollt innerhalb der fixen Spalte.

Keine Änderungen an Routen, Logik, Submit-Flow oder anderen Dateien.
