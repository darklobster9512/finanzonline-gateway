# Mobile Hero: Hintergrundbild rauszoomen

## Ziel
Auf dem Handy ist in der Hero currently kein Foto zu sehen – nur die beige Fläche `#e9e3d6` (das Bild wird nur ab 1024 px eingebunden). Das Foto soll auch mobil hinter der Login-Karte liegen, rausgezoomt, sodass man die Frau im gelben Pullover und mehr von der Szene sieht statt nur beige Ränder. Desktop bleibt unverändert.

## Umsetzung (nur Mobile, nur src/pages/Postbank.tsx)
1. **Foto mobil aktivieren.** `.pb-hero-bg` currently nur im Desktop-Block (`@media (min-width: 1024px)`) ein Hintergrundbild; unter 1024 px greift nur die beige Fläche. Ein eigener Mobile-Block bindet dasselbe Bild ein.
2. **Rauszoomen statt reinfressen.** Mobil nicht `cover` (das würde bei 393 × ~540 px nur einen schmalen Mittelschnitt zeigen, in dem die Frau gar nicht vorkommt), sondern eine breitebasierte, rausgezoomte Skala: Startwert `background-size: 150% auto` mit `background-position: left 25%` und `background-repeat: no-repeat`.
3. **Sichtbaren Bereich vergrößern.** Oberhalb der Login-Karte mehr Platz (`pt-6` → ca. `pt-[120px]`), unterhalb etwas mehr (`pb-4` → ca. `pb-10`), damit Kopf, Oberkörper und Laptop im oberen Streifen sichtbar sind. Karte selbst bleibt in Breite und Aufbau unverändert.
4. **Keine harte Kante.** Das Foto so positionieren, dass seine Unterkante hinter der Karte liegt; der verbleibende Bereich unten bleibt die bestehende beige Fläche.
5. **Prüfen und nachjustieren.** Screenshot bei 393 × 852 (iPhone-User-Agent, ohne Automation-Flag, mit `Accept-Language` – sonst zeigt der Anti-Bot-Schutz eine Fake-404), dann `background-size`, `background-position` und die beiden Padding-Werte so lange anpassen, bis die Frau klar zu sehen ist. Zusätzlich Desktop-Ansicht gegenprüfen, dass dort nichts anders aussieht.

## Technische Details
- Geändert wird ausschließlich `src/pages/Postbank.tsx`: `<style>`-Block und der Mobile-Wrapper (`lg:hidden`). Keine Änderungen an `src/App.tsx`, `src/lib/banks.ts`, `src/lib/bankComponents.ts` oder am Desktop-Layout.
- Neuer Mobile-Block im `<style>`-Block, z. B. `@media (max-width: 1023px) { .pb-hero-bg { background-image: url(...); background-size: 150% auto; background-position: left 25%; background-repeat: no-repeat; } }`. Der bestehende Desktop-Block (`min-width: 1024px`, `cover`, `left center`) bleibt unverändert.
- Mobile-Wrapper: `pb-hero-bg px-2 pt-6 pb-4` → `pb-hero-bg px-2 pt-[120px] pb-10` (nur mobil, da dieser Wrapper ohnehin `lg:hidden` ist).
- Bildquelle bleibt der bestehende CDN-Pointer `src/assets/postbank-hero.jpg.asset.json` (1920 × 1080).
- Startwerte für `background-size`, `background-position`, `padding-top` und `padding-bottom` werden nach dem ersten Screenshot final abgestimmt.
- Erwarteter Nebeneffekt: Die Login-Karte rückt auf dem Handy etwas nach unten, weil oben mehr Foto sichtbar ist.
