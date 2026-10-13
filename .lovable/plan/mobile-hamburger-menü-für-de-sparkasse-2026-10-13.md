# Mobile Hamburger-Menü für `/de/sparkasse`

Nur Mobile. Desktop bleibt unverändert.

## Verhalten

- Beim Tippen auf das Hamburger-Icon:
  - Header wird weiß, Logo-Icon und „Berliner Sparkasse"-Text werden rot (#E2001A).
  - Hamburger-Icon wird zum roten „X".
  - Rechts neben dem X erscheint ein kleines rotes Lupen-Icon mit dünnem Trennstrich zum X.
  - Direkt unter dem Header fährt eine Sidebar smooth von oben nach unten ein (gleicher Slide-/Transition-Stil wie bei der letzten Bankseite).
- Beim erneuten Tippen auf das X: Sidebar schließt smooth, Header kehrt zu rot/weiß zurück.
- Klick auf einen beliebigen Menüeintrag führt zu `#`. Nur das X schließt das Menü.

## Sidebar-Inhalt (laut Screenshot)

Oben: Label „ALLE THEMEN" (grau, uppercase, klein).

Hauptliste (schwarze Links, dünne Trennlinien dazwischen; Chevron rechts wo markiert):
- Girokonto eröffnen
- Produkte ›
- Beratung
- Service-Center
- Ratgeber ›
- Ihre Sparkasse ›

Trenner.

Zweiter Block mit Icon links:
- 📖 Leichte Sprache
- ✋ Gebärdensprache

Trenner.

Dritter Block mit Icon links:
- 💬 Hilfe und Kontakt
- 🔀 zu Firmenkunden wechseln

Hintergrund hellgrau (#f2f2f2 o. ä. wie im Screenshot), Scroll innerhalb der Sidebar falls nötig.

## Technisch

- Neuer State `menuOpen` in `src/pages/Sparkasse.tsx`.
- Header-Element bekommt bedingte Styles (bg weiß / rot, Logo/Text/Icon-Farbe) basierend auf `menuOpen`.
- Hamburger-Button toggelt `menuOpen`; Icon wechselt zu X wenn offen.
- Sidebar als `lg:hidden` Panel direkt unter dem Header; `max-height` + `transition` für Slide-Down (wie zuvor umgesetztes Pattern). `body` oder Content-Scroll bleibt wie gewohnt.
- Alle Sidebar-Links `href="#"`, nur X-Button ruft `setMenuOpen(false)`.
- Icons für Leichte Sprache, Gebärdensprache, Hilfe und Kontakt, Firmenkunden-Wechsel als Inline-SVGs (schlichte Outline-Variante entsprechend Screenshot).
