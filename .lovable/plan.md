# Pfeile bei „Jetzt freischalten" und „Weitere Informationen" ersetzen

Die beiden handgezeichneten SVG-Pfeile neben den Links sehen bastelig aus und passen nicht zum Sparkassen-Stil.

## Was ich ändere

- In `src/pages/Sparkasse.tsx` die zwei inline-SVG-Pfeile neben „Jetzt freischalten" und „Weitere Informationen" entfernen.
- Stattdessen das echte Sparkassen-Icon aus der Pictos-Icon-Font verwenden (`sk-icon-arrow`, Codepoint `\f7b2`), das auch im restlichen Design genutzt wird.
- Größe und Farbe passend zur Linkschrift (ca. 14–16 px, `#292929`), vertikal mittig ausgerichtet.

Sonst bleibt an der Seite nichts verändert.
