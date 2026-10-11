# ING-Loginseite: Feinschliff

Visuelle Anpassungen auf `/de/ing` gemäß Anweisung 587. Nur `src/pages/ING.tsx` wird geändert.

## Änderungen

1. **Titel „Log-in für Privatkunden“** — Farbe von Orange auf `#333` ändern.
2. **ING-Logo** — kleiner skalieren (Desktop 36 → 28 px, Mobil 32 → 24 px).
3. **Card-Titel** („Anmelden mit Zugangsdaten“, „Anmelden mit App und QR-Code“) — Schriftgröße von 22 → 26 px.
4. **Beide Login-Cards** — abgerundete Ecken (`borderRadius: 12`) und mehr Innenabstand (Padding `36px 36px 40px`).
5. **Anmelden-Button** — abgerundete Ecken (`borderRadius: 24`, pill-artig). Button wandert in dieselbe Spalte wie die Eingabefelder (unter das Passwortfeld, aber ohne `sm:pl-[156px]` → stattdessen ins rechte Grid-Feld). „Zugangsdaten vergessen?“ bleibt direkt unter dem Button.
6. **Untere Infocard** (Neue Zugangsdaten / Business Banking / Hilfe / Sicherheit) — ebenfalls `borderRadius: 12`.
7. **Eingabefelder** — abgerundete Ecken (`borderRadius: 8` statt 2).

## Technisches

- Änderungen rein in `src/pages/ING.tsx` (Konstanten + Inline-Styles + ein Markup-Umbau für die Button-Platzierung).
- Keine neuen Dateien, keine Logikänderungen, keine Mobile-/Desktop-Trennung über das Vorhandene hinaus.
