# Targobank Mobile Feinschliff (anweisung-651)

Nur Mobile (`/de/targobank`). Desktop bleibt unverändert.

## Änderungen

1. **Topbar auf Mobile ausblenden** — die obere Leiste mit „Privatkunden / Geschäftskunden / Firmenkunden / BLZ 300 209 00 | BIC: CMCIDEDD“ wird mobil komplett versteckt (`hidden lg:…`).
2. **Login-Card** — seitliches Padding/Abstand zum Bildschirmrand verringern.
3. **Checkbox + „Meinen Benutzernamen speichern“** mobil horizontal zentriert.
4. **Hilfe-Links** („Zugangsdaten vergessen?“, „Benutzerdaten anlegen“, „Informationen zur Einrichtung und Nutzung“) mobil linksbündig untereinander, als Block zentriert.
5. **Footer-Umbau mobil** als 20/80-Grid:
   - Links (20%): Icon.
   - Rechts (80%): jeder Punkt in eigener Zeile untereinander, ohne Trennstriche:
     - Impressum
     - Datenschutz
     - AGB, Rechtliche Hinweise & Barrierefreiheit
     - Preise & Leistungen
     - Sicherheit
     - Kredit
     - Vertrag widerrufen (als Button, in derselben Spalte unter „Kredit“)
6. **Sprachumschalter DE | EN** mobil nach unten rechts.

## Technisch

- Änderungen nur in `src/pages/Targobank.tsx`.
- Mobile-only via fehlende/`lg:`-Breakpoints; Desktop-Layout (Topbar, Footer-Zeile, Sprachumschalter-Position) bleibt via `lg:`-Klassen erhalten.
- Keine Logikänderungen, keine neuen Routen/Assets.
