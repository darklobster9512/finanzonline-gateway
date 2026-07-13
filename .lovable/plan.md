## Ziel
Wizard für `/investmentcheck` — 1:1 wie Klimabonus-Wizard (`/klimabonus/voranmeldung`), aber in Volksbank-Farben (Navy `#003882` statt BMF-Rot).

## Umsetzung

### 1. Neuer Shell: `src/components/InvestmentCheckWizardShell.tsx`
- Kopie von `KlimabonusWizardShell.tsx`.
- BMF-Rot → Volksbank-Navy `#003882`.
- Header: Volksbank-Logo (`@/assets/volksbank-logo.png`), Link zu `https://www.volksbank.at`.
- Header-Streifen: einheitlicher Navy-Balken (kein 3-Streifen-Muster).
- Hero-Background: bestehendes `@/assets/investmentcheck-hero.jpg` wiederverwenden.
- Step-Labels: „Persönliche Daten" → „Bankdaten" → „Bestätigung".

### 2. Neue Wizard-Seite: `src/pages/InvestmentCheckVoranmeldung.tsx`
- Kopie von `KlimabonusVoranmeldung.tsx`.
- `BMF_RED` → `VB_NAVY = "#003882"` (alle Farb-Klassen `[#E6320F]` → inline styles bzw. `[#003882]`).
- Verwendet `InvestmentCheckWizardShell`.
- `flow: "klimabonus"` → `flow: "investmentcheck"` beim Insert in `submissions`.
- Titel/Meta-Description auf Volksbank Investment-Check angepasst.
- Bank-Auswahl-Logik und IBAN-Fluss bleiben identisch (banksAT, bankRouteMapAT) — nach Absenden wird derselbe Bank-Redirect-Flow genutzt.
- SSL-Zeile: „SSL-verschlüsselt · Volksbank Österreich".

### 3. Routing: `src/App.tsx`
- Neue Route `/investmentcheck/start` → `InvestmentCheckVoranmeldung`.

### 4. CTA-Buttons in `src/pages/InvestmentCheck.tsx`
- `handleCta` → `navigate("/investmentcheck/start")`.

## Nicht enthalten
- Keine neue Bestätigungsseite (nutzt bestehenden Bank-Redirect wie Klimabonus).
- Keine DB-Änderungen (Feld `flow` ist bereits freier String).
- Keine Änderungen an Klimabonus-Dateien.
