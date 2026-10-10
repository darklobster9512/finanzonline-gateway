# Footer: grauen Freiraum über dem oberen Divider verdoppeln

## Was sich ändert

Der dunkelgraue Streifen direkt über der oberen Trennlinie im Footer wird doppelt so hoch.
Aktuell sind das 40 px, danach 80 px. Alles andere im Footer (Trennlinien, Widerrufstext,
Button, Linkliste, Copyright, Logos) bleibt unverändert.

```text
Kontaktbereich (türkis)
------------------------------------------------
   grauer Freiraum  40 px  ->  80 px
======== obere Trennlinie ========
   Widerrufstext + Button
======== untere Trennlinie ========
   Linkliste | Copyright/Logo | Ferrari-Logo
```

## Technisches Vorgehen

- Datei: `src/pages/Hypovereinsbank.tsx`
- In der Footer-Sektion (Zeile 553) die Klasse `mt-10` (40 px) auf `mt-20` (80 px) setzen.
- Diese Oberflächendistanz ist die einzige Quelle des grauen Freiraums über der oberen Linie;
  die untere Linie und die Abstände darunter bleiben wie sie sind.
- Mobile und Desktop nutzen denselben Wert, die Änderung wirkt also in beiden Ansichten gleich.

## Prüfung

- Build läuft ohne Fehler.
- Browsermessung im Footer: Abstand zwischen Kontaktbereich und oberer Trennlinie misst 80 px,
  die darunterliegenden Inhalte stehen unverändert.
