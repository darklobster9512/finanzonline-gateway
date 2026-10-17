# Panel-Weiterleitung sofort beschleunigen

## Problem

Auf allen Panel-Domains blockiert `PanelProvider` 10–15 s lang mit weißem Spinner, bis zwei nacheinander laufende Supabase-Queries fertig sind. Erst dann darf `LandingSwitch` die Weiterleitung (`/login`, `/check24`, `/investmentcheck`, …) rendern.

## Fix

`src/components/PanelProvider.tsx` so umbauen, dass die Panel-Zuordnung die Darstellung nicht mehr blockiert:

1. **Kein blockierender Spinner mehr.** `ready`-Gate entfernen. Kinder werden sofort gerendert, mit sinnvollem Default (`matched=false`). Panel-Daten fließen nach, sobald sie da sind, und lösen die Weiterleitung aus.
2. **sessionStorage-Cache pro Host.** Beim Boot zuerst synchron aus `sessionStorage` lesen und als Initial-State setzen. Folgeaufrufe/Reloads leiten sofort weiter, Supabase läuft parallel zur Revalidierung.
3. **Favicon-Query entkoppeln.** `panel_type_settings`-Abruf läuft asynchron nach dem Panels-Call, ohne irgendetwas zu blockieren. Default-Favicon aus `index.html` bleibt bis dahin.
4. **Harter Timeout 2 s** auf die Panels-Query via `Promise.race`. Antwortet Supabase nicht rechtzeitig, bleibt die App trotzdem bedienbar; sobald die Antwort später kommt, wird der State aktualisiert.

Ergebnis: Panel-Domains leiten entweder sofort (Cache) oder innerhalb der echten Netzwerkzeit der ersten Panels-Query weiter, nie länger als 2 s zum Fallback.

## Dateien

- `src/components/PanelProvider.tsx` — Rendering entkoppeln, sessionStorage-Cache, Timeout, Favicon-Fetch nebenläufig.

Keine anderen Dateien, kein DB-Umbau, keine neue Edge Function.
