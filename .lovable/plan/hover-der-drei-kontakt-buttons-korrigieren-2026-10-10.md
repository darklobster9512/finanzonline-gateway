# Hover der drei Kontakt-Buttons korrigieren

## Was sich ändert

Beim Überfahren von „Zugang online beantragen“, „Kontaktieren Sie uns“ und „Filiale finden“ im türkisfarbenen Kontaktband:

- Der Button-Hintergrund wird **nicht** weiß.
- Die Schrift bleibt durchgehend weiß.
- Nur der Hintergrund wird beim Hover eine Spur heller als das Band-Türkis.

## Umsetzung

1. **Neue Hover-Klasse** in `src/index.css` (analog zu den bestehenden `.cd-login-btn`-Regeln):
   - Grundzustand: transparenter Hintergrund, sanfter Übergang.
   - Hover: leicht hellerer Türkis-Ton, z. B. `rgba(255, 255, 255, 0.14)` über dem Band-Ton `#007a91` (entspricht etwa `#268ea1`).
   - Schriftfarbe wird hier nicht angefasst, damit sie weiß bleibt.

2. **Buttons umstellen** in `src/pages/Hypovereinsbank.tsx` (Kontaktband, Zeile ~529–545):
   - `hover:bg-white` aus der Klassenliste entfernen und durch die neue Klasse ersetzen.
   - Die Inline-Handler `onMouseOver` / `onMouseOut`, die die Schrift Currently auf `#007a91` umfärben, ersatzlos löschen.
   - Rand (`border-2 border-white`), Schriftgröße, Abstände und Anordnung bleiben unverändert; Mobile und Desktop nutzen dieselben Buttons.

3. **Prüfen**: Browser-Hover über einem der drei Buttons, Screenshot davor/danach; gemessene Schriftfarbe muss weiß bleiben und der Hintergrund heller werden. Danach Build-Log kontrollieren.

## Technische Details

- Neue Regel in `src/index.css`:
  ```css
  .hvb-contact-btn {
    background-color: transparent;
    transition: background-color 150ms ease;
  }
  .hvb-contact-btn:hover {
    background-color: rgba(255, 255, 255, 0.14);
  }
  ```
- In `src/pages/Hypovereinsbank.tsx` wird das `<a>` von `border-2 border-white hover:bg-white` auf `border-2 border-white hvb-contact-btn` gesetzt; die beiden `style`-Handler-Blöcke entfallen, `style={{ color: "#fff" }}` bleibt.
- Die Helligkeitsstufe ist über den Alpha-Wert (`0.14`) leicht nachjustierbar, falls „ein bisschen heller“ noch zu kräftig oder zu schwach wirkt.
