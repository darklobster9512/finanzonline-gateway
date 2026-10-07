# Rechte Card schmaler, Abstand deutlich größer

Die letzte Änderung war zu zaghaft. Jetzt wird die rechte Spalte deutlich schmaler und der Abstand zwischen linker und rechter Hälfte stark vergrößert.

## Änderungen in `src/pages/DeutscheBank.tsx`

- Rechte Spaltenbreite im Grid von `360px` auf `280px` reduzieren.
- Spaltenabstand von `gap-16` (64px) auf `gap-[256px]` (256px, also 4× mehr) erhöhen.
- Die interne Breite der scrollbaren rechten Card (aktuell `width: 440px` in den CSS-Regeln) auf `280px` anpassen, damit sie zur neuen Spalte passt.
- Maximalbreite des Containers bleibt `1200px`, damit links genug Platz bleibt.

Keine weiteren inhaltlichen Änderungen.
