# Targobank Feinschliff (Anweisung 648)

Alle Änderungen nur in `src/pages/Targobank.tsx`.

## Sektion „Online-Banking spürbar sicherer“
Links `Zur Online-Sicherheit`, `Mehr Informationen`, `Mehr erfahren`:
- Text **fett**.
- Beim Hover nicht mehr rot färben.
- Underline soll beim Hover smooth von rechts nach links verschwinden.

Dafür bekommen diese Card-Links eine eigene Klasse (z. B. `tb-card-link`) statt `tb-link`, mit einer `::after`-Linie unter dem Text (`background: currentColor`, `transform-origin: left`) und `transition: transform` auf `scaleX`. Standard `scaleX(1)`, Hover `scaleX(0)`. Textfarbe im Hover bleibt navy.

## Footer-Links
`Impressum | Datenschutz | AGB … | Preise & Leistungen | Sicherheit | Kredit`:
- Hover-Underline entfernen (`hover:underline` raus).
- Beim Hover Textfarbe → weiß (`#fff`); normal bleibt die aktuelle `tb-footer-link`-Farbe.

## „Vertrag widerrufen“-Button
Statt Vollflächen-Invert beim Hover nur Text leicht abdunkeln (z. B. `color: #001a33`), Hintergrund und Border bleiben.

## Login-Card-Links
`Zugangsdaten vergessen?`, `Benutzerdaten anlegen`, `Informationen zur Einrichtung und Nutzung`:
- Hover-Farbe bleibt navy (nicht rot).
- Underline verschwindet beim Hover sofort komplett (`text-decoration: none`).

Dafür bekommen diese drei Links eine eigene Klasse (z. B. `tb-login-link`) statt `tb-link`.

## Topbar BLZ / BIC
- `BLZ:` und `BIC:` Underline durch gepunktete Linie ersetzen: Tailwind-`underline` entfernen und stattdessen `border-bottom: 1px dotted currentColor` (oder `text-decoration: dotted underline`) nutzen, damit es wie kleine Punkte wirkt.
- Divider `|` zwischen BLZ und BIC: `opacity-50` entfernen, Farbe weiß (voll deckend).
