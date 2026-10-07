# Deutsche Bank Login – Begrüßung und EN-Text

## Änderungen in `src/pages/DeutscheBank.tsx`

1. **EN-Duplikat beheben**: `secNews` auf Englisch von `"Security at a glance"` auf `"Current security information"` ändern. `secOverview` bleibt `"Security at a glance"`. (DE war schon unterschiedlich.)

2. **Tageszeit-abhängige Begrüßung**: Ab 17:00 Uhr Berliner Zeit wird aus
   - `"Guten Tag"` → `"Guten Abend"`
   - `"Hello"` → `"Good evening"`

   Umsetzung: Berliner Stunde über `Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', hour: 'numeric', hour12: false })` ermitteln. Wert einmal beim Rendern berechnen und je Sprache den passenden Gruß aus `t.greeting` bzw. einer neuen `t.greetingEvening` wählen.
