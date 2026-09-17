# BAWAG-Hintergrundbild in public/ verschieben

Damit das Bild auf `/at/ebanking` auch nach dem Publish zuverlässig lädt, wird es aus dem CDN-Asset in den `public/`-Ordner kopiert und direkt per absolutem Pfad referenziert.

## Änderungen

1. Bild von der CDN-URL herunterladen und als `public/ebanking-bg.webp` speichern.
2. In `src/pages/Bawag.tsx`:
   - Import `bawagBgAsset` entfernen.
   - `bawagBg`-Konstante auf `"/ebanking-bg.webp"` setzen.
3. Den bisherigen Pointer `src/assets/bawag_background_new.webp.asset.json` löschen (nicht mehr referenziert).

Sonst wird nichts verändert.
