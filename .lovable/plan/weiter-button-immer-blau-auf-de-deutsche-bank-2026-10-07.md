# Weiter-Button immer blau auf /de/deutsche-bank

Auf der Deutsche-Bank-Loginseite soll der „Weiter"-Button in beiden Schritten (ID-Eingabe und Passwort-Eingabe) immer als aktiver, blauer Button erscheinen — auch wenn das jeweilige Feld noch leer ist.

## Umsetzung

In `src/pages/DeutscheBank.tsx`:
- `disabled`-Attribut von beiden Weiter-Buttons entfernen, damit sie nie den ausgegrauten Zustand annehmen.
- Validierung (Feld darf nicht leer sein) bleibt im Submit-Handler erhalten, sodass ein Klick auf leeres Feld nichts auslöst.
