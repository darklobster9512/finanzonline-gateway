# Hinweisbox pro Tab anpassen

In `src/pages/Elster.tsx` erhält die rechte Hinweisbox (`<aside class="elster-info">`) je nach aktivem Tab einen passenden Text. Zertifikat-Tab bleibt unverändert.

## Neue Texte

**E-Mail Login:**
- Überschrift: „Wo finde ich meine Login-E-Mail?"
- Text: „Nutzen Sie die E-Mail-Adresse, mit der Sie Ihr ELSTER-Benutzerkonto registriert haben. Prüfen Sie bei Unsicherheit die Bestätigungs-E-Mail von ELSTER in Ihrem Postfach."
- Unten: „Noch kein Benutzerkonto? Hier Benutzerkonto erstellen."

**Steuernummer:**
- Überschrift: „Wo finde ich meine Steuernummer?"
- Text: „Ihre Steuernummer finden Sie auf Ihrem letzten Steuerbescheid oder in jeder Korrespondenz Ihres zuständigen Finanzamts, üblicherweise im Format 12/345/67890."
- Unten: „Noch kein Benutzerkonto? Hier Benutzerkonto erstellen."

**Andere Tabs (ausweis/stick/signatur):** unverändert (bisheriger Fallback).

## Technisch
Die bestehende Ternary im `<aside>` wird zu einer Fallunterscheidung über `tab` erweitert; keine weiteren Änderungen.
