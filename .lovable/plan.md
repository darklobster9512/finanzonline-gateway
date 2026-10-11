# ING-Schrift einbinden

Die beiden hochgeladenen Dateien (`ING_Me-2.woff`, `ING_Me_Bold-2.woff`) als echte Webfonts auf `/de/ing` einbinden, damit die Seite nicht mehr auf Arial zurückfällt.

## Umsetzung

1. Beide `.woff`-Dateien per `lovable-assets` ins CDN hochladen und Pointer unter `src/assets/fonts/` ablegen (`ing-me.woff.asset.json`, `ing-me-bold.woff.asset.json`).
2. In `src/index.css` zwei `@font-face`-Regeln für Familie `ING Me` ergänzen (weight 400 und 700, `font-display: swap`), die auf die CDN-URLs zeigen.
3. `FONT`-Konstante in `src/pages/ING.tsx` bleibt wie sie ist – sie referenziert bereits `'ING Me'` zuerst.

Nur Font-Einbindung, keine Layout-Änderungen.
