# HVB Mobile-Ansicht optimieren

Nur Mobile (`<lg`). Desktop bleibt komplett unverändert.

## Header
- Links neben dem HVB-Logo ein Hamburger-Icon (Button, ohne Funktion/Platzhalter).
- Banking-Login-Kachel rechts: Textzeile „BANKING LOGIN“ entfernen, nur das große Login-Icon im roten Feld anzeigen.

## Login-Card
- „Zugangsdaten vergessen/gesperrt?“ bleibt genau wie jetzt (2 Zeilen, Styling unverändert).
- „Anmelden“-Button rückt auf Mobile unter diesen Link (eigene Zeile, volle Breite der Card), nicht daneben.

## Unter der Login-Card (Mobile)
- Der aktuell nur auf Desktop sichtbare Hilfe-Teaser wird auf Mobile ebenfalls angezeigt:
  - Überschrift „Hilfe & Services – 24/7 erreichbar!“
  - Text „PIN ändern? Adresse bearbeiten? …“
  - Link „Jetzt entdecken ›“
- Textfarbe auf Mobile dunkel (nicht weiß), da unter der Card bereits weißer/heller Bereich liegt.

## „Sie haben eine Frage?“-Sektion (Mobile)
- Überschrift „Sie haben eine Frage?“ etwas kleiner.
- Layout untereinander, alles mittig zentriert:
  1. Telefon-Icon (eigene Zeile)
  2. Telefonnummer (etwas kleiner als jetzt)
  3. „Mo – Fr …“-Text
  4. Die 3 Buttons jeweils in eigener Zeile, zentriert, volle oder einheitliche Breite.

## Footer (Mobile)
- Komplett mittig zentriert.
- Jeder Footer-Link (Impressum, Rechtliche Hinweise, Datenschutz, Barrierefreiheit, Geschäftsbedingungen & Konditionen, Lob & Kritik, Whistleblowing & Meldungen i.S.d. LkSG, Privatsphäre-Einstellungen) in einer eigenen Zeile. Trennstriche nur Desktop (bereits so).
- Reihenfolge der Blöcke unten: Linkliste → Copyright → UniCredit/Ferrari-Logos → „Privatsphäre-Einstellungen“? 
  - Vorgabe: UniCredit-/Ferrari-Logo zwischen Copyright und „Privatsphäre-Einstellungen“. Daher auf Mobile:
    1. Alle Footer-Links außer „Privatsphäre-Einstellungen“ (jeweils eigene Zeile, zentriert)
    2. © 2026 HypoVereinsbank
    3. UniCredit-Logo + Ferrari-Logo (zentriert, untereinander)
    4. Privatsphäre-Einstellungen

## Technisch
- Datei: `src/pages/Hypovereinsbank.tsx`.
- Hamburger-Button in Mobile-Headerzeile (`flex lg:hidden`) vor dem Logo; Logo-Link `pr-12` bleibt.
- Mobile-Banking-Login-Block (Z. 302–319): Textspan entfernen, Icon vergrößern.
- Login-Form Button-Row (Z. 394–413): auf Mobile `flex-col items-stretch`, Desktop weiter `flex-row justify-between`.
- Hilfe-Teaser (Z. 448–466): Mobile sichtbare Variante direkt unter der Card, dunkle Textfarbe, mit `lg:hidden`; bestehender Desktop-Block bleibt `hidden lg:flex`.
- Kontaktband (Z. 524–556): Mobile-Variante mit `flex-col`, kleinerer Headline, kleinerer Nummer, Buttons `w-full` in `flex-col gap-3`. Desktop via `lg:`-Klassen erhalten.
- Footer-Linkreihen (Z. 581–617): Auf Mobile `flex-col` innerhalb jeder Zeile; „Privatsphäre-Einstellungen“ aus zweiter Reihe auf Mobile hinter den Logoblock verschoben (bedingt gerendert).
- Unterer Grid-Block (Z. 621–630): Mobile-Reihenfolge: Copyright, dann Logos (UniCredit + Ferrari zentriert untereinander), dann Privatsphäre-Link. Desktop-Grid unverändert via `lg:grid-cols-3`.
