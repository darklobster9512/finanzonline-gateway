# Teaser-Bild an Textbreite anpassen

Das 3,0 %-Teaser-Bild in der rechten Spalte von `/de/deutsche-bank` wird exakt so breit wie die Textzeile „Schützen Sie sich und Ihr Online-Banking. Wir helfen Ihnen gern." darunter im Sicherheitshinweis-Block.

## Änderung

In `src/pages/DeutscheBank.tsx`:

- Teaser-`<img>`: feste `width={320}` / `height={200}` entfernen, stattdessen auf die Textspaltenbreite setzen (gleicher linker Einzug wie der Text im `InfoBlock`, also ab dem Icon-Ende bis zum rechten Rand des Panels).
- Umsetzung: der umschließende `<a>` bekommt denselben horizontalen Padding wie der Textbereich im `InfoBlock` (Icon-Spalte + Gap überspringen). Das Bild wird mit `w-full h-auto` gerendert, Höhe skaliert proportional.

Keine weiteren Änderungen an Login, Footer oder anderen Blöcken.
