# Zurück-Link anpassen

Den "Zurück"-Link auf dem Passwort-Schritt im selben Stil wie den "Zugangsdaten vergessen?"-Link darstellen.

## Änderung

In `src/pages/DeutscheBank.tsx` (Zeile ~180–187):

- Klassen auf `text-[13px] font-bold underline` setzen (statt `text-[14px] underline`).
- Farbe bleibt `LINK` (`#0550d1`).
- Pfeil-Icon `ArrowLeft` bleibt als kleines Zeichen vor dem Text.
