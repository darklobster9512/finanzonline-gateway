# Link-Schrift verkleinern auf /de/deutsche-bank

Die Linkschrift in der rechten Spalte (Sicherheitshinweise, Zugang beantragen, Sicherheitsverfahren etc.) und in den „Zugangsdaten vergessen?"-Links wird von 14 px auf 12 px reduziert und von `font-semibold` auf `font-normal` gesetzt. Footer-Links bleiben unverändert.

## Technisch

In `src/pages/DeutscheBank.tsx`:
- Zeilen 163 und 207 (`Zugangsdaten vergessen?`): `text-[14px] ... font-semibold` → `text-[12px] ...` (ohne semibold)
- Zeile 329 (RightCard-Links): dito
