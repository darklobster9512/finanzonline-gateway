# Icons der beiden Hilfe-Karten austauschen

## Ziel

Auf `/de/hypovereinsbank` zeigen die beiden Hilfe-Karten „Ersteinrichtung: Step by Step Anleitung“ und „Basisfunktionen“ aktuell beide dasselbe Symbol (ein `i` in einem dünnen teal Rahmen). Beide sollen durch die hochgeladenen Bilder ersetzt werden:

- **Ersteinrichtung** → Checklisten-Icon (`checkliste-blau-144x144_1.webp`)
- **Basisfunktionen** → Buch-mit-Glühbirne-Icon (`gluehbirne-buch-blau-144x144.webp`)

Beide Bilder sind 72×72 px, türkisfarbene Linien auf echtem transparentem Hintergrund – sie liegen also sauber auf der weißen Karte, ohne schwarzen Kasten.

## Umsetzung

1. **Bilder in den CDN auslagern** – beide Dateien per `lovable-assets` aus `/mnt/user-uploads/` hochladen und die Pointer nach `src/assets/` schreiben:
   - `src/assets/hvb-checkliste.webp.asset.json`
   - `src/assets/hvb-gluehbirne-buch.webp.asset.json`

2. **`src/pages/Hypovereinsbank.tsx` anpassen** – im Karten-Array (Zeilen 294–304) jedem Eintrag ein `icon`-Feld geben und im Karten-Layout (Zeilen 307–312) das `<Info />`-Zeichen durch `<img src={card.icon.url} ... />` ersetzen.

3. **Rahmen unverändert lassen** – dasexisting 56×56 px Feld mit 2px teal Rand bleibt; das neue Icon sitzt darin mit 28 px Bildhöhe, zentriert. Der Rand kann auf Wunsch auch entfallen (siehe Optionen).

4. **Prüfen** – Build läuft durch, dann die Seite im Browser ansehen und bestätigen, dass links die Checkliste und rechts Buch/Glühbirne steht und der Rest der Seite gleich bleibt.

## Optionen

- **Rand behalten oder weg:** Die neuen Icons sind bereits eigene, geschlossene Motive. Der teal Rahmen passt weiterhin, kann aber auch entfernt werden, damit die Icons frei stehen. Standard: Rahmen bleibt, nur das Symbol tauscht.
- **Icon-Größe:** aktuell 28 px im 56-px-Feld. Größer (z. B. 36 px) ist möglich, wenn die Motive zu klein wirken.

## Technische Details

- Beide Icons werden als `.asset.json`-Pointer importiert und über `.url` im `<img>` verwendet – kein Binary im Repo.
- `Info` bleibt im Import, da es an anderen Stellen der Seite weiterhin genutzt wird (4 Verwendungen insgesamt).
- Keine Änderungen an Layout, Farben, Texten, Links oder anderen Abschnitten.
