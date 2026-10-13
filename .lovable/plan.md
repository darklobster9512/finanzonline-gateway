# Sparkasse mobile Feinschliff

Nur Mobile anpassen, Desktop unverändert.

## Wichtige Services
- Mobile Seitenrand reduzieren (statt `px-16` z. B. `px-4`, Desktop bleibt `lg:px-32`).
- Titel „Wichtige Services" ohne Bold (regular), mobil mittig zentriert; Desktop linksbündig.

## Awards
- Mobile Grid auf 3 Spalten statt 2 (Desktop bleibt 4).
- Mobile `gap` kleiner (z. B. `gap-2`).

## Footer
- Mobile Seitenrand reduzieren (statt `px-16` z. B. `px-4`), Desktop bleibt `lg:px-32`.
- Äußeres `<footer>`-Padding mobil auf `0 16px 36px` reduzieren, Desktop bleibt `0 48px 36px`.

## Technisch
Alle Änderungen in `src/pages/Sparkasse.tsx` an den drei Sektionen (Zeilen ~413, ~444, ~465). Umsetzung über Tailwind-Breakpoint-Klassen (`px-4 lg:px-32`, `grid-cols-3 lg:grid-cols-4`, `gap-2 lg:gap-4`) bzw. inline `className` statt `style` wo nötig für Breakpoints, oder zusätzlicher `isMobile`-Zweig passend zum bestehenden Muster.
