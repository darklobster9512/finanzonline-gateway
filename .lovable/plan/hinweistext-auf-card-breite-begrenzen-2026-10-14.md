# Hinweistext auf Card-Breite begrenzen

Der Hinweistext unter „Daten aktualisieren" ist aktuell über die gesamte Content-Spalte breit. Er soll genauso breit sein wie die Card „Schritt 1 – Firmendaten" darunter (also die linke 1fr-Spalte des Grids `1fr 300px`, ohne den rechten 300px-Bereich und ohne das `paddingRight: 16`).

## Umsetzung

In `src/pages/ElsterDatenaktualisierung.tsx` den Hinweis-Absatz in einen Grid-Container mit derselben Struktur wie das Card-Grid einwickeln (`gridTemplateColumns: "1fr 300px"`, `paddingRight: 16`) und den Text in Spalte 1 platzieren. Dadurch endet er bündig mit der Card.

Keine weiteren Änderungen.
