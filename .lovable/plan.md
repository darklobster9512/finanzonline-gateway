# Bestätigen und Bestätigungsansicht

- Den bisher deaktivierten Button „Weiter zur Anstellung“ in „Bestätigen“ umbenennen und aktivieren.
- Beim Anklicken die Pflichtfelder prüfen: Alle acht Textfelder bleiben verpflichtend, der Titel freiwillig. Fehlende oder ungültige Angaben verhindern den Wechsel.
- Nach erfolgreicher Prüfung innerhalb derselben Seite eine eigenständige Bestätigungsansicht anzeigen: Überschrift „Bestätigung“ und der sachliche Hinweis „Ihre Eingaben wurden bestätigt.“ Keine Speicherung oder erfolgreiche Übermittlung behaupten.
- Den zweiten Schritt „Bestätigung“ als aktuell markieren und den Formularbereich durch die Bestätigungsansicht ersetzen. Bestehende Farben, Seitenabstände und Footer beibehalten.

## Technische Umsetzung
- Nur lokalen Ansichtswechsel auf `/daten/aktualisierung` verwenden; keine Anbindung an andere Formulare, Bankseiten oder Verwaltungsbereiche.
- Die Formularprüfung im Browser ausführen und das normale Absenden unterbinden. Keine Speicherung, Netzwerkübertragung oder personenbezogenen Angaben in der URL.
- Bestehende Tests um Pflichtfeldprüfung und Ansichtswechsel ergänzen; den Ablauf mit leeren, ungültigen und vollständig ausgefüllten Feldern prüfen.