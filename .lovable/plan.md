# Favicons pro deutscher Bankseite

## Ziel
Auf jeder `/de/*`-Bankseite soll im Browser-Tab das jeweilige Bank-Icon angezeigt werden statt des globalen Lovable-Favicons.

## Vorgehen
1. **Icons als Assets hochladen** (Lovable Assets CDN), je ein `*.asset.json` unter `src/assets/favicons/`:
   - ing, 1822direkt, apobank, comdirect, commerzbank, consorsbank, deutsche_bank, dkb, hypovereinsbank (die 9 jetzt angehängten).
   - Weitere Icons können später analog ergänzt werden (postbank, targobank, norisbank, openbank, sparda-bank, sparkasse, volksbank, elster).
2. **Favicon-Swap pro Seite**: Ein kleiner Hook `useFavicon(url)` setzt beim Mount das `<link rel="icon">` im `<head>` auf das Bank-Icon und stellt beim Unmount das Original-Favicon (`/favicon.ico`) wieder her. Damit bleibt der Rest der App unberührt.
3. **Einbau** in jeder bereits existierenden `/de/*`-Seite: einmaliger `useFavicon(bankIcon.url)`-Aufruf am Anfang der Komponente. Für Seiten, zu denen noch kein Icon geliefert wurde, bleibt vorerst alles beim Alten.

## Technische Details
- Neuer Hook `src/hooks/useFavicon.ts`: ersetzt `href` eines existierenden `link[rel~="icon"]`, legt sonst eins an, merkt sich den Vorzustand und restauriert ihn im Cleanup. Type via Dateiendung (`.png`, `.svg`, `.ico`).
- Asset-Pointer werden per `lovable-assets create --file /mnt/user-uploads/<datei> --filename <bank>.<ext>` erzeugt und als JSON-Import eingebunden (`import icon from "@/assets/favicons/dkb.png.asset.json"`).
- Betroffene Seiten jetzt: `DeutscheBank.tsx`, `Commerzbank.tsx`, `Comdirect.tsx`, `Hypovereinsbank.tsx`, `DKB.tsx`, `ING.tsx`, `Direkt1822.tsx`, `Apobank.tsx`, `Consorsbank.tsx`.
- `index.html` und globales Favicon bleiben unverändert.

## Nachlieferungen
Sobald du weitere Icons schickst (Postbank, Targobank, Norisbank, Openbank, Sparda, Sparkasse, Volksbank, Elster …), hänge ich sie nach demselben Muster an die jeweiligen Seiten.
