# Commerzbank Links: Hover-Shift statt Underline, Pfeile vor Sicherheitshinweisen

## Änderungen in `src/pages/Commerzbank.tsx`

1. **Linke Spalte (Login-Links):** Bei
   - „Passwort vergessen?"
   - „Teilnehmernummer vergessen?"
   - „Zugang beantragen" (mit Pfeil)
   - „Wichtige Informationen zum Digital Banking" (mit Pfeil)

   `hover:underline` entfernen. Stattdessen beim Hovern den gesamten Link (Text + Pfeil) ein paar Pixel nach rechts verschieben — via `transition-transform` + `hover:translate-x-1`.

2. **Rechte Spalte (Sicherheitshinweise):** Bei den vier Einträgen
   - Pfeil **vor** den Text setzen (nicht dahinter)
   - gleiches Hover-Verhalten: kein Underline, Link verschiebt sich beim Hovern nach rechts

3. **Pfeil-Icon:** Das `ArrowRight`-SVG nutzt bereits exakt den gewünschten Pfad (`m16.81 4.42…`). Keine Änderung nötig, nur bestätigen, dass alle Pfeile diese Komponente verwenden.

Keine weiteren Änderungen an Layout, Farben oder Formular.
