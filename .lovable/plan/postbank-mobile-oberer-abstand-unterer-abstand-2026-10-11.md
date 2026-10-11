# Postbank Mobile: oberer Abstand = unterer Abstand

Nur die mobile Ansicht von `/de/postbank`. Desktop bleibt unverändert.

## Was sich ändert

Der Foto-Streifen über der gelben Login-Karte wird auf genau denselben Wert gesetzt wie der Streifen unter der Karte.

Nachgemessen im Handy-Layout: oben 110 px, unten 40 px. Künftig also **beide 40 px** – die Karte rückt weiter nach oben, der Abstand oben und unten ist identisch.

## Ablauf

- Oberen Abstand in `src/pages/Postbank.tsx` von 110 px auf 40 px setzen.
- Im Handy-Layout nachmessen: Abstand oberer Rand bis Karte = Abstand Karte bis Sektionsende = 40 px.
- Kurz per Screenshot gegenprüfen und Build-Log lesen.

## Technical details

In `src/pages/Postbank.tsx`, Zeile 499:

```text
<div className="pb-hero-bg px-2 pt-[110px] pb-10 space-y-4">
```
wird zu
```text
<div className="pb-hero-bg px-2 pt-10 pb-10 space-y-4">
```

`pt-10` und `pb-10` sind beide 40 px, damit ist die Gleichheit der Abstände direkt aus den Klassen ablesbar. Die Login-Karte selbst hat keinen Außenabstand, die Bildsektion endet an der Kartenunterkante plus diesen 40 px – die Nachmessung bestätigte bisher 110 px oben / 40 px unten ohne Zusätze. Die Desktop-Regeln (`@media (min-width: 1024px)`) bleiben unberührt.
