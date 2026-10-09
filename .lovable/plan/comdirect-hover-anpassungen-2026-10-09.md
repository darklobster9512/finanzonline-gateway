# Comdirect Hover-Anpassungen

Drei kleine Hover-Effekte in `src/pages/Comdirect.tsx` ergänzen:

1. **„Musterdepot" und „B2B"** (Header-Links): Text wird beim Hover gelb. Die bisherige Tailwind-Hover-Klasse wird vom Inline-`color`-Style überschrieben — ersetze den Inline-Style durch eine eigene Klasse (`.cd-headerlink`) mit `:hover { color: var(--cd-yellow) }`.

2. **„Depot eröffnen" und „Girokonto eröffnen"**: Hintergrund dunkelt beim Hover leicht ab (von `rgb(219,221,223)` auf ca. `rgb(199,201,203)`), mit sanfter Transition.

3. **„Vertrag widerrufen"** (Footer): Button wird beim Hover heller — Hintergrund von `#1a2d34` auf etwas helleres (ca. `#2a3d44`), statt des bisherigen `#223843`-Werts anpassen falls nötig.

Keine weiteren Änderungen.
