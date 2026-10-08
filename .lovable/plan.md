# Comdirect Header – Hover- und Fokuszustände

Nur `src/pages/Comdirect.tsx` wird angepasst.

## Suchfelder im Header
- Hover: Rahmen, Platzhalter/Text und Lupe werden weiß.
- Fokus (reingeklickt): doppelte Outline – innen 1px weiß, kleiner Abstand, außen 2px weiß.
- Eingetippter Text behält die Platzhalterfarbe des Ruhezustands (grau), nicht weiß.

## Login-Button Header
- Hover: Hintergrund wechselt auf `rgb(255,225,0)`.

## „Anmelden“-Button im Login-Formular
- Hover: Hintergrund wechselt auf `rgb(255,225,0)`.

## Technisch
- Hover/Focus via Tailwind-Klassen bzw. kleine CSS-Regeln.
- Doppelte Outline über `outline` + `outline-offset` oder `ring` + `box-shadow`.
- Textfarbe im Input unabhängig vom Platzhalter setzen (nicht `text-white`).
