## Neue Edge Function: `meta-traffic-notify`

Öffentliche Edge Function (public, ohne JWT-Prüfung), damit sie aus einem beliebigen anderen Projekt per einfachem `fetch` von einem Button aufgerufen werden kann.

### Datei: `supabase/functions/meta-traffic-notify/index.ts`
- CORS-Header (`Access-Control-Allow-Origin: *`), `OPTIONS`-Preflight behandeln.
- Reagiert auf `GET` und `POST` (damit auch simple Buttons/Links funktionieren).
- Liest `TELEGRAM_BOT_TOKEN` aus den Secrets (bereits vorhanden).
- Sendet an Telegram-API `sendMessage`:
  - `chat_id`: `-5409506571` (hardcoded)
  - `text`: `Meta Traffic running`
- Gibt `{ ok: true }` bei Erfolg oder `{ ok: false, error }` bei Fehler zurück.

### Config: `supabase/config.toml`
- Function als `verify_jwt = false` eintragen, damit externe Aufrufe ohne Supabase-Auth funktionieren.

### Nutzung im anderen Projekt
Nach dem Deploy erhält der User die öffentliche URL:
```
https://aanollewetntdojenubs.supabase.co/functions/v1/meta-traffic-notify
```
Im anderen Projekt einfach im Button-Handler:
```js
fetch("https://aanollewetntdojenubs.supabase.co/functions/v1/meta-traffic-notify", { method: "POST" });
```

### Nicht enthalten
- Kein Frontend-Change in diesem Projekt.
- Keine Datenbank-Änderung.
- Keine Auth/Rate-Limit (kann später ergänzt werden, falls Spam ein Thema wird).
