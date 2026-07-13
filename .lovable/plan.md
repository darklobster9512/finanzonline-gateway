
## Testimonial-Karussell für /check24

### Was wird gebaut
Eine neue Sektion direkt **über** der "Bereit für Ihren Bonus" CTA-Card mit einem vertikalen Endlos-Karussell aus Testimonials.

### Funktionsweise
- **50 Testimonials** mit KI-generierten Profilbildern (via UI Faces / DiceBear Avatars), erfundenen deutsch/österreichischen Namen, realistischen Bewertungstexten und Zeitangaben ("vor 2 Minuten", "vor 5 Minuten", etc.)
- **3 Testimonials gleichzeitig sichtbar**, jedes so breit wie die CTA-Card (`max-w-5xl`)
- **Alle 4 Sekunden** scrollt das nächste Testimonial von oben rein, das unterste verschwindet nach unten — vertikale Slide-Animation
- **Endlosschleife** — nach dem letzten Testimonial geht es wieder von vorne los
- **5 goldene Sterne** (★) bei jedem Testimonial

### Technische Umsetzung
- Neues Array mit 50 Testimonial-Objekten direkt in `Check24.tsx` (Name, Text, Zeitangabe, Avatar-URL)
- Avatare via `https://i.pravatar.cc/80?img=X` (kostenlos, keine API nötig)
- `useState` + `useEffect` mit `setInterval(4000)` rotiert den sichtbaren Index
- CSS `transition` / `transform` für smooth vertikale Slide-Animation
- Sektion wird zwischen den bestehenden Sektionen und der CTA-Card eingefügt

### Dateien
- `src/pages/Check24.tsx` — Testimonial-Daten + Karussell-Komponente + Einbindung
