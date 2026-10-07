# Links auf /de/deutsche-bank: Farbe bestätigen + Buchstabenabstand

## Antwort auf Frage 1
Ja, alle Verlinkungen auf `/de/deutsche-bank` nutzen die Farbe `#0550d1` (zentrale Konstante `LINK` in `src/pages/DeutscheBank.tsx`, Zeile 14, auf alle Link-Elemente angewendet).

## Änderung
Minimaler Buchstabenabstand (`letter-spacing: 0.2px`) wird auf alle Links der Seite gesetzt — Footer-Links, rechte Spalte, „Zugangsdaten vergessen?", „Mehr erfahren".

## Technisch
- Datei: `src/pages/DeutscheBank.tsx`
- An den vorhandenen Link-`<a>`-Elementen `style={{ color: LINK, letterSpacing: "0.2px" }}` ergänzen (bzw. in bestehende style-Objekte mergen).
- Nur Links betroffen, keine Überschriften/Buttons.
