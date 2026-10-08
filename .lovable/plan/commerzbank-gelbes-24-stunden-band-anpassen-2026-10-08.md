# Commerzbank Gelbes "24 Stunden" Band anpassen

Zwei kleine Änderungen am gelben Service-Band auf `/de/commerzbank`:

1. Die Card ragt künftig zu ca. **30 %** (statt 25 %) über den weißen Bereich oberhalb des grünen Footers heraus — der obere Überstand wird entsprechend vergrößert.
2. Die Card wird **höher/tiefer** gemacht, damit sie nicht mehr so schmal wirkt — mehr vertikales Innenpadding.

## Technisch

In `src/pages/Commerzbank.tsx` am gelben Banner (`marginTop: -32px`, `py-8`):
- `marginTop` von `-32px` auf etwa `-56px` erhöhen (ca. 30 % Überstand bei der neuen Höhe).
- Vertikales Padding von `py-8` auf `py-14` erhöhen, damit die Card deutlich höher wird.

Keine weiteren Änderungen.
