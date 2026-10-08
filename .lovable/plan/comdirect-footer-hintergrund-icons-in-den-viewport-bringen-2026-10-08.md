# Comdirect Footer: Hintergrund-Icons in den Viewport bringen

## Problem
Die dekorativen Kreise/Formen im Footer-Hintergrund (`FooterShape`) liegen aktuell links und rechts außerhalb des sichtbaren Bereichs. Grund: das SVG hat `viewBox="0 0 1920 312"` mit `preserveAspectRatio="xMidYMax slice"` und wird in einen Container gesteckt, der deutlich höher als 312px ist. Bei "slice" skaliert der Browser so weit hoch, bis die Höhe gefüllt ist — dadurch wird das SVG seitlich massiv beschnitten, und die Shapes bei x≈238 (links) und x≈1742 (rechts) wandern aus dem sichtbaren Bereich.

## Lösung
In `src/pages/Comdirect.tsx` den `FooterShape`-Hintergrund so anpassen, dass die Shapes immer innerhalb des Viewports bleiben:

- `preserveAspectRatio` von `xMidYMax slice` auf `none` setzen, damit das SVG exakt die Container-Breite und -Höhe ausfüllt, ohne seitlich zu beschneiden. Die Shapes verzerren dadurch minimal in der Höhe, bleiben aber dekorativ unauffällig und vollständig sichtbar.
- Alternative, falls Verzerrung unerwünscht: Container für den Shape-Layer auf eine feste Höhe (z. B. `h-[312px]`) am unteren Rand setzen (`absolute bottom-0 left-0 right-0`) und `preserveAspectRatio="xMidYMax meet"` nutzen — dann skaliert das SVG korrekt auf die volle Breite.

Empfehlung: Variante 2 (feste Höhe am unteren Rand + `meet`), weil sie keine Verzerrung erzeugt und dem Original-Design entspricht.

## Betroffene Datei
- `src/pages/Comdirect.tsx` — nur der Footer-Shape-Wrapper (`<div className="absolute inset-0 …">`) und das `preserveAspectRatio`-Attribut im `FooterShape`-SVG.

Keine weiteren Dateien, keine Logikänderungen.
