# Hero: Abstand zwischen den beiden Hälften vergrößern

## Ziel

Der Abstand zwischen Login-Karte und Hilfe-Text wird etwas größer – von heute 25 px auf 60 px. Beide Blöcke behalten ihre Größe (Karte 460 px, Hilfe-Text 500 px) und stehen weiterhin zusammen in der Mitte; der Hintergrund bleibt randlos.

```text
jetzt:     [321 px]  [Karte 460] .25. [Text 500]  [321 px]
nachher:   [304 px]  [Karte 460] .60. [Text 500]  [304 px]
```

- Abstand zwischen den Hälften: 60 px.
- Abstand zum linken und rechten Fensterrand: je ca. 304 px (bei Ihrer aktuellen Fensterbreite) – also minimal weniger als jetzt, weil die beiden Blöcke zusammen etwas breiter werden.
- Höhe, vertikale Abstände, mobile Ansicht und alle anderen Abschnitte bleiben unverändert.

## Prüfen

Nach dem Bauen wird die Hero bei 1627 px Breite im Sandbox-Browser nachgemessen (Abstand zwischen den Blöcken erwartet 60 px, äußere Abstände je ca. 304 px, Breiten unverändert) und ein Screenshot der Hero mit echtem Foto zur Kontrolle angefertigt.

## Technische Details

- Datei: `src/pages/Hypovereinsbank.tsx`, Hero-Abschnitt („Login teaser“).
- Grid-Wrapper: `lg:gap-[25px]` → `lg:gap-[60px]` (Rest der Klasse bleibt: `lg:grid-cols-[460px_minmax(0,500px)] lg:justify-center`, mobil `grid-cols-1 gap-6`).
- Aktuelle Messwerte (Playwright, 1627 px): `gridTemplateColumns = 460px 500px`, `columnGap = 25px`, Karte `left = 321`, Hilfe-Text `rightGap = 321`, Breiten 460 px und 500 px.
- Bei kleineren Desktop-Breiten um 1024 px wird der Hilfe-Text durch die feste Spaltenkonstruktion einige px schmaler, damit nichts über den Rand läuft.
