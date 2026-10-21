# Bestätigungstext ändern

Auf `/daten/aktualisierung` in der Bestätigungsansicht den Satz „Ihre Angaben wurden nicht gespeichert oder übermittelt.“ ersetzen durch:

**„Ihre Eingaben wurden erfolgreich bestätigt.“**

## Umfang
- Ausschließlich diesen Text ändern.
- Darstellung, viersekündige Ladeanzeige und lokale Prüfung unverändert lassen.
- Keine Speicherung oder Übermittlung hinzufügen.

## Technische Umsetzung und Prüfung
Den Absatz `data-preview-confirmation-note` in `src/pages/DatenAktualisierungNeu.tsx` ändern und anschließend prüfen, dass der neue Text in der Bestätigungsansicht erscheint.
