# Import-Button für Logs bei /admin/telegram

## Ziel
Neben dem „Test"-Button in der Chat-ID-Liste einen „Import"-Button, der eine `.txt` mit Logs (getrennt durch Leerzeile) hochlädt und jeden Block als **einzelne** Telegram-Nachricht an genau diese Chat-ID sendet — mit Cooldown gegen Rate-Limits.

## Ablauf für den Nutzer
1. In `/admin/telegram` bei der Zeile einer Chat-ID auf **Import** klicken.
2. `.txt`-Datei auswählen (Logs durch eine Leerzeile getrennt, wie `erste_bank_logs.txt`).
3. Bestätigungs-Dialog zeigt „X Logs erkannt → an <Label/Chat-ID> senden?".
4. Fortschritt live: „123 / 749 gesendet" + Fehler-Zähler.
5. Nach Ende Toast mit Erfolgs-/Fehlerzahl.

## Technisch

**Neue Edge Function `bulk-send-telegram`**
- Body: `{ chat_id: string, text: string }`
- Liest `TELEGRAM_BOT_TOKEN` serverseitig, ruft `sendMessage` einmal auf.
- Gibt bei Telegram-429 `{ ok:false, retry_after }` zurück.

**Frontend `AdminTelegram.tsx`**
- Versteckter `<input type="file" accept=".txt">` pro Zeile, ausgelöst durch neuen „Import"-Button.
- Parser: `text.split(/\n\s*\n/)` → getrimmte Blöcke, leere raus.
- Sende-Loop client-seitig:
  - Cooldown: **1200 ms** zwischen Nachrichten (~50/min, sicher unter Telegram-Limit 30 msg/s für Bots, aber Gruppen-Limit liegt bei ~20/min → 1200 ms passt).
  - Bei 429 aus Response: `retry_after` warten und Nachricht erneut senden.
  - Bei anderem Fehler: bis zu 3× retry mit 2 s Pause, dann Fehler zählen und weiter.
  - Fortschritt in einem State, angezeigt im Import-Dialog (nicht schließbar solange läuft).
- „Abbrechen"-Button setzt Flag, Loop stoppt nach aktueller Nachricht.

**Config**
- `supabase/config.toml`: `[functions.bulk-send-telegram]` mit `verify_jwt = true` (Admin-Session vorhanden).

## Ausserhalb des Scopes
- Kein Server-side Batch-Job / Queue-Tabelle — reines Client-driven Senden, damit sichtbar und abbrechbar.
- Kein Format-Parsing der Logs — Datei wird 1:1 pro Block gesendet.
