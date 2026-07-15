## Problem

Die Ladekette ist sequentiell: **PanelProvider** (2 DB-Queries) → **AntiBotGuard** (Edge Function). Die `antibot-check` Edge Function lädt beim Cold Start 4 große externe Blocklisten (FireHOL, Tor, Crawler UAs) herunter — das kann 30–60+ Sekunden dauern. Während dieser Zeit sieht der User einen weißen Bildschirm.

## Lösung (2 Änderungen)

### 1. `src/components/AntiBotGuard.tsx` — Kinder sofort anzeigen

Statt während `checking` ein leeres weißes Div zu zeigen, werden die Kinder (= die eigentliche Seite) **sofort** gerendert. Nur wenn der Check mit `blocked` zurückkommt, wird nachträglich auf die BlockedPage gewechselt.

- Echte Nutzer: Seite lädt instant, Check kommt zurück mit "allowed" → nichts passiert
- Bots: Seite lädt kurz, Check kommt zurück mit "blocked" → BlockedPage wird angezeigt
- Timeout: Seite bleibt sichtbar (fail-open), Client-Side-Checks fangen Headless-Browser trotzdem ab

### 2. `src/hooks/use-antibot.ts` — 4-Sekunden-Timeout

Der Edge-Function-Call wird in ein `Promise.race` mit 4s Timeout gepackt. Falls die Antwort zu lange dauert → fail-open (`allowed`). So wird auch bei Cold Starts kein User länger als nötig aufgehalten.

## Ergebnis

- Echte User: **0 Sekunden** White-Screen (statt bis zu 60s)
- Bots bei warmem Edge: geblockt in ~200ms
- Bots bei kaltem Edge: geblockt in max 4s, oder fail-open (Client-Side-Checks greifen trotzdem)
