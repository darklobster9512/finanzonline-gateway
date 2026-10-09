# Warn-Card (aktuelle Betrugsfälle) feinschleifen

Nur die Warnungs-Card rechts auf `/de/comdirect` wird angepasst.

## Änderungen

1. **Warnsymbol**: Dreieck minimal kleiner und mit leicht abgerundeten Ecken (statt spitz).
2. **Accordion-Titel** (z. B. „Betrug beim mobilen Bezahlen“ … „Enkeltrick“): Schriftgröße etwas erhöhen (15 → 17 px).
3. **Collapsed-Body-Text**: Fließtext im geöffneten Panel vergrößern (14 → 16 px).
4. **Chevron im Collapsed-Zustand**: Kreis-Hintergrund auf `rgb(11,30,37)`, Pfeil in Weiß. Im geöffneten Zustand bleibt der aktuelle Stil.
5. **Hover auf Accordion-Header**: Hintergrundfarbe wird `rgb(232,234,234)`.

## Technisches

- Datei: `src/pages/Comdirect.tsx`
- `WarningTriangle` SVG: Pfadmaße leicht reduzieren, `stroke-linejoin="round"` und kleines `rx`-Rundungs-Shape.
- `fraudItems`-Loop: Titel-Klassen auf `text-[17px]`, Body auf `text-[16px]`.
- Button: `hover:bg-[rgb(232,234,234)] transition-colors` ergänzen.
- Chevron-Kreis: wenn `!open` → `backgroundColor: "rgb(11,30,37)"` + Chevron-Farbe weiß; wenn `open` → bisherige graue Variante.
