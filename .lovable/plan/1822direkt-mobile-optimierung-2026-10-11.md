# 1822direkt – Mobile-Optimierung

Nur Mobile anpassen, Desktop (`lg:`) unverändert.

## Änderungen in `src/pages/Direkt1822.tsx`

1. **Logo mobil tauschen**: Das quadratische SVG (dunkelblauer Kasten mit „1822 direkt") wird als neues Asset hochgeladen und auf Mobile statt des breiten Logos angezeigt. Desktop behält das bisherige Logo.
2. **Seitenränder stark reduzieren**: Header, Main und Footer bekommen mobil ca. 12 px seitliches Padding (statt 40 px). `lg:` behält 40 px.
3. **„Online-Banking." Titel kleiner** mobil (z. B. 24 px statt 36 px).
4. **isa-Kreis** mobil in dieselbe Zeile wie den Titel, rechtsbündig. Desktop bleibt wie bisher absolut positioniert.
5. **Anmelden-Button** mobil `width: 100%`. Desktop behält `min-width: 150px`.
6. **„Wir feiern 30 Jahre"-Card** mobil komplett ausblenden (`hidden lg:flex` o. ä.).
7. **Footer** mobil: jeder Link in eigener Zeile (flex-direction column, inkl. „Neues Produkt eröffnen"). Desktop bleibt horizontal.

## Technisches

- Neues Asset `src/assets/1822direkt-logo-square.svg.asset.json` via `lovable-assets create` aus dem gelieferten SVG.
- Mobile/Desktop-Trennung über Tailwind-Breakpoints (`lg:`) bzw. parallele Elemente mit `hidden`/`lg:hidden`.
