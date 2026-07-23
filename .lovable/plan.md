## Ziel
Resend API Key aus dem Browser entfernen und stattdessen als Supabase Secret verwenden.

## Schritte

1. **Secret anfragen**: Über `secrets--add_secret` den User nach dem Wert für `RESEND_API_KEY` fragen und in Supabase Secrets speichern.

2. **Edge Function `send-spoof-email` anpassen**:
   - `apiKey` aus dem Request-Body entfernen.
   - Stattdessen `Deno.env.get("RESEND_API_KEY")` verwenden.
   - Fehler zurückgeben, falls das Secret fehlt.

3. **`src/pages/AdminEmailSpoof.tsx` anpassen**:
   - Feld "Resend API Key" (Label + Input) aus der Resend-Konfiguration Card entfernen.
   - `apiKey` aus dem `ResendConfig` Type und State entfernen.
   - `apiKey` aus dem Request an die Edge Function entfernen.
   - Validierung (`!resend.apiKey`) entfernen, nur noch `fromName` und `fromEmail` prüfen.
   - Hinweistext zum lokalen Speichern des API Keys entfernen/anpassen (jetzt: "Der API-Key ist sicher in Supabase Secrets hinterlegt.").
