# HVB Mobile: Hamburger-Icon, Anmelden-Button, Zugangsdaten-Link

Drei Korrekturen in `src/pages/Hypovereinsbank.tsx`, nur Mobile betroffen, Desktop bleibt unverändert:

1. **Hamburger-Icon ersetzen**
   - Das aktuelle ucicons-Glyph `\uEA20` ist offenbar ein Briefumschlag-Icon, kein Menü-Icon.
   - Ersetzen durch ein echtes Hamburger-Icon: drei horizontale Linien als Inline-SVG (stroke, aktuelle Textfarbe `#4a4a4a`), gleiche Größe (24 px). Kein Rätselraten mit weiteren Font-Glyphen.

2. **Anmelden-Button nicht mehr full-width**
   - `w-full` aus der mobilen Variante entfernen, sodass der Button wieder seine ursprüngliche kompakte Breite hat (nur `px-6 h-10`, Inhaltsbreite).

3. **„Zugangsdaten vergessen/gesperrt?" wieder zweizeilig**
   - Der Link soll auf Mobile wieder in zwei Zeilen umbrechen wie zuvor, statt full-width in einer Zeile.
   - Umsetzung: Link nicht als Block/full-width, sondern mit begrenzter Breite (z. B. `max-w` / Inline-Verhalten), damit der Text wie vorher auf zwei Zeilen läuft; Button bleibt darunter.

## Technisch
- Nur `src/pages/Hypovereinsbank.tsx` anfassen.
- Mobile-only Änderungen über `lg:`-Trennung; Desktop-Layout unverändert.
- Danach Build-Log prüfen und mobilen Screenshot zur Verifikation.
