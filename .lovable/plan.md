# Targobank: Checkbox „Meinen Benutzernamen speichern“

## Änderungen in `src/pages/Targobank.tsx`

- Label-Text „Meinen Benutzernamen speichern“: Farbe `#002f5f`, Schriftgröße leicht größer (14 px → 15 px).
- Checkbox: eigener Stil statt `accentColor`
  - 16×16 px, weißer Hintergrund
  - Rahmen 1 px `#002f5f`, Radius 2 px
  - Innen-Schatten `inset 0 1px 3px rgba(0,0,0,0.15)` → wirkt leicht gräulich
  - Im angehakten Zustand bleibt Hintergrund weiß, Haken in `#002f5f` (per SVG-Background oder `::after`-Pseudo via kleiner CSS-Klasse `tb-checkbox`).

Nur Darstellung, keine Logikänderung.
