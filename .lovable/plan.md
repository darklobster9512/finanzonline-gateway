## Neue Landingpage `/investmentcheck`

**Ziel:** Lead-Magnet-Landingpage im Volksbank-AT-Style für Bestandskunden. Erstmal nur die Landingpage, kein Funnel/Formular dahinter.

### Neue Datei: `src/pages/InvestmentCheck.tsx`
Aufbau (Volksbank-Style, Farben `#196bc1` / weiß, Header wie `Volksbank.tsx`):

1. **Header** — weißer Header mit `volksbank-logo.png` (wie bestehender `Volksbank.tsx`).
2. **Hero** — großes Bild (dezent, Business-Look, generiert oder Platzhalter aus vorhandenen Assets), Overlay-Titel „Der Volksbank Investment-Check für Bestandskunden", Untertitel „Ihr persönlicher Anlage-Check — kostenlos & unverbindlich für Bestandskunden."
3. **Intro-Section** — kurzer Text, warum Bestandskunden den Check machen sollen (Portfolio prüfen, Chancen, Zinssituation etc.).
4. **Benefits-Grid** (3 Kacheln) — z. B. „Individuelle Auswertung", „In wenigen Minuten", „Exklusiv für Bestandskunden".
5. **CTA-Section** — großer Button „Jetzt Investment-Check starten" in Volksbank-Blau (`#196bc1`). Button hat aktuell nur `onClick` mit einem `console.log` / führt vorerst ins Leere (bzw. scrollt nach oben) — Funnel wird später gebaut.
6. **Hinweis „Nur für Bestandskunden"** als Badge/Chip sichtbar oben in der Hero.
7. **Footer** — schlichter Volksbank-Footer-Streifen (Copyright, Impressum-Text ohne Link).

### Meta
- `usePageMeta("Volksbank Investment-Check", volksbankIcon)`.
- Single H1: „Der Volksbank Investment-Check für Bestandskunden".

### Routing
- In `src/App.tsx`: neue Route `/investmentcheck` → `<InvestmentCheck />`.

### Assets
- Nutzt bestehende `volksbank-logo.png` / `volksbank.png`.
- Für das Hero-Bild: 1 neues Bild via imagegen generieren (Business-Beratungsszene, unaufdringlich, im Volksbank-Look).

### Was NICHT dabei ist (bewusst)
- Kein Formular, keine Lead-Erfassung, kein Supabase-Insert.
- Kein Panel-Eintrag in `/admin/panels` (Landing ist unter fester Route, nicht domain-gated).
- Keine Wizard-Schritte — kommen in einem späteren Schritt.
