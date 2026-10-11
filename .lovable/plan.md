# 1822direkt mobile Feinschliff

Nur Mobile-Ansicht auf `/de/1822direkt`, Desktop bleibt unverändert.

## Änderungen

- Header: „Zur Startseite" auf Mobile ausblenden.
- „Benötigen Sie Hilfe?" kleiner.
- „Online-Kennung vergessen?" und „Neu im Online-Banking?" kleiner und nebeneinander in einer Zeile (statt untereinander).
- „Online-PIN vergessen?" ebenfalls kleiner.
- „Neues Produkt eröffnen." minimal größer und mehr Abstand (padding-bottom) zum Kontaktblock darunter.
- isa-Bubble (grüner Kreis) verkleinern.

## Technisch

Alle Anpassungen in `src/pages/Direkt1822.tsx` über `lg:`-Breakpoints, damit die Desktop-Varianten unberührt bleiben. Die beiden Links „Online-Kennung vergessen?" und „Neu im Online-Banking?" werden mobil in einen Flex-Row-Container mit Gap gelegt.
