# Mehr Abstand im Commerzbank-Footer

Im unteren Footer-Bereich mit der Linkleiste ("AGB", "Rechtliche Hinweise", "Impressum", "Einwilligungseinstellung", "Konzern", "Karriere") soll mehr Luft entstehen:

- Mehr Abstand zwischen der horizontalen Trennlinie (Divider) und den Links.
- Mehr Abstand zwischen den Links und dem unteren Seitenrand.

Nur dieser Bereich wird geändert; Rest des Footers (Logo-Zeile, Claim, Divider) bleibt wie bisher.

## Technische Details

In `src/pages/Commerzbank.tsx` (Zeilen 310, 317):
- Äußeres Container `pb-10` → `pb-16`.
- Divider-Wrapper `pt-5` → `pt-10`.
