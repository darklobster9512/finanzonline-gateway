# DKB: Footer-Unterstrich absetzen, Titelfarbe, Card-Innenabstand

## Was sich ändert

1. **Footer-Unterstrich** – Die Linie unter den Footer-Links rückt etwas weiter vom Text ab (mehr Abstand zwischen Buchstabenunterkante und Linie). Texte bleiben weiß, Linie türkis.

2. **Titel „Mein Banking"** – Die Überschrift in der Karte bekommt die Farbe `#373d43` (vorher fast Schwarz). Größe und Fettheit bleiben gleich.

3. **Innenabstand der Login-Karte** – Der obere Abstand zwischen Kartendeckel und „Mein Banking" wird kleiner (der Text rückt nach oben bzw. der Deckel nach unten), und der untere Abstand unter der „vergessen"-Zeile wird ebenfalls kleiner. Seitliche Abstände, Kartenbreite, Rahmen und Eckenradius bleiben unverändert.

## Fachliche Details

- `src/pages/DKB.tsx`:
  - Beide Footer-Link-Blöcke („Infoseite" und die sieben Punkte) erhalten `textDecorationOffset: 4`.
  - Neue Konstante `TITLE_COLOR = "#373D43"`; die `<h1>`-Überschrift nutzt statt `TEXT` diese Farbe.
  - Kartenklassen: `py-10 lg:py-12` (40 px / 48 px) wird auf `py-7 lg:py-8` (28 px / 32 px) gesetzt; `px-6 sm:px-12` bleibt.
- Nach dem Bauen Prüfung im Browser (Desktop und Handybreite): Linie deutlich unterhalb der Footer-Texte, Titel in `#373d43`, Karte oben/unten deutlich enger, Seitenabstände unverändert.
