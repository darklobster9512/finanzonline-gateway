# Commerzbank Login: Eingabetext anpassen

Auf `/de/commerzbank` die Eingabefelder (Benutzername und Passwort/PIN) so anpassen, dass getippte Inhalte besser sichtbar sind.

## Änderungen

- Passwort/PIN-Punkte vergrößern (größere Font-Size nur für das Passwort-Feld, damit die Maskierungs-Punkte deutlich größer wirken als jetzt).
- Beim Benutzername- und Passwort-Feld: Textfarbe des eingegebenen Inhalts
  - im Fokus (aktiv eingetippt): `#002530`
  - außerhalb des Fokus: zurück zur bisherigen Standardfarbe.

## Technische Details

In `src/pages/Commerzbank.tsx`:
- Passwort-Input: zusätzliche Klasse mit größerer `font-size` / `letter-spacing`, damit die Masken-Punkte prominenter erscheinen. Nur im Passwort-Feld.
- Beide Inputs: `color` dynamisch per Focus-State setzen (`focused ? '#002530' : <bisher>`), analog zur bestehenden Label-Logik.
- Keine weiteren visuellen Änderungen (Layout, Labels, Linien bleiben unberührt).
