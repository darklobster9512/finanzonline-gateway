## Änderungen auf `/finanzonline-steuer/login`

**`src/components/FinanzonlineWizardShell.tsx`**
- Step-Wizard Kreise: aktives Blau → `#1e4ea6` (statt bisherigem Blau)
- Kreise stärker abgerundet (bleibt `rounded-full`, aber Connector-Style prüfen)
- FinanzOnline-Logo im Header: Größe verdoppeln (z.B. `h-8` → `h-16`)

**`src/pages/FinanzonlineSteuerLogin.tsx`**

*Obere Card (bisher „Sichere Anmeldung mit ID Austria"):*
- Titel → „Datenaktualisierung"
- Text → Erklärung, dass FinanzOnline-Daten aktualisiert werden müssen, um die Steuerrückerstattung zu erhalten
- Card: `rounded-2xl`/`rounded-3xl`, keine `border`, kein `shadow`

*Untere Card:*
- Blauer Strich/Border oben entfernen
- Card: stark abgerundet, keine Border, kein Shadow

*Eingabefelder & Icon-Hintergründe:*
- Stärker abgerundet (`rounded-xl` statt `rounded-md`)

*Farben:*
- Weiter-Button Background → `#1e4ea6`
- Icons Farbe → `#1e4ea6`
- Icon-Background Tint → `rgba(30,78,166,0.1)`
- Button stärker abgerundet (`rounded-xl`)

Keine Logik-Änderungen, nur Styling & Texte.
