# Consorsbank Login-Popup umbauen

Das Login-Popup in `src/pages/Consorsbank.tsx` wird breiter und in zwei Hälften geteilt.

## Layout

```text
+------------------------------------------------------+
| Loggen Sie sich ein:              [X]               |
|                                                      |
| Kontonummer / UserID:   | [ Eingabefeld            ] |
| Online-PIN / Passwort:  | [ Eingabefeld        👁 ] |
|                         | Online-PIN vergessen       |
|                         | Fragen zum TAN-Verfahren?  |
|                         | [     Einloggen →        ] |
|                         | 🏛 Jetzt Konto/Depot...    |
+------------------------------------------------------+
```

- Popup-Breite auf ca. 640 px erhöhen.
- Titel „Loggen Sie sich ein:" sitzt linksbündig in der linken Hälfte, vertikal zur ersten Formulzeile ausgerichtet.
- Labels „Kontonummer / UserID:" und „Online-PIN / Passwort:" in der linken Hälfte, rechtsbündig zur Mittellinie.
- Eingabefelder in der rechten Hälfte.
- Hilfe-Links („Online-PIN vergessen", „Fragen zum TAN-Verfahren?") stehen in der rechten Hälfte unter den Feldern.
- „Einloggen"-Button als Full-Width-Button in der rechten Hälfte (statt zentrierter Pille), weiterhin petrolfarben mit Pfeil-Icon.
- „Jetzt Konto oder Depot eröffnen" darunter, ebenfalls in der rechten Hälfte.

## Technisch

- Grid-Spalten im Dialog auf z. B. `minmax(220px, 1fr) 1fr` erweitern, `alignItems: start`.
- Titelzeile als Teil des Grids (linke Spalte) oder als separater Flex-Row mit gleicher Spaltenaufteilung; Close-Button bleibt oben rechts.
- Hilfe-Links, Button und Eröffnen-Link in die rechte Grid-Spalte setzen (`gridColumn: 2`), kein `paddingLeft: 192` mehr.
- Button: `width: 100%`, Border-Radius bleibt rund (999), Höhe/Styling unverändert.
