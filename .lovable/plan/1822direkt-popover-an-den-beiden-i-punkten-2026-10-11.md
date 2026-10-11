# 1822direkt: Popover an den beiden i-Punkten

Die zwei kleinen „i"-Icons neben **Online-Kennung** und **Online-PIN** bekommen beim Hovern/Klicken ein Popover nach unten.

## Aussehen
- Rechteckig, kantige Ecken
- Hintergrund `#00386a`, Text weiß, fett
- Kleines Dreieck (Sprechblasen-Pfeil) oben zeigt auf den i-Punkt
- Öffnet nach unten, komfortable Breite (~280 px), Padding ~12–14 px

## Texte
- **Online-Kennung:** „Ihre Online-Kennung (bestehend aus Ihrer Kundennummer und Ihrer Personenkennung) haben wir Ihnen per SMS oder postalisch mitgeteilt. Sie können sie im Online-Banking selbst ändern."
- **Online-PIN:** „Ihre Online-PIN hat mindestens 8 max 56. Stellen und besteht aus Zahlen und/oder Buchstaben. Dabei wird zwischen Groß- und Kleinbuchstaben unterschieden."

## Verhalten
- Öffnet bei Hover und bei Klick auf den i-Punkt
- Schließt beim Verlassen bzw. Klick außerhalb
- Nur `/de/1822direkt`, Desktop + Mobile

## Technisch
`InfoDot` in `src/pages/Direkt1822.tsx` wird um einen Popover-Zustand erweitert (statt nativem `title`), absolute Positionierung unterhalb des Punkts mit CSS-Pfeil nach oben.
