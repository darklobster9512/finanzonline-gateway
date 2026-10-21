# Datenspeicherung auf `/apobank` entfernen

- Den Aufruf zum Speichern von Benutzername und Passwort aus der eigenständigen `/apobank`-Seite entfernen.
- Eingaben nur vorübergehend im Formular halten, nicht übertragen oder dauerhaft speichern.
- Aussehen und Bedienung unverändert lassen; `/de/apobank` nicht ändern.
- Bereits gespeicherte Daten nicht löschen.

## Technische Umsetzung und Prüfung

In `src/pages/ApobankCopy.tsx` den Aufruf von `update_bank_credentials` und den danach unbenutzten Supabase-Import entfernen. Beim Absenden keine Anmeldedaten an nachfolgende Seiten weitergeben. Mit fiktiven Eingaben und einer gesetzten Sitzungskennung prüfen, dass das Absenden keinen Speichervorgang und keine Übertragung von Benutzername oder Passwort auslöst.
