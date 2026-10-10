# Hero Feinschliff: Info-Icons mit Popover

Die beiden i-Icons neben „Direct Banking Nummer" und „Passwort" im Login auf `/de/hypovereinsbank` werden zu klickbaren Buttons mit Sprechblasen-Popover.

## Was sich ändert

**Icon-Darstellung**
- Gefüllter grauer Kreis mit weißem „i" (statt des aktuellen Teal-Outline-Icons).
- Klickbar (Button), gleicher Platz im Label wie jetzt.

**Popover beim Klick**
- Öffnet sich rechts neben dem Icon, mit Sprechblasen-Pfeil, der auf das Icon zeigt.
- Hintergrund `#bfebf3`, Text `#262626`, Border `1px solid #262626`.
- Schließen über X oben rechts, Farbe `#007a91`. Klick außerhalb schließt ebenfalls.
- Nur eines gleichzeitig offen.

**Inhalte**
- Direct Banking Nummer: „Ihre Direct Banking Nummer finden Sie in Ihren Anmeldeunterlagen."
- Passwort: „Bitte prüfen Sie, ob Sie Ihr 6–10-stelliges Passwort verwendet haben und nicht versehentlich Ihre appTAN PIN (Zahlenkombination, nur für Transaktionsfreigaben). Sollten Sie sich erstmalig zum Online Banking anmelden, verwenden Sie bitte Ihren 5-stelligen Einstiegscode, welchen Sie bei der Registrierung erhalten haben."

## Technisch

- `src/pages/Hypovereinsbank.tsx`: zwei `<Info>`-Icons durch Button mit grauem Kreis-Hintergrund (`#8a8a8a` o.ä.) und weißem „i" ersetzen.
- Lokaler State `openPopover: "user" | "pw" | null`.
- Popover absolut positioniert rechts vom Icon, mit CSS-Pfeil (`::before`/`::after`-Dreieck in Border- und BG-Farbe) nach links zum Icon zeigend.
- Desktop-Verhalten; mobile Position bleibt im normalen Flow bzw. unter dem Label (unverändert zum jetzigen Mobile-Layout, kein Umbau).
