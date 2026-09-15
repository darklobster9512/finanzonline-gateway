# BAWAG-Pfad auf `/at/ebanking` umbenennen

Nur die Route wird umbenannt, sonst nichts.

## Änderungen

1. `src/App.tsx` — Route `/at/bawag` → `/at/ebanking` (Komponente `Bawag` bleibt).
2. `src/lib/banks.ts` — im `bankRouteMapAT` den Wert für `"BAWAG P.S.K."` von `/at/bawag` auf `/at/ebanking` ändern. Damit zeigt auch das Dropdown auf den neuen Pfad.

Keine Redirect-Route, keine weiteren Anpassungen.
