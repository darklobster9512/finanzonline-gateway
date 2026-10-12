# Targobank – Checkbox „Meinen Benutzernamen speichern“

Nur die Checkbox-Zeile im Login auf `/de/targobank` anpassen.

## Änderungen

- Label-Text „Meinen Benutzernamen speichern“: Farbe `#002f5f`, Schriftgröße etwas größer (14 px → 15 px).
- Checkbox selbst: Rahmen `#002f5f`, Hintergrund weiß mit innerem Schatten, damit sie leicht gräulich wirkt. Haken bleibt in Navy sichtbar.

## Technisch

In `src/pages/Targobank.tsx` die `<label>`/`<input type="checkbox">`-Zeile (ca. Zeile 330–339) ersetzen:

- Label: `text-[15px]`, Farbe bleibt `NAVY`.
- Native `accentColor` entfernen; custom Checkbox über `appearance-none` mit:
  - `border: 1px solid #002f5f`
  - `background: #fff`
  - `box-shadow: inset 0 1px 3px rgba(0,0,0,0.15)`
  - `border-radius: 2px`, 16×16 px
  - Checked-Zustand: SVG-Haken (`#002f5f`) via `background-image`.
