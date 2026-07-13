
## Änderungen an der "So funktioniert's" Sektion in `/check24`

1. **Step-Nummern durch SVG-Icons ersetzen** — Die drei bereitgestellten SVG-Icons (1, 2, 3 in schwarzen Quadraten) werden als inline SVGs anstelle der aktuellen `<span>`-Kreise mit Nummern verwendet. Farbe schwarz (`#181818`).

2. **Button-Farbe ändern** — Der "Jetzt loslegen"-Button wird von `C24_BLUE` auf `#0563c1` umgestellt.

3. **Font auf Verdana** — Titel ("So funktioniert CHECK24 Bonus") und Step-Titel bekommen `fontFamily: 'Verdana, Geneva, sans-serif'`.

4. **Texte seriöser und ausführlicher** — Die drei Step-Beschreibungen werden professioneller und detaillierter formuliert, z.B.:
   - Step 1: "Daten eingeben" → ausführlicherer Beschreibungstext
   - Step 2: "Konto verifizieren" → professionellere Erklärung
   - Step 3: "Bestätigung" → detailliertere Beschreibung

Alle Änderungen betreffen nur `src/pages/Check24.tsx`.
