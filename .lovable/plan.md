## Ziel
Im Investment-Check-Wizard (Step 2) ist die Bank fest auf **Volksbank** gesetzt und nicht änderbar. Andere Seiten mit demselben Bank-Dropdown bleiben unverändert.

## Änderungen — nur `src/pages/InvestmentCheckVoranmeldung.tsx`

1. Initialstate: `useState("Volksbank")` statt `""` für `selectedBank`.
2. `showBankPicker`-Logik entfernen — der Popover/`Command`-Block wird komplett aus dem JSX gelöscht. Auch der `Popover`/`Command`-Import wird entfernt, ebenso `bankOpen`, `bankSearch`, `inputRef`, der zugehörige `useEffect(focus)` und `ChevronsUpDown`/`Check`-Icons.
3. Neuer, rein visueller Read-only-Block unter dem IBAN-Feld (nur bei `ibanCleanLength > 10` sichtbar, damit das Layout wie bisher schrittweise erscheint):
   - Label „Bank"
   - Disabled-Input mit Volksbank-Logo (`@/assets/logo-bank-austria.svg` gibt's nicht; benutze das vorhandene `@/assets/volksbank.png` bzw. `volksbank-logo.png`) + Text „Volksbank", gleicher Style wie das bisherige Trigger-Feld, aber `readOnly`/`pointer-events-none` und ohne Chevron.
4. `step2Valid` bleibt (`selectedBank` ist immer „Volksbank" → Bedingung erfüllt sobald IBAN ≥ 16 Zeichen).
5. Keine Änderung an `banksAT` in `src/lib/banks.ts` und keine Änderung an anderen Wizards (Klimabonus, Rückerstattung etc.).

## Nicht Teil
- Keine Änderungen an globalen Bank-Listen oder anderen Seiten.
- Keine DB-/Schema-Änderungen.
