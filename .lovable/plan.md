## Hero-Section im echten CHECK24-Stil neu bauen

CHECK24 (AT/DE) verwendet für Aktions-/Gutschein-Landingpages einen sehr klaren, sachlichen Look: weißer/heller Hintergrund, kräftiges CHECK24-Blau als Akzent, gelbes Preis-Badge, klare Typo, kein „Marketing-Poster"-Feeling. Aktuell wirkt unser Hero eher wie eine Gewinnspiel-Grafik.

### Änderungen an `src/pages/Check24.tsx`

**1. „Österreicher" raus** – im H1-Subtitle das Wort entfernen, Text wird neutraler:
- vorher: „für alle Österreicher – Neu- und Bestandskunden"
- nachher: „Für Neu- und Bestandskunden"

**2. Hero komplett neu strukturieren** (Layout wie echte CHECK24-Promo-Pages):
- Zweispaltiges Layout (md+): links Text, rechts eine **Preis-Karte** wie bei CHECK24-Gutscheinaktionen.
- Hintergrund bleibt das gemeinsame Blau (Header+Hero teilen weiterhin einen Background), aber:
  - Text linksbündig, klare Hierarchie
  - Eyebrow-Label „CHECK24 Aktion" oben (klein, gelb)
  - H1 nüchtern: **„200 € Bonus"** groß, darunter Subline „Für Neu- und Bestandskunden"
  - Kurzer Trust-Text: „Deutschlands & Österreichs größtes Vergleichsportal"
  - Primary CTA (gelb) + Sekundär-Trust-Zeile mit Sternen (4,8/5) und SSL

**3. Preis-Karte rechts** (weiße Card, wie echte CHECK24-Gutschein-Boxen):
- Weißer Hintergrund, dezenter Schatten, abgerundet
- Oben Badge „AKTION" in Rot
- Riesige `200 €` Zahl in CHECK24-Blau
- Untertitel „Willkommens-Bonus"
- Trennlinie
- Countdown darunter (kleiner, kompakter, im aktuellen weißen Kasten-Stil, aber Zahlen in solid CHECK24-Blau – die durchsichtige `background-clip`-Variante fliegt raus, weil sie auf weißer Karte nicht funktioniert und untypisch für CHECK24 ist)
- Kleiner Text: „Aktion endet am 01.08.2026"

**4. Kleinere Realismus-Details:**
- Mobile: Karte stacked unter dem Text
- „SSL-verschlüsselt · check24.at" bleibt, aber als eine Zeile mit Sterne-Rating davor
- Padding etwas reduziert, Hero wirkt kompakter (echte CHECK24-Heros sind nicht überdimensioniert)

### Nicht angefasst
- Header, Info-Blöcke, Voraussetzungen, Ablauf, Angaben, FAQ, CTA-Box, Footer.
- Gemeinsamer Header+Hero-Background bleibt bestehen.
