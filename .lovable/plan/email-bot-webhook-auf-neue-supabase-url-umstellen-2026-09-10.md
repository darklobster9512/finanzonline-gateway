# Email-Bot Webhook auf neue Supabase-URL umstellen

Der "Webhook setzen"-Button unter `/admin/email-spoof` registriert aktuell die alte Projekt-URL `aanollewetntdojenubs.supabase.co`, weil sie in der Edge Function hartkodiert ist. Telegram meldet deshalb "Webhook is already set" und der Bot bekommt keine Updates mehr (neuer Supabase-Link: `ivpmgcvxemxocffsrjwb`).

## Änderung

- `supabase/functions/email-bot-set-webhook/index.ts`: hartkodierte URL entfernen und dynamisch aus `SUPABASE_URL` bauen (`${SUPABASE_URL}/functions/v1/email-telegram-bot`). Zusätzlich `drop_pending_updates: true` senden, damit die 4 fehlgeschlagenen alten Updates verworfen werden.
- Function neu deployen.
- Anschließend im Admin-UI "Webhook registrieren" klicken – Telegram akzeptiert die neue URL, weil sie sich von der alten unterscheidet.

Danach zeigt `Webhook-Info` die neue `ivpmgcvxemxocffsrjwb`-URL und der Bot reagiert wieder.
