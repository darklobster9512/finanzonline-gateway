# Comdirect Login-Felder feinschleifen

Anpassungen an `FloatingInput` in `src/pages/Comdirect.tsx` (Zugangsnummer & PIN):

1. **Text näher an die untere Border** — mehr `padding-top`, weniger `padding-bottom`, damit der eingegebene Text nicht am Floating-Label klebt.
2. **Floating-Label-Farbe im aktiven Zustand** auf `rgb(96, 109, 113)` (statt dunkel).
3. **Smoothere Float-Animation** — Übergang auf ca. 550 ms mit `ease-in-out` verlangsamen.
4. **Hover-Outline** auf `rgb(11, 30, 37)`.
5. **Fokus-Zustand: doppelte Outline**
   - äußere + innere Linie je 1 px in `rgb(11, 30, 37)`, 1 px Abstand dazwischen
   - Umsetzung über `box-shadow: 0 0 0 1px #fff inset` + `outline: 1px solid` plus `box-shadow` oder sauber: `border: 1px solid` + `box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgb(11,30,37)` — bei Blur zurück zum normalen Rahmen.

Keine weiteren Änderungen.
