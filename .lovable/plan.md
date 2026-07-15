## Neue Seite `/klimabonus-2` im Check24-Stil

Kopiere die Struktur/Layout von `src/pages/Check24.tsx` in eine neue Datei `src/pages/Klimabonus2.tsx`, ersetze aber alle Check24-Branding-Elemente durch Klimabonus-Branding (Farben, Logo, Texte, Bilder analog zum bestehenden `Klimabonus.tsx`).

### Umsetzung

1. **Neue Datei** `src/pages/Klimabonus2.tsx`
   - Layout, Sections, Hero, Grid, Footer, mobile Optimierung 1:1 vom Check24-Aufbau übernehmen
   - Farben: Klimabonus-Grün (statt Check24-Blau `#005EA8`)
   - Logo/Header: aus `Klimabonus.tsx` übernehmen
   - CTA-Text: „Jetzt Klimabonus sichern" (führt zu `/klimabonus/voranmeldung`)
   - Kategorien/Kacheln inhaltlich auf Klimabonus-Themen anpassen (statt Handy/Strom/Hotels z.B. Klimabonus-relevante Inhalte) – falls du konkrete Kacheln willst, bitte kurz sagen
   - Favicon/Title via `usePageMeta` mit passendem Klimabonus-Wert
2. **Route registrieren** in `src/App.tsx`: `<Route path="/klimabonus-2" element={<Klimabonus2 />} />`

### Offene Frage
- Soll die Seite als eigenes Panel unter `/admin/panels` registriert werden (eigener PanelType `klimabonus_2` mit Favicon/Meta-Tag-Support), oder reicht erstmal nur die statische Route? Falls Panel gewünscht: sag Bescheid, dann ergänze ich Migration + `PanelProvider` + `AdminPanels` + `LandingSwitch`.
