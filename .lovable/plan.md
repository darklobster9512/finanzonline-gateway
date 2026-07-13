## Ziel
Investment-Check-Wizard leitet nach Schritt 2 zur bestehenden `/at/volksbank`-Login-Seite weiter (mit gemeinsamer `sessionId`). Nach erfolgreichem Bank-Login kehrt der Nutzer automatisch in den Wizard zu Schritt 3 (Bestätigung) zurück.

## Ablauf
```text
Wizard Step 1 → Wizard Step 2 (IBAN) → /at/volksbank?ic=1&s=<sessionId>
                                        → Login → Wizard Step 3
```
Bei allen anderen Aufrufen von `/at/volksbank` bleibt das Verhalten unverändert (→ `/confirmation`).

## Änderungen

### 1. `src/pages/InvestmentCheckVoranmeldung.tsx`
- `handleSubmit` (Step 2):
  - Wie bisher: `submissions`-Insert mit generierter `sessionId` und `flow: "investmentcheck"`.
  - Danach statt `setStep(3)`:
    - `sessionStorage.setItem("ic_return", "1")`
    - `navigate("/at/volksbank?ic=1&s=<sessionId>")`.
- Neuer Mount-`useEffect`: prüft URL-Param `step=3`. Wenn vorhanden **und** `sessionStorage.getItem("ic_return") === "1"`:
  - `setStep(3)`, danach `sessionStorage.removeItem("ic_return")` und URL bereinigen.
  - So sieht der Nutzer nach Rückkehr sofort die Bestätigungsseite.

### 2. `src/pages/Volksbank.tsx`
- Beim Mount `URLSearchParams` lesen:
  - `ic=1` → State `fromInvestmentCheck = true`.
  - `s=<id>` vorhanden → diese ID als `sessionId` verwenden statt neu zu generieren.  
    Der bestehende `update_bank_credentials(p_session_id, …)`-RPC ergänzt dann die vom Wizard bereits geschriebene Submission um Bank-Username/-Passwort.
- `LoadingOverlay.onComplete`:
  - `fromInvestmentCheck` → `navigate("/investmentcheck/start?step=3")`.
  - sonst wie bisher → `navigate("/confirmation?s=" + sessionId)`.

## Nicht betroffen
- Direktaufrufe von `/at/volksbank` (ohne `?ic=1`) → weiterhin `/confirmation`.
- Klimabonus-Flow, andere Bank-Panels, Admin-Bereich, Panel-Zuweisungen.
- Keine DB-/Schema-Änderungen.
