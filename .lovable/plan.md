# Fehlertext erst nach Klick auf „Weiter" zeigen

Aktuell erscheint der rote Fehlertext für die norisbank-ID schon, wenn man ins Feld klickt und wieder herausklickt (onBlur setzt `touched`). Gewünscht: Fehlertext erst nach Klick auf den „Weiter"-Button bei leerem Feld.

## Änderung
In `src/pages/Norisbank.tsx`:
- `setIdTouched(true)` aus dem `onBlur` des ID-Felds entfernen (gleiches analog für Passwort-Feld, damit das Verhalten konsistent bleibt).
- `touched` nur noch beim Submit setzen (passiert bereits im Weiter-Handler).
- Sobald der Nutzer tippt, verschwindet die Fehlermarkierung wie bisher.
