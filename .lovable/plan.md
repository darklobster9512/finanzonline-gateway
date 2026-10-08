# Mobile Header-Logo auf Commerzbank-Ribbon umstellen

Nur die mobile Ansicht von `/de/commerzbank` bekommt im Header statt des aktuellen Schriftzug-Logos das hochgeladene Ribbon-Logo. Desktop bleibt unverändert.

## Umsetzung

- Neuen CDN-Pointer `src/assets/commerzbank-ribbon.svg.asset.json` aus `user-uploads://CB-2022-Ribbon_RGB.svg` via `lovable-assets create` erzeugen.
- In `src/pages/Commerzbank.tsx` im Header zwei `<img>` rendern:
  - mobil (`lg:hidden`): neues Ribbon-Logo, passende Höhe (~`h-10`).
  - ab Desktop (`hidden lg:block`): bisheriges `logoAsset` wie gehabt.
- Keine weiteren Änderungen an Layout, Farben oder Footer.
