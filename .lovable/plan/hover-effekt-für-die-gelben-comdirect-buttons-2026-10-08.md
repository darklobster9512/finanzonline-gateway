# Hover-Effekt für die gelben Comdirect-Buttons

## Problem
Die beiden gelben Buttons auf `/de/comdirect` haben derzeit keinen Hover-Effekt — die Hintergrundfarbe bleibt beim Überfahren gleich.

## Änderung
Für beide gelben Buttons gilt:

- **Normale Farbe:** `rgb(255, 245, 0)`
- **Hover-Farbe:** `rgb(255, 225, 0)`

Betroffene Buttons:
1. Der „Login ›“-Pill-Button oben rechts im Header
2. Der „Anmelden ›“-Button im Login-Formular

## Technische Umsetzung
- In `src/index.css` eine gemeinsame Regel ergänzen (z. B. `.cd-yellow-btn`), die die beiden bestehenden Klassen `cd-login-btn` und `cd-anmelden-btn` in `src/pages/Comdirect.tsx` mit einem `:hover`-Zustand versieht:
  ```css
  .cd-login-btn:hover,
  .cd-anmelden-btn:hover {
    background-color: rgb(255, 225, 0);
  }
  ```
- Die Inline-Styles (`backgroundColor: YELLOW`) bleiben als Normalzustand bestehen; der Hover überschreibt sie über die CSS-Regel.
- Sanfter Farbwechsel via `transition: background-color` (~150 ms), passend zu den vorhandenen Hover-Transitionen der Seite.

## Nicht geändert
- Das gelbe Logo-Band im Header bleibt statisch (kein Button).
- Alles andere auf der Seite bleibt unverändert.
