# HVB Login-Karte: Texte minimal vergrößern

In der Login-Karte auf `/de/hypovereinsbank` werden die folgenden Texte eine Spur größer:

- „Bitte loggen Sie sich ein.“
- Feldbeschriftungen „Direct Banking Nummer“ und „Passwort“ (mit i-Icons)
- „Zugangsdaten vergessen/gesperrt?“
- Button „ANMELDEN“
- „Sie haben noch kein Online Banking?“
- „Hier registrieren Sie sich in wenigen Schritten.“

Alles andere auf der Seite (Header, Hero-Bild, Hilfe-Spalte rechts, Footer, Popover-Styling, i-Buttons) bleibt unverändert.

## Technische Details

Datei: `src/pages/Hypovereinsbank.tsx`. Pro Element wird nur die `font-size` leicht erhöht (jeweils +1px):

- „Bitte loggen Sie sich ein.“: 15px → 16px
- Feldlabel „Direct Banking Nummer“/„Passwort“: 15px → 16px
- „Zugangsdaten vergessen/gesperrt?“: aktuelle Größe +1px
- „ANMELDEN“-Button-Text: aktuelle Größe +1px
- „Sie haben noch kein Online Banking?“ und Registrier-Hinweis: jeweils +1px

Gewicht (Regular/Medium), Farben, Abstände, i-Button-Größe und Popover-Styling bleiben wie sie sind.
