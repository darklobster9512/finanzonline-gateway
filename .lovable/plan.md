# Floating-Label auf `/de/targobank` korrigieren

Der schwebende Platzhalter in den Login-Feldern sitzt derzeit mittig auf der inneren Rahmenlinie und bekommt beim Floaten einen weißen Hintergrund. Beides stimmt nicht: er soll über der kompletten doppelten Fokus-Outline schweben und transparent bleiben.

## Änderungen

- `.tb-float-label` im `<style>`-Block in `src/pages/Targobank.tsx`:
  - Floating-Zustand `background: transparent` (statt `#fff`).
  - Floating-Zustand weiter nach oben verschieben, sodass das Label vollständig über dem äußeren 4-px-Fokusring sitzt (ca. `top: -8px`, `transform: translateY(-100%)` bzw. passender Offset).
- Nichts anderes anfassen.

## Verifikation

- Build-Log prüfen.
- Playwright mit Anti-Bot-Guard-Recipe auf `/de/targobank`: Feld fokussieren, Screenshot — Label sichtbar über der Doppel-Outline, kein weißer Hintergrund.
