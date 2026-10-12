# Consorsbank Login-Popup: 50/50-Split

Nur `src/pages/Consorsbank.tsx` anpassen.

## Änderungen

1. **Backdrop dunkler** — Overlay von aktuellem Wert auf `bg-black/60` (statt leicht transparent).
2. **Popup-Ecken** — Border-Radius erhöhen (z. B. von `rounded-lg` auf `rounded-2xl`).
3. **50/50-Split-Layout** innerhalb des Dialogs:
   - **Linke Hälfte:** Überschrift „Loggen Sie sich ein:“, Label + Feld „Kontonummer / UserID“, Label + Feld „Online-PIN / Passwort“.
   - **Rechte Hälfte:** Links „Online-PIN vergessen“ und „Fragen zum TAN-Verfahren?“, Petrol-Button „Einloggen“, Link „Jetzt Konto oder Depot eröffnen“.
   - Schließen-Icon (×) bleibt oben rechts im Dialog.
   - Felder in der linken Spalte stapeln sich vertikal; Labels bleiben über den Feldern (nicht mehr daneben), damit die schmalere Spalte passt.
4. Auf Mobile wird gestapelt (links oben, rechts unten).

## Technisch

- Dialog-Container: `max-w` erhöhen, damit zwei Spalten Platz haben (~`max-w-3xl`).
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-8`.
- Overlay-Klasse im Dialog-Overlay auf dunkleres Schwarz setzen.
