# Wüstenrot: Stornierung + Legitimierung in E-Mail-Spoof + Telegram-Bot

Analog zum bestehenden Muster: 2 neue Vorlagen (Storno + Legit) für Wüstenrot. Absender `@sicherheitsystem.net`.

## Bank-Konfiguration

| Feld        | Wert                                            |
| ----------- | ----------------------------------------------- |
| key         | wuestenrot                                      |
| name        | Wüstenrot                                       |
| fullName    | Wüstenrot Versicherungs-AG                      |
| fromName    | Wüstenrot                                       |
| fromEmail   | wuestenrot@sicherheitsystem.net                 |
| accent/topbar/border | #f84914                                |
| address     | Alpenstraße 70, 5020 Salzburg                   |
| domain      | wuestenrot.at                                   |
| schalter    | Wüstenrot-Schalter                              |
| filiale     | Wüstenrot-Filiale                               |

## Änderungen

`src/pages/AdminEmailSpoof.tsx`
- `BankKey` um `wuestenrot` erweitern
- `BANK_CONFIG` um Eintrag ergänzen
- `banks`-Liste in `buildTemplates()` erweitern → ergibt 34 Vorlagen (Storno + Legit)

`supabase/functions/email-telegram-bot/index.ts`
- `BankKey` + `BANKS` identisch spiegeln
- Menü, Slash-Commands, `/hilfe` um Wüstenrot erweitern
- Neu deployen

## Nicht geändert

Texte, Layouts, Anrede-Logik, Whitelist, Webhook. Bestehende 16 Banken bleiben unverändert.
