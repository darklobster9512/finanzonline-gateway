# 1822direkt: Border-Farben korrigieren

In `src/pages/Direkt1822.tsx`:

- Standard-Border der Eingabefelder: `#00386a` (statt aktuell `#176BC0`).
- Fokus-Zustand: doppelte Outline in `#176bc0` (innerer weißer Trenn-Ring, dann 2px `#176bc0`).

## Technisch
- `INPUT_BORDER = "#00386a"`.
- `FOCUS_RING = "0 0 0 2px #fff, 0 0 0 4px #176bc0"`.
