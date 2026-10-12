# Openbank – Eingabefelder mit Floating Label & Fehlerstatus

Die beiden Loginfelder (Benutzerkennung, Passwort) auf `/de/openbank` bekommen das Verhalten aus der Vorlage.

## Verhalten

- Platzhalter dient als Label. Beim Fokus (oder wenn das Feld gefüllt ist) floatet das Label klein nach oben – innerhalb des Feldes.
- Beim Fokus/Wert: Hintergrund des Feldes wird `#F3F3F3`.
- Verlässt man das Feld ohne Eingabe (touched + leer): Rahmen wird rot `rgb(254 46 38)` und darunter erscheint eine Fehlermeldung in `#c1110c`:
  - Benutzerkennung: „Bitte geben Sie Ihre Benutzerkennung ein.“
  - Passwort: „Bitte geben Sie Ihr Passwort ein.“
- Sobald Text eingegeben wird, verschwindet der Fehlerzustand.

## Weitere Änderung

- Link „Passwort zurücksetzen“ erhält die Farbe `#c1110c` (statt bisherigem Hero-Rot).

## Technisches

- Änderungen nur in `src/pages/Openbank.tsx`.
- Neues CSS `.ob-field` (Wrapper) + `.ob-float-label` + `.ob-field.is-error` + `.ob-error-msg`.
- Lokaler State pro Feld: `touched` Flag; Fehler = `touched && !value`.
- Icons (User/Eye) bleiben rechts positioniert; Label floatet links.
- Desktop und Mobile identisch.
