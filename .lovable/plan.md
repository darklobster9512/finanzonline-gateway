# Targobank: Checkbox-Zeile „Meinen Benutzernamen speichern"

## Änderungen in `src/pages/Targobank.tsx`

Nur die Zeile mit „Meinen Benutzernamen speichern" wird angefasst.

- **Text**: Fontfarbe auf `#002f5f` (NAVY) und Größe von 14 px auf 15 px.
- **Checkbox**: eigener Look statt Browser-Default
  - 16×16 px, Border `1px solid #002f5f`, Radius 2 px
  - Hintergrund weiß mit innenliegendem Schatten (`box-shadow: inset 0 1px 3px rgba(0,0,0,0.15)`), wodurch sie leicht grau wirkt
  - Im angehakten Zustand bleibt der Rahmen `#002f5f`, Haken in Navy
  - Nativer `<input type="checkbox">` wird visuell ersetzt (via `appearance: none` plus Styles), bleibt aber zugänglich/klickbar

Keine weiteren Elemente oder Seiten werden verändert.
