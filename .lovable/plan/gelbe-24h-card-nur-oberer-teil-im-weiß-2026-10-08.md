# Gelbe 24h-Card: nur oberer Teil im Weiß

Aktuell liegt die gelbe Card komplett auf weißem Hintergrund, und der dunkelgrüne Footer wird per negativem Margin nach oben gezogen. Gewünscht: nur ~25 % der Card oben ragen ins Weiß, die restlichen ~75 % liegen bereits auf dem dunkelgrünen Footer-Bereich.

## Änderung

Datei: `src/pages/Commerzbank.tsx`

- Hintergrund der Banner-Section auf dunkelgrün (`GREEN`) setzen statt weiß.
- Die gelbe Card um ca. 25 % ihrer Höhe nach oben verschieben (negatives `margin-top`, z. B. `-mt-[64px]` passend zur aktuellen Padding/Höhe), sodass der obere Rand im weißen Bereich oberhalb sitzt.
- Footer: negatives `marginTop: -90px` und `pt-[120px]` entfernen, da der Übergang jetzt über die Card selbst entsteht; stattdessen direkt an die Banner-Section anschließen.
- Keine Änderungen an Farben, Icons, Typo oder Layout der Card-Inhalte.

Desktop und Mobile verhalten sich gleich; nur die Positionierung ändert sich.
