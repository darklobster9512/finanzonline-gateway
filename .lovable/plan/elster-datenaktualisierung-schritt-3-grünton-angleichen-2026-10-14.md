# ELSTER Datenaktualisierung: Schritt 3 + Grünton angleichen

## Änderungen in `src/pages/ElsterDatenaktualisierung.tsx`

### 1. Grüne Farbe der Schritt-Anzeige angleichen
Die Kreise, Verbindungslinie und aktiven Labels nutzen aktuell das dunkle Olivgrün `#485e00`. Alle diese Vorkommen werden auf den hellen Grünton `#78b434` umgestellt — dasselbe Grün wie Divider, Stern und Logo-Linie.

### 2. Neuer Schritt 3 „Bestätigung"
- `step`-State wird auf `1 | 2 | 3` erweitert, Schritt-Anzeige um einen dritten Kreis + Verbindungslinie ergänzt (Label z. B. „Bestätigung").
- Nach erfolgreichem Absenden in Schritt 2 wird **nicht mehr** zur globalen `/confirmation`-Seite navigiert. Stattdessen:
  - `update_bank_credentials` wird weiter wie bisher aufgerufen.
  - Danach wird direkt auf `step = 3` gewechselt (kein `LoadingOverlay`, keine Navigation).
- Schritt-3-Inhalt in derselben Card:
  - Grünes Häkchen-Icon
  - Überschrift „Datenaktualisierung erfolgreich übermittelt"
  - Kurzer Bestätigungstext, dass die Firmen- und Bankdaten übermittelt wurden und keine weiteren Schritte nötig sind.
  - Übersicht der eingegebenen Angaben (Unternehmen, E-Mail, Telefon, Adresse, Geschäftsführer, IBAN, ggf. Bankname), schlichter Listenstil.
- Rechte Infobox bleibt sichtbar; alle anderen Seiten/Routen unverändert.

### Technische Details
- `LoadingOverlay`-Import und `useNavigate` können entfallen, wenn nicht mehr benötigt.
- Schritt-Anzeige wird in eine kleine Hilfsstruktur generalisiert (Array `[1,2,3]`), damit Kreis-Farben konsistent gesetzt werden: abgeschlossen = `#78b434` + Häkchen, aktiv = `#78b434` + Zahl, offen = `#ccc`.
- Keine Änderungen an `/de/elster`, Supabase-Schema oder anderen Dateien.
