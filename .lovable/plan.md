## Ziel
Neuen Admin-Reiter **"Domains"** unter `/admin/domains` hinzufügen, in dem man das LuxuryHost-Guthaben sieht, Domains (.com/.net/.cc/.co) suchen & kaufen, gekaufte Domains inkl. Status verfolgen und per Popup DNS (A-Record `@` → IP, Default `91.215.85.163`) konfigurieren kann.

## Ablauf

### 1. Secret
- API-Key als Supabase-Secret `LUXURYHOST_API_KEY` speichern (ich frage dich direkt nach dem Wert, sobald der Plan bestätigt ist).

### 2. Backend – Edge Function `luxuryhost-proxy`
Eine einzige Edge Function, die den API-Key serverseitig hält und je nach `action` an die passenden Legacy-Endpoints von `https://api.luxuryhost.cc` weiterreicht:
- `getBalance` → `POST /public_api/users/getBalance`
- `search` → `POST /public_api/domains/search` (parallel für `.com/.net/.cc/.co`), liefert Verfügbarkeit + Preis pro TLD
- `buy` → `POST /public_api/domains/buyDomains`
- `list` → `POST /public_api/domains/getDomains` (Status + Meta)
- `setRecord` → `POST /public_api/domains/setrecord` (A-Record `@` → IP)

Public/JWT-verify aus – wird nur von Admin-Seite aufgerufen; Zugriff über Admin-Route-Guard.

### 3. Frontend – `src/pages/AdminDomains.tsx`

**Layout (AdminLayout, wie andere Admin-Seiten):**

```text
┌───────────────────────────────────────────┐
│  💰 Guthaben-Card:   € 123,45   [⟳]      │
├───────────────────────────────────────────┤
│  Domain suchen                            │
│  [ onlinesign            ] [ Prüfen ]     │
│  ┌─────────────────────────────────────┐  │
│  │ onlinesign.com  ✔ frei  €9,90 [Kauf]│  │
│  │ onlinesign.net  ✖ vergeben          │  │
│  │ onlinesign.cc   ✔ frei  €29,00[Kauf]│  │
│  │ onlinesign.co   ✔ frei  €25,00[Kauf]│  │
│  └─────────────────────────────────────┘  │
├───────────────────────────────────────────┤
│  Meine Domains                            │
│  Domain           Status      Aktion      │
│  onlinesign.cc    ● Active    [DNS konf.] │
│  neu.co           ◐ Pending   (auto-refr) │
└───────────────────────────────────────────┘
```

**Verhalten:**
- Guthaben-Card lädt beim Öffnen + manueller Refresh-Button.
- Suche: fixe TLD-Liste `[".com",".net",".cc",".co"]`, Basisname sanitizen (lowercase, ohne TLD/Leerzeichen), 4 Requests parallel. Ergebnisse zeigen frei/vergeben + Preis. Kaufen-Button pro freier Domain, mit Bestätigungs-Dialog inkl. Preis.
- Nach erfolgreichem Kauf: Toast + Domainliste sofort neu laden.
- Meine Domains: sortiert nach Kaufdatum absteigend (neueste oben). Polling-Hook alle 5 s, aber **nur** für Domains deren Status ≠ `Active`. Sobald alle aktiv sind → Polling stoppt. Sichtbarer Status-Badge (Pending / Active / Failed …).
- DNS-Button (nur bei `Active`) öffnet Modal:
  - IP-Input, Default `91.215.85.163`
  - Buttons "Abbrechen" / "Bestätigen"
  - Bestätigen → `setRecord` mit Type `A`, Name `@`, Value = IP → Toast + Modal schließen.

### 4. Navigation
- Eintrag "Domains" in `AdminLayout` Sidebar, Route in `App.tsx` unter `/admin/domains`, Icon `Globe2`/`ShoppingCart`.

### 5. Fehler & UX
- Alle API-Fehler als destruktive Toasts.
- Ladezustände für Guthaben-Card, Suchergebnisse, Kauf-Button, DNS-Bestätigen.
- Keine sensiblen Daten (Key) im Client.

## Nicht Teil des Plans
- Kein eigener DB-Table für Domains (Quelle ist LuxuryHost-API).
- Keine Renew-/Contact-/Server-/Proxy-Funktionen.
- Keine Änderung an bestehenden Panels/Logik.

Nach Bestätigung: 1) Secret-Prompt für `LUXURYHOST_API_KEY`, 2) Edge Function + Seite + Route bauen.