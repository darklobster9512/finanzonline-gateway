# Anpassungen `/de/targobank`

Nur visuelle Feinjustierung in `src/pages/Targobank.tsx`, Desktop und Mobile.

## Änderungen

1. **Hero-Hintergrund**: Das weiße Targo-Icon im Hintergrund stärker herauszoomen, damit mehr Form sichtbar ist. Statt der aktuellen radialen Kreise ein großes, zentriertes, halbtransparentes Targo-SVG (via `footerIconAsset.url`) als Hintergrundbild rechts im Hero platzieren, deutlich größer als heute.
2. **Login-Card**:
   - Hintergrund mit Transparenz (`rgba(207, 238, 251, 0.72)`), leichter Backdrop-Blur für Lesbarkeit.
   - Max-Breite von 520 px auf ca. 440 px reduzieren.
3. **„* Pflichtfeld"**: Schriftgröße von 14 px auf 15–16 px.
4. **„Login"-Titel**: Von 34/40 px auf 30/34 px verkleinern.
5. **„Jetzt einloggen"-Button-Text**: Font-weight von `bold` auf `font-normal`, Größe von 16 px auf 18 px.
6. **Header-Logo**: Von `h-10 lg:h-12` auf ca. `h-8 lg:h-9` verkleinern.

Keine Änderung an Flow, Links, Footer, Sicherheitstipps oder Karten-Sektion.
