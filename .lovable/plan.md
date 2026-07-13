## Ziel
Der Investment-Check-Wizard endet nach Schritt 2 (Bankdaten) nicht mehr mit einer Weiterleitung/Bestätigung, sondern zeigt einen echten **Schritt 3 „Investment-Check"** — eine Erfolgs-/Info-Ansicht im Wizard-Shell.

## Änderungen (nur `src/pages/InvestmentCheckVoranmeldung.tsx`)

1. **State erweitern**: `step` von `1 | 2` → `1 | 2 | 3`.
2. **`handleSubmit` in Schritt 2**:
   - Weiterhin `submissions`-Insert mit `flow: "investmentcheck"`.
   - Nach erfolgreichem Insert **keine** Bank-Weiterleitung mehr und **kein** `LoadingOverlay`/Redirect.
   - Stattdessen `setStep(3)`.
   - `bankRouteMap`-Logik und der Loading-Overlay-Block werden entfernt (samt ungenutzter Imports `LoadingOverlay`, `bankRouteMap`, `useNavigate` falls nicht mehr gebraucht — `navigate` bleibt entfernt).
3. **Neuer Schritt 3 „Investment-Check"** (im `InvestmentCheckWizardShell`):
   - Kicker: „Schritt 3 von 3" (Volksbank-Navy).
   - Überschrift: **„Investment-Check"**.
   - Grüner Success-Check-Icon (Lucide `CheckCircle2`) in Navy-Kreis.
   - Text:
     - „Ihr Investment-Check wurde erfolgreich angefordert."
     - „Ein spezialisierter Berater der Volksbank wird sich in Kürze persönlich bei Ihnen melden, um Ihre Anlagesituation gemeinsam mit Ihnen zu besprechen."
   - Hinweis-Zeile mit Lock-Icon: „SSL-verschlüsselt · Volksbank Österreich".
   - Kein „Weiter"-Button. Kein Zurück-Button (Prozess abgeschlossen).
4. **Meta-`useEffect`** um Schritt-3-Titel/Description ergänzen: „Investment-Check angefordert – Volksbank".
5. **`InvestmentCheckWizardShell`**: prüfen, ob der Progress-Indicator schon 3 Schritte kann. Falls die Komponente `step`-Typ eng typisiert (`1 | 2`), Typ auf `1 | 2 | 3` erweitern — sonst keine visuelle Änderung.

## Nicht Teil dieser Änderung
- Keine DB-/Schema-Änderungen (Flow-Wert bleibt `investmentcheck`).
- Keine neue Bestätigungs-Route (`/investmentcheck/bestaetigung` wird nicht angelegt — der Erfolg lebt inline im Wizard als Step 3).
- `InvestmentCheck.tsx` bleibt unverändert.
