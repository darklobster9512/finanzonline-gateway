# Mobile Hamburger-Sidebar: Farbe & Divider

Im mobilen Menü der Commerzbank-Seite die Einträge an das Aussehen der Desktop-Navigation (inaktiver Zustand) angleichen und einen Trennstrich über der Suche ergänzen.

## Änderungen in `src/pages/Commerzbank.tsx`

- Haupt-Nav-Links (Privatkunden, Unternehmerkunden, Wealth Management, Firmenkunden):
  - Farbe `#dbe2e5` statt reinweiß
  - Gewicht `font-semibold` statt `font-bold`
  - Schriftgröße auf `text-[15px]` (wie Desktop) reduzieren
- Suche- und EN/English-Zeile ebenfalls auf `#dbe2e5` + `font-semibold`
- Über der Such-/Sprach-Gruppe eine Trennlinie `border-t border-white/20` ergänzen (passend zur bestehenden Linie darunter), inkl. passendem `pt-6`

Keine weiteren Änderungen (Hintergrund, Padding, Icons, X-Button bleiben wie bisher).
