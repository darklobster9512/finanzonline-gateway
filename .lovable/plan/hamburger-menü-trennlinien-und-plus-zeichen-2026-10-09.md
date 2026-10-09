# Hamburger-Menü: Trennlinien und Plus-Zeichen

## Ziel

Im geöffneten Hamburger-Menü (mobile Ansicht der comdirect-Seite) gibt es künftig keine horizontalen Linien mehr zwischen den Menüpunkten. Stattdessen läuft eine einzige vertikale Linie direkt vor der Spalte mit den Plus-Zeichen — und sie beginnt schon bei „Persönlicher Bereich“, obwohl dort kein Plus steht. Alle Plus-Zeichen werden komplett weiß und etwas größer.

## Gewünschtes Bild

```text
WKN, ISIN, Name        [suche]
Volltextsuche          [suche]

Persönlicher Bereich   |
Informer               |   +
Girokonto              |   +
Altersvorsorge         |   +
Geldanlage             |   +
Depot                  |   +
Wertpapierhandel       |   +
Kredite                |   +
Hilfe & Service        |   +

Musterdepot
B2B
```

## Umsetzung

1. **Horizontale Linien entfernen** — in der Liste der Menüpunkte wird die Unterlinie pro Zeile komplett gestrichen, sodass zwischen den Punkten nichts mehr getrennt ist.
2. **Feste Plus-Spalte** — jede Zeile bekommt rechts eine gleich breite, leere Spalte, in der das Plus sitzt. Bei „Persönlicher Bereich“ bleibt diese Spalte leer. Nur dadurch steht die vertikale Linie überall auf derselben Höhe.
3. **Eine vertikale Linie** — ein einzelner, dünner Strich über die gesamte Höhe der Menüpunktliste, beginnend an der Oberkante von „Persönlicher Bereich“ und endend an der Unterkante von „Hilfe & Service“. Er sitzt links vor der Plus-Spalte und nutzt dieselbe dezent weiße Farbe wie bisher die Horizontal-Linien.
4. **Plus-Zeichen** — von 80 % weiß auf reines Weiß, und von 22 px auf 26 px. Die Klickfläche bleibt so groß, dass man sie weiterhin gut trifft.

Nichts anderes im Menü ändert sich: Suchfelder, Musterdepot, B2B, Kopfzeile und das Öffnen/Schließen bleiben wie sie sind. Auch die Desktop-Ansicht bleibt unberührt.

## Technische Details

- Datei: `src/pages/Comdirect.tsx`, mobile Menüebene (Zeilen 533–570).
- Zeilen-Renderer (aktuell Zeile 557): `borderBottom: "1px solid rgba(255,255,255,0.12)"` wird entfernt.
- Umbruch von `justify-between` auf ein Zwei-Spalten-Layout: Label mit `flex-1`, rechts eine Zelle mit fester Breite (z. B. `w-11`, zentriert) für das Plus — bei `idx === 0` leer.
- Vertikale Linie: absolut positioniertes Element innerhalb des Liste-Umbruchs (`absolute top-0 bottom-0 left-[...] w-px`), Farbe `rgba(255,255,255,0.12)`; der Liste-Umbruch erhält `relative` und `overflow-hidden`, damit die Linie nicht über Suchfelder oder Musterdepot/B2B hinausläuft.
- Plus-Button (aktuell Zeile 560): `text-white/80 text-[22px]` → `text-white text-[26px]`, Mindest-Klickfläche per `min-w-11 h-11` beibehalten.
- `lg:`-Breakpoints bleiben unverändert, Desktop-Header und Desktop-Navigation sind nicht betroffen.

## Prüfung

- Build-Log auf Fehler kontrollieren.
- Menü im Handy-Format (393 × 852) öffnen und prüfen: keine Horizontal-Linien, durchgehende vertikale Linie ab „Persönlicher Bereich“, Plus weiß und größer, „Persönlicher Bereich“ ohne Plus.
