# HVB-Header optimieren (/de/hypovereinsbank)

## Was geändert wird

1. **Schatten unter dem Header**
   - Der Header bekommt einen weichen Schatten (`box-shadow`), der nach unten in den Hero-Bereich (Login-Teaser mit Hintergrundbild) übergeht.
   - Die bisherige feine Linie (`border-b`) wird durch den Schatten ersetzt, damit der Übergang weich wirkt.

2. **Hover-Effekt Navbar**
   - Beim Überfahren der Navigationspunkte (Privatkunden, Wealth Management, Unternehmenskunden, Nachhaltigkeit, Über Uns, Services) färbt sich der Text schwarz.
   - Die Hauptnavigation hat bereits `hover:text-black` – wird geprüft und vereinheitlicht; auch die 4 rechten Punkte (Suche, Hilfe, Filiale) bekommen denselben Schwarz-Hover.

3. **Icons der 4 Header-Punkte aktualisieren**
   - SUCHE, HILFE, FILIALE und BANKING LOGIN erhalten Icons, die dem Original-HVB-Header entsprechen:
     - Suche: Lupe
     - Hilfe: Fragezeichen im Kreis
     - Filiale: Standort-Pin
     - Banking Login: Person/Schloss-Symbol auf rotem Button
   - Umsetzung als inline SVGs im Stil der echten HVB-Seite (dünne Konturen, 24px).

## Hinweis zur hochgeladenen CSS

Die einzige hochgeladene CSS-Datei (`@charset_UTF-8_pasted.txt`) stammt von der Commerzbank und enthält keine HVB-Icons. Falls du eine andere CSS-Datei mit den HVB-Icon-Definitionen meintest, lade sie bitte nochmal hoch – ich passe die Icons dann exakt daran an. Bis dahin baue ich die Icons als SVGs nach dem Vorbild der echten HVB-Seite.

## Technische Details

- Alle Änderungen nur in `src/pages/Hypovereinsbank.tsx` (Header-Bereich, Zeilen ~98–145).
- Schatten: z.B. `box-shadow: 0 4px 12px rgba(0,0,0,0.08)` am `<header>`.
- Mobile Ansicht (nur roter BANKING-LOGIN-Button) bleibt unverändert, abgesehen vom Schatten.
