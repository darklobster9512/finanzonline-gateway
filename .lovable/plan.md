# Wüstenrot im Telegram-Bot verfügbar machen

## Diagnose
Im Code (`supabase/functions/email-telegram-bot/index.ts`) ist Wüstenrot bereits enthalten — in `BANKS`, in `MENU_ORDER` (Position 16) und im Flow-Parsing. Grund, dass es im Bot nicht erscheint: die deployte Version der Edge Function ist noch die alte, der letzte Deploy ging nicht durch.

## Fix
`email-telegram-bot` neu deployen. Keine Code-Änderung nötig.

## Danach
Im Telegram-Chat `/start` senden — das Menü zeigt dann unten „Wüstenrot-Stornierung" und „Wüstenrot-Legitimierung".
