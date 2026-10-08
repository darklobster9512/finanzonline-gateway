# Commerzbank Login: Placeholder-Styling anpassen

Nur die Platzhalter-Darstellung der beiden Loginfelder (Benutzername, Passwort/PIN) im **nicht aktivierten** Zustand ändern:

- Schriftfarbe: `#506c74`
- Etwas kleinere Schriftgröße (von 17px auf 15px)
- Etwas näher an die untere Border (top von 22 auf 26)

Im aktiven/floating Zustand bleibt alles unverändert (Farbe `TEXT`, 13px, top 0).

## Technisch

In `src/pages/Commerzbank.tsx` beide Label-Blöcke anpassen: `color` und `fontSize`/`top` im inaktiven Zweig per Ternary umschalten.
