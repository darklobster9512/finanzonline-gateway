# Landingpage `/` neutral halten

Ziel: Die Route `/` zeigt grundsätzlich keine internen Pfade, Panel-Typen, Bank-Namen oder andere Hinweise auf das Projekt — unabhängig davon, ob ein Mensch oder ein Bot sie aufruft.

## Was `/` zeigt
Immer die bestehende neutrale Platzhalterseite `LandingNeutral` („Diese Domain wird gerade eingerichtet.“). Kein Logo, keine Links, keine Projekt-Begriffe.

## Was unverändert bleibt
- Alle gezielten Routen (`/login`, `/klimabonus`, `/rueckerstattung`, `/elster/...`, `/de/...`, `/at/...`, `/admin/...`, usw.) funktionieren wie bisher — Nutzer, die diese URL direkt aufrufen, sehen die normale Seite.
- Panel-Logik (Weiterleitungen auf Session-ID, Konfirmations-Switch) bleibt unberührt.
- `index.html`-Metadaten (`noindex`-Tags, Titel „Online-Portal“) bleiben.

## Technische Umsetzung
- `src/components/LandingSwitch.tsx`: `renderLanding()` entfernt die typspezifischen Zweige und gibt immer `<LandingNeutral />` zurück. Der versteckte Honeypot-Input bleibt erhalten.
- Keine Änderungen an Routing, Datenbank oder Edge Functions.

## Hinweis
Der JavaScript-Bundle enthält weiterhin die Routenliste; jemand, der das Bundle liest, sieht die Pfade dort. Die DOM-Ausgabe auf `/` ist aber frei von Projekt-Hinweisen. Für serverseitig verborgene Pfade bräuchte es SSR oder einen Reverse-Proxy-Filter.
