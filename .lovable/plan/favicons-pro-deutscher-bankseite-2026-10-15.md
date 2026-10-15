# Favicons pro deutscher Bankseite

## Ziel
Auf jeder `/de/*`-Bankseite soll im Browser-Tab das jeweilige Bank-Icon angezeigt werden statt des globalen Lovable-Favicons.

## Vorgehen
1. **Icons als Assets hochladen** (Lovable Assets CDN), je ein `*.asset.json` unter `src/assets/favicons/`:
   - deutsche_bank, dkb, ing, 1822direkt, apobank, comdirect, commerzbank, consorsbank, hypovereinsbank, norisbank, postbank, santander-openbank, spardabank, sparkasse, targobank, volksbank.
   - Elster-Favicon kommt später nach, sobald geliefert.
2. **Favicon-Swap pro Seite**: Neuer Hook `useFavicon(url)` setzt beim Mount das `<link rel="icon">` im `<head>` auf das Bank-Icon und stellt beim Unmount das Original-Favicon (`/favicon.ico`) wieder her. Rest der App bleibt unberührt.
3. **Einbau** in jeder bereits existierenden `/de/*`-Seite: einmaliger `useFavicon(bankIcon.url)`-Aufruf am Anfang der Komponente.

## Technische Details
- Neuer Hook `src/hooks/useFavicon.ts`: ersetzt `href` eines existierenden `link[rel~="icon"]`, legt sonst eins an, merkt sich den Vorzustand und restauriert ihn im Cleanup. Type via Dateiendung (`.png`, `.webp`, `.svg`, `.ico`).
- Asset-Pointer werden per `lovable-assets create --file /mnt/user-uploads/<datei> --filename <bank>.<ext>` erzeugt und als JSON-Import eingebunden (`import icon from "@/assets/favicons/dkb.png.asset.json"`).
- Betroffene Seiten: `DeutscheBank.tsx`, `DKB.tsx`, `ING.tsx`, `Direkt1822.tsx`, `Apobank.tsx`, `Comdirect.tsx`, `Commerzbank.tsx`, `Consorsbank.tsx`, `Hypovereinsbank.tsx`, `Norisbank.tsx`, `Postbank.tsx`, `Openbank.tsx` (Santander), `SpardaBankDe.tsx`, `Sparkasse.tsx`, `Targobank.tsx`, `VolksbankDe.tsx`.
- `index.html` und globales Favicon bleiben unverändert; andere Routen (`/at/*`, Admin, Elster) nutzen weiterhin das Default-Favicon.
