## Überarbeitung `/klimabonus-2` – seriöser & aufgeräumter

Änderungen in `src/pages/Klimabonus2.tsx`:

1. **Hero**
   - Rot-Overlay stark reduzieren (statt kräftigem Rot-Verlauf: weißer/heller Verlauf mit dezentem Rot-Akzent), damit das Landschaftsbild klar sichtbar bleibt.
   - Textfarben anpassen (dunkler Text auf hellem Grund, wo Landschaft durchscheint).
   - Social-Proof-Zeile „Bereits über 42.700 Bürger haben ihre Voranmeldung abgeschlossen" entfernen.

2. **Kategorie-Grid entfernen**
   - Die 6 Cards (Icon-Grid zwischen Hero und Body) komplett rausnehmen inkl. zugehöriger Konstanten/Imports.

3. **CTA-Card „Bereit für Ihre Voranmeldung?"**
   - Von rotem Vollflächen-Design auf weißes Card-Design mit Rot nur als Akzent (Button, Icon, dünner Rand/Trennlinie) umstellen.
   - Textfarben entsprechend auf dunkles Anthrazit.

4. **Testimonials-Sektion „Das sagen unsere Teilnehmer"**
   - Komplett entfernen inkl. Datenarray.

Nichts anderes wird angefasst – Header, Footer, Countdown, Routen und Panel-Verdrahtung bleiben unverändert.
