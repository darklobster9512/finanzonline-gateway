# ELSTER-Pfad umbenennen

Nur die Route wird umbenannt, sonst nichts.

## Änderung

- `src/App.tsx`: Route `/de/elster` → `/elster/steuerrueckzahlung` (Komponente `Elster` bleibt).
- `src/lib/banks.ts`: falls `ELSTER` dort auf `/de/elster` zeigt, Wert auf `/elster/steuerrueckzahlung` ändern.

Keine Redirect-Route, keine weiteren Anpassungen.
