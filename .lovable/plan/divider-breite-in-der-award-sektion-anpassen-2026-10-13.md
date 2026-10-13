# Divider-Breite in der Award-Sektion anpassen

Die Trennlinien oberhalb und unterhalb der Award-Sektion sind aktuell breiter als der sichtbare Inhalt der Spalten-Sektion darüber. Sie sollen exakt die Breite des Inhalts (also innerhalb der seitlichen Section-Paddings) erhalten.

## Änderung

In `src/pages/Sparkasse.tsx`:

- Award-Sektion: `borderTop` nicht mehr auf dem `<section>`-Element setzen (das die äußeren `px-16 lg:px-32`-Paddings einschließt), sondern auf einem inneren Wrapper, der die gleiche Breite hat wie der Inhalt der 4-Spalten-Sektion darüber.
- Footer-Trennlinie analog so begrenzen, dass sie bündig mit demselben Inhaltsbereich endet.

Konkret: Divider wird in einen inneren Container verschoben, der innerhalb des horizontalen Paddings liegt, sodass die Linie exakt an den linken/rechten Kanten des Spalteninhalts beginnt und endet.

Keine weiteren Änderungen an Inhalten, Fonts oder Spacing.
