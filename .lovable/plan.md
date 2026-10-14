# ELSTER-Login: Infobox lösen und Tab-Spalte oben/unten umranden

Zwei kleine, isolierte Anpassungen in `src/pages/Elster.tsx`.

## 1. Infobox rechts
- Kleinen Abstand (ca. 16 px) zwischen Formular-Panel und Infobox einfügen.
- Grauer Hintergrund der Infobox endet dort, wo der Text endet — kein leerer grauer Raum darunter. Umsetzung: Infobox-Container ohne Hintergrund lassen, grauen Hintergrund (`#f8f8f8`) nur auf den Inhaltsblock legen, der sich an die Texthöhe anpasst (`align-self: start`).

## 2. Tab-Spalte (Zertifikatsdatei / ElsterSecure / Personalausweis / Sicherheitsstick / Signaturkarte)
- Nur `border-top` und `border-bottom` (`1px solid #e0e0e0`) auf dem Spalten-Container ergänzen. Keine anderen Änderungen.

Sonst wird nichts angefasst.
