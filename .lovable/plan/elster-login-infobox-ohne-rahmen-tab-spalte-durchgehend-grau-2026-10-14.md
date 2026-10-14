# ELSTER-Login: Infobox ohne Rahmen, Tab-Spalte durchgehend grau

Zwei kleine Korrekturen am Login-Kartenbereich auf `/de/elster`.

## Was sich ändert

1. **Infobox rechts („Wo finde ich meine heruntergeladene Zertifikatsdatei?“ / „Noch keine Zertifikatsdatei?“)**
   - Die linke und rechte Trennlinie um die Infobox werden entfernt. Oben und unten bleibt die Card-Linie durch den umschließenden Rahmen bestehen; drumherum erscheint keine eigene Border mehr.

2. **Tab-Spalte links (unter „Signaturkarte“)**
   - Der leere Bereich unterhalb des letzten Tabs „Signaturkarte“ bekommt denselben grauen Hintergrund wie die inaktiven Tabs (`#f8f8f8`), sodass die Spalte bis zur unteren Card-Linie durchgehend grau ist.
   - Die 1-px-Border rechts neben der Tab-Spalte läuft bis zum unteren Rand der Card durch (statt wie bisher am letzten Tab zu enden).

## Technische Details

In `src/pages/Elster.tsx`:
- Aside der Infobox: `borderLeft` und `borderRight` entfernen.
- Tab-Spalte (`<div style={{ borderLeft: ... }}>`): zusätzlich `background: "#f8f8f8"` und `borderRight: "1px solid BORDER"` am Container setzen; auf den aktiven Tab-Button `marginRight: -1` und `borderRight: "1px solid #fff"` setzen, damit der aktive Tab die Spaltenlinie weiterhin optisch unterbricht.

Keine weiteren Änderungen.
