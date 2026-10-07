# Deutsche Bank Login – Validierungszustände für Eingabefelder

Nur `src/pages/DeutscheBank.tsx` wird geändert. Verhalten für das ID-Feld (Schritt 1) und das Passwort-Feld (Schritt 2) wird nach denselben Regeln umgesetzt – beim Passwort entfällt lediglich die Fehlermeldung unterhalb.

## Zustände pro Feld

Pro Feld werden zwei Flags verwaltet: `focused` und `touched` (true nach dem ersten Blur).

Darstellung in Abhängigkeit von Fokus, Inhalt und `touched`:

| Zustand | Label-Farbe | Rahmen |
|---|---|---|
| Initial (nie fokussiert) | #171945 | 1px grau |
| Fokus, leer | #171945 | innerer Rahmen #0550d1, äußerer Rahmen #0550d1 (double, mit Abstand, dicker) |
| Blur, leer, touched | #78070a | 1px #78070a; darunter Icon (i) + Text in #78070a |
| Fokus, leer, touched (erneut angeklickt) | #78070a | innerer Rahmen #78070a, äußerer Rahmen #0550d1 (double) |
| Fokus, mit Inhalt | #0550d1 | double outline, beide #0550d1 |
| Blur, mit Inhalt | #171945 | 1px grau (normal) |

Fehlertext nur beim ID-Feld, exakt: „Bitte prüfen Sie Ihre Eingabe. Geben Sie Ihre Deutsche Bank ID ein."

## Umsetzung (technisch)

- State: `idFocused`, `idTouched`, `pwFocused`, `pwTouched`.
- `onFocus` setzt `focused=true`; `onBlur` setzt `focused=false` und `touched=true`.
- Helfer `getFieldStyle({focused, touched, hasValue})` liefert `borderColor`, `boxShadow` (für double outline via `0 0 0 3px #fff, 0 0 0 5px <outerColor>`) und `labelColor`.
- Double outline: `border: 1px solid <innerColor>` + `box-shadow: 0 0 0 3px #fff, 0 0 0 5px <outerColor>`. Container erhält etwas `margin`, damit die äußere Linie nicht abgeschnitten wird.
- Fehlerzeile unter dem ID-Input: nur wenn `idTouched && !dbId`. Zeigt kleines rundes Icon (AlertCircle oder gefülltes „i") in #78070a plus Text in #78070a, kleiner Abstand oben.
- Standardfarbe `#171945` wird auch für „Deutsche Bank ID", „Passwort" und „Bitte geben Sie Ihre Zugangsdaten ein." gesetzt (ersetzt aktuelles `#555`).
