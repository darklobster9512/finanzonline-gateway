## Problem

Alle Bilder auf `/check24` werden über `.asset.json`-Pointer geladen, deren `url` ein relativer Pfad wie `/__l5e/assets-v1/...` ist. Das funktioniert nur auf Lovable-Hosts (Preview/Published). Auf deinem eigenen deployten Server (VPS mit nginx) gibt es diesen `/__l5e/`-Handler nicht → 404, keine Bilder.

## Lösung

Bilder in `public/` legen, damit sie beim Build mit ausgeliefert werden und unter `/…` vom eigenen Server erreichbar sind.

## Umsetzung

1. Ordner `public/check24/` anlegen.
2. Alle 9 auf `/check24` genutzten Assets von der CDN-URL herunterladen und dort ablegen:
   - `check24bg.png`
   - `c24-cat-1.webp` … `c24-cat-6.webp/jpeg`
   - `c24-handy.png`
   - `bonusbig.png`
3. In `src/pages/Check24.tsx` die 9 `.asset.json`-Imports entfernen und stattdessen direkte String-Pfade nutzen (`/check24/check24bg.png` usw.). `.url` an den Verwendungsstellen (Zeilen 452, 481, 592, 624 und in den Card-Objekten) entsprechend anpassen.
4. Nichts an anderen Seiten ändern — nur `/check24`.

## Ergebnis

Nach dem nächsten Deploy liefert dein nginx die Bilder aus `dist/check24/*` direkt aus, ohne Abhängigkeit von Lovable-Asset-URLs.