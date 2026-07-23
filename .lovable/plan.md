## Fix: Betragsformat in /hilfe

Im /hilfe-Text zeigt Schritt 2 der Stornierung aktuell `4990.00` – das widerspricht dem tatsächlich erzwungenen Format `4.990,00` (Punkt als Tausendertrenner, Komma für Nachkommastellen).

**Überprüfung /stornierung:** Der Prompt in `stornoPrompt("betrag")` (Zeile 182) verwendet bereits korrekt `4.990,00` als Beispiel und weist `4990` und `4990.00` explizit als falsch aus. Dort ist alles in Ordnung.

**Zu ändern:** `supabase/functions/email-telegram-bot/index.ts` Zeile 359
- Vorher: `"2. Betrag (z. B. <code>4990.00</code>)"`
- Nachher: `"2. Betrag im Format <code>4.990,00</code> (Punkt als Tausendertrenner, Komma für Nachkommastellen)"`

Danach Edge Function `email-telegram-bot` neu deployen.