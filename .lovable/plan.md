# HVB-Header optimieren (/de/hypovereinsbank)

## Was geändert wird

1. **Schatten unter dem Header**
   - Der Header bekommt einen weichen Schatten (`box-shadow: 0 4px 12px rgba(0,0,0,0.08)`), der nach unten in den Hero-Bereich (Login-Teaser mit Hintergrundbild) übergeht.
   - Die bisherige feine Linie (`border-b border-gray-100`) wird entfernt, damit nur der Schatten den Übergang bildet.

2. **Hover-Effekt Navbar**
   - Beim Überfahren der Navigationspunkte färbt sich der Text schwarz.
   - Die Hauptnavigation hat bereits `hover:text-black`; die 4 rechten Punkte (SUCHE, HILFE, FILIALE) bekommen denselben Schwarz-Hover für Text und Icon.

3. **Icons der 4 Header-Punkte aus der hochgeladenen CSS**
   - Die hochgeladenen Dateien (`webfonts.min.css`, `public.min.css`) enthalten die Original-Icon-Schrift **ucicons** (als Base64-WOFF2 eingebettet) und die Icon-Klassen:
     - SUCHE: `icon_search-nav` → Zeichen `\ea2d`
     - HILFE: `icon_help-nav` → Zeichen `\ea18`
     - FILIALE: `icon_pin` → Zeichen `\ea26`
     - BANKING LOGIN: `icon_login` → Zeichen `\ea1f`
   - Umsetzung:
     - Die ucicons-WOFF2 wird aus der Base64-Einbettung extrahiert und als CDN-Asset (`src/assets/ucicons.woff2.asset.json`) abgelegt.
     - In `src/index.css` wird eine `@font-face`-Regel für `ucicons` ergänzt.
     - In `src/pages/Hypovereinsbank.tsx` ersetzen die Original-Glyphen die bisherigen Lucide-Icons (Search, HelpCircle, MapPin, LogIn) – Desktop und Mobile.

## Technische Details

- Änderungen nur in `src/pages/Hypovereinsbank.tsx`, `src/index.css` und ein neues Asset unter `src/assets/`.
- Glyphen werden per CSS-`content` (Pseudo-Element) oder per Unicode-Zeichen mit `font-family: ucicons` gerendert.
- Mobile Ansicht (roter BANKING-LOGIN-Button) bekommt ebenfalls das Original-Login-Icon; sonst bleibt Mobile unverändert.
