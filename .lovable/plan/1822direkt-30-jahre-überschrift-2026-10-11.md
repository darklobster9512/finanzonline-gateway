# 1822direkt: 30-Jahre-Überschrift

In der Werbekarte auf `/de/1822direkt` die Zeile „Wir feiern 30 Jahre. Du feierst mit.“ anpassen:

- `fontWeight` auf 100 (thin) setzen.
- `fontSize` so vergrößern, dass der Satz die Breite der Card genau ausfüllt (einzeilig, ohne Umbruch). Startwert ~34 px, danach per Browsercheck an die tatsächliche Cardbreite anpassen.

Keine weiteren Änderungen.

## Technisch
Datei: `src/pages/Direkt1822.tsx`, Zeile 185 — `fontWeight: 700` → `100`, `fontSize` nachjustieren und mit Playwright messen.
