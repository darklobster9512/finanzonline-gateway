# DKB: Abstand Titel/Feld verkleinern, Logo minimal größer

Zwei Stellschrauben in `src/pages/DKB.tsx`, beide ohne Seiteneffekte auf andere Elemente.

## Änderungen

**1. Abstand „Mein Banking“ zum ersten Eingabefeld**
- Der Titel hat aktuell 32 px Abstand nach unten.
- Neu: 20 px auf dem Handy, 24 px am Rechner.
- Der Titel selbst (Größe, Farbe, Fettheit) bleibt gleich.

**2. DKB-Logo oben links**
- Aktuell 38 px hoch auf dem Handy, 42 px am Rechner.
- Neu: 41 px mobil, 46 px Desktop – also rund 9 % größer, Breite wächst automatisch mit.
- Der Reiter-Tab im Browser nutzt dasselbe Bild und bleibt unverändert.

## Technisches

- `src/pages/DKB.tsx` Zeile 119: `h-[38px] lg:h-[42px]` → `h-[41px] lg:h-[46px]`.
- `src/pages/DKB.tsx` Zeile 131: `mb-8` → `mb-5 lg:mb-6`.
- Keine weiteren Dateien, keine Logik-Änderungen; Formular, Captcha und Footer bleiben wie sie sind.

## Prüfung

- Build-Log (`/tmp/observability/build-errors.log`) auf Fehler checken.
- Mit dem Browser im Handy- und Rechnerformat messen: Logo-Höhe 41/46 px, Abstand Titel→Feld 20/24 px, und dass die Card-Breite sowie das Captcha unverändert bleiben.
