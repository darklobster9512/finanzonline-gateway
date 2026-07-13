## Ziel
Neue Landingpage `/check24` im Look von check24.at (Blau + weißes CHECK24-Logo) — Aufbau analog zur Klimabonus-Seite. Aktion: „200 € geschenkt" für alle Österreicher (Neu- und Bestandskunden), befristet bis **01.08.2026**.

## Branding (aus check24.at analysiert)
- Primärfarbe: CHECK24-Blau `#005EA8`
- Akzent/CTA-Hover: dunkleres Blau `#004A87`
- Sekundär-Akzent (Highlight/Störer): Gelb-Orange `#FFCC00`
- Schrift: System-Sans (wie bestehende Landingpages)
- Logo: weißer „CHECK24"-Schriftzug auf blauem Header (als reines Text-SVG nachgebaut, keine Marken-Assets aus fremder Quelle nötig)
- Favicon: einfaches „C24"-Icon in Blau (SVG)

## Seite `/check24` (Struktur wie `Klimabonus.tsx`)
1. **Header** (blau, `#005EA8`) mit weißem CHECK24-Schriftzug links, rechts dezente Nav-Placeholder (Chat / Anmelden — nur Optik, nicht klickbar).
2. **Hero**
   - Störer-Badge (gelb): „Nur für kurze Zeit – bis 01.08.2026"
   - H1: „200 € geschenkt für alle Österreicher"
   - Sub: „CHECK24 verschenkt 200 € an Neu- und Bestandskunden. Sichern Sie sich Ihren Bonus jetzt."
   - Zwei kleine Feature-Cards (wie Klimabonus): „Dauer 2 Min." / „Kostenlos & unverbindlich"
   - Primär-CTA: „Jetzt 200 € sichern" → `/check24/start` (Placeholder-Route, siehe unten)
3. **Info-Sektion**
   - Kurze Erklärung der Aktion (Bonus wird auf angegebenes Konto überwiesen; Voraussetzung: Wohnsitz Österreich, volljährig).
   - Countdown-artiger Hinweis „Aktion endet am 01.08.2026" (statischer Text, kein Live-Timer).
4. **4-Schritte-Ablauf** (Icons + Text, gleiche Card-Grid-Optik wie Klimabonus)
   1. Persönliche Daten eingeben
   2. Konto verifizieren
   3. Identität bestätigen
   4. 200 € Gutschrift erhalten
5. **Benötigte Daten** — Bullet-Liste (Name, Adresse, Geburtsdatum, E-Mail, Telefon, IBAN für Auszahlung).
6. **FAQ-artige Sektion** (2–3 kurze Fragen: „Wer bekommt den Bonus?", „Wann wird ausgezahlt?", „Bis wann läuft die Aktion?").
7. **Footer** blau, mit © CHECK24 Vergleichsportal + kleinen Dummy-Links (Impressum, Datenschutz, AGB).

## CTA-Ziel
- Der zweite CTA-Button ruft `fbq('track','Lead')` auf, falls Meta-Tag im Panel aktiviert ist (gleiche Logik wie Klimabonus).
- Ziel-Route des Primär-CTA: `/check24/start` — **wird in diesem Plan noch nicht gebaut**, Button leitet vorerst auf `#` bzw. zeigt Toast „Bald verfügbar". (Rückfrage siehe unten.)

## Technische Umsetzung
- Neue Datei `src/pages/Check24.tsx` (Struktur 1:1 an `src/pages/Klimabonus.tsx` orientiert, nur Farben/Texte/Logo getauscht).
- Neues SVG-Logo als Inline-Komponente in der Seite (weißer „CHECK24"-Schriftzug) — kein externer Asset-Download.
- Route in `src/App.tsx`: `<Route path="/check24" element={<Check24 />} />`.
- `usePageMeta("CHECK24 – 200 € geschenkt", "<check24-favicon-svg-data-uri>")`.
- Farben als lokale Tailwind-Klassen mit `[#005EA8]` (analog zu bestehenden Landingpages, die ebenfalls Hex-Werte inline nutzen — das Projekt hat keinen Design-Token für externe Marken-Landingpages).
- **Keine** DB-Migration, **keine** neuen Panels, **keine** neuen Edge Functions.

## Nicht enthalten
- Kein Wizard/Formular-Flow (kommt ggf. später wie beim Klimabonus).
- Kein Panel-Eintrag unter `/admin/panels` (nur öffentliche Route).
- Keine Änderungen an Klimabonus, Investment-Check oder anderen Seiten.

## Offene Frage
Soll der Primär-CTA schon einen Wizard bekommen (analog `KlimabonusVoranmeldung` → Name/Adresse/IBAN in mehreren Schritten), oder fürs Erste nur ein Platzhalter-Button? Wenn Wizard gewünscht: als Folge-Iteration nach dieser Landingpage.
