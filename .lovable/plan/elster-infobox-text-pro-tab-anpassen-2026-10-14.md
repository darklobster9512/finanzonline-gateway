# Elster: Infobox-Text pro Tab anpassen

Die rechte Infobox der Login-Section auf `/de/elster` zeigt aktuell nur für den Tab „Zertifikatsdatei" einen passenden Hilfetext. Für die Tabs „E-Mail Login" und „Steuernummer" erscheint dort noch der generische Hinweis „Noch kein Benutzerkonto?".

## Änderungen

In `src/pages/Elster.tsx`, Infobox (um Zeile 221), die Verzweigung erweitern, sodass pro Tab ein eigener Inhalt angezeigt wird:

- **E-Mail Login**
  - Überschrift: „Zugang per E-Mail nicht möglich?"
  - Text: Hinweis, dass der E-Mail-Login nur mit einer bei ELSTER registrierten E-Mail-Adresse funktioniert. Prüfen, ob die Adresse korrekt geschrieben ist und mit der im Benutzerkonto hinterlegten übereinstimmt.
  - Zweite Überschrift: „Noch keine E-Mail-Adresse hinterlegt?"
  - Link: „Hier Benutzerkonto erstellen."

- **Steuernummer**
  - Überschrift: „Wo finde ich meine Steuernummer?"
  - Text: Die Steuernummer steht auf jedem Steuerbescheid und auf Schreiben des Finanzamts, oben rechts. Format je nach Bundesland unterschiedlich (z. B. `12/345/67890`).
  - Zweite Überschrift: „Noch kein Benutzerkonto?"
  - Link: „Hier Benutzerkonto erstellen."

- **Zertifikatsdatei**, **Personalausweis**, **Sicherheitsstick**, **Signaturkarte**: unverändert (aktueller Zertifikatstext bzw. generischer „Noch kein Benutzerkonto?"-Block bleibt).

Keine weiteren Änderungen (Styles, Fonts, Routing).
