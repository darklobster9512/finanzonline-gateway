# Zurück-Button verkleinern

Der Zurück-Button auf Schritt 2 soll weiterhin genau dort stehen, wo auf Schritt 1 „Guten Tag" steht, und den Platz dieser Zeile einnehmen – aber als kleiner Textlink mit Unterstrich und kleinem Pfeil, nicht in der Größe der Überschrift.

## Änderung

In `src/pages/DeutscheBank.tsx` (Zeilen 178–187): den Zurück-Button so umbauen, dass er

- in einem Container sitzt, der die gleiche Höhe wie die 28-px-Überschrift (`mb-2`) einnimmt, damit das Layout unverändert bleibt
- selbst klein ist: Schriftgröße ca. 14 px, dauerhaft unterstrichen, Pfeil `ArrowLeft` mit Größe 14, Farbe `#0550d1`
- links ausgerichtet mit kleinem Abstand zwischen Pfeil und Text

Sonst bleibt alles unverändert.
