# Targobank Feinschliff – Mobile

Alle Änderungen nur in `src/pages/Targobank.tsx`, ausschließlich im Mobile-Viewport (unter `lg`). Desktop bleibt unverändert.

## Änderungen

1. **Topbar auf Mobile ausblenden** – Links „Privatkunden / Geschäftskunden / Firmenkunden“ sowie „BLZ: 300 209 00 | BIC: CMCIDEDD“ auf Mobile verstecken.
2. **Login-Card** – seitliches Padding zum Viewport-Rand verringern.
3. **Checkbox + „Meinen Benutzernamen speichern“** – gemeinsam horizontal zentrieren.
4. **Hilfe-Links** („Zugangsdaten vergessen?“, „Benutzerdaten anlegen“, „Informationen zur Einrichtung und Nutzung“) linksbündig zentriert als Block (links aligned text, Block zentriert).
5. **Footer-Layout 20/80**
   - Linke Spalte (20%): Icon
   - Rechte Spalte (80%): Footer-Punkte je in eigener Zeile, untereinander, ohne Divider:
     - Impressum
     - Datenschutz
     - AGB, Rechtliche Hinweise & Barrierefreiheit
     - Preise & Leistungen
     - Sicherheit
     - Kredit
     - Vertrag widerrufen (direkt unter „Kredit“)
6. **Sprachumschalter DE | EN** – auf Mobile unten rechts im Footer platzieren.

Desktop-Styling bleibt überall erhalten (`lg:`-Breakpoints für Mobile-only Regeln).
