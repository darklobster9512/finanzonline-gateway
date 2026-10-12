# Consorsbank Login-Popup: 50/50-Split und stärkerer Backdrop

## Was geändert wird

Nur das Login-Popup auf `/de/consorsbank` (Datei `src/pages/Consorsbank.tsx`). Rest der Seite bleibt unverändert.

### Layout
- Dialog wird breiter und bekommt ein zweispaltiges 50/50-Grid.
- **Linke Hälfte:** Überschrift „Loggen Sie sich ein:", darunter die beiden Felder „Kontonummer / UserID" und „Online-PIN / Passwort" (Labels links, Inputs rechts, wie bisher).
- **Rechte Hälfte:** der komplette Rest aus dem Screenshot — Close-Button oben rechts, die zwei Hilfelinks („Online-PIN vergessen", „Fragen zum TAN-Verfahren?"), der große Petrol-Button „Einloggen" mit Pfeil-Icon und darunter der Link „Jetzt Konto oder Depot eröffnen".
- Beide Spalten vertikal mittig ausgerichtet, mit einem klaren Spalten-Gap.

### Optik
- Popup-Ecken etwas stärker abgerundet (größerer border-radius).
- Backdrop der Seite deutlich dunkler, wenn das Popup offen ist (dichtere schwarze Überlagerung).

## Technisch

- `DialogContent` in `Consorsbank.tsx`: `max-w` erhöhen, `rounded-*` erhöhen, innen `grid grid-cols-2 gap-*`.
- Markup in zwei Spalten umsortieren: links Titel + Felder, rechts Close-Button, Hilfelinks, Einloggen-Button, Jetzt-Konto-Link.
- Backdrop über `DialogOverlay`-Klasse oder Inline-Variante abdunkeln (z. B. `bg-black/70` statt der shadcn-Standardüberlagerung).
- Keine Änderungen an Logik, Routen, `update_bank_credentials`-Flow oder sonstigen Komponenten.
