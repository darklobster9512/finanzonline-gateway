# ELSTER-Logo einbauen

Das echte ELSTER-Wappen (roter Monitor mit „E", Vogel, Hand) steckt als base64-SVG in `internetfiliale.min...css`. Es wird extrahiert und als Logo in Header und Footer von `/de/elster` verwendet.

## Umsetzung

- SVG aus dem base64-Datablock dekodieren und als Datei `elster-logo.svg` ablegen.
- Via `lovable-assets` als CDN-Pointer registrieren: `src/assets/elster-logo.svg.asset.json`.
- In `src/pages/Elster.tsx`:
  - Header: aktuelle grüne „ELSTER"-Wortmarke durch `<img src={logo.url}>` + Claim ersetzen (Höhe ~40 px).
  - Mobile-Menü-Header: gleiches Logo kleiner (~32 px).
  - Footer-Spalte „ELSTER": grüner Stern (✻) durch dasselbe Logo in weiß/invertiert ersetzen (Höhe ~36 px).
  - Footer-Bottom-Leiste: kleinen Stern vor „ELSTER ®" ebenfalls durch das Logo ersetzen (Höhe ~18 px).

Keine weiteren Änderungen.
