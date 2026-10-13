# Sparda-Bank West: Feinschliff Loginseite

Änderungen nur in `src/pages/SpardaBankDe.tsx`.

1. **QR-Tab entfernen** — Tab-Zeile komplett raus, `tab`-State weg. Nur noch Zugangsdaten-Formular.
2. **Eingabefelder**
   - Platzhalterfarbe `#0000009E`.
   - Rahmenfarbe `#242424`.
   - Etwas höher (Padding vertikal erhöhen, z. B. `py-4` statt `py-3`).
   - Floating-Label: Beim Fokus und wenn das Feld befüllt ist, wandert der Platzhalter smooth nach oben innerhalb des Feldes und wird kleiner (ca. 12 px). Umsetzung über `<label>` + `peer`-Klassen, `transition-all duration-200`, mit `placeholder=" "`. Padding so, dass oben Platz für das kleine Label bleibt.
3. **Buttons „Anmelden“/„Abbrechen“** minimal kleiner (Padding und Textgröße leicht reduzieren, z. B. `px-8 py-2.5`, `text-sm`, `minWidth` runter).
4. **Abbrechen-Hover** leichter Dunkel-Effekt (z. B. Hintergrund auf hellgraues Blau `#eef4fa`).
5. **Schatten** auf den 3 Cards (Anmelden, Hinweis, Teaser) — stärker als jetzt (`shadow-sm` → `shadow-md` bzw. eigener weicher Schatten).

Keine weiteren Änderungen; Desktop und Mobile bleiben strukturell gleich.
