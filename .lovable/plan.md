# Targobank Hero-Icon

Statt der blauen Kreise soll das hochgeladene weiße TARGOBANK-Icon rechts im Hero-Hintergrund stehen.

## Umsetzung

- `targobank_icon_white-2.svg` als CDN-Asset hochladen (`src/assets/targobank_icon_white.svg.asset.json`).
- In `src/pages/Targobank.tsx` die `radial-gradient`-Kreise aus `.tb-hero` entfernen und stattdessen das Icon als `background-image` rechts platzieren (z. B. `background-position: right center`, großzügige Größe, teils über den Rand hinausragend wie im Screenshot).
- Mobile ebenfalls anpassen: kleineres Icon, rechts angeschnitten.
- Grundfarbe cyan bleibt.
