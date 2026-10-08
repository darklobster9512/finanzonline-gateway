# Platzhalter-Farben im Hover-/Fokus-Zustand

In `src/pages/Commerzbank.tsx` die Farbe der inaktiven Floating-Labels (Benutzername, Passwort/PIN) anpassen:

- Normalzustand: `#506c74`
- Hover oder Fokus (solange das Feld leer ist): `#002530`
- Aktiver Zustand (Feld ausgefüllt oder fokussiert, Label oben) bleibt unverändert.

## Technisch

- Pro Feld einen `hover`-State ergänzen (`onMouseEnter`/`onMouseLeave`) bzw. `group`+`group-hover`-Pattern nutzen.
- Im inaktiven Zustand Farbe = fokussiert/gehovert ? `#002530` : `#506c74`.
- Aktiver (geschrumpfter) Zustand behält `#506c74`.
