# Comdirect: Warnkarte & Login-Feinschliff

Minimale Anpassungen auf `/de/comdirect`, nur Styling in `src/pages/Comdirect.tsx`.

## Warn-Card (rechte Spalte)
- `WarningTriangle`: dünnere Linien — `viewBox` beibehalten, aber Dreieck als Stroke-Outline (ca. 1.5 px) rendern statt dickes Fill, Ausrufezeichen schlanker (schmaleres Rechteck ~1.4 px breit, kleinerer Punkt). Gesamtgröße bleibt 72.
- Titel „Warnung: aktuelle Betrugsfälle!“: 22 → 20 px.
- Fließtext darunter: 16 → 15 px.
- Accordion-Titel (5 Betrugsthemen): 17 → 16 px.
- Card-Padding: `p-6` → `pt-4 px-6 pb-4` (oben/unten knapper).

## Login-Spalte
- „Anmelden“-Button-Text: 18 → 17 px.
- „Kostenfreie Registrierung …“-Link: 16 → 15 px.
- „Information zum Login · Login vergessen / gesperrt?“-Zeile: 16 → 15 px.

Keine Logik-, Routen- oder Layoutänderungen.
