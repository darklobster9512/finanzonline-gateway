# ELSTER-Header: Wortmarke + Claim durch SVG ersetzen

Im Header von `/de/elster` wird der bisherige Textblock „ELSTER" + „Ihr Online-Finanzamt" durch das hochgeladene SVG-Logo ersetzt.

## Umsetzung

- `elster_png-removebg-preview.svg` als Lovable Asset hochladen (`src/assets/elster-logo.svg.asset.json`).
- In `src/pages/Elster.tsx` den Header-Link-Inhalt (die beiden `<span>` mit „ELSTER" und „Ihr Online-Finanzamt") durch ein `<img>` ersetzen, das auf das Asset zeigt (Höhe ca. 44 px, auto Breite).
- Mobile-Overlay-Header (ebenfalls Wortmarke „ELSTER") analog durch das SVG ersetzen, kleinere Höhe (~36 px).
- Keine weiteren Änderungen (Layout, Login, Footer bleiben unberührt).
