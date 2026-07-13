## Fixes für /check24 Hero + Header

**1. Header verwendet exakt denselben Background wie Hero (nahtlos)**
- Aktuell: Header + Hero haben beide separat `backgroundImage: url(check24bg)` mit `backgroundSize: cover` → Header wirkt dunkler, weil eigener Bildausschnitt gerendert wird.
- Fix: Header und Hero in **einen gemeinsamen Wrapper** packen, der den Background *einmal* setzt (`backgroundSize: cover`, `backgroundPosition: center`). Header und Hero bekommen intern `background: transparent`. So teilen sie sich **ein** Bild → keine Farbdifferenz.

**2. Countdown-Zahlen und Labels wirklich durchsichtig**
- Aktuell: Zahlen sind `rgba(0,94,168,0.35)` — das ist nur eine halbtransparente blaue Farbe auf weißem Kasten, nicht durchsichtig zum Hintergrund.
- Referenz (prnt.sc-Screenshot): Die weißen Kästen zeigen den dunkelblauen Background durch die Zahlen hindurch — Text ist ein „Ausschnitt", die Zahlen nehmen die Farbe des Backgrounds an.
- Fix: `background-clip: text` + `color: transparent` mit dem Background-Image als Text-Fill:
  ```
  backgroundImage: url(check24bg)
  backgroundClip: text
  WebkitBackgroundClip: text
  color: transparent
  backgroundSize: cover (mit fixiertem Offset, damit alle 4 Boxen aus demselben Bild „ausschneiden")
  ```
- Gleiche Technik für die Labels (TAGE/STD/MIN/SEK).
- Weiße Kästen bleiben solid weiß wie jetzt.

**3. Keine weiteren Änderungen** an Struktur, Info-Cards, FAQ, Footer usw.

### Betroffene Datei
- `src/pages/Check24.tsx` — Header + Hero-Section zu einem gemeinsamen Background-Wrapper zusammenführen; `Countdown`-Komponente auf `background-clip: text`-Technik umstellen.
