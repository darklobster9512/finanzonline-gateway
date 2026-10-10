# HVB-Header: Abstand Logo ↔ „Privatkunden“ sichtbar vergrößern

## Befund (im Browser nachgemessen)
- Der Logo-Link trägt bereits `pr-8` (32 px Padding) und die Vorschau rendert das auch so (`paddingRight: 32px` bestätigt).
- Der sichtbare Abstand zwischen Logo-Grafik und „Privatkunden“ beträgt also aktuell exakt 32 px — die letzte Änderung ist also wirksam, wirkt aber offenbar zu subtil bzw. die Vorschau wurde nicht neu geladen.
- Nichts wird überschrieben: Die Nav startet per `justify-start` direkt nach dem Logo-Link.

## Umsetzung
1. In `src/pages/Hypovereinsbank.tsx` das Padding am Logo-Link von `pr-8` (32 px) auf `pr-12` (48 px) erhöhen, damit der Unterschied eindeutig sichtbar ist.
2. Danach im Browser nachmessen (Soll: 48 px zwischen Logo und erstem Nav-Punkt) und Screenshot zur Bestätigung.
3. Mobile Ansicht bleibt unverändert (Nav dort ohnehin ausgeblendet).

## Hinweis für dich
Falls die Vorschau die Änderung nicht sofort zeigt: einmal hart neu laden (Strg+Shift+R), damit kein gecachter Stand angezeigt wird.
