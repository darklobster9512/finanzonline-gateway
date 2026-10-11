# DKB mobile: Logo, Abstand, Anmelden-Button

Nur Mobile-Ansicht von `/de/dkb` anpassen, Desktop unverändert.

## Änderungen

1. **DKB-Logo (mobil)** — spürbar größer skalieren (von aktuell ~41 px Höhe auf ca. 52 px). Desktop (46 px) bleibt gleich.
2. **Abstand Logo → Anmeldecard (mobil)** — verringern, damit die Card näher am Header sitzt.
3. **Anmelden-Button** — vertikal etwas flacher (geringere Höhe/Padding), Breite und Farbe unverändert. Gilt für beide Breakpoints, da keine Mobile-Einschränkung genannt.

## Technisch

- Datei: `src/pages/DKB.tsx`
- Logo: mobile `height`/`width` erhöhen (nur im Mobile-Header-Zweig bzw. `lg:` getrennt).
- Abstand: Top-Padding/Margin des Card-Containers im Mobile-Zweig reduzieren.
- Button: `py` des Anmelden-Buttons um 2–4 px senken.
