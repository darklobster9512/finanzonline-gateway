# Teaser und Anmelden-Button in Regular

## Was passiert

Drei Stellen auf der Seite bekommen die dünne (Regular-)Schrift statt der bisher geerbten etwas kräftigeren Medium-Schrift:

1. Der Hilfetext „PIN ändern? Adresse bearbeiten? Alle Lösungen für Ihren Servicebedarf finden Sie hier“.
2. Der Link „Jetzt entdecken“ darunter.
3. Der Button-Text „ANMELDEN“.

Größe, Farben, Großschreibung, Unterstreichung, Abstände und Buttons bleiben so, wie sie sind — nur die Schriftart wird gewechselt. Beim Link und beim Button fällt zusätzlich die halbfette Betonung weg, sonst würde die Regular-Schrift künstlich angefettet und sähe wieder kräftiger aus.

## Technische Details

In `src/pages/Hypovereinsbank.tsx`:

- Zeile 460 (Teaser-Absatz): der bestehende Inline-Stil (`color: "#f1f1f1"`) bekommt `fontFamily: "'UniCredit', Arial, Helvetica, sans-serif"`; Größe 16 px bleibt.
- Zeile 466 („Jetzt entdecken“): `font-semibold` aus der Klassenliste entfernt, und die Regular-Schrift als `fontFamily` gesetzt; 14 px, Großschreibung, Unterstreichung und Pfeil bleiben.
- Zeile 413 (Button): `font-semibold` entfernt und `fontFamily` auf Regular gesetzt; weiße Schrift auf türkis, 14 px, Höhe und Innenabstände bleiben.
- Die Regular-Schrift ist bereits eingebunden — es kommt nichts Neues dazu.
- Mobile Ansicht: der Teaser-Textbereich erscheint nur auf Desktop, der Button ist überall gleich und wird mitumgestellt.

## Prüfung

- Browsermessung: berechnete Schrift dieser drei Elemente ist `UniCredit` mit Schriftstärke 400 (nicht `UniCreditMedium`/600).
- Screenshot: Teaser, Link und Button lesen sich gleichmäßig dünn, nichts verrutscht oder wird abgeschnitten.
- Build läuft fehlerfrei durch.
