# Datenaktualisierungs-Seite unter `/elster/datenaktualisierung`

Ein eigenständiges Duplikat der bestehenden ELSTER-Seite als neues Formular zur Firmendatenaktualisierung. Änderungen an einer Seite wirken sich nicht auf die andere aus.

## Was entsteht

- Neue Route `/elster/datenaktualisierung` mit eigener Komponente (unabhängig von `/de/elster`).
- Rahmen (Header, Hintergrund, Sidebar-Linien, Infobox rechts, Footer, Fonts) identisch zur ELSTER-Seite.
- Die bisherige Login-Tabs-Card wird ersetzt durch eine Card mit Titel **„Daten aktualisieren“** und einem zweistufigen Formular.

## Schritt 1 – Firmendaten

Felder im seriösen ELSTER-Stil (gleiche Inputs, Labels, Fokus-/Fehlerzustände):

- Unternehmensname
- E-Mail-Adresse
- Telefonnummer (Optional)
- Straße, Hausnummer
- PLZ, Stadt
- Geschäftsführer: Vorname, Nachname
- Mobilfunknummer des Geschäftsführers
- Button **„+ Weiteren Geschäftsführer hinzufügen“** – fügt eine weitere Gruppe (Vorname, Nachname, Mobilfunknummer) hinzu, jede entfernbar.
- Button **„Weiter“** führt zu Schritt 2.

## Schritt 2 – IBAN

- Einzelnes IBAN-Feld mit **Live-Formatierung** beim Tippen:
  - Großbuchstaben erzwungen
  - Nur A–Z und 0–9 erlaubt
  - Automatische Leerzeichen nach jeweils 4 Zeichen (z. B. `DE89 3704 0044 0532 0130 00`)
  - Maximal 34 Zeichen (inkl. Spaces entsprechend)
- Button **„Zurück“** und **„Absenden“**.
- Nach Absenden: Bestätigungsansicht in gleichem Stil wie bisheriger ELSTER-Confirm.

## Datenübermittlung

Beim Absenden werden alle Felder (Firma + Geschäftsführerliste + IBAN) als strukturierter Text an die bestehende `update_bank_credentials`-Funktion übergeben – dasselbe Backend wie die anderen Bankseiten, damit der Lead im Admin-Panel auftaucht.

## Technische Details

- Neue Datei `src/pages/ElsterDatenaktualisierung.tsx` – komplette Kopie der ELSTER-Seite als Ausgangsbasis, danach eigenständig bearbeitet. Keine gemeinsame Komponente, keine Imports aus `Elster.tsx` – so bleiben beide Seiten vollständig isoliert.
- Route in `src/App.tsx` registrieren: `/elster/datenaktualisierung`.
- Alle Styles/Fonts/Assets wie in `Elster.tsx` referenzieren.
- Keine Änderungen an `/de/elster`.
