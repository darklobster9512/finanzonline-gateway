# Popover-Feinschliff: Text, Farbe, X-Button, Innenabstand

## Ziel
Die Hinweis-Popover auf `/de/hypovereinsbank` (neben Benutzername und Passwort) werden in vier Punkten nachgeschärft.

## Änderungen
1. **Textgröße** — Der Hinweistext wird von 15 px auf 17 px erhöht, mit passendem Zeilenabstand.
2. **Textfarbe** — Der Text bekommt dieselbe Farbe wie der Rahmen: hellgrau `#999999`. Hinweis: Auf dem hellblauen Grund ist das deutlich kontrastärmer als vorher — wenn es zu blass wirkt, gehen wir wieder einen Schritt zurück.
3. **X-Button** — Das Schließen-Kreuz wird als feines Liniensymbol gesetzt (zwei dünne Striche, ca. 1,4 px Linienstärke, 18 × 18 px). Es wirkt dadurch dünner und größer als das aktuelle, fette Schriftzeichen. Die Farbe bleibt das bisherige Petrol.
4. **Innenabstand** — Der Abstand zu den seitlichen Rändern wird minimal vergrößert: links 14 → 20 px, rechts 28 → 34 px (rechts bleibt etwas mehr Platz, weil dort das X sitzt). Der vertikale Abstand von 12 px bleibt gleich.

Breite (300 px), Hintergrundfarbe, Rahmen, Eckenradien und Pfeil bleiben unverändert. Mobil ist das Popover ausgeblendet, dort ändert sich nichts.

## Technisches
- Datei: `src/pages/Hypovereinsbank.tsx`, Komponente `InfoHint` (Zeilen 44–164).
- Popover-Style: `color: HINT_FG` → `color: HINT_BORDER`, `fontSize: 15` → `17`, `lineHeight: 1.5` → `1.55`, `padding: "12px 28px 12px 14px"` → `"12px 34px 12px 20px"`.
- Schließen-Button: Der Textknoten `×` mit `fontSize: 18, fontWeight: 700` wird durch ein Inline-SVG (18 × 18, zwei Linien mit `stroke: HINT_X`, `strokeWidth: 1.4`, `strokeLinecap: "round"`) ersetzt; Position `top: 4, right: 6` wird auf das größere Symbol angepasst.
- Prüfung: Build-Log, dann Playwright mit Desktop-Viewport und Safari-User-Agent (AntiBotGuard) — Popover öffnen, berechnete Werte für Schriftgröße, Textfarbe, Padding und X-Größe ablesen und per Element-Screenshot gegenprüfen.
