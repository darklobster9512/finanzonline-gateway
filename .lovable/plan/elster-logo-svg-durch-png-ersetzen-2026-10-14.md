# ELSTER-Logo: SVG durch PNG ersetzen

Das aktuell im ELSTER-Header verwendete SVG wird durch die hochgeladene PNG-Datei (`elster_png.png`) ersetzt.

## Schritte
1. PNG als Lovable Asset hochladen (`src/assets/elster-logo.png.asset.json`).
2. In `src/pages/Elster.tsx` den bisherigen SVG-Import durch den PNG-Pointer ersetzen – an denselben Stellen (Desktop-Header und mobiles Menü).
3. Altes SVG-Asset entfernen, wenn es nirgendwo sonst referenziert wird.
