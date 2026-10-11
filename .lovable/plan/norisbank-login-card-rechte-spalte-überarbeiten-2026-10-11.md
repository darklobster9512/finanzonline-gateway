# Norisbank Login-Card & rechte Spalte überarbeiten

Änderungen nur in `src/pages/Norisbank.tsx` (Desktop im Fokus, Mobile analog wo relevant).

## Login-Card (links)
- Vertikal mittig im Hero zentrieren (Desktop-Grid auf `items-center`, `min-h-screen` beim Hero).
- Hintergrund `#1c2533`.
- Ecken der Card abgerundet (`border-radius: 16px`).
- Begrüßung bereits dynamisch (`Guten Tag` / `Guten Abend` ab 17 Uhr Berlin) — unverändert belassen, da schon vorhanden.
- Eingabefelder: Border `#ee7971`, Radius reduziert (z. B. 8 px statt 999).
- Label „norisbank ID" / „Passwort" in `#ee7971`.
- Beim Fokus: doppelte Outline (weißer Zwischenraum + äußerer Ring) in `#fd5000`, umgesetzt via `box-shadow: 0 0 0 2px #1c2533, 0 0 0 4px #fd5000`.
- „Weiter"-Button schmaler (z. B. `px-6`), Textfarbe `#1c2533`.

## Rechte Spalte
- Hintergrund `#1c2533`.
- Alle Divider entfernen, außer:
  - Divider über „Warnung: Aktuelle Betrugsfälle"
  - Divider über dem Footerblock (English Version / Erste Schritte / … / Datenschutz).
- Icons (Telefon, Fragezeichen, Schild) in Textfarbe statt Orange.
- Alle grauen Texte (`MUTED`) in der rechten Card auf Weiß.
- norisbank-Logo etwas kleiner.

## Footer der rechten Card (unter dem letzten Divider)
- Hintergrund `#101921`.
- „© 2026 norisbank GmbH" minimal größer und weiß.

## Nicht ändern
- Keine weiteren Texte, Links, Verhalten, Routen oder Mobile-Besonderheiten anfassen.
