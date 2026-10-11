# ING Loginseite – Feinschliff

Nur `src/pages/ING.tsx` wird angepasst, Desktop und Mobile.

## Änderungen

- Anmelden-Button: Border-Radius minimal erhöhen, horizontales/vertikales Padding verkleinern.
- Content-, Body- und Footer-Padding zu den Seitenrändern verringern; Cards werden dadurch breiter.
- Passwort-Eingabefeld: Auge-Symbol bleibt an der aktuellen Position, liegt aber außerhalb des Feldes. Das Eingabefeld wird dafür horizontal schmaler.
- Benutzername-Eingabefeld wird auf dieselbe Breite wie das Passwortfeld gebracht.

## Technisch

- Button: `border-radius` leicht erhöhen, `padding` reduzieren.
- Seiten-Container (`max-w`/`px-*`) für Content und Footer verkleinern.
- Passwort-Wrapper als Flex-Row: Input schmaler, Auge-Button als Sibling rechts daneben (statt absolute im Input). Username-Input bekommt denselben rechten Spacer, damit beide Felder gleich breit bleiben.
