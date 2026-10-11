# DKB Captcha – Feinschliff

Änderungen nur in `src/pages/DKB.tsx` (plus ggf. kleine Style-Anpassung inline).

## Was angepasst wird

1. **Haken-Icon ersetzen**: Das aktuelle Haken-SVG wird durch den gelieferten Pfad ersetzt (viewBox `0 0 79 68` passend zu den Koordinaten), gefüllt in DKB-Blau, Größe wie bisher (26×26 px).

2. **Komplette Captcha-Box klickbar**: Der Click-Handler, der den Demo-Ablauf startet, wird vom Checkbox-Element auf den gesamten Captcha-Container verschoben (`role="button"`, `cursor: pointer`). Checkbox bleibt rein visuell.

3. **Anmelden-Button immer aktiv**:
   - `disabled`-State des Buttons nicht mehr an Captcha-Erfolg koppeln – Button bleibt durchgehend im blauen Aktivzustand.
   - Beim Klick auf „Anmelden“:
     - Wenn Captcha bereits erfolgreich → wie bisher Login auslösen (`update_bank_credentials` + Redirect).
     - Wenn Captcha noch nicht erfolgreich → Captcha-Ablauf starten (sofern Idle) und ein Flag `pendingSubmit` setzen. Nach erfolgreichem Captcha-Abschluss automatisch Login auslösen.

4. **Textfarben / Font-Weight im Captcha**:
   - „Friendly Captcha“-Link: Font-Weight auf **regular (400)**, Farbe `rgb(86, 86, 86)`.
   - „Ich bin ein Mensch“ (sowie die Ladezustands-Texte an derselben Stelle): Farbe `#222`.

Alles andere (Zentrierung, Größen, Hintergrund `#fafafa`, Punkte oben rechts, Spinner) bleibt unverändert.
