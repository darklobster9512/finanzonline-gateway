# TARGOBANK Hero-Icon exakt wie im Screenshot

Im Screenshot sitzt das Icon (zwei überlappende hellblaue Kreise auf cyan) ganz rechts, vertikal mittig, etwa so hoch wie der Hero-Bereich, deutlich angeschnitten am rechten Rand, und ist nur leicht heller als der cyan Hintergrund (sehr geringe Deckkraft, kein Weiß).

## Änderungen in `src/pages/Targobank.tsx`

- Das neu hochgeladene `targobank_icon_white-4.svg` als CDN-Asset-Pointer unter `src/assets/targobank/targobank-hero-icon.svg.asset.json` anlegen und als Hero-Icon verwenden (altes Icon-URL entfällt).
- Icon als absolut positioniertes `<img>` im Hero rendern (nicht mehr CSS-Background), damit `opacity` greift:
  - `position: absolute; right: -120px; top: 50%; transform: translateY(-50%);`
  - Höhe ≈ 110 % der Hero-Höhe (ca. `h-[110%]`), `width: auto`
  - `opacity: 0.22` (sehr dezent, nur eine Spur heller als der Hintergrund)
  - `pointer-events-none`, hinter der Login-Card (z-Index niedriger)
- Mobil: `right: -160px`, Höhe ≈ `90%`, `opacity: 0.22` beibehalten.
- Hero-Container behält `overflow-hidden`, damit das Icon rechts sauber angeschnitten wird.

Nach dem Build visuell gegen den Screenshot abgleichen und Position/Größe/Opacity einmal nachjustieren, falls nötig.
