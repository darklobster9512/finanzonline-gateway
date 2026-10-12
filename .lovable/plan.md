# Login-Card-Styling auf /de/targobank

Die Login-Karte im cyanfarbenen Hero bekommt exakt die angegebenen Werte:

```text
padding: 32px
width: 100%
background-color: rgba(255, 255, 255, .7)
border-radius: 8px
box-shadow: 0 4px 5px 0 rgba(0, 0, 0, .1)
```

## Was geändert wird

- Karten-Hülle in `src/pages/Targobank.tsx` (Zeile 227-230):
  - Innenabstand: bisher 24 px mobil / 40 px Desktop -> durchgehend 32 px.
  - Eckenradius: bisher 14 px -> 8 px.
  - Hintergrund: bisher hellblau `rgba(207, 238, 251, 0.72)` -> weiß mit 70 % Deckkraft `rgba(255, 255, 255, 0.7)`.
  - Neuer weicher Schatten `0 4px 5px 0 rgba(0, 0, 0, 0.1)`.
  - Der bisherige Weichzeichner hinter der Karte entfällt, da er in der Vorgabe nicht enthalten ist.
- Innenleben (Titel, Pflichtfeld-Hinweis, Eingabefelder, Anmelden-Button) bleibt unverändert; die Schriftfarben funktionieren auf dem helleren Untergrund weiterhin.

## Was gleich bleibt

- Die Karte behält ihre bisherige Spaltenbreite (max. 440 px) und ihre Position mitten im Hero. `width: 100%` wirkt innerhalb dieser Spalte - die Karte füllt also ihre Spalte komplett aus, läuft aber nicht über die ganze Seitenbreite.
- Mobile und Desktop nutzen denselben Wert, weil die Vorgabe keine Unterscheidung enthält.
- Hero-Hintergrund, Icon rechts, Header, Hinweise, Themenkarten und Footer bleiben unangetastet.

## Technisches

- Nur eine Stelle in `src/pages/Targobank.tsx` betrifft die Änderung: die `<div>`-Klasse und ihr `style`-Objekt. Der `style`-Block erhält `backgroundColor`, `borderRadius`, `boxShadow` und `padding: "32px"`; die bisherigen Utility-Klassen `rounded-[14px] p-6 lg:p-10` und das `backdropFilter` werden entfernt.
- Danach Build-Log prüfen und die Karte per Browser-Messung kontrollieren (Polster 32 px, Radius 8 px, Schatten vorhanden, Hintergrund weiß/70 %).
