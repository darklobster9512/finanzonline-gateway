# Sparkasse: rechte Service-Leiste als ein Stück

Die drei roten Quadrate am rechten Rand werden zu einer durchgehenden roten Leiste zusammengefasst (so wie im Screenshot).

## Umsetzung

In `src/pages/Sparkasse.tsx` den Floating-Container ersetzen:

- Ein roter Block (`background: RED`, `borderRadius: 6`, keine Lücke zwischen den Icons), Breite ~44 px.
- Drei Icon-Buttons untereinander, jeweils ~56 px hoch, transparenter Hintergrund, weiße Linien-Icons.
- Icons als neue Inline-SVGs (outline, nicht gefüllt), passend zum Screenshot:
  - Telefon: Hörer korrekt orientiert (nach unten links geöffnet, nicht gespiegelt)
  - Chat/Sprechblase mit kleinem grünen Punkt oben rechts
  - Umschlag (outline)
- Vorhandene `sk-icon-*` Iconfont-Glyphs werden hier nicht mehr verwendet.
