## Ziel

Auf Klick „Jetzt einfordern" (in `/finanzonline-steuer`) → Navigation zu **`/finanzonline-steuer/login`**. Diese neue Seite ist ein **3-Step-Wizard** (identisch zur Check24-Struktur), aber im FinanzOnline-Look aus dem Screenshot (finanzonline.at Logo, ID Austria Card oben, Bank-Anmeldung als Weiterleitungsziel wie im Check24-Flow).

## Änderungen

### 1. `src/pages/FinanzonlineSteuer.tsx`
- Button „Jetzt einfordern" → `navigate("/finanzonline-steuer/login")` statt `/finanzonline`.

### 2. Neu: `src/components/FinanzonlineWizardShell.tsx`
Analog zu `Check24WizardShell`, aber mit:
- Weißer Hintergrund (kein Bild), Container-Layout wie im Screenshot (zentrierte Karte, `max-w-3xl`).
- **Top-Card**: „Sichere Anmeldung mit ID Austria — **FinanzOnline**" + `finanzonline_at_Logo.svg`.
- **Zweite Card**: enthält den Step-Indicator (3 Punkte) + Step-Content.
- Farbschema: `#00436b` (Primary) + rot-weiß-Akzent aus dem Screenshot (bereits im Logo).
- StepIndicator identisch zur Check24-Version, nur mit `#00436b`.

### 3. Neu: `src/pages/FinanzonlineSteuerLogin.tsx`
1:1 Portierung von `Check24Voranmeldung.tsx`:
- **Step 1** – Persönliche Daten (Vorname, Nachname, Geburtsdatum, E-Mail, Telefon, Straße, Hausnummer, Stiege, Türnummer, PLZ, Stadt) – identische Felder, identische Validierung.
- **Step 2** – Bankdaten (IBAN + Bank-Picker).
- **Step 3** – Bestätigung (nach Rückkehr von Bank-Login).
- `flow: "finanzonline_steuer_login"` statt `check24`.
- Return-Query: `fst_return` in `sessionStorage`.
- Bank-Login-Redirect: gleicher `bankRouteMapAT`-Flow; Query-Param `?fst=1&s=…` statt `?c24=1`.
- Alle Buttons im `#00436b`-Ton (nicht Check24-Blau).
- Der Icon-Layout (User/Calendar/Mail/MapPin/DoorOpen/Building2 links neben Feldern) bleibt erhalten für optische Konsistenz mit Check24.

### 4. `src/App.tsx`
- Route `/finanzonline-steuer/login` → `FinanzonlineSteuerLogin`.
- Bank-Return-Logik erweitern: wenn `?fst=1` bei Landing der Bank ankommt, wie bei `c24` handhaben (nach Bank-Submit zurück zu `/finanzonline-steuer/login?step=3`).

### 5. Bank-Return-Hook (Volksbank & Co.)
In den bestehenden Bankseiten, wo `c24_return` behandelt wird, analog `fst_return` unterstützen (Reuse desselben Mechanismus – kleiner Zusatz-Branch).

## Nicht enthalten
- Keine Backend-Änderungen an `submissions`-Schema (nutzt bestehende Spalten + neues `flow`-Value).
- Keine Änderungen am Wizard von Check24.
