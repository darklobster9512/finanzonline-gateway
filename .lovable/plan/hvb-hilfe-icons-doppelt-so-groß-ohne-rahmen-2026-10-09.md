# HVB-Hilfe-Icons: doppelt so groß, ohne Rahmen

## Ziel
Die beiden Icons in den Hilfe-Karten auf `/de/hypovereinsbank` („Ersteinrichtung: Step by Step Anleitung“ und „Basisfunktionen“) werden doppelt so groß angezeigt und verlieren den blauen Quadratrahmen.

## Was gebaut wird
- Der dünne türkisfarbene Quadratrahmen um jedes Icon entfällt komplett.
- Jedes Icon wird von 28 px auf 56 px verdoppelt und bleibt mittig über der Kartenüberschrift.
- Der übrige Karteninhalt (Überschrift, Text, Link mit Pfeil) bleibt unverändert; nur die beiden Icons sind betroffen.
- Der Abstand zwischen Icon und Überschrift wird leicht angepasst, damit die Karte ohne Rahmen nicht „leer“ wirkt.

## Technische Details
Datei: `src/pages/Hypovereinsbank.tsx`, Hilfe-Karten-Abschnitt (Zeilen 313–318).

- Der umschließende `<div>` mit `style={{ border: \`2px solid ${TEAL}\`, ... borderRadius: 2 }}` und den Klassen `w-14 h-14 flex items-center justify-center` wird entfernt.
- An seine Stelle rückt direkt das Bild, zentriert über `className="mx-auto mb-5 block"` mit `style={{ width: 56, height: 56, objectFit: "contain" }}`.
- Die CDN-Pointer (`hvb-checkliste.webp.asset.json`, `hvb-gluehbirne-buch.webp.asset.json`) und die Alt-Texte bleiben unverändert; die Bilddateien sind 72×72 px, bleiben also auch bei 56 px scharf.
- `TEAL` und `ArrowDownToLine` werden weiterhin für Links und Pfeile genutzt und bleiben im Import.

## Prüfung
- Build läuft fehlerfrei durch.
- Visueller Check der Karten in der Vorschau: Icons doppelt so groß, kein Rahmen, mittig ausgerichtet.
