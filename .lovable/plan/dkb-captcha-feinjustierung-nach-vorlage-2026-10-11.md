# DKB-Captcha: Feinjustierung nach Vorlage

## Korrekturen (Ist → Soll laut Screenshots)

1. **Box-Hintergrund**: weiß → **leicht gräulich** (`#f7f7f7`), Rahmen bleibt dünn hellgrau.
2. **Vertikale Zentrierung**: Checkbox + Text + „•••“ in einer Zeile, exakt vertikal mittig in der Box; „Friendly Captcha“ als eigene kleine Zeile unten rechts.
3. **Text „Ich bin ein Mensch“**: 17 px semibold → **~15 px, normale Schriftstärke (400–500)**, dunkelgrau (`#333`-Ton statt Navy).
4. **Checkbox-Rahmen**: 2 px `#9e9e9e` → **1 px hellgrau** (`#bdbdbd`-Ton), Größe ~24 px.
5. **„•••“-Punkte**: kleiner (~10 px), hellgrau, exakt oben rechts in der Box-Ecke.
6. **„Friendly Captcha“-Link**: 12 px → **~11 px**, hellgrau, unterstrichen.
7. Lade- und Erfolgszustand erhalten dieselben Maße (Spinner ~20 px, dünner; Haken ~22 px).

## Umsetzung

- `src/pages/DKB.tsx`: Captcha-Block mit den oben genannten Werten anpassen.
- Danach erneut alle Zustände per Playwright-Screenshot mit deinen Vorlagen vergleichen.
