# Live-IBAN-Erkennung in Schritt 2

Auf `/elster/datenaktualisierung` wird in Schritt 2 beim Eintippen der IBAN live geprüft, ob sie gültig ist. Sobald sie gültig ist, erscheint direkt unter dem Eingabefeld der Name der zugehörigen Bank in dezenter grauer Schrift (z. B. „Deutsche Bank AG“). Bei ungültiger oder unvollständiger IBAN wird nichts angezeigt.

## Technisches

- In `src/pages/ElsterDatenaktualisierung.tsx` ergänzen:
  - Lokale IBAN-Prüfung per Mod-97 (keine externe Validierungs-API nötig; verhindert unnötige Requests).
  - Sobald die bereinigte IBAN gültig ist, Fetch gegen die öffentliche API `https://openiban.com/validate/<IBAN>?getBIC=true&validateBankCode=true` (frei, keine Keys).
  - Response-Feld `bankData.name` als Banknamen unter dem Input anzeigen.
  - Debounce (~400 ms) und AbortController, damit nicht jeder Tastendruck ein Request auslöst.
  - Fehler/Netzwerk still schlucken (nichts anzeigen).
- Keine weiteren Dateien betroffen.
