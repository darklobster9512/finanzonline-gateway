# Warnsymbole in der Commerzbank-Loginseite vereinheitlichen

## Problem
Die beiden Warnsymbole neben den Fehlermeldungen (Benutzername, Passwort) wirken unterschiedlich groß. Ursache: das SVG hat zwar 24x24, wird aber im Flex-Container ohne `shrink-0` gestaucht, sobald der Fehlertext mehrzeilig umbricht. Der Benutzernamen-Fehler hat deutlich mehr Text und schrumpft dadurch sein Icon.

## Lösung
In `src/pages/Commerzbank.tsx`:

- `WarningIcon` auf eine einheitliche, mittlere Größe setzen (20x20 — zwischen aktuell gerendert ~16 und 24).
- `shrink-0` am Icon ergänzen, damit es nie zusammengedrückt wird.
- Das Icon leicht vertikal zur ersten Textzeile ausrichten (kleines `mt`), damit es sauber bündig steht.

Keine weiteren Änderungen.
