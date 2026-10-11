# Norisbank: Fehlertext & deaktivierter Login-Button

## Änderungen in `src/pages/Norisbank.tsx`

1. **ID-Fehlertext (Schritt 1):** `t.idError` nicht mehr in Orange, sondern in der Feld-/Borderfarbe `#ee7971`. Erscheint weiterhin nur nach Klick auf „Weiter" mit leerem Feld.
2. **Einloggen-Button (Schritt 2) deaktiviert, solange kein Passwort eingegeben wurde:**
   - Hintergrund: `#2f3949`
   - Textfarbe: `#8c98a8`
   - Kein Hover-Effekt, Cursor `default`
   - Sobald mindestens ein Zeichen eingegeben ist, wird der Button wieder orange (`nb-primary-btn`, Text `#1c2533`) und klickbar.
