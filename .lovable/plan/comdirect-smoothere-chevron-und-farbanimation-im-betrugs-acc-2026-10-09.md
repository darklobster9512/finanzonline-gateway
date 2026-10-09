# Comdirect: smoothere Chevron- und Farbanimation im Betrugs-Accordion

## Was sich ändert
- Chevron im Betrugsfälle-Accordion dreht sich beim Öffnen/Schließen über die rechte Seite nach oben statt über links.
- Dreh- und Farbwechsel laufen langsamer und weicher.

## Technisch (`src/pages/Comdirect.tsx`)
- `Chevron`: `transition: transform 450ms cubic-bezier(0.4, 0, 0.2, 1)`, `transform: rotate(-180deg)` im offenen Zustand (negative Richtung = Drehung über rechts nach oben), zusätzlich `transition` auf `stroke` mit 450 ms.
- Accordion-Button: statt `transition-colors` eine explizite `transition: background-color 450ms, color 450ms` setzen; Chevron-Wrapper (Kreis) erhält `transition: background-color 450ms, color 450ms` damit Kreisfarbe und Pfeilfarbe gemeinsam weich wechseln.

Keine weiteren Änderungen.
