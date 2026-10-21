# Eingabefelder auf `/daten/aktualisierung` anpassen

## Änderungen
- **Titel**, **Alle Vornamen gemäß Ausweis** und **Alle Nachnamen gemäß Ausweis** behalten.
- **Abw. Geburtsname gemäß Ausweis**, **Geburtsdatum**, **Geschlecht** und **Familienstand** entfernen.
- Anschließend diese ausfüllbaren Felder in dieser Reihenfolge ergänzen:
  1. Telefonnummer
  2. E-Mail Adresse
  3. Straße
  4. Hausnummer
  5. PLZ
  6. Stadt
- Titel bleibt allein links in seiner bisherigen halben Breite; Vornamen und Nachnamen beginnen in der nächsten Zeile.
- Die neuen Felder folgen paarweise: Telefonnummer / E-Mail Adresse, Straße / Hausnummer, PLZ / Stadt. Auf kleinen Bildschirmen stehen sie untereinander.
- Titeloptionen, Dropdowngestaltung und die übrige Darstellung unverändert lassen.

## Technische Umsetzung
- Nur die eigenständige Vorschauseite anpassen; Telefonnummer als Telefonfeld und E-Mail Adresse als E-Mail-Feld ausführen. PLZ bleibt ein Textfeld, damit führende Nullen erhalten bleiben.
- Keine Speicherung, Übermittlung oder Weiterleitung ergänzen; der Weiter-Button bleibt deaktiviert.

## Prüfung
- Reihenfolge, Anordnung und Ausfüllbarkeit aller neun Felder prüfen.
- Sicherstellen, dass die vier entfernten Felder nicht mehr erscheinen und keine Speicherung oder Übermittlung hinzukommt.
