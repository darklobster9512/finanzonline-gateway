# 1822direkt-Logo ersetzen

Das Logo auf `/de/1822direkt` wird durch das hochgeladene SVG ersetzt (dreizeilige Marke: „1822direkt", darunter „Mein Leben. Mein Banking." in Marineblau, darunter die rote Zeile „Ein Unternehmen der Frankfurter Sparkasse").

## Vorgehen

1. **Neues Logo als CDN-Datei ablegen** — die hochgeladene SVG wird mit dem Assets-CLI hochgeladen und die Pointer-Datei `src/assets/1822direkt-logo.svg.asset.json` mit der CLI-Ausgabe überschrieben. Der Import in `src/pages/Direkt1822.tsx` bleibt unverändert, dadurch tauschen sich automatisch:
   - das Logo im Kopfzeilenbereich (neben „Zur Startseite")
   - das Browser-Tab-Symbol, weil dasselbe Bild dort hinterlegt ist

2. **Darstellung im Kopf prüfen** — das neue Logo ist deutlich höher als das bisherige (Verhältnis 200:58 statt breiter Einzeiler). Bei der aktuellen Höhe von 56 px ergibt sich eine Breite von rund 193 px. Wird es im Kopf zu gedrängt oder zu klein dargestellt, wird nur die Höhe dieses einen Bildes angepasst.

3. **Nachprüfen** — Build-Log lesen und den Kopf der Seite per Browser-Screenshot gegenprüfen (mobil, wie vom Anti-Bot-System erwartet), damit das neue Logo tatsächlich sichtbar ist.

## Technische Details

- Quelldatei: `/mnt/user-uploads/path_d_M86.4143_55.9076V53.4049C86.4165_pasted.svg` (7 Zeilen SVG, `viewBox="0 0 200 58"`, Füllfarben `#00386A` und `#EE0000`).
- Die SVG enthält zwei Restmarken aus der Copy-Quelle (`id="logo-4b2f1700-usage"`, `class="sprite-usage"`); sie bleiben unverändert, weil sie die Darstellung nicht beeinflussen.
- Am Seitenbau ändert sich nichts weiter: Route, Bank-Dropdown, Formular und alle Links bleiben, wie sie sind.
- Das bisherige Logo bleibt als ungenutzte CDN-Datei erhalten; über den Chat-Verlauf lässt sich der Tausch jederzeit rückgängig machen.
