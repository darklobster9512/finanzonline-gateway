## Voraussetzungen Cards im Referenz-Style

Die 4 Voraussetzungen-Cards (Wohnsitz, Alter, Bankkonto, Frist) werden im Style des Screenshots umgestaltet:

- **Layout**: Weiterhin 2×2 Grid (`sm:grid-cols-2`), aber Cards breiter/flacher
- **Card-Design**: Weißer Hintergrund, dezenter Schatten, abgerundete Ecken, horizontales Layout
- **Inhalt pro Card**: Rundes Icon (blauer Hintergrund) links, Titel **fett** oben, Beschreibungstext darunter mit **bold keywords**, Chevron-Pfeil `>` rechts
- **Hover**: Leichter Schatten-Effekt

### Änderungen

1. **`InfoItem` Komponente** (Zeilen 54-69): Umbauen auf den Referenz-Style — rundes Icon-Badge, fetterer Titel, Beschreibung mit hervorgehobenen Schlüsselwörtern, Chevron rechts
2. **`voraussetzungen` Array** (Zeilen 352-357): Texte anpassen mit hervorgehobenen Schlüsselwörtern (ähnlich wie im Screenshot: "**garantiert**", "**über 60 Anbietern**" etc.)
