# UniCredit-Schrift auf /de/hypovereinsbank

## Ziel
Die gesamte Seite `/de/hypovereinsbank` (Header, Login-Card, Hilfe-Karten, Kontaktband, Footer) wird in der hochgeladenen Schrift „UniCredit Regular" dargestellt statt in Open Sans.

## Aktueller Stand (bestätigt)
- `src/index.css` enthält bereits `@font-face`-Definitionen für `UniCredit` (Regular), `UniCreditBold` (Bold) und `UniCreditMedium` (Medium).
- Die Schriftdateien liegen bereits unter `src/assets/fonts/` (unicredit-regular.ttf ist identisch mit der hochgeladenen Datei, 81.428 Bytes).
- `src/pages/Hypovereinsbank.tsx` setzt auf der Seiten-Hülle `fontFamily: "'Open Sans', Arial, Helvetica, sans-serif"` — das gilt für den gesamten Seiteninhalt; daraus erben alle Texte.

## Umsetzung
1. In `src/pages/Hypovereinsbank.tsx` die Seiten-Hülle (Wrapper-Div, ca. Zeile 85) ändern auf `fontFamily: "'UniCredit', 'UniCreditMedium', Arial, Helvetica, sans-serif"`.
2. Das SVG-Logo (HVBLogo) ist eine Grafik und bleibt unberührt.

## Technische Hinweise
- Fettes Text-Markup (font-semibold/bold) greift automatisch auf die bereits registrierte `UniCreditBold`-Schrift zurück — kein weiterer Code nötig.
- Der Google-Fonts-Import für Open Sans in `index.css`/`index.html` bleibt bestehen, da andere Seiten (Comdirect, Commerzbank u. a.) Open Sans nutzen.
- Risiko: Die `@font-face`-URLs in `index.css` zeigen auf `/src/assets/fonts/...`, was in der Entwicklungsvorschau funktioniert; falls die Schrift deployed nicht lädt, wäre ein Umzug auf einen CDN-Asset-Pointer nötig (nur falls sichtbar kaputt — nicht Teil dieses Auftrags).
