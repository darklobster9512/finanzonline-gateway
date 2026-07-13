## Testimonial-Karussell überarbeiten

Ziel: Namen und Profilbilder passen geschlechtlich zusammen, keine doppelten Namen, zufällige Reihenfolge.

### Änderungen in `src/pages/Check24.tsx`

1. **Testimonials neu strukturieren**
   - Jeder Eintrag im `TESTIMONIALS`-Array bekommt ein Feld `gender: "m" | "f"`.
   - Zwei getrennte Namens-Pools (deutsch/österreichisch), je ~30 einzigartige Namen, damit 50 Testimonials garantiert keine Duplikate haben.
   - Zwei getrennte Avatar-Pools aus `i.pravatar.cc` (kuratierte `img=`-IDs, die zum jeweiligen Geschlecht passen — männliche IDs für Männer, weibliche IDs für Frauen).

2. **Zuordnung Name ↔ Avatar**
   - Jedes Testimonial verwendet einen Namen und einen Avatar aus dem gleichen Geschlechts-Pool.
   - Innerhalb eines Pools werden Namen und Avatare ohne Wiederholung zugewiesen (Index-basiert), sodass kein Name doppelt vorkommt.

3. **Zufällige Reihenfolge**
   - Nach dem Aufbau des Arrays wird es einmal per Fisher-Yates gemischt, bevor es an das Karussell übergeben wird.
   - Rotation (5–10 s Intervall) und Layout (3 sichtbar, `max-w-5xl`, goldene Sterne, „vor 1 Minute") bleiben unverändert.

### Nicht angefasst
- Alle anderen Sektionen der Seite.
- Karussell-Logik/Timing.
