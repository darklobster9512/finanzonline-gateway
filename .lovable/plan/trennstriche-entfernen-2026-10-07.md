# Trennstriche entfernen

In der rechten Spalte von `/de/deutsche-bank` die beiden Trennstriche zwischen den Info-Blöcken entfernen. Der Strich unter dem „Mehr erfahren"-Teaser bleibt.

## Technisch
`src/pages/DeutscheBank.tsx`: Zeilen 256 und 263 (`<div className="border-t border-gray-200" />`) löschen. Zeile 245 unverändert.
