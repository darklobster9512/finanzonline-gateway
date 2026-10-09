# Teaser-Card: Chevron unten rechts fixieren, Text volle Breite

Im Teaser „Dein Zukunfts-Ich …“ nimmt der Chevron aktuell eine eigene Spalte rechts ein. Der Text endet dadurch früher und wirkt wie halbiert.

## Änderung

In `src/pages/Comdirect.tsx` am Teaser-Link:

- Container `relative` machen, Chevron als eigenes `absolute bottom-3 right-3` Element unten rechts in der Card fixieren.
- Chevron-Spalte aus dem Flex-Layout entfernen, damit die Textspalte die gesamte verbleibende Breite neben dem Bild einnimmt.
- Textspalte bekommt ausreichend `padding-right`, damit Text nicht unter dem Chevron läuft, Rest bleibt wie gehabt (Höhe, Bild, Typo).
