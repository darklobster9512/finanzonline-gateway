# Comdirect Mobile – Feinschliff

Nur mobile Ansicht von `/de/comdirect`. Desktop unverändert.

## Header
- Mobile Header-Höhe verdoppeln.
- C-Logo entsprechend doppelt so groß darstellen.
- Login-Button und Hamburger-Icon behalten exakt ihre aktuelle Größe (nicht mitskalieren).

## Hamburger-Overlay
- Header bleibt beim Öffnen sichtbar/fixed.
- Overlay startet direkt unter dem Header und fährt smooth von dort nach unten auf (statt wie bisher den ganzen Screen inkl. Header neu zu rendern).
- Schließen via X/ESC/Login unverändert.

## Zukunfts-Ich Teaser (Mobile)
- Mobile Teaser-Bild durch das neue, breitere Format `sigma_wsphub_themeninsel4_sm.jpg` ersetzen, damit das Seitenverhältnis in der Card passt.
- Als CDN-Asset-Pointer `src/assets/comdirect-teaser-mobile.jpg.asset.json` einbinden; Desktop nutzt weiter das bestehende Bild.

## Footer (Mobile)
- Vertikalen Abstand zwischen den Navbar-Linkzeilen reduzieren.

## Technisch
- Änderungen in `src/pages/Comdirect.tsx`, mobile Styles via `lg:`-Breakpoints kapseln.
- Overlay: separater Container unterhalb des fixierten Headers, Transform/Transition unverändert, Startposition = Header-Höhe.
- Neues Mobile-Bild via `lovable-assets create` aus `/mnt/user-uploads/sigma_wsphub_themeninsel4_sm.jpg`.
