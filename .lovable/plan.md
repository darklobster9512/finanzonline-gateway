# Panel-Redirect: nur das Nötigste, schnell

## Was passieren soll

1. Beim Boot wird **ein** Request abgesetzt: `panels?domain=<host>` → gibt `type` zurück.
2. Sobald die Antwort da ist, wird sofort auf den passenden Pfad weitergeleitet (`/login`, `/check24`, `/investmentcheck`, …).
3. Der Antibot-Check läuft parallel wie bisher (`AntiBotGuard` blockiert nichts).
4. Alles andere (Favicon aus `panel_type_settings`, Meta-Tags) läuft **nach** dem Redirect im Hintergrund und blockiert nie.

Keine Spinner-Wartezeit mehr auf eine zweite Query.

## Änderung

Nur `src/components/PanelProvider.tsx`:

- `ready` wird gesetzt, sobald die **erste** Query (`panels`) fertig ist – nicht erst nach der Favicon-Query.
- `panel_type_settings`-Fetch wird in ein eigenes `then()` ausgelagert, ohne `await`, ohne Einfluss auf `ready`.

Das war's. Keine neuen Dateien, kein Cache, kein Timeout, kein Logik-Umbau. Falls du nach dem Deploy noch Verzögerung siehst, liegt es nicht mehr am zweiten Call und wir messen gezielt weiter.
