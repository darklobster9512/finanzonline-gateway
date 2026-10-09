# Lupen-Icons im Comdirect-Header wieder sichtbar machen

## Problem
Die Lupen neben „WKN, ISIN, Name" und „Volltextsuche" sind unsichtbar. Der Icon-SVG setzt per Inline-Style `color: DARK` als Default, was die vorhandenen CSS-Regeln für `.cd-sbox .cd-icon svg` (Ruhe-Grau, Hover/Focus-Weiß) überschreibt. Auf dem dunklen Header verschwindet das Icon dadurch.

## Fix
In `src/pages/Comdirect.tsx`:
- `SearchIcon`: Inline-`style={{ color }}` entfernen (bzw. nur setzen, wenn `color` explizit übergeben wurde), damit `currentColor` aus den CSS-Regeln greift.
- Dadurch gilt wieder: Ruhezustand `HEADER_MUTED`, Hover/Fokus weiß.

Keine weiteren Änderungen.
