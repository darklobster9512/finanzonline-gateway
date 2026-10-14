# ELSTER: Info-Box lösen, Tabs-Spalte mit Rahmen

Zwei kleine Korrekturen auf `/de/elster`:

1. **Info-Box (rechts, grau) vom Formular lösen**
   - Kleiner horizontaler Abstand zwischen der Formular-Card und der grauen Info-Box.
   - Die graue Fläche umschließt nur den Text – kein leerer Platz nach unten (Höhe passt sich dem Inhalt an, hängt nicht mehr an der Formularhöhe).

2. **Tabs-Spalte (Zertifikatsdatei / ElsterSecure / Personalausweis / Sicherheitsstick / Signaturkarte)**
   - Fehlende Rahmen oben **und** unten ergänzen, so dass die Spalte wie eine eigene Card wirkt.

## Technisch

Datei: `src/pages/Elster.tsx`

- Grid von `260px 1fr 260px` auf `260px 1fr auto` mit `gap` z. B. `0 0 20` (Tab/Form bündig, Info-Box mit Lücke) ändern; alternativ Grid auf zwei Spalten (Tabs+Form und Info) umbauen.
- Tabs-Container: `border: 1px solid BORDER` statt nur links/rechts; `alignSelf: start` damit Höhe nicht gestreckt wird.
- Form-Panel: linken Border entfernt lassen (bleibt bündig an Tabs) – unverändert.
- Info-Aside: `alignSelf: start` + eigener Abstand (`marginLeft`), damit grauer Hintergrund nur so hoch ist wie der Text.
