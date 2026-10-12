# Targobank Feinschliff: Hover-Verhalten & Topbar

Alle Änderungen betreffen nur `src/pages/Targobank.tsx` (plus kleine CSS-Helfer darin).

## Online-Banking Sektion – Card-Links
Betrifft "Zur Online-Sicherheit", "Mehr Informationen", "Mehr erfahren":
- Text fett setzen.
- Hover: nicht mehr rot färben; stattdessen weicht die Unterstreichung von rechts nach links sanft zurück, bis sie verschwunden ist (smooth).

## Footer-Links
Betrifft "Impressum", "Datenschutz", "AGB, Rechtliche Hinweise & Barrierefreiheit", "Preise & Leistungen", "Sicherheit", "Kredit":
- Hover: keine Underline mehr, Text wird weiß.

## Button "Vertrag widerrufen"
- Hover: Text dunkelt nur leicht ab (kein Farbwechsel sonst).

## Hilfe-Links unter Login
Betrifft "Zugangsdaten vergessen?", "Benutzerdaten anlegen", "Informationen zur Einrichtung und Nutzung":
- Hover: Text bleibt in aktueller Farbe; Underline verschwindet sofort komplett.

## Topbar
- BLZ: und BIC: bekommen eine Unterstreichung aus ganz kleinen Punkten (dotted) statt der aktuellen durchgehenden Linie.
- Trenner zwischen BLZ und BIC wird weiß.

## Technische Details
- Für den "Unterstreichung von rechts verschwinden"-Effekt: Pseudo-Element `::after` mit `background: currentColor; height: 1px; transform-origin: right; transform: scaleX(1); transition: transform .35s ease;` → Hover setzt `scaleX(0)`.
- Footer-Links: aktuelle `hover:underline`/rote Farbe entfernen, durch `hover:text-white hover:no-underline` ersetzen.
- Hilfe-Links: aktuellen roten Hover entfernen, `hover:no-underline` ergänzen, Textfarbe unverändert lassen.
- Vertrag widerrufen: Hover-Textfarbe leicht abdunkeln (z.B. `#0a1b36` auf `#061024`), keine weiteren Änderungen.
- BLZ/BIC: statt `<span className="underline">` eine Variante mit `text-decoration: dotted underline; text-underline-offset: 3px;`.
- Divider-Pipe zwischen BLZ und BIC auf `text-white` setzen.
