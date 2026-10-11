# ING-Loginseite: Weitere Feinschliff-Anpassungen

Visuelle Anpassungen auf `/de/ing` gemäß Anweisung 588. Nur `src/pages/ING.tsx` wird geändert.

## Änderungen

1. **Labels „Benutzername“ und „Passwort“** — Schriftgröße leicht reduzieren (16 → 15 px).
2. **Eingabefelder** — gleich breit machen. Aktuell ist das Passwortfeld schmaler, weil daneben das Auge-Icon in derselben Flex-Zeile liegt. Lösung: Das Auge-Icon absolut im Feld positionieren, Input bekommt rechts Padding für das Icon. Beide Felder haben dann dieselbe Breite (volle Spaltenbreite).
3. **Anmelden-Button** — Ecken weniger stark abgerundet (`borderRadius: 24` → `4`).
4. **Blaue Link-Farbe** — `LINK_BLUE` von `#004C93` auf `#525199` ändern (betrifft „Zugangsdaten vergessen?“, „Detaillierte Anleitung“ und alle Links in der unteren Infoleiste).
5. **Footer-Links** — nicht fett (`fontWeight: 600` → `400`), aber etwas größer (15 → 16 px).
6. **Horizontales Seitenpadding** verringern:
   - Content (`main > div`): `px-4 lg:px-6` → `px-3 lg:px-4`.
   - Header und Footer bleiben unverändert, damit das ING-Logo an exakt derselben Stelle sitzt.
7. **Eingabefelder-Border** — Standardfarbe `#9E9E9E` → `#7C7C7C`. Bei Fokus: Border `#B2C2CE` und 2 px breit, wobei die zusätzliche Linie nach innen wächst (via `box-shadow: inset 0 0 0 1px #B2C2CE` statt Border-Verbreiterung, damit das Layout nicht springt). Fehler-Zustand (rot) bleibt wie bisher.

## Technisches

- Rein in `src/pages/ING.tsx`.
- Fokus-Border ohne Layout-Shift: Border bleibt 1 px, zusätzlicher 1-px-Inset per `boxShadow` beim Fokus setzen.
- Auge-Icon: Passwortfeld-Wrapper auf `position: relative`, Icon-Button `position: absolute right`, Input bekommt `paddingRight` für Icon-Platz.
- Keine neuen Dateien, keine Logikänderungen.
