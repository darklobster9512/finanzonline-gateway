# Hilfe-Sidebar auf 50% Breite

Die Hilfe-Sidebar auf `/de/commerzbank` soll wie im Screenshot die rechte Hälfte des Viewports einnehmen (50% Breite) statt der aktuellen schmaleren Panel-Breite.

## Umsetzung

- In `src/pages/Commerzbank.tsx` die Sidebar-Breite auf `w-1/2` (bzw. `max-w-[50vw]`) setzen und die bisherige feste max-width entfernen.
- Overlay (abgedunkelter Bereich links) nimmt entsprechend die linken 50% ein.
- Mobile bleibt full-width.
