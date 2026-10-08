# Commerzbank: Hover-Feinheiten Header & 24h-Card

Nur `src/pages/Commerzbank.tsx` wird angepasst — reine UI-Hover-Änderungen.

## Änderungen

1. **Hilfe-Button** (oben rechts, über dem Formular)
   - Entfernt: `hover:underline`.
   - Ergänzt: dieselbe Hover-Anhebung wie die vier Formular-Links (nach oben schieben, keine Unterstreichung).

2. **Suche + Lupe und EN** (Header rechts)
   - Beim Hover zusätzlich zur Farbänderung leicht nach oben verschieben (gleiche Bewegung wie Hilfe/Formular-Links).

3. **24h-Card: Service & Kontakt**
   - Kreis-Outline im Ruhezustand bleibt 1 px.
   - Beim Hover 2 px breit, **nach innen** wachsend, sodass der Außendurchmesser und das Layout gleich bleiben (kein Spring/Verschieben der Icons).

## Technische Details

- Für die Hover-Anhebung wird dieselbe CSS-Klasse/Technik verwendet wie bereits bei den vier Formular-Links (translate nach oben, ohne Layoutsprung).
- Für die Kreise: innerer `box-shadow: inset 0 0 0 1px <TEXT>` beim Hover zusätzlich zur bestehenden 1 px-Border, oder Border auf 2 px bei gleichzeitiger `box-sizing`-Anpassung mittels negativem inset (`box-shadow inset`) — bevorzugt per `box-shadow: inset 0 0 0 2px` beim Hover, Border bleibt 1 px dauerhaft, damit der Außendurchmesser stabil ist.
