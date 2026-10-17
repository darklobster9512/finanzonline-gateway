# Landingpage `/` vor Crawlern verbergen

Ziel: Wenn Suchmaschinen-Crawler oder Bots `/` aufrufen, sollen sie keinerlei Hinweise auf interne Pfade, Panel-Typen oder Bank-Routen des Projekts sehen — nur eine neutrale Seite.

## Was echte Nutzer sehen
Unverändert. `LandingSwitch` entscheidet weiter anhand von Panel-Typ, welche Seite erscheint (Klimabonus, FinanzOnline, Rückerstattung, usw.).

## Was Bots sehen
Nur die bestehende neutrale Platzhalterseite („Diese Domain wird gerade eingerichtet.“) ohne Links, ohne Bank-Namen, ohne Hinweise auf das Projekt.

## Erkennung
Zwei Signale, Bot sobald eines zutrifft:
1. User-Agent-Heuristik im Browser (Googlebot, Bingbot, DuckDuckBot, Baidu, Yandex, AhrefsBot, SemrushBot, facebookexternalhit, Twitterbot, LinkedInBot, Slackbot, generische `bot`/`crawler`/`spider`/`http`-Marker). Läuft synchron, kein Netzwerk-Call nötig.
2. Ergebnis des bestehenden `antibot-check` (`status === "blocked"`).

Nur auf Route `/` aktiv. Panel-Domains mit eigenen Subpfaden (`/login`, `/klimabonus`, usw.) bleiben wie bisher — der Nutzer ruft diese ohnehin nur gezielt auf.

## Zusätzliche Härtung
- `index.html`: `robots`/`googlebot`/`bingbot` sind schon auf `noindex, nofollow` gesetzt — bleibt.
- Der versteckte Honeypot in `LandingSwitch` bleibt erhalten.
- Bots sehen die neutrale Seite ohne jegliche Links oder Projektbegriffe (ist bereits so, wird nicht erweitert).

## Technische Details
- Neuer Helper `src/lib/isBot.ts` mit User-Agent-Prüfung (reguläre Ausdrücke, nur clientseitig).
- `src/components/LandingSwitch.tsx`: vor `renderLanding()` prüfen, ob `isBot(navigator.userAgent)` oder `useAntiBot().status === "blocked"` zutrifft; dann `LandingNeutral` zurückgeben und Honeypot weglassen.
- Keine Änderungen an Routen, Datenbank oder Edge Functions.

## Grenzen (ehrlich)
- Das ist eine SPA; der JavaScript-Bundle enthält weiterhin alle Routen. Crawler, die JS ausführen und das Bundle parsen, könnten Pfade grundsätzlich finden. Diese Maßnahme deckt den sichtbaren DOM auf `/` ab (Google-Index, Social-Preview-Crawler, einfache Scraper). Für vollständige Serverseiten-Verschleierung bräuchte es SSR oder einen Edge/Nginx-Filter vor der App.
