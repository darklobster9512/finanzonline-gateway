# apoBank Login – Feinschliff

Visuelle Anpassungen an `/de/apobank` (`src/pages/Apobank.tsx`), Desktop.

## Änderungen

1. **Card-Shadow** – stärkerer Schatten auf der gesamten Karte (statt dem aktuellen zarten `0 .125rem .25rem`), z. B. `0 .5rem 1rem rgba(0,0,0,.15)`.
2. **apoBank-Logo** im Footer vertikal mittig zentrieren (Flexbox, `align-items: center`, ggf. feste Höhe).
3. **Titel „Login apoBank"** auf `font-weight: 700` (bold).
4. **Card-Body-Hintergrund** auf `#F0F3F5`.
5. **Card-Breite** reduzieren (von `maxWidth: 940` auf ca. `820`) und **Innen-Padding** erhöhen (Header `22px 48px`, Body `36px 48px 40px`).
6. **„Sicherheitshinweise"-Link** mit `text-decoration: underline`.
7. **Anmelden-Button** – Border- und Textfarbe auf `#556a9a` (Hover-Fill passend auf `#556a9a`).
8. **Maßnahmen-Icons** – die drei Inline-SVGs (`IconLock`, `IconMail`, `IconPhone`) durch die drei hochgeladenen apoBank-PNGs ersetzen. Upload als Lovable Assets (`src/assets/*.asset.json`) und als `<img>` einbinden; Größe passend (~28 px Lock/Mail, ~24 px Phone).

## Technisch

- Icons via `lovable-assets create --file /mnt/user-uploads/<name> --filename <name>` hochladen und JSON-Pointer importieren.
- Lock/Datenschutz → `apoBank_Icon_apoBlau_Datenschutz_allgemein_150.png`, Mail → `apobank_icon_apoblau_Email-Finanzen_150.png`, Phone → `phone-3.png`.
- Keine Änderungen an Funktion/Flow.
