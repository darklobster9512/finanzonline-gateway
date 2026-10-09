# Teaser-Card „Dein Zukunfts-Ich" vertikal 25% höher

Die Höhe der Card wird aktuell vom Bild (`h-[138px]`) bestimmt. Letzte Änderung hat nur Padding angepasst, deshalb blieb die sichtbare Höhe gleich.

## Änderung
In `src/pages/Comdirect.tsx` (Teaser-Block ab Zeile ~391):
- Bildhöhe von `h-[138px]` auf `h-[173px]` (138 × 1.25).
- Innenabstände leicht erhöhen (`pt-6 pb-5` → `pt-8 pb-7`), damit der Textblock die neue Höhe mitträgt und vertikal mittig ausbalanciert bleibt.

Keine anderen Elemente oder Seiten werden berührt.
