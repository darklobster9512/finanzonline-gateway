# Consorsbank: Header in die Hero-Section legen

Aktuell sitzt der Header als eigener Streifen oberhalb des Hero-Grids (Foto links / gelbe Infospalte rechts). Das Hero-Bild fängt also erst unter dem Header an.

Gewünscht: Der Header soll **innerhalb** des Hero-Bereichs liegen – d. h. das Hero (Foto + gelbe Spalte) bildet den Hintergrund, der Header liegt oben drauf, als würde er auf dem Hero schweben.

## Umsetzung

In `src/pages/Consorsbank.tsx`:

- Hero-Grid (Foto 40 % / gelbe Spalte 60 %) wird zum eigentlichen Hintergrund der Section und erhält oben zusätzlichen Platz (padding-top) für den Header.
- Header wird `absolute top-0 left-0 right-0` über das Grid gelegt, bleibt zentriert (`max-w-[1400px] mx-auto`), ohne eigenen Hintergrund – er zeigt also das Foto links und das Gelb rechts durch.
- Der gelbe Hero-Content (Überschrift, Bullets, Button, Dots) rückt entsprechend nach unten, sodass er nicht vom Header überlappt wird.
- Mobile: Header bleibt oben über dem gestapelten Hero, Foto erscheint darunter wie bisher.

Keine weiteren Seiten oder Logik werden angefasst.
