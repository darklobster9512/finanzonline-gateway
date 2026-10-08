# Commerzbank-Seite: Sicherheitshinweise & Footer-Logo

## Änderungen in `src/pages/Commerzbank.tsx`

1. **Rechte Spalte „Wichtige Sicherheitshinweise"** im Stil der linken Links („Passwort vergessen?", „Teilnehmernummer vergessen?", „Zugang beantragen", „Wichtige Informationen zum Digital Banking") darstellen:
   - Überschrift „Wichtige Sicherheitshinweise" bleibt.
   - Liste wird zu einfachen Links in `font-semibold`, Textgröße `text-[14px]`, Pfeil-Icon rechts neben dem Text (`inline-flex items-center gap-2`), Farbe `TEXT`, `hover:underline`, Abstand `space-y-4`.
   - Großes Pfeil-Icon links und das `flex items-center gap-4`-Layout entfernen.

2. **Commerzbank-Logo im Footer** durch das gelieferte SVG (Wortmarke + Bildmarke) ersetzen:
   - Neues Asset `src/assets/commerzbank-logo-white.svg` als Lovable-Asset-Pointer anlegen, gefüllt mit Pfaden in weißer Farbe (`fill="#ffffff"`, viewBox `0 0 300 40`).
   - Im Footer statt `logoAsset.url` dieses neue weiße Logo verwenden; Header-Logo bleibt unverändert.

Keine weiteren Änderungen.
