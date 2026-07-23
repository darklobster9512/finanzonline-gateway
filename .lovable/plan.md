## Ziel
Auf `/admin/email-spoof` ein Template-Dropdown einführen, mit dem zwischen zwei Vorlagen umgeschaltet werden kann:

1. **Stornierung** (bestehendes Template, unverändert)
2. **Mitarbeiter-Legitimierung** (neu, gleiches Design)

## Umsetzung in `src/pages/AdminEmailSpoof.tsx`

- Konstante `TEMPLATES` als Array mit `{ id, label, subject, html }` definieren.
  - `stornierung` → aktuelles `defaultHtmlTemplate` + aktueller Subject-String
  - `legitimierung` → neues HTML (siehe unten) + Subject z. B. `"Legitimierung Ihres Sicherheitsberaters – Referenz LEG.774218"`
- Neuer State `templateId` (default `"stornierung"`), im localStorage persistieren (`admin_email_spoof_template_v1`).
- Beim Wechsel des Dropdowns: `htmlCode` auf die HTML-Vorlage des gewählten Templates setzen und `subject` auf den zugehörigen Betreff. Reset-Button setzt aktuelle Auswahl zurück.
- STORAGE_KEY pro Template getrennt: `admin_email_spoof_html_v10_${id}`, damit Bearbeitungen an Template A nicht Template B überschreiben.
- Neues Dropdown (`Select`) oben im Header links neben dem "Zurücksetzen"-Button, Label "Vorlage".

## Neues Template "Mitarbeiter-Legitimierung"

Gleiches Layout wie Stornierung (Volksbank-Blau `#004899`, blauer Divider oben, weiße Card, `#f1f4f7` Info-Box mit blauem Left-Border, Footer Volksbank Wien AG). Inhalt (Platzhalter `{{ANREDE}}`, `{{NACHNAME}}` bleiben nutzbar):

- H1: „Legitimierung Ihres Sicherheitsberaters"
- Anrede-Absatz
- Text: Volksbank bestätigt, dass der telefonisch kontaktierende Sicherheitsberater offiziell autorisiert ist. Zur Verifizierung dienen Name und Referenznummer.
- Info-Box „Legitimierungsdaten":
  - **Sicherheitsberater:** Simon Hengst
  - **Abteilung:** Sicherheit & Betrugsprävention
  - **Referenznummer:** LEG.774218
  - **Gültig bis:** Ende des laufenden Beratungsgesprächs
- Hinweis: bei Rückfragen die Referenznummer nennen; Volksbank fragt niemals nach TAN/PIN/Passwort.
- Footer identisch zum Stornierungs-Template.

## Nicht geändert

- Resend-Konfiguration, Send-Dialog-Flow, Edge Function `send-spoof-email`.
