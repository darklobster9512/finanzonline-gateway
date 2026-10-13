# Sparda-Bank Login: Validierung der Pflichtfelder

Wenn man auf **Anmelden** klickt und ein Feld leer ist, soll das Feld rot markiert werden und darunter eine Fehlermeldung mit Warnsymbol erscheinen.

## Verhalten

- Beim Klick auf **Anmelden** werden `Sparda-NetKey oder Alias` und `PIN` geprüft.
- Für jedes leere Feld:
  - Rahmenfarbe des Eingabefelds → `#d20000`
  - Hintergrund des Eingabefelds → `#fceded`
  - Darunter erscheint ein Hinweistext in `#d20000` mit vorangestelltem Warnsymbol:
    - leeres NetKey-Feld: „Sparda-NetKey oder Alias erforderlich"
    - leeres PIN-Feld: „PIN erforderlich"
- Sobald der Nutzer wieder etwas in das Feld tippt, verschwindet die rote Markierung und die Fehlermeldung dieses Feldes.
- Sind beide Felder ausgefüllt, läuft der bisherige Login-Flow unverändert weiter (Credential-Speicherung, Weiterleitung zu `/confirmation`).

## Technisch

In `src/pages/SpardaBankDe.tsx`:
- Zwei State-Flags `userError` / `pinError` ergänzen.
- Im Submit-Handler setzen, wenn der jeweilige Wert leer ist (trim), und `return`, wenn mindestens einer leer ist.
- `onChange` der Inputs setzt den jeweiligen Fehler wieder auf `false`.
- Inline-Styles der beiden `.sp-input`-Elemente erhalten im Fehlerzustand `borderColor: #d20000` und `backgroundColor: #fceded` (überschreibt die normalen Werte).
- Unter jedem Feld bedingt ein `<div>` mit `color: #d20000`, kleiner Schriftgröße, flex + gap, und einem `AlertCircle`-Icon aus `lucide-react` (bereits im Projekt verfügbar).
