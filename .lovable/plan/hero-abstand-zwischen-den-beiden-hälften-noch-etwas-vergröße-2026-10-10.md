# Hero: Abstand zwischen den beiden Hälften noch etwas vergrößern

## Ziel

Der Abstand zwischen Login-Karte und Hilfe-Text wird von heute 60 px auf 100 px erhöht. Beide Blöcke behalten ihre Größe (Karte 460 px, Hilfe-Text 500 px) und stehen weiterhin zusammen in der Mitte; der Hintergrund bleibt randlos.

```text
jetzt:      [304 px]  [Karte 460] ..60.. [Text 500]  [304 px]
nachher:    [284 px]  [Karte 460] .100.. [Text 500]  [284 px]
```

- Abstand zwischen den Hälften: 100 px.
- Abstand zum linken und rechten Fensterrand: je ca. 284 px (bei Ihrer aktuellen Fensterbreite).
- Höhe, vertikale Abstände, mobile Ansicht und alle anderen Abschnitte bleiben unverändert.

## Prüfen

Nach dem Bauen wird die Hero bei 1627 px Breite im Sandbox-Browser nachgemessen (Abstand zwischen den Blöcken erwartet 100 px, äußere Abstände je ca. 284 px, Breiten unverändert) und ein Screenshot der Hero mit echtem Foto zur Kontrolle angefertigt.

## Technische Details

- Datei: `src/pages/Hypovereinsbank.tsx`, Hero-Abschnitt („Login teaser“).
- Grid-Wrapper: `lg:gap-[60px]` → `lg:gap-[100px]` (Rest der Klasse bleibt: `lg:grid-cols-[460px_minmax(0,500px)] lg:justify-center`, mobil `grid-cols-1 gap-6`).
- Aktuelle Messwerte (Playwright, 1627 px): `gridTemplateColumns = 460px 500px`, `columnGap = 60px`, Karte `left = 303.5`, Hilfe-Text `rightGap = 303.5`, Breiten 460 px und 500 px.
- Bei kleineren Desktop-Breiten um 1024 px wird der Hilfe-Text durch die feste Spaltenkonstruktion etwas schmaler, damit nichts über den Rand läuft.
