# HVB-Header: Logo-Abstand und Punkte-Abstand vergrößern

## Was sich ändert

1. **Mehr Luft zwischen Logo und „Privatkunden".** Derzeit liegen zwischen dem Logo und dem ersten Navigationspunkt 16 px. Künftig sind es 32 px – also doppelt so viel, aber immer noch eng am Logo.
2. **Punkte etwas weiter auseinander.** Der Abstand zwischen den sechs Punkten (Privatkunden, Wealth Management & Private Banking, Unternehmenskunden, Nachhaltigkeit, Über Uns, Services) wächst von 24 px auf 28 px – eine minimale Stufe, damit die Zeilen nicht enger zusammenrücken.

Am Rest des Headers ändert sich nichts: Suche/Hilfe/Filiale, die graue Trennlinie, die rote Banking-Login-Kachel und das mobile Bild bleiben exakt so, wie sie sind.

## Technische Details

Datei: `src/pages/Hypovereinsbank.tsx`

- Zeile 96 – Logo-Link: `pr-4` → `pr-8`
- Zeile 99 – Navigationsleiste: `gap-6` → `gap-7`

## Prüfung

- Desktop-Screenshot des Headers (1408 px Breite) mit den in der Projekt-Memory hinterlegten Browser-Einstellungen: Logo-Abstand und Punkte-Abstand nachmessen, prüfen dass nichts umbricht und der rechte Block unverändert am Rand bleibt.
- Build-Log (`/tmp/observability/build-errors.log`) auf „build OK" kontrollieren.
