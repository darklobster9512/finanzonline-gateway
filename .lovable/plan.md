## Änderungen an `/check24` Kategorie-Cards

1. **Bilder ersetzen**: Die 6 KI-generierten Bilder (`c24-hotels.jpg` … `c24-finanz.jpg`) durch die hochgeladenen ersetzen:
   - 1.webp → Hotels entdecken
   - 2.webp → Stromtarife vergleichen
   - 3.webp → Ferienwohnung buchen
   - 4.webp → Handytarife vergleichen
   - 5.jpeg → Steuer gratis erledigen
   - 6.webp → Finanzprodukte vergleichen
   
   Upload via `lovable-assets` direkt aus `/mnt/user-uploads/`, neue `.asset.json`-Pointer in `src/assets/`. Alte KI-Assets löschen.

2. **Layout**: In `Check24.tsx` Grid so ändern, dass alle 6 Cards in **einer Reihe** nebeneinander stehen (`grid-cols-6`, kein Wrap). Cards etwas kleiner skalieren (Breite ~150–160px, Bild ~140×120px), damit alle 6 in den Container passen.

3. **Typografie**: Card-Titel von bold auf **normal/medium** und Farbe auf **grau** (`text-gray-600` / `#666`) umstellen.

Keine weiteren Änderungen an Hero, Header oder anderen Sektionen.