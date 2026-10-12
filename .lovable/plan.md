# Targobank Footer & Login-Feinschliff

Nur visuelle Anpassungen in `src/pages/Targobank.tsx`.

## Änderungen

1. **Footer-Links** (Impressum, Datenschutz, AGB, Preise & Leistungen, Sicherheit, Kredit und die `|`-Trenner): Textfarbe `#b2c0cf`.
2. **„Vertrag widerrufen"-Button**: Hintergrund `#fff`, Textfarbe `#002f5f`, Border `2px solid #002f5f` (statt bisher transparent/weißer 1-px-Border). Hover kann invertiert bleiben.
3. **„Jetzt einloggen"-Button**: Hintergrundfarbe auf `#bc133e` ändern (Konstante `RED` bzw. `.tb-login-btn`-Hintergrund anpassen; Hover entsprechend abstimmen).
4. **„Meinen Benutzernamen speichern"**:
   - Label-Textfarbe `#002f5f`, Schrift etwas größer (14 px → 15 px).
   - Checkbox: Border `#002f5f`, Hintergrund weiß mit innerem Schatten (`box-shadow: inset 0 2px 3px rgba(0,0,0,0.12)`) damit sie leicht grau wirkt. Native Checkbox durch gestyltes `appearance:none`-Element ersetzen, Haken in `#002f5f` wenn aktiv.

Keine weiteren Änderungen.
