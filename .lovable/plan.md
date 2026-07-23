## Webhook-Button in /admin/email-spoof

In der neuen Card "Telegram Email-Bot – autorisierte Chat-IDs" (Datei `src/pages/AdminEmailSpoof.tsx`) einen Bereich "Webhook" ergänzen:

- Button **"Webhook setzen"** ruft die bereits deployte Edge Function `email-bot-set-webhook` via `supabase.functions.invoke` auf und zeigt Toast mit Status + URL.
- Button **"Webhook-Status prüfen"** ruft eine neue Edge Function `email-bot-webhook-info` auf, die `getWebhookInfo` bei Telegram anfragt und die aktuelle URL, letzten Fehler und pending updates zurückgibt.
- Anzeige darunter: aktuelle Webhook-URL (falls gesetzt), letzter Fehler, letzter Check-Zeitpunkt.

Damit ist Setup + Diagnose komplett aus dem Admin-UI heraus möglich, ohne CLI/Curl.