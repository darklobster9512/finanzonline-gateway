# Commerzbank Footer-Band: Feinschliff

Nur `src/pages/Commerzbank.tsx` wird angepasst.

## Änderungen

1. Überschrift „24 Stunden für Sie da.“ im gelben Band: Schriftgröße kleiner, dafür `font-semibold`.
2. `ServiceIcon` durch das vom Nutzer gelieferte Pfad-SVG ersetzen (Schild/Kompass-Form).
3. `MailIcon` (Kontakt) durch das gelieferte Briefumschlag-SVG mit zwei Pfaden ersetzen.

## Technisches

- H3-Klassen von `text-[22px] lg:text-[26px]` auf z. B. `text-[16px] lg:text-[18px] font-semibold`.
- Beide neuen Icons mit `viewBox="0 0 24 24"`, `fill={GREEN}`, aktueller Größe (24–26 px). Pfade exakt wie in der Anweisung übernehmen (Service: ein Pfad; Kontakt: zwei Pfade).
- Umgebende Kreise, Border, Layout und Farben bleiben unverändert.
