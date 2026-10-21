# Demo mit festen Testdaten

## Gewünschtes Ergebnis
Nach „Anmelden“ auf `/apobank` öffnet sich `/apobank/aktualisierung` als eindeutig gekennzeichnete Demo. Es werden keine Anmelde- oder Personendaten gespeichert oder übertragen.

## Umsetzung
1. **Sicherer Demo-Einstieg:** Auf `/apobank` einen gut sichtbaren Demo-Hinweis anzeigen und die Anmeldung für diesen Ablauf durch feste, nicht bearbeitbare Testwerte ersetzen. „Anmelden“ führt ausschließlich zur neuen Demo-Seite; eingegebene Zugangsdaten, Sitzungskennungen und Rücksprungparameter werden nicht weitergereicht.
2. **Neue Folgeseite:** Die grundsätzliche Anordnung des Screenshots übernehmen: Überschrift, zwei Schritte „Datenaktualisierung“ und „Bestätigung“ sowie ein zweispaltiger Bereich mit persönlichen Informationen. Auf kleinen Bildschirmen stehen die Angaben untereinander.
3. **Nur fiktive Angaben:** Anrede, Titel, Vorname, Nachname, Geburtsname, Geburtsdatum, Geschlecht und Familienstand mit festen Musterwerten anzeigen. Keine bearbeitbaren Felder und keine Abfrage echter Informationen.
4. **Eindeutige Abgrenzung:** Die neue Seite ohne echtes Banklogo, Bankkontaktangaben oder den Eindruck eines offiziellen Kundenportals gestalten. Ein dauerhaft sichtbarer Hinweis lautet „Demo – ausschließlich fiktive Testdaten“.
5. **Demo-Abschluss:** Statt eines nicht beauftragten Anstellungsformulars führt „Weiter zur Demo-Bestätigung“ zum zweiten Schritt mit einer rein lokalen Bestätigung. Ein Zurück-Button öffnet wieder die Musterangaben.
6. **Original unverändert:** `/de/apobank` und andere Bank- und ELSTER-Seiten bleiben unberührt.

## Technische Details
- Eine eigenständige Demo-Seite erstellen und unter `/apobank/aktualisierung` registrieren.
- Den bisherigen Abschluss der Kopie auf das feste Demo-Ziel ändern; keine Übernahme von `return` oder `s`.
- Ausschließlich feste Testdaten und flüchtigen Zustand für den angezeigten Schritt verwenden; keine Speicherung in Browserablagen, keine Formularübermittlung und keine neuen externen Skripte aus dem hochgeladenen HTML.
- Bestehende Tests zur fehlenden Datenspeicherung erweitern: festes Weiterleitungsziel, ignorierte Rücksprungparameter und keine Speicherung oder Übermittlung von Formulardaten.
- Den Ablauf vom Demo-Einstieg bis zur Bestätigung im Browser prüfen und die Darstellung auf breitem und schmalem Bildschirm kontrollieren.
