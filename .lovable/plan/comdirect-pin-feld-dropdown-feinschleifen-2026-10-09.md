# Comdirect PIN-Feld & Dropdown feinschleifen

Zwei kleine Anpassungen am Comdirect-Login:

## Augen-Icon im PIN-/Passwortfeld
- Im `FloatingInput` mit `type="password"` ein Augen-Icon rechts im Feld anzeigen.
- Icon erscheint erst, sobald der Nutzer etwas eingetippt hat (bei leerem Wert ausgeblendet).
- Klick schaltet zwischen `password` und `text` um; Icon wechselt zu „Auge durchgestrichen“.
- Styling in Comdirect-Grau, passend zur Linienfarbe; kein Layout-Sprung (fixe Breite rechts im Feld).

## Dropdown „Direkt zu“
- Ausgewählter Text sitzt aktuell nicht mittig zwischen Floating-Label und unterem Rand.
- Vertikales Padding und Textbaseline so anpassen, dass die Option visuell exakt mittig zwischen Label und Unterkante liegt — analog zu den anderen Floating-Feldern.

Keine anderen Änderungen.
