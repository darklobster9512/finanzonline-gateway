## Ziel

Die `/investmentcheck` Seite optisch stark an die Referenzseite `volksbank.at/private/anlegen/fonds.page` anlehnen — gleiche Hero-Optik, Typografie, Abschnittsstruktur und Farbwelt.

## Design-Anpassungen an `src/pages/InvestmentCheck.tsx`

### 1. Farben & Typografie
- Primärblau auf Volksbank-Navy `#003882` (Referenz nutzt tiefes Marineblau, nicht das helle `#196bc1`), Akzent-Rot `#e6001e` für CTA-Highlights.
- Serif-freie, kräftige Headline-Schrift (Tailwind `font-bold`, große Zeilenhöhe, `tracking-tight`), sehr große Hero-Überschrift (5xl–7xl).
- Fließtext in dunklem Grau `#333`, großzügiger Zeilenabstand.

### 2. Hero (Full-Bleed)
- Vollflächiges Hero-Bild (kein zweispaltiges Layout), Höhe ca. 70vh.
- Bild mit dunklem Verlauf-Overlay unten links.
- Große weiße H1 „Der Volksbank Investment-Check" + Sub-Line „Für Bestandskunden: prüfen Sie in 3 Minuten, ob Ihr Erspartes für Sie arbeitet." unten links über dem Bild.
- Kein Badge im Hero — schlichter, wie Referenz.
- CTA direkt unter dem Bild: „Jetzt Investment-Check starten" — als Textlink-Button mit Pfeil-Icon in Volksbank-Blau (nicht als gefüllter breiter Button im Hero).

### 3. Intro-Block „Der persönliche Anlage-Check"
- Kleine Kicker-Zeile in Blau (uppercase, tracking-wider).
- Große Headline (3xl–4xl).
- 2–3 Absätze Fließtext, max-Breite ~720px, linksbündig.
- Trennlinie/Abstand wie Referenz (viel Whitespace).

### 4. Teaser-Karten Sektion (3 Cards)
Ersetzt die aktuellen Icon-Benefit-Cards durch bildbasierte Product-Teaser-Cards im Stil der Referenz:
- 3 Cards nebeneinander, jeweils:
  - Bild oben (16:9)
  - `###` Titel
  - Kurztext (2–3 Zeilen)
  - Textlink mit Pfeil unten („Mehr erfahren")
- Themen: „Individuelle Auswertung", „Persönliche Beratung", „In 3 Minuten erledigt".
- Bilder generieren (3 zusätzliche Bilder passend zum Volksbank-Stil: Büro-/Beratungsszenen).

### 5. „Chancen & Vorteile" Zwei-Spalten-Block
- Analog zu Referenz „Chancen und Risiken".
- Zwei Spalten: „Ihre Vorteile" (grüner Check-Bullet) und „Was Sie erwartet" (Info-Bullet).
- Klar getrennt durch Linie/Spalten.

### 6. Sekundärer CTA (Footer-CTA)
- Statt vollflächig blauer Balken: dezentere Sektion mit hellem Hintergrund `#f5f7fa`, mittiger Headline, Kurzbeschreibung, blauem Solid-Button.

### 7. Footer
- Wie Referenz: heller Footer mit feinen grauen Linien, Copyright und Bestandskunden-Hinweis.

### 8. Header
- Reduzierter, weißer Header mit dünner unterer Border, Logo links, kleine Navigation rechts entfällt (nur „Investment-Check"-Kicker).

## Technische Details

- Nur Frontend-Änderung an `src/pages/InvestmentCheck.tsx`.
- Bestehendes Hero-Bild `src/assets/investmentcheck-hero.jpg` wird durch ein neu generiertes, breiteres Hero-Bild (1920×1080, zwei Personen im Büro-Gespräch, natürliches Licht) ersetzt.
- 3 neue Teaser-Bilder unter `src/assets/investmentcheck-teaser-1/2/3.jpg` (je 720×540).
- Keine Änderung an Routing, Providern, DB oder anderen Seiten.
- Farbwerte als Konstanten im File (keine Tailwind-Config-Änderung, damit isoliert).
- Alle Buttons behalten den existierenden `handleStart`-Handler (Funnel kommt später).
