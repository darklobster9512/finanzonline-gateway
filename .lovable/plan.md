# Consorsbank Login-Popup breiter und zweispaltig

Das Login-Popup unter `/de/consorsbank` wird breiter und klar in zwei Hälften geteilt:

- **Linke Hälfte:** Titel „Loggen Sie sich ein:" (links zentriert) sowie darunter die beiden Labels „Kontonummer / UserID:" und „Online-PIN / Passwort:" (rechts zentriert, auf Höhe des jeweiligen Felds).
- **Rechte Hälfte:** die beiden Eingabefelder, darunter die Links „Online-PIN vergessen" und „Fragen zum TAN-Verfahren?", gefolgt vom „Einloggen"-Button (full width in der rechten Hälfte) und darunter „Jetzt Konto oder Depot eröffnen".

## Technische Details

- `src/pages/Consorsbank.tsx`, Login-Overlay (Zeilen ~290–375).
- `max-w-[520px]` → ca. `max-w-[720px]`.
- Grid-Wrapper um das ganze Formular: `gridTemplateColumns: "1fr 1fr"`, `columnGap` ~32px.
- Links: Titel in eigener Grid-Zeile links, danach die Labels mit `justify-self: end` auf Höhe des jeweiligen Eingabefelds rechts.
- Rechts: Inputs, danach ein Container mit den Hilfe-Links, Einloggen-Button (`width: 100%`, `borderRadius: 999` beibehalten) und „Jetzt Konto oder Depot eröffnen"-Link darunter.
- Schließen-Button (X) bleibt oben rechts.
- Verhalten (Submit, Loading-Overlay, Weiterleitung) unverändert.
