# Hero: beide Hälften fast bündig zur Mitte (25 px Abstand)

## Ziel

Die linke Login-Karte und der rechte Hilfe-Text rücken noch weiter zusammen, so dass zwischen ihnen nur noch etwa 25 px Luft sind. Beide Blöcke behalten ihre heutige Größe (Karte 460 px, Hilfe-Text 500 px) – sie werden also nicht schmaler, sondern nur näher zusammen gerückt.

## Wie das umgesetzt wird

Statt den Innenabstand noch weiter aufzublähen (das würde die Karte mit der Spalte zusammendrücken), bekommt die Hero auf dem Desktop zwei feste Spalten mit exakt 25 px Abstand, die zusammen in der Mitte stehen:

```text
vorher (1627 px Fensterbreite)
[157 px]  [Karte 460] .... 240 px .... [Text 500]  [189 px]

nachher
[ca. 321 px]  [Karte 460] 25px [Text 500]  [ca. 321 px]
```

- Zwischen den beiden Hälften: 25 px.
- Abstand vom linken und rechten Fensterrand: je ca. 321 px (bei Ihrer aktuellen Fensterbreite) – nach außen also deutlich mehr als jetzt.
- Der Hintergrund bleibt wie bisher randlos über die ganze Breite.
- Die Höhe der Hero und die vertikalen Abstände bleiben gleich.
- Mobile bleibt unverändert: einspaltig, Karte über dem Text.

Damit der Hilfe-Text die vollen 500 px ausschöpfen kann, entfällt sein zusätzlicher Rechtsabstand von 32 px (bisher saß er 32 px zusätzlich vor dem Rand).

## Prüfen

Nach dem Bauen wird die Hero bei 1627 px Breite im Sandbox-Browser geöffnet (mit dem echten Foto, das in der lokalen Vorschau sonst nicht lädt) und gemessen: Abstand Karte/Text (erwartet 25 px), äußere Abstände (erwartet je ca. 321 px), Breiten unverändert 460 px und 500 px. Zusätzlich ein Screenshot der Hero zur Kontrolle.

## Technische Details

- Datei: `src/pages/Hypovereinsbank.tsx`, Hero-Abschnitt („Login teaser“).
- Grid-Wrapper: `max-w-[1360px] mx-auto px-4 lg:px-16 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-6`
  - Desktop: `lg:grid-cols-12` → `lg:grid-cols-[460px_minmax(0,500px)]`, `lg:gap-[25px]`, `lg:justify-center`; Innenabstand zurück auf `lg:px-6` (die Zentrierung erledigen jetzt die Spalten, großes Padding wäre sonst bei kleineren Desktop-Breiten ab 1024 px zu eng).
  - Mobil: `grid-cols-1`, `px-4`, `gap-6` bleiben.
- Rechter Block `text-white max-w-[500px] mb-8 ml-auto mr-8` → `mr-8` und `ml-auto` entfernt, `mb-8` bleibt.
- Linke Karte: `max-w-[460px]` bleibt; die Warnbox mit den negativen Randausgleichen bleibt unangetastet.
- Aktuelle Messwerte (Playwright, 1627 px): `padL/padR = 64px`, Karte `left = 197.5`, `width = 460`, Text `width = 500`, `rightGap = 229.5`, Lücke zwischen den Blöcken 240 px.
