# Openbank: Textgrößen verkleinern

Die aufgelisteten Texte auf `/de/openbank` werden eine Stufe kleiner gesetzt, Layout und Farben bleiben unverändert.

## Betroffen
- Überschrift „Willkommen"
- Hinweiszeile „Weitere Informationen zum Online Banking…"
- Formular-Labels „Benutzerkennung", „Passwort"
- Links/Buttons: „Passwort zurücksetzen", „Einloggen", „Signaturverfahren einrichten", „Konto eröffnen"
- Sicherheits-Warnblock (Achtung…) inkl. „Mehr"
- Abschnitt „Online Zahlungen mit Ihrer Visa Karte" samt Fließtext und „Mehr"

## Technisch
In `src/pages/Openbank.tsx` die jeweiligen Tailwind-/Inline-Fontgrößen um einen Schritt reduzieren (z. B. `text-3xl` → `text-2xl`, `text-base` → `text-sm`), ohne Spacing oder Farben zu ändern.
