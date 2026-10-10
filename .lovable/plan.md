# Hero-Feinschliff `/de/hypovereinsbank`

## Änderungen in `src/pages/Hypovereinsbank.tsx`

1. **Entfernen:**
   - Hinweistext „Bitte überprüfen Sie immer die Korrektheit der Browser-URL:“ inkl. Info-Icon
   - Graue URL-Pille „my.hypovereinsbank.de/…“
   - Komplette Warnbox unten in der Login-Karte (Datum `06.08.2026` + „Warnung – Phishing E-Mails im Namen der HVB“)

2. **Info-Icons bei „Direct Banking Nummer“ und „Passwort“:**
   - Statt lucide `Info` ein kleiner gefüllter grauer Kreis (ca. 14 px, Hintergrund `#9b9b9b`) mit weißem „i“
   - Klickbar: öffnet rechts daneben ein Popover (Sprechblase mit Pfeil nach links auf das Icon)

3. **Popover-Inhalte:**
   - Direct Banking Nummer: „Ihre Direct Banking Nummer finden Sie in Ihren Anmeldeunterlagen.“
   - Passwort: „Bitte prüfen Sie, ob Sie Ihr 6-10-stelliges Passwort verwendet haben und nicht versehentlich Ihre appTAN PIN (Zahlenkombination, nur für Transaktionsfreigaben). Sollten Sie sich erstmalig zum Online Banking anmelden, verwenden Sie bitte Ihren 5-stelligen Einstiegscode, welchen Sie bei der Registrierung erhalten haben.“

4. **Popover-Stil:**
   - Hintergrund `#bfebf3`, Text `#262626`, Border `1px solid #262626`
   - Oben rechts Schließen-X in `#007a91`
   - Pfeil/Spitze links, die auf das Info-Icon zeigt (CSS mit `::before`/`::after`-Dreiecken, Border und Fill passend)
   - Jeweils nur eines offen; Klick außerhalb oder X schließt

Keine weiteren Änderungen an Layout, Abständen, Header, Mobile etc.
