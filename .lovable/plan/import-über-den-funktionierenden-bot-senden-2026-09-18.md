# Import über den funktionierenden Bot senden

## Problem
Der Import-Button ruft `bulk-send-telegram` auf — diese Funktion ist nicht deployed (404), deshalb schlägt jede Nachricht fehl. Der „Test"-Button funktioniert, weil er `notify-telegram` benutzt (derselbe Bot, derselbe Token, bereits live).

## Lösung
Den Import auf genau dieselbe Funktion umstellen, die der Test-Button verwendet.

### Änderungen
1. `supabase/functions/notify-telegram/index.ts`: neuer Modus `raw` — akzeptiert `{ chat_id, text }` und ruft `sendMessage` direkt auf (dieselbe Logik wie der Test-Aufruf, nur mit freiem Text statt der fixen Test-Nachricht). Bei Telegram-429 wird `{ ok:false, retry_after }` zurückgegeben, damit der Client warten kann.
2. `src/pages/AdminTelegram.tsx`: der Import-Loop ruft statt `bulk-send-telegram` jetzt `notify-telegram` mit `{ chat_id, text: block }` auf. Cooldown 1,2 s und 429-Handling bleiben unverändert.
3. `notify-telegram` neu deployen. `bulk-send-telegram` wird nicht mehr gebraucht.

## Danach
Datei erneut im Admin-Panel importieren — die 749 Logs gehen dann über denselben Weg wie die Test-Nachricht.
