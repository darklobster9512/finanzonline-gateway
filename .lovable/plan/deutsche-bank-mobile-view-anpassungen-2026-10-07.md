# Deutsche Bank – Mobile View Anpassungen

Nur Mobile (`<1024px`). Desktop bleibt unverändert.

## Änderungen in `src/pages/DeutscheBank.tsx`

1. **Infobox-Text verkleinern** (Mobile): Fließtext/Bullets von 14 px auf 13 px, Titel von 15 px auf 14 px. Nur per Mobile-Klassen, Desktop behält aktuelle Größen.

2. **Hintergrundbild entfernen (Mobile)**: Auf Mobile kein `backgroundImage`, stattdessen Flächenfarbe `#1e2a78` — aber nur bis zum unteren Rand der Login-Card. Darunter wird der Hintergrund weiß.
   - Umsetzung: Oberer Block (Info-Box + Login-Card) bekommt auf Mobile `background: #1e2a78`. Der Container der rechten Spalte (Teaser + Infoblöcke + Footer) bekommt auf Mobile weißen Hintergrund. Desktop-Hintergrundbild bleibt via `lg:` Klassen erhalten.

3. **Abstand verringern**: Zwischen Login-Card und dem darunter liegenden Content (Teaser-Block) auf Mobile `gap` deutlich reduzieren (z.B. von 256 px auf 16 px).

4. **Content unter Login full width (Mobile)**: Rechte Spalte (Teaser, Sicherheits-Blöcke, Footer) nimmt auf Mobile volle Breite ohne horizontale Paddings der Außencontainer, sodass die Blöcke randlos sitzen.

5. **"Vertrag widerrufen"-Button full width** (Mobile).

6. **Login-Card (Mobile)**:
   - Weiter-Button full width.
   - "Zugangsdaten vergessen?" rückt in die Zeile darunter, linksbündig (bzw. laut Text "links zentriert" → linksbündig unterhalb des Buttons).
   - Gleiche Behandlung für den "Einloggen"-Button in Schritt 2.

## Technisch

- Alles via Tailwind Responsive-Präfixe (`lg:` behält Desktop). Keine Logik- oder Routen-Änderungen.
- Grid-`gap-[256px]` wird zu `gap-4 lg:gap-[256px]`.
- Login-Button-Zeile: Flex-Spalte auf Mobile, Flex-Row auf Desktop.
- Hintergrundumstellung über zwei Wrapper mit Mobile-/Desktop-Klassen; keine Änderung an Desktop-Styles.
