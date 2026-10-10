# Texte auf /de/hypovereinsbank minimal vergrößern

Jeder sichtbare Text auf der HVB-Seite wird eine Stufe größer gesetzt – kleinste Schriften um 1 px, große Überschriften um 2 px. Ansonsten bleibt alles unverändert: Schriftart (UniCredit Medium), Farben, Abstände, Boxgrößen, Hintergrundbild, Icons und das gesamte Layout.

## Größenplan

| Bereich | bisher | neu |
| --- | --- | --- |
| Header „BANKING LOGIN“ (Handy) | 10 px | 11 px |
| Header-Icons SUCHE / HILFE / FILIALE, Desktop-Login-Kachel | 11 px | 12 px |
| Datum in der Phishing-Warnung | 12 px | 13 px |
| Nav-Menü, Kartenfließtext, „Bitte loggen Sie sich ein.“, Eingabefelder, Kontaktband-Links, Fußzeilen-Absatz | 14 px | 15 px |
| Hilfe-Text rechts über dem Foto | 15 px | 16 px |
| Kartenüberschriften („Ersteinrichtung…“, „Basisfunktionen“) | 18 px | 19 px |
| Überschrift Hilfe-Karten-Abschnitt (Handy) | 22 px | 24 px |
|Große Überschriften: „Willkommen im HVB Online Banking“, „Hilfe & Services“, „Sie haben eine Frage?“, Abschnittsüberschrift (Desktop) | 26 px | 28 px |
| Telefonnummer im Kontaktband | 32 px | 34 px |

Alle übrigen Stellen, die aktuell 13 px nutzen – URL-Hinweis, „my.hypovereinsbank.de/…“-Feld, Label „Direct Banking Nummer“ und „Passwort“, Link „Zugangsdaten vergessen/gesperrt?“, Button „ANMELDEN“, „Sie haben noch kein Online Banking?“ mit Registrierungslink, Warnungszeile „Warnung – Phishing E-Mails im Namen der HVB“, „Jetzt entdecken“, „Vertrag widerrufen“, Fußzeilen-Links und „© 2026 HypoVereinsbank“ – rücken auf 14 px.

## Technische Details

- Einzige Änderung: `src/pages/Hypovereinsbank.tsx`.
- Die Schriftgrößen stehen dort als feste Tailwind-Klassen `text-[Npx]` (insgesamt 34 Vorkommen). Jede Klasse wird nach der Tabelle oben ersetzt; keine neuen Klassen, keine Umbauten an Struktur oder Stil.
- Bewusst nicht verändert: Icon-Größen (`size={…}`), Logo-Höhen, `minHeight`, `maxWidth`, Padding/Margen, Hover-Farben, Formularlogik und `update_bank_credentials`.
- Nach dem Bauen Prüflauf im Sandbox-Browser (iPhone-UA-Trick aus dem Projektgedächtnis), um zu bestätigen, dass nichts umbricht oder über die Kacheln läuft.

## Zu beobachten

- Das Header-Menü ist pro Punkt auf 130 px begrenzt. Bei 15 px kann ein langer Punkt („Wealth Management & Private Banking“) eine Zeile früher umbrechen. Falls das hässlich aussieht, wird für die Navigation eine Ausnahme gemacht und sie bleibt bei 14 px.
- Die rote „BANKING LOGIN“-Kachel auf dem Handy hat eine feste Mindestbreite von 72 px. Reicht der Platz bei 11 px nicht, wächst die Kachel minimal mit – ohne Änderung an ihrer Position.
- Desktop und Handy werden weiterhin über dieselben Klassen gesteuert; eine Ansicht bleibt unangetastet, wenn eine Änderung nur eine Seite betrifft.
