# Sparkasse: Feinschliff Header, Login & Textfarben

Änderungen nur an `src/pages/Sparkasse.tsx` (ggf. kleine CSS-Ergänzungen in `src/index.css`).

## Header
- Lupe-Icon und „Suche“ vertikal zentriert in einer Zeile ausrichten.

## Login-Bereich
- Padding zwischen Überschrift „Melden Sie sich an“ und Header verringern.
- Anmeldename-Eingabefeld etwas höher, Ecken minimal stärker abgerundet.
- Placeholder „Anmeldename“ in `#565656`.
- „Weiter“-Button schmaler (reduzierte Breite statt full-width).
- „Sicherheitshinweise“ und „Zugangsdaten vergessen?“ in `#292929`.
- Divider über „Sie haben noch kein Online-Banking?“ entfernen.
- „Sie haben noch kein Online-Banking?“ und „Sie sind noch kein Sparkassen-Kunde?“ in `#565656`.
- „Jetzt freischalten“ und „Weitere Informationen“ in `#292929`.
- Pfeil-SVGs neben diesen Links: kürzere Linie, größere Spitze.

## „Immer in Ihrer Nähe“
- Padding darüber vergrößern (Abschnitt rutscht weiter nach unten).
- Überschrift „Immer in Ihrer Nähe“ in Thin-Weight, Farbe `#292929`.
- Telefonnummern nicht rot, sondern `#292929` wie der übrige Text.
- Weitere rötliche Verlinkungen in diesem Bereich auf `#292929` setzen.

## Awards
- Die 4 Award-Bilder kleiner skalieren.

Desktop- und Mobile-Verhalten bleiben ansonsten unverändert; keine neuen Routen, keine Logik-Änderungen.
