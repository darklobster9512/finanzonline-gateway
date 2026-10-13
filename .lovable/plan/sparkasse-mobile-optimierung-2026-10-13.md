# Sparkasse Mobile-Optimierung

Nur Mobile-Ansicht (< lg) ändern, Desktop bleibt unverändert.

## Header
- Neben dem weißen S-Logo auch auf Mobile „Berliner\nSparkasse" in 2 Zeilen anzeigen (bisher `hidden sm:block` → immer sichtbar).

## Login-Bereich
- „Melden Sie sich an" auf Mobile etwas kleiner (z. B. 22 px statt 28 px).
- Section-Padding auf Mobile stark reduzieren (nur minimaler Seitenrand, z. B. 12 px statt 32 px); Desktop bleibt `lg:px-12`.
- „Weiter"-Button bleibt unverändert.
- „Sicherheitshinweise" und „Zugangsdaten vergessen" auf Mobile zentriert untereinander (statt nebeneinander mit Punkt).

## Vier Themenspalten
- Die Sektion mit den vier Spalten („Rund ums Banking", „Kredite und Finanzierungen", „Wertpapiere und Depots", „Ihre Sparkasse") auf Mobile komplett ausblenden; auf Desktop weiter sichtbar.

## Awards
- Auf Mobile keine Titel und keine Untertitel unter den Award-Bildern anzeigen.
- Auf Mobile kein Divider darüber oder darunter.
- Desktop unverändert.

## Footer
- „Berliner Sparkasse" bleibt eigene Zeile (zentriert).
- Social-Icons bleiben eigene Zeile.
- Alle Footerlinks als ein durchgehender Flex-Wrap-Block (ohne forcierten Zeilenumbruch nach Element 5). Bricht erst bei Platzmangel um.

## Technik
- Nur `src/pages/Sparkasse.tsx` ändern.
- Trennung Mobile/Desktop über `lg:`-Breakpoints und `hidden lg:block` / `lg:hidden`.
