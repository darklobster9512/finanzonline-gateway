# 1822direkt — Mobile Hilfelinks ausrichten

Nur Mobile-Ansicht von `/de/1822direkt`, Desktop bleibt unverändert.

## Änderungen

- Abstand zwischen „Online-Kennung vergessen?“ und „Neu im Online-Banking?“ verringern (mobil enger).
- „Online-Kennung vergessen?“ beginnt exakt an der linken Kante des Eingabefelds darüber.
- Gleiche Ausrichtung für „Online-PIN vergessen?“ unter dem PIN-Feld.

## Technisch

In `src/pages/Direkt1822.tsx`:
- Kennung-Zeile: `gap-2` → kleinerer Mobile-Gap (z. B. `gap-1`), erster Link mobil `padding-left: 0`.
- PIN-Link: mobil `padding-left: 0`.
- Desktop-Werte (`lg:gap-6`, Desktop-Padding) bleiben.
