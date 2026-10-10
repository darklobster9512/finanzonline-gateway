# Hero-Section: mehr Abstand zum Seitenrand

## Ziel

Beide Hälften der Hero-Section (Login-Karte links, Hilfe-Text rechts) rücken weiter zur Mitte. Der Abstand zum linken und rechten Seitenrand wird größer; die Hintergrundfläche der Hero bleibt unverändert randlos.

## Was sich ändert

- Der innere seitliche Abstand der Hero-Section wird auf dem Desktop von 24 px auf 64 px pro Seite erhöht (also +40 px links und +40 px rechts).
- Die linke Login-Karte und der rechte Hilfe-Text rücken dadurch gleichmäßig nach innen.
- Kartenbreite (460 px) und Breite des Hilfe-Texts (500 px) bleiben gleich – es gibt keine neuen Umbrüche, nur mehr Luft außen.
- Mobile bleibt unverändert (dort ist die Hero einspaltig; der seitliche Abstand dort bleibt bei 16 px).
- Header, Hilfe-Karten, Kontaktband und Footer bleiben unangetastet.

## Erwartetes Ergebnis (bei 1627 px Vorschau-Breite)

Aktuell gemessen:

```text
viewport 1627 px
Hero-Inhalt: max 1360 px, zentriert, je 24 px Innenabstand
Login-Karte:   157,5 px vom linken Rand
Hilfe-Text:    189,5 px vom rechten Rand
```

Nach der Änderung:

```text
Login-Karte:   ca. 197 px vom linken Rand
Hilfe-Text:    ca. 230 px vom rechten Rand
```

## Hinweis zur Ausrichtung

Der Header bleibt so, wie er ist (Navigationspunkte links, roter „Banking Login“-Block randständig). Die Login-Karte der Hero sitzt damit etwas weiter innen als der erste Navigationspunkt. Falls die Karte stattdessen bündig mit der Navigation stehen soll, wird der innere Abstand des Headers in einem Schritt mitgenommen.

## Prüfen

Nach dem Bauen wird die Seite per Sandbox-Browser bei 1627 px Breite geöffnet und die Abstände von Karte und Hilfe-Text zum Rand werden nachgemessen, plus ein Screenshot der Hero-Section zur Kontrolle.

## Technische Details

- Datei: `src/pages/Hypovereinsbank.tsx`
- Stelle: der Grid-Wrapper der Hero-Section (Klasse `max-w-[1360px] mx-auto px-4 lg:px-6 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-6`)
- Änderung: `lg:px-6` → `lg:px-16`; `px-4` (mobil) bleibt
- Bestehende Messung (Playwright, 1627 px): `padL/padR = 24px`, `maxW = 1360px`, Karte `left = 157.5`, Hilfe-Text `rightGap = 189.5`
- Nach der Änderung erneut messen: erwartete Abstände ca. 197 px bzw. 230 px, Breiten unverändert 460 px bzw. 500 px
