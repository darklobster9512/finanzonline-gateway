# Sparkasse Footer Feinschliff

Footer von `/de/sparkasse` an den Screenshot angleichen.

## Änderungen

1. `DE`-Sprachauswahl mit Globus-Icon in dieselbe Zeile wie die Linkliste integrieren (erstes Element), nicht mehr als eigene Zeile darüber.
2. Linkreihenfolge und -darstellung anpassen: `AGB`, `Cookie-Einstellungen anpassen`, `Datenschutz`, `Preise und Hinweise`, `Barrierefreiheit`, `Barriere melden`, `Vertrag widerrufen`, `Kontakt`, `Impressum`, `Filialen A-Z`, `Geldautomaten A-Z`. `Vertrag widerrufen` als aktiver Link in Medium ohne Unterstreichung, alle anderen Regular mit Unterstreichung.
3. Twitter-Icon entfernen, stattdessen TikTok. Reihenfolge: Facebook, Instagram, TikTok, YouTube, LinkedIn. Icon-Kreise mit dünnerem Rand (1 px).
4. „Berliner Sparkasse“-Label und Abstände an den Screenshot anpassen (kompakter, zentriert).

Nur Footer in `src/pages/Sparkasse.tsx`; Desktop. Keine Logik-/Backend-Änderungen.
