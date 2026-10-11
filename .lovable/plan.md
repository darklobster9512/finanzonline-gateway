# ING-Eingabefelder: Fokus-Rahmenfarbe korrigieren

Die beiden Eingabefelder auf `/de/ing` nutzen aktuell `#B2C2CE` als 2 px Innen-Fokusrahmen. Das wird auf `#335D7D` geändert.

## Änderung
- `src/pages/ING.tsx`: Fokus-`boxShadow` beider Inputs (Zugangsdaten + Passwort) von `#B2C2CE` auf `#335D7D` setzen. Sonst nichts anfassen.
