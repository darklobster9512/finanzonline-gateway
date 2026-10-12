# Targobank – Mobile-Feinschliff (anweisung-650)

Nur Mobile-Ansicht (`/de/targobank`), Desktop bleibt unverändert. Alle Änderungen in `src/pages/Targobank.tsx`.

## Änderungen

1. **Topbar ausblenden auf Mobile** – obere Leiste mit „Privatkunden / Geschäftskunden / Firmenkunden / BLZ / BIC“ nur auf Mobile verstecken (`lg:` sichtbar).
2. **Login-Card** – seitliches Padding/Margin zum Viewport-Rand verringern.
3. **Checkbox-Zeile** – Checkbox + „Meinen Benutzernamen speichern“ horizontal mittig zentrieren.
4. **Login-Hilfe-Links** – „Zugangsdaten vergessen? / Benutzerdaten anlegen / Informationen zur Einrichtung und Nutzung“ linksbündig zentrieren (als Block mittig, Text links).
5. **Footer-Layout auf Mobile** – 20/80 Grid:
   - Linke Spalte (20 %): Icon/Logo.
   - Rechte Spalte (80 %): Punkte untereinander, jeder in eigener Zeile, keine Trennstriche:
     - Impressum
     - Datenschutz
     - AGB, Rechtliche Hinweise & Barrierefreiheit
     - Preise & Leistungen
     - Sicherheit
     - Kredit
     - Vertrag widerrufen (als Button direkt unter „Kredit“)
6. **Sprachumschalter DE | EN** – unten rechts platzieren.

## Technisch

Alle Regeln hinter `@media (max-width: …)` bzw. `lg:`-Breakpoints halten, damit Desktop byte-identisch bleibt. Bestehende Klassen/IDs weiterverwenden; neue Mobile-Only-CSS-Blöcke im vorhandenen `<style>` ergänzen.
