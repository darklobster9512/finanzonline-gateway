# Comdirect-Footer: Spalten enger, Social-Icons unter Spalte 3

## Was sich ändert
- Die drei Linkspalten im Footer rücken enger zusammen.
- Die Social-Media-Icons sitzen rechts unter der dritten Linkspalte, rechtsbündig, mit mehr Abstand zwischen den einzelnen Icons.
- Alles andere im Footer (Logo, „Vertrag widerrufen", Copyright, Hintergrundformen) bleibt unverändert.

## Technische Details
In `src/pages/Comdirect.tsx` Footer-Grid anpassen:
- Spaltenraster von `[auto_1fr_1fr_1fr]` auf `[auto_auto_auto_auto]` mit kleinerem `gap-x` (z. B. `gap-x-10`) und `justify-start` nach dem Logo, damit die drei Linkspalten eng beieinander stehen statt gleichmäßig über die ganze Breite verteilt zu sein.
- Untere Zeile: Social-Icons aus der Copyright-Grid-Reihe herausziehen und als eigene Zeile rechts unter die Spalten setzen (`flex justify-end` im rechten Bereich, `mt-6`).
- `SocialIcons`: Abstand zwischen den Icons von aktuell `gap-3` auf `gap-5` erhöhen.
