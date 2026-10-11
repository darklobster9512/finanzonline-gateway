# DKB: Demo-Captcha wieder einbauen

Auf `/de/dkb` kommt die Friendly-Captcha-Box (nur Demo, keine echte Prüfung) wieder in die Login-Karte, zwischen Passwortfeld und „Anmelden“-Button.

## Ablauf (nach den hochgeladenen Screenshots)

1. **Ausgangszustand:** leere Checkbox + Text „Ich bin ein Mensch“, oben rechts drei Punkte, unten rechts kleiner Hinweis „Friendly Captcha“.
2. **Klick auf die Checkbox** startet die Ladeanimation (Spinner statt Checkbox) mit wechselnden Texten, je ca. 1–1,5 Sekunden:
   - „Initialisierung…“
   - „Herausforderung laden…“
   - „Das Ergebnis wird überprüft…“
3. **Endzustand:** blauer Haken + „Ich bin ein Mensch“. Erst dann wird der „Anmelden“-Button freigeschaltet (vorher deaktiviert/ausgegraut).

## Technisch

- Nur `src/pages/DKB.tsx` wird geändert.
- Zustand über einen State (`idle` → `loading` mit Textindex → `done`) und `setTimeout`-Kette; beim Unmount aufräumen.
- Styling wie im Screenshot: heller Kasten (`#f2f9ff`-ähnlich), dünner Rahmen, runde Ecken, Spinner als animierter Kreis, Haken als blaues SVG.
- Kein echtes Captcha, keine externe Verbindung — rein visuell.
