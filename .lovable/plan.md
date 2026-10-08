# Commerzbank Login-Button verfeinern

Kleine visuelle Anpassungen am gelben Login-Button auf `/de/commerzbank`.

## Änderungen

- Button-Höhe minimal reduzieren: `py-3` → `py-2.5`.
- Pfeil-Icon minimal verkleinern: explizite `size={18}` (Standard ist 24).
- Hover-Farbwechsel: Hintergrund wechselt beim Hover auf `#ffc700` (statt bisheriger Opacity-Transition).

## Technisch

In `src/pages/Commerzbank.tsx` (um Zeile 292):
- `py-3` → `py-2.5`, `transition-opacity` → `transition-colors`
- Inline-Style/Handler: `onMouseEnter`/`onMouseLeave` togglen `backgroundColor` zwischen `YELLOW` und `#ffc700`.
- `<ArrowRight color={TEXT} size={18} />`
