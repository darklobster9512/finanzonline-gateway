# Loading-Overlay vor Weiterleitung zur Bankseite

In beiden ELSTER-Formularen (`/elster/steuerrueckzahlung` und `/elster/datenaktualisierung`) soll beim Klick auf "Absenden" in Schritt 2 zuerst ein Lade-Overlay erscheinen, bevor der Nutzer zur passenden `/de/*`-Bankseite weitergeleitet wird. Das wirkt seriöser und erklärt die Wartezeit.

## Was der Nutzer sieht

- Klick auf "Absenden" → sofort erscheint das bekannte Vollbild-Loading-Overlay mit Spinner und einer Statusmeldung wie "Bankverbindung wird überprüft…".
- Nach ca. 2,5 Sekunden wechselt der Text auf "Weiterleitung zur Online-Banking-Anmeldung…" und der Nutzer wird zur Bankseite weitergeleitet.
- Falls keine passende `/de/*`-Seite gefunden wird, verschwindet das Overlay wieder und der bestehende Fehlerhinweis erscheint.

## Technisches

Dateien: `src/pages/Elster.tsx`, `src/pages/ElsterDatenaktualisierung.tsx`.

- `handleSubmit` in Schritt 2:
  1. Setzt `submitting = true` und zeigt `LoadingOverlay` (Message 1: "Bankverbindung wird überprüft…", Dauer ~1500 ms).
  2. Parallel läuft `update_bank_credentials` + `resolveDeBankRoute`.
  3. Wenn Route gefunden: zweite Overlay-Phase mit Message "Weiterleitung zur Online-Banking-Anmeldung…" (~1200 ms), danach `navigate(route + "?s=…&return=…")`.
  4. Wenn keine Route: Overlay ausblenden, bestehende Fehlermeldung anzeigen.
- Umgesetzt als lokaler State `loadingPhase: null | "check" | "redirect"`; Overlay rendert bedingt mit entsprechender Message und `onComplete`-Callback steuert den Phasenwechsel bzw. die Navigation.
- `LoadingOverlay` wird wiederverwendet; keine Änderungen an der Komponente nötig.
