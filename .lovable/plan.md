# Zukunfts-Ich Card: Höhe an Bild anpassen

Die Teaser-Card auf `/de/comdirect` soll genauso hoch sein wie das Bild (173 px). Der Text soll die restliche Breite der Card voll ausfüllen.

## Änderungen in `src/pages/Comdirect.tsx`

- Textcontainer: vertikale Paddings entfernen (`pt-8 pb-7` → `py-0`), stattdessen vertikal zentrieren (`justify-center` statt `justify-start`), damit die Card nicht höher wird als das Bild.
- Chevron-Container: `self-end p-2` → `self-center pr-4`, kein zusätzliches Padding, das die Card streckt.
- Text bleibt links neben dem Bild, nutzt mit `flex-1` die volle Restbreite.

Keine weiteren Änderungen.
