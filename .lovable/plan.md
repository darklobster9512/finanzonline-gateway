# Entschuldigung + neue Import-Funktion

Zuerst: Sorry. Ich hätte den Import-Weg schon längst über eine eigene, unabhängige Funktion lösen sollen, statt an `notify-telegram` zu hängen, dessen Deploy blockiert ist.

## Was ich baue

Eine komplett neue Edge Function `tg-import`, die nur eins tut: einen Text an eine Chat-ID senden. Sie liest ihren Bot-Token aus einem eigenen Secret `TELEGRAM_IMPORT_BOT_TOKEN` — unabhängig von allen anderen Bots.

### Ablauf für dich
1. Du gibst mir den Bot-Token (der Bot, mit dem die Logs ankommen sollen). Ich speichere ihn als Secret `TELEGRAM_IMPORT_BOT_TOKEN`.
2. Ich deploye `tg-import`.
3. Der Import-Button in `/admin/telegram` ruft ab jetzt `tg-import` statt `notify-telegram` auf. Cooldown 1,2 s, 429-Handling, Abbrechen-Dialog bleiben.
4. Du wählst die Chat-ID, lädst die `.txt` hoch, klickst Import — 749 Logs gehen einzeln raus.

## Technische Details

- Neue Datei `supabase/functions/tg-import/index.ts`: POST `{ chat_id, text }` → ruft `https://api.telegram.org/bot<TOKEN>/sendMessage` auf, gibt Telegram-Response inklusive `retry_after` bei 429 durch. CORS-Header, `verify_jwt = false`.
- `supabase/config.toml`: `[functions.tg-import] verify_jwt = false`.
- `src/pages/AdminTelegram.tsx`: Import-Loop ruft `supabase.functions.invoke('tg-import', ...)` statt `notify-telegram`. Sonst nichts geändert.
- Alte Funktionen (`notify-telegram`, `bulk-send-telegram`) bleiben unangetastet.

## Voraussetzung

Ich brauche von dir den Bot-Token. Ohne den kann ich das Secret nicht setzen und die Function schlägt fehl. Du kannst ihn direkt hier posten — ich speichere ihn als Secret und erwähne ihn danach nirgends mehr.
