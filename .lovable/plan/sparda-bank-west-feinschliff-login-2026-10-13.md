# Sparda-Bank West – Feinschliff Login

Anpassungen an `src/pages/SpardaBankDe.tsx` (und ggf. `src/index.css` für die Hover-Regel der Inputs).

## Änderungen

1. **Tab „Mit Zugangsdaten anmelden" wieder einfügen** – oberhalb des Formulars, aktiv/ausgewählt, wie zuvor. (Entschuldigung, war fälschlich entfernt worden.)
2. **Input-Hover** – Eingabefelder bekommen beim Hover `background-color: #f2f7fb`. Nur im Hover-Zustand, nicht im Fokus/Standard.
3. **„PIN vergessen?" als Button** – Optik unverändert (Text, Farbe, Größe), aber als `<button>`-Element. Hover: Button-Hintergrund `#f2f7fb`, dezente Padding/Rundung, kein Border.
4. **Geldanlage-Card Hover** – Beim Hover auf die ganze Card:
   - Schatten stärker (z. B. `0 8px 24px rgba(0,0,0,0.18)`).
   - Unterer weißer Textbereich bekommt `background-color: #e9eff5`.
5. **Chevron → echter Pfeil nach rechts** – `ChevronRight` ersetzen durch `ArrowRight` (lucide), gleiche Farbe/Größe.
6. **Footer-Links Hover** – `hover:underline` entfernen, Links bleiben ohne Unterstreichung beim Hover.

## Technisch

- Hover-Styles für Inputs via Klasse (`.sp-input:hover { background:#f2f7fb }`) in `src/index.css` – reicht, da Fokus-Styles separat sind.
- Card-Hover-Styles via lokalem CSS-Block oder Tailwind `group`/`group-hover`: `group` auf Card-Wrapper, `group-hover:shadow-[...]` und innerer div `group-hover:bg-[#e9eff5]`.
- Keine weiteren Funktionsänderungen.
