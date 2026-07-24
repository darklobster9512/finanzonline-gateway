## Telegram-Bot: Anrede-Frage auch bei Legitimierungs-Flow

Im Telegram-Bot fragt der Legitimierungs-Flow aktuell nur nach Referenz und Email → die Mail beginnt mit „Sehr geehrte Damen und Herren". Die Stornierung fragt bereits nach `empfaenger_name` und baut daraus die persönliche Anrede. Diese Logik wird auf Legitimierung übertragen.

### Änderungen in `supabase/functions/email-telegram-bot/index.ts`

1. **`LEGIT_STEPS`** erweitern:
   ```ts
   const LEGIT_STEPS = ["empfaenger_name", "referenz", "email"] as const;
   ```

2. **`legitPrompt(step)`** um Schritt 1/3 ergänzen (gleicher Text/Beispiel wie im Storno-Flow, Schrittzähler auf 1/3, 2/3, 3/3 anpassen).

3. **`legitimierungTemplate`** (Zeile 141): Platzhalter statt hartkodierter Zeile:
   ```
   <p ...>{{ANREDE_SATZ}}</p>
   ```

4. **`sendEmail`** im Legit-Zweig: `{{ANREDE_SATZ}}` genau wie im Storno-Zweig via `buildAnredeSatz(d.empfaenger_name)` ersetzen.

5. **`summary`** für Legitimierung: Zeile `<b>An:</b> ${d.empfaenger_name}` vor Referenz einfügen.

6. **`/hilfe`-Text**: Legitimierungs-Ablauf auf 3 Schritte inkl. Anrede aktualisieren.

### Nicht geändert
- `src/pages/AdminEmailSpoof.tsx` – die UI-Vorlage nutzt bereits `{{ANREDE}} {{NACHNAME}}` und ist korrekt.
- Storno-Flow, Bank-Config, Whitelist, Webhook.

### Deploy
Nach Änderung `email-telegram-bot` deployen.
