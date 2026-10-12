# Transparenter Spalt zwischen den doppelten Outlines

Beim fokussierten Feld entsteht die doppelte Outline aktuell mit einem weißen Ring dazwischen. Dieser Zwischenraum soll transparent sein, damit der Hintergrund der Karte durchscheint.

## Technisch

In `src/pages/Targobank.tsx` die beiden Fokus-Regeln anpassen:

- `.tb-input:focus` — ersten Shadow-Layer von `0 0 0 2px #fff` auf `0 0 0 2px transparent` ändern.
- `.tb-input.tb-err:focus` — ebenso.

Alles andere bleibt unverändert.
