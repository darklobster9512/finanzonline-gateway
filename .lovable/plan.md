# Sparkasse: Header bündig, Content mit mehr Seitenabstand

## Ziel
Auf `/de/sparkasse`:
- Der rote Header (oberer Streifen + Hauptheader) hat keinen seitlichen Innenabstand mehr, Logo links und Suche rechts gehen bis an die Bildschirmkante.
- Alle übrigen Inhaltsbereiche (Login, „Immer in Ihrer Nähe“, Wichtige Services, Themenspalten, Awards, Footer) bekommen mehr Abstand zum linken und rechten Rand.

## Was geändert wird
In `src/pages/Sparkasse.tsx`:
1. Topbar-Container: `px-6` entfernen → `px-0`.
2. Header-Container: `px-4 lg:px-6` entfernen → `px-0`.
3. Content-/Footer-Container (Login-Section, „Immer in Ihrer Nähe“, Wichtige Services, 4 Spalten, Awards, Footer-Inner): `px-4` auf `px-8 lg:px-12` erhöhen.

Desktop und Mobile werden gleich behandelt; nichts außer dieser Padding-Logik ändert sich.

## Technical details
- Datei: `src/pages/Sparkasse.tsx`
- Keine neuen Komponenten, keine Font-/Asset-Änderungen.
- Verifikation über `/tmp/observability/build-errors.log`.
