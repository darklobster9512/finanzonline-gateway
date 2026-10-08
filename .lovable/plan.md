# Comdirect Footer: Hintergrund-Formen reparieren

Im aktuellen Footer sind die dekorativen Kreise links und das Ringmotiv rechts beschnitten und falsch positioniert, weil beide Formen in einem gemeinsamen SVG mit `viewBox="0 0 1920 312"` und `preserveAspectRatio="xMidYMax slice"` liegen und auf eine 180 px hohe Leiste gezwungen werden.

## Fix

In `src/pages/Comdirect.tsx`:

1. `FooterShape` in zwei separate SVGs aufteilen:
   - `FooterShapeLeft` enthält nur die vier grauen Kreise + den oberen Ring, mit eigener `viewBox` ihrer natürlichen Bounding-Box.
   - `FooterShapeRight` enthält nur das Ring/Halbkreis-Motiv rechts, mit eigener `viewBox` ihrer natürlichen Bounding-Box.
2. Beide SVGs im Footer absolut platzieren:
   - Links: `absolute left-0 bottom-0` in natürlicher Größe (ca. 180×220 px), kein Slice/Scale.
   - Rechts: `absolute right-0 bottom-0` in natürlicher Größe (ca. 210×180 px).
3. Footer bekommt `min-height` groß genug, damit die Formen (bis ca. 280 px hoch) nicht oben abgeschnitten werden; Inhalt behält `relative z-10`, damit Links/Logo über den Formen liegen.
4. Keine Änderungen an Linkspalten, Logo, „Vertrag widerrufen"-Pill, Copyright oder Social-Icons.

Ergebnis: Formen sitzen bündig an linker/rechter Footer-Kante in Originalproportion, so wie im Referenz-Screenshot.
