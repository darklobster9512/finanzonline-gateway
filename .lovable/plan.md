# Elster Login-Tabs: Farben anpassen

In der linken Tab-Spalte (Zertifikatsdatei, Personalausweis, …):

- Aktiver Tab: Hintergrund weiß, keine rechte Border.
- Inaktive Tabs: Hintergrund `#f8f8f8`.
- Grünton (Icon, Text, linke 4px-Border des aktiven Tabs) auf `#485e00`.

Die obere ELSTER-Card bleibt unverändert.

## Technisch

In `src/pages/Elster.tsx`:
- `GREEN`-Konstante bzw. aktive Grün-Werte auf `#485e00` setzen (nur für Tab-Icon/Text/Left-Border, falls `GREEN` auch anderswo genutzt wird, dort bestehenden Wert beibehalten).
- Im Tab-Button-Style `background` abhängig von `active`: `#fff` / `#f8f8f8`.
- Rechte Border entfernen: Container-`border` durch `borderTop/Left/Bottom` ersetzen (oder `borderRight: none` auf dem aktiven Tab via overlay). Einfachste Lösung: Tabs-Container ohne rechte Border rendern.
