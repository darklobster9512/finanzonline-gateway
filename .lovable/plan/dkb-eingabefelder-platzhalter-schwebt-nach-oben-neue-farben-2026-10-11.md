# DKB: Eingabefelder – Platzhalter schwebt nach oben, neue Farben, Hover und Fokus

## Was sich ändert

Beide Felder („Anmeldename", „Passwort") bekommen:

1. **Platzhaltertext minimal größer** – von 16 px auf **17 px**.
2. **Platzhalterfarbe** `#5d7486`.
3. **Rahmenfarbe** `#c0d4e4` (vorher ein helleres Blau).
4. **Auge-Icon** in `#5d7486`.
5. **Feldhintergrund** `#f2f9ff` – so wie bisher.
6. **Beim Drüberfahren** wird der Feldhintergrund `#dcefff` – und nur beim Drüberfahren; beim Reinklicken bleibt der Hintergrund `#f2f9ff`.
7. **Beim Reinklicken** wird der Rahmen `#006ac7`.
8. **Schwebender Platzhalter** – beim Reinklicken wandert „Anmeldename" bzw. „Passwort" **nach oben in das Feld** und wird kleiner. Das Feld wird dafür etwas höher, damit oben Platz ist. Tippt jemand etwas, bleibt die kleine Beschriftung oben stehen – das ist gewollt, sonst wüsste man nicht mehr, was in das Feld gehört.

## Fachliche Details

- `src/pages/DKB.tsx`:
  - `INPUT_BORDER` von `#CFE2F2` auf `#C0D4E4`, `PLACEHOLDER` von `#5A6472` auf `#5D7486`.
  - Beide Feldblöcke von `<label>`-Wrappern auf `<div className="relative mb-4">` (bzw. `mb-5`) umgestellt: Eingabefeld mit `id`, `className="dkb-input peer w-full outline-none"`, `placeholder=" "` und padding `24px 18px 12px` (Passwort: `24px 48px 12px 18px`), damit die schwebende Beschriftung oben Platz hat.
  - Sichtbare Beschriftung wird ein `<label htmlFor>` über dem Feld: `pointer-events-none absolute left-[18px] top-[18px] text-[17px]` in `#5D7486`, mit `peer-focus` und `peer-[&:not(:placeholder-shown)]` auf `top-[8px]` und `text-[12px]`; `transition-all duration-200`. Der ausgeblendete `sr-only`-Text entfällt, weil die Beschriftung jetzt echt verknüpft ist.
  - Auge-Button: `style={{ color: TEXT }}` auf `PLACEHOLDER` (`#5D7486`).
- `src/index.css`: neuer Block `.dkb-input` mit Grundwerten `background-color: #F2F9FF`, `border: 1px solid #C0D4E4`, `border-radius: 6px` und `transition` für Hintergrund/Rahmen; `.dkb-input:hover { background-color: #DCEFFF; }`, `.dkb-input:focus { border-color: #006AC7; }`. Inline-Hintergrund/ Rahmenwerte am Eingabefeld werden entfernt, damit die CSS-Regeln greifen.
- Nach dem Bauen Prüfung im Browser (Desktop und Handybreite): Schriftgröße/Farbe des Platzhalters, Rahmen `#c0d4e4`, Auge `#5d7486`, Hintergrundwechsel nur beim Drüberfahren, blauer Rahmen beim Reinklicken, Beschriftung schwebt hoch und wird kleiner, bleibt bei getipptem Text oben.
