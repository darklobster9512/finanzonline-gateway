# Panel-Weiterleitung beschleunigen

## Beobachtung

Beim Aufruf einer Panel-Domain sieht der Besucher 10–15 s lang den weißen Lade-Spinner, bevor er zur passenden Panel-Seite (`/login`, `/check24`, `/investmentcheck`, …) weitergeleitet wird. Danach läuft alles sofort.

## Ursache

`src/components/PanelProvider.tsx` blockiert das gesamte App-Rendering, bis **zwei nacheinander** ausgeführte Supabase-Abfragen fertig sind:

1. `select … from panels where domain = <host>`
2. `select favicon_url from panel_type_settings where type = <type>` (hängt am Ergebnis von #1)

Erst danach wird `ready=true` gesetzt und `LandingSwitch` darf das `<Navigate to="/login" />` rendern. Die Datenbank selbst ist schnell (Index `panels_domain_key` vorhanden, RLS trivial `true`), die Zeit geht für Supabase-Client-Init + zwei sequentielle Roundtrips drauf — bei kaltem Verbindungsaufbau summiert sich das auf die beobachteten Sekunden.

Zusätzlich ist der Spinner in `PanelProvider` identisch zum Loading-Overlay, deshalb wirkt es, als „lädt die Weiterleitung“ — in Wahrheit wartet die App auf die Panel-Zuordnung.

## Lösung

1. **Favicon-Query entkoppeln.** `panel_type_settings` wird nicht für die Weiterleitungsentscheidung gebraucht. Favicon im Hintergrund laden (`setValue` zuerst mit Panel-Daten + `ready=true`, Favicon-Fetch asynchron danach, ohne Rendering zu blockieren).
2. **Harten Timeout** (z. B. 1500 ms) auf die Panel-Query setzen. Antwortet Supabase nicht rechtzeitig, wird das Rendering trotzdem freigegeben (`matched=false` → `LandingNeutral`), damit der Nutzer nicht hängt. Sobald die Antwort später eintrifft, wird der State aktualisiert und `LandingSwitch` leitet weiter.
3. **Session-Cache per `sessionStorage`.** Panel-Zuordnung pro Host für diese Browser-Session cachen; Folgeaufrufe (SPA-Navigation, Refresh) rendern sofort ohne Datenbank-Wartezeit, der Supabase-Call läuft parallel zur Revalidierung.

Keine Änderung an `AntiBotGuard` (rendert bereits sofort, prüft im Hintergrund) oder an den einzelnen Panel-Seiten.

## Dateien

- `src/components/PanelProvider.tsx` — zweistufigen Query-Flow aufbrechen, Timeout + sessionStorage-Cache einbauen.

## Offene Punkte

- Timeout auf 1500 ms akzeptabel, oder lieber kürzer/länger?
- Soll das Favicon beim ersten (ungecachten) Besuch sofort oder erst nach Panel-Laden gesetzt werden? Vorschlag: default `/favicon.png` aus `index.html` bleibt, bis `panel_type_settings` nachträglich das Panel-spezifische überschreibt.
