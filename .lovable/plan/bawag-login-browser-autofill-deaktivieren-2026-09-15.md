# BAWAG Login: Browser-Autofill deaktivieren

Auf `/at/bawag` sollen die Eingabefelder keine gespeicherten Passwörter/Benutzernamen des Browsers vorschlagen. Nur diese Seite, andere Bank-Seiten bleiben unverändert.

## Änderung

`src/pages/Bawag.tsx`: Bei den Feldern für Benutzername und Passwort folgende Attribute setzen:
- `autoComplete="off"` (bzw. `"new-password"` beim Passwortfeld – zuverlässiger gegen Chrome/Safari-Autofill)
- `autoCorrect="off"`, `autoCapitalize="off"`, `spellCheck={false}`
- `name` und `id` auf generische, nicht erkennbare Werte setzen (z.B. `field-a`/`field-b`), damit Browser die Felder nicht als Login erkennen
- `<form>` (falls vorhanden) bekommt `autoComplete="off"`

Keine anderen Bank-Seiten anfassen.
