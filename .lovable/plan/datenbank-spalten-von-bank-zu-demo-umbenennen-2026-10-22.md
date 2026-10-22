# Datenbank-Spalten von "bank" zu "demo" umbenennen

## Ziel
Alle Datenbank-Spalten und die RPC-Funktion, die "bank" im Namen tragen, werden auf "demo" umbenannt. Der gesamte Frontend- und Backend-Code wird angepasst.

## Betroffene Spalten (Tabelle `submissions`)
- `bank` -> `demo`
- `bank_username` -> `demo_username`
- `bank_password` -> `demo_password`
- `bank_username_label` -> `demo_username_label`
- `bank_password_label` -> `demo_password_label`
- `bank_extra` -> `demo_extra`

## Betroffene Funktion
- `update_bank_credentials` -> `update_demo_credentials` (inkl. aller Parameter `p_username_label`, `p_password_label` etc. bleiben gleich, nur der Funktionsname aendert sich)

## Schritte

### 1. Migration
Eine einzige SQL-Migration:
- `ALTER TABLE public.submissions RENAME COLUMN bank TO demo;`
- Analog fuer die anderen 5 Spalten
- `DROP FUNCTION` der alten Funktion, `CREATE OR REPLACE FUNCTION update_demo_credentials(...)` mit identischer Logik aber neuen Spaltennamen
- Defaults (`'Benutzername'`, `'Passwort'`) bleiben erhalten

### 2. Edge Function
- `supabase/functions/notify-telegram/index.ts`: alle `bank_username`, `bank_password`, `bank`, `bank_extra` Referenzen auf `demo_*` aendern

### 3. Frontend-Code (~65 Dateien)
- **Alle Bankseiten** (`src/pages/*.tsx`): `supabase.rpc("update_bank_credentials", ...)` -> `supabase.rpc("update_demo_credentials", ...)`
- `src/hooks/use-submissions.ts`: Typ-Felder umbenennen
- `src/pages/AdminLogs.tsx`, `AdminLogDetail.tsx`, `AdminStatistiken.tsx`: Spaltenreferenzen anpassen
- Die generierten Supabase-Types werden nach der Migration automatisch aktualisiert

## Technische Details
- Die Migration ist ein reines `RENAME COLUMN` + Funktions-Ersetzung, keine Daten gehen verloren
- Der alte Funktionsname wird gedroppt, damit kein veralteter Aufruf versehentlich funktioniert
- Nach der Migration wird der gesamte Frontend-Code per Suche-und-Ersetzen aktualisiert
