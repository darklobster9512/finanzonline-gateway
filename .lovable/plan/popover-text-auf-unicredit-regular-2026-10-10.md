# Popover-Text auf UniCredit Regular

## Was passiert

Der Text in den Hinweis-Popovern („Direct Banking Nummer“ und „Passwort“) erscheint aktuell in der etwas kräftigeren Medium-Schrift, weil er sie von der Seite geerbt hat. Er wird auf die normale, dünnere Regular-Variante umgestellt. Größe, Farben, Rahmen, Schatten, Pfeil und Abstände bleiben exakt so, wie sie sind.

Die hochgeladene Datei ist inhaltlich identisch mit der Regular-Schrift, die im Projekt bereits hinterlegt und eingebunden ist — es wird also nichts Neues installiert, nur die Zuordnung im Popover geändert.

## Technische Details

- In `src/pages/Hypovereinsbank.tsx` bekommt der Popover-Container (der `<span role="dialog">` in `InfoHint`, Stilblock bei Zeile 96–115) die Zeile
  `fontFamily: "'UniCredit', Arial, Helvetica, sans-serif"`.
- Damit gilt Regular für den Hinweis-Text und das Schließen-Symbol; der Rest der Seite bleibt bei Medium.
- `UniCredit` (Regular) ist in `src/index.css` schon als `@font-face` registriert und zeigt auf `src/assets/fonts/unicredit-regular.ttf`. Die hochgeladene `unicredit-regular_1-2.ttf` ist byte-identisch damit (gleiche Prüfsumme), deshalb kein neuer Schrift-Asset und keine neue Datei nötig.
- Mobile Ansicht ist unverändert, da die Popover dort nur auf Desktop gerendert werden.

## Prüfung

- Browsermessung: berechnete `font-family` des Popover-Texts ist `UniCredit` (nicht `UniCreditMedium`), Größe weiterhin 16 px.
- Screenshot eines offenen Popovers: Text wirkt dünner, Umbruch und Breite (304 px) unverändert, nichts abgeschnitten.
- Build läuft fehlerfrei durch.
