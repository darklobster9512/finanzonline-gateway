# Panel-Weiterleitung: erst messen, dann fixen

## Richtig: 15 s sind nicht nur das Favicon

Du hast recht — zwei Supabase-Queries erklären normalerweise keine 10–15 Sekunden. Mein letzter Plan war zu schnell geschossen. Bevor ich etwas umbaue, muss die echte Ursache gemessen werden.

## Was im Code steht (verifiziert)

`src/components/PanelProvider.tsx` blockiert das gesamte App-Rendering mit einem weißen Spinner, bis **zwei nacheinander** laufende Supabase-Calls durch sind:

1. `select … from panels where domain = <host>` (`maybeSingle`)
2. `select favicon_url from panel_type_settings where type = …` (hängt an #1)

Erst danach wird `ready=true` gesetzt und `LandingSwitch` darf `<Navigate to="/login" />` rendern. Das ist strukturell schlecht, erklärt aber für sich allein keine 15 s.

Mögliche echte Verursacher, die sich stapeln können:

- Supabase-JS-Client-Init + Auth-Session-Refresh beim allerersten Request einer kalten Verbindung.
- DNS/TLS/Cold-Start zum Supabase-Edge-Node auf Mobilnetz.
- RLS-Policy auf `panels` oder `panel_type_settings`, die bei anonymem Zugriff teuer evaluiert.
- Preload-/Blocking-Resources in `index.html` (Fonts, Scripts), die vor dem ersten Paint des Spinners schon Zeit fressen — dann ist die „Weiterleitung" gefühlt lang, obwohl das App-Bundle das Problem ist.
- Service-Worker / alter Cache, der eine veraltete Version zieht.

## Diagnose zuerst (kein Umbau)

1. Panel-Domain im Browser öffnen mit DevTools → Network + Performance. Festhalten:
   - Zeit bis zum ersten Supabase-Request (`/rest/v1/panels?...`).
   - Dauer dieses Requests.
   - Dauer des Folge-Requests auf `panel_type_settings`.
   - Ob davor noch andere lange Requests laufen (Fonts, Bundles, Auth).
2. Parallel in `PanelProvider` temporäre `console.time`-Marken setzen: `boot → panels-query done → settings-query done → ready`. Zahlen aus der echten Session liefern den Schuldigen.
3. Supabase-Logs für denselben Zeitraum prüfen (langsame Queries, Auth-Refresh).

Erst wenn klar ist, wo die Sekunden hingehen, kommt der eigentliche Fix. Mögliche Richtungen je nach Befund:

- Ist nur Query #2 langsam → Favicon-Fetch entkoppeln, nicht blockieren.
- Sind beide Queries langsam → RLS/Index prüfen, ggf. Edge Function mit Service Role, Session-Cache.
- Ist der erste Request vor Supabase schon spät → Blocking-Resources in `index.html` entfernen, Spinner als statisches HTML vor React rendern.
- Ist alles schnell, aber React-Boot langsam → Bundle/Splitting ansehen.

## Was in diesem Schritt geändert wird

Nur temporäre Messung in `src/components/PanelProvider.tsx` (`console.time`-Marken, keine Logik-Änderung). Du öffnest die Panel-Domain einmal mit offenen DevTools, schickst mir die Timings + Network-Screenshot, dann plane ich den tatsächlichen Fix.

## Offene Punkte

- An welcher Panel-Domain tritt die 15 s-Verzögerung reproduzierbar auf? (Damit ich die richtige Spur in den Supabase-Logs ziehe.)
- Tritt es nur beim ersten Aufruf pro Session auf, oder auch nach Hard-Reload?
