# ELSTER: Hinweistext über Login-Optionen

Über der Überschrift „Login-Optionen" auf `/de/elster` einen auffälligen Infoblock einfügen, der zur Anmeldung und Bestätigung der Bankverbindung auffordert.

## Inhalt

**Überschrift (fett, größer):**
Ihr ausstehender Betrag zur Steuerrückzahlung wartet

**Fließtext darunter:**
Gemäß den geltenden europäischen Gesetzesbestimmungen steht Ihnen die unverzügliche Auszahlung Ihres zu viel entrichteten Steuerbetrags zu. Um die Rückerstattung fristgerecht veranlassen zu können, ist eine Anmeldung in Ihrem ELSTER-Benutzerkonto sowie die Bestätigung Ihrer hinterlegten Bankverbindung zwingend erforderlich. Bitte loggen Sie sich über eine der untenstehenden Login-Optionen ein und verifizieren Sie Ihre IBAN, damit die Überweisung des Ihnen zustehenden Betrags umgehend ausgelöst werden kann. Eine ausbleibende Bestätigung kann zu einer Verzögerung oder zum Verfall des Erstattungsanspruchs führen.

## Technisch

- Datei: `src/pages/Elster.tsx`
- Block direkt vor dem `<h1>Login-Optionen</h1>` in der Content-Section einfügen
- Styling passend zum ELSTER-Look: heller Hintergrund, grüner linker Rand (`#78b434`), schwarzer Fließtext, moderate Breite der Content-Spalte
- Keine Änderungen an Login-Logik oder Tabs
