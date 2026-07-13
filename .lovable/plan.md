## Fix Werbeaktion section in Check24.tsx

### Changes (lines 496-514)

1. **Replace the crude SVG** (`<svg><rect fill="#022d94"><text>CHECK24</text></svg>`) with the existing `Check24Logo` component, passing a `fill="#022d94"` style — no card/rect background around it.

2. **Restore original text** (before anweisung-286 redesign):
   - Title: "So funktioniert unsere 200 €-Aktion"
   - Body: "Als Dankeschön verschenkt CHECK24 Österreich **200 €** an jeden neuen und bestehenden Kunden..."
   - "Der Bonus wird nach erfolgreicher Verifizierung direkt auf Ihr angegebenes Konto überwiesen."
   - Blue accent line: "Aktion endet am {AKTIONS_ENDE} – jetzt teilnehmen!"

3. **Keep the white card styling** (border, rounded, shadow) but remove the blue rect logo box — the Check24Logo SVG sits directly in the top-right corner colored `#022d94`.

### Technical detail

The `Check24Logo` component currently renders all paths with `fill="#fff"`. To recolor it to `#022d94`, pass a wrapper style or add a `color` prop. Simplest: wrap in a div with CSS `filter` or change the fill attribute via a prop.
