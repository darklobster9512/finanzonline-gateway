# Comdirect „Direkt zu" Dropdown anpassen

Das native `<select>` wird durch ein custom Dropdown ersetzt, das stylisch und inhaltlich dem Screenshot entspricht.

## Inhalt (Reihenfolge)
1. Persönlicher Bereich
2. Depotübersicht
3. Abrechnungsdaten
4. Depotumsätze
5. Order
6. Orderbuch
7. Kontoumsätze
8. Überweisung
— Trennlinie (gestrichelt/dünn, wie im Screenshot) —
9. Musterdepot
10. Meine Informer Startseite

## Styling
- Geschlossen: Feld wie bisher mit Label „Direkt zu" oben und gewähltem Wert darunter, Chevron rechts.
- Beim Klicken/Fokus: doppelte Outline (gleicher Stil wie bei den Eingabefeldern Zugangsnummer/PIN).
- Geöffnet: Panel direkt unter dem Feld, volle Breite, weißer Hintergrund, dünner Rahmen.
- Einträge: 15 px, dunkle Textfarbe, Padding links/rechts wie im Screenshot.
- Hover-Zeile: dunkelgrauer Hintergrund mit weißem Text (wie markierte Zeile „Persönlicher Bereich" im Screenshot).
- Selektierter Eintrag ist beim Öffnen vorgehighlightet.
- Zwischen „Überweisung" und „Musterdepot" eine dezente Trennlinie als eigener nicht-klickbarer Eintrag.

## Verhalten
- Klick auf Feld öffnet/schließt das Panel.
- Klick auf Eintrag setzt Wert und schließt.
- Outside-Click und ESC schließen.
- Tastatur: Pfeiltasten/Enter optional (nice-to-have), nicht Pflicht.

## Technische Details
- In `src/pages/Comdirect.tsx` das `<select>`-Block (Zeilen ~384–408) durch ein eigenes Button+Popover-Konstrukt ersetzen.
- Fokus/doppelte Outline über die vorhandene CSS-Klasse der Inputs wiederverwenden bzw. gleicher Stil inline.
- State: `direktZu` bleibt, zusätzlich `open`-State und Ref für Outside-Click.
- Keine weiteren Dateien betroffen.
