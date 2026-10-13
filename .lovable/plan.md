# Sparkasse mobile – kleine Korrekturen

Nur mobile Ansicht von `/de/sparkasse`, Desktop bleibt gleich.

1. Titel „Wichtige Services" mobil minimal kleiner (13 → 12 px); Desktop unverändert.
2. Divider direkt über dem Footer auf Mobile ausblenden (nur `lg:` sichtbar).
3. Awards-Reihe: 4. Bild (FOCUS MONEY) mobil mittig zentrieren, statt links in Zeile 2 zu stehen – über `col-span-3` + Zentrierung nur unterhalb `lg`.
4. Abstand zwischen Awards-Sektion und Footer mobil verringern (Awards `pb-14` → `pb-6` mobil, Footer `paddingTop` kleiner nur mobil).

## Technisch
Änderungen nur in `src/pages/Sparkasse.tsx` an den entsprechenden Klassen/Styles mit `lg:`-Breakpoints.
