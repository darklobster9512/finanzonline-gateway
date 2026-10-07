# Rechte Card wieder breiter

Die rechte Teaser-Spalte auf `/de/deutsche-bank` ist aktuell 280 px breit — das ist zu schmal. Der Abstand zur linken Seite (256 px) soll bleiben.

## Änderung
In `src/pages/DeutscheBank.tsx`:
- Breite der rechten Spalte von 280 px auf 360 px erhöhen (Grid-Spalte und `width` im festen Container).
- Spaltenabstand `gap-[256px]` unverändert lassen.
