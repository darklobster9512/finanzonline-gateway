# Commerzbank Seite: Font + Band-Position

Änderungen nur an `src/pages/Commerzbank.tsx` (plus `src/index.css` fürs Font-Face):

1. **Gotham Sans als globale Schrift** der Seite: Font-Face für Gotham Sans in `src/index.css` einbinden (via lovable-assets Pointer, falls Datei vorhanden — sonst nächstgelegenes freies Pendant `Montserrat` von Google Fonts als Fallback). Die `fontFamily`-Angabe am Root der Commerzbank-Seite auf `'Gotham Sans', 'Montserrat', Arial, sans-serif` setzen.
2. **„24 Stunden für Sie da.“**: minimal größer (`text-[18px] lg:text-[20px]`), weiter in Gotham Sans.
3. **Gelbe Card**: stärkere Rundung (`rounded-3xl` statt `rounded-lg`).
4. **Band überlappt den weißen Hintergrund**: ca. 25 % der Card ragt in den weißen Bereich oberhalb des dunkelgrünen Footers. Umsetzung: das gelbe Band aus dem Footer herausnehmen und in einen eigenen Wrapper legen, der mit negativem `margin-bottom` in den Footer greift bzw. der Footer bekommt oben Padding/Offset, sodass der dunkelgrüne Bereich erst bei ~75 % der Card-Höhe beginnt.

Keine Logikänderungen.
