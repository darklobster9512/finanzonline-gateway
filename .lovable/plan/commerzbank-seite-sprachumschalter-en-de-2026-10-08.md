# Commerzbank-Seite: Sprachumschalter EN/DE

## Ziel
Klick auf „EN“ im Header zeigt die gesamte Seite auf Englisch; der Button wird dann zu „DE“ und schaltet beim nächsten Klick zurück auf Deutsch. Betrifft nur `/de/commerzbank`.

## Was übersetzt wird
Alle sichtbaren deutschen Texte in `src/pages/Commerzbank.tsx`:
- Header-Navigation (Privatkunden, Unternehmerkunden, Wealth Management, Firmenkunden) sowie Suche/Login/Hilfe-Labels
- Teaser-Link
- Login-Card: Titel, Feldlabels, „Passwort anzeigen“, Login-Button, Hilfelinks (Passwort/Teilnehmernummer vergessen, Registrieren)
- Sicherheitshinweise-Block (Überschrift + alle Listeneinträge)
- Service/Kontakt-Band inkl. „Die Bank an Ihrer Seite“
- Footer-Links (Bedingungen, Rechtliche Hinweise, Impressum, Consent Management, Konzern, Karriere)
- Hilfe-Sidebar: Titel „Hilfe“, Accordion-Titel und die drei Fließtexte (Benutzername / Teilnehmernummer / PIN)
- Fehlermeldungen bei leerem Login
- Mobile Vollbild-Menü: Suche-Placeholder, Sprachzeile, Navigationslinks

Die englischen Entsprechungen stammen aus `anweisung-503.txt`; die drei langen Hilfetexte werden 1:1 übernommen.

## Umsetzung (technisch)
- `useState<"de" | "en">("de")` in der Commerzbank-Komponente.
- Ein `copy`-Objekt mit `de`/`en`-Varianten für alle oben genannten Strings; in JSX durch `t.xyz` ersetzen.
- Headerbutton (Desktop + Mobile Sidebar) zeigt `lang === "de" ? "EN" : "DE"` und togglet beim Klick.
- Keine Änderungen an Layout, Farben, Routen, Logik oder anderen Seiten.

## Nicht enthalten
- Keine URL-/Query-Persistenz der Sprache (Reload = wieder Deutsch), außer gewünscht.
- Keine Änderungen an Deutsche-Bank- oder anderen Seiten.
