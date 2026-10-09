# Mobiler Comdirect-Header: nicht mehr sticky

## Grund
In `src/pages/Comdirect.tsx` Zeile 495 trägt der mobile Header-Container die Klassen `sticky top-0 z-50`. Dadurch klebt der dunkle Hintergrund beim Scrollen oben am Bildschirm – obwohl der Header nicht sticky sein soll.

## Was sich ändert
- Ist das Menü **zu**, steht der Header ganz normal im Seitenfluss: er scrollt mit der Seite nach oben raus, der Hintergrund bleibt nicht am Bildschirm kleben.
- Ist das Menü **offen**, bleibt es beim bisher gewünschten Verhalten: Header sichtbar, das Menü fährt direkt darunter auf (Overlay startet unverändert bei 88 px).
- An Höhe (88 px), C-Logo, Login-Button, Menü-Zeichen, Popover-Inhalt, Desktop-Ansicht und allem anderen wird nichts gedreht.

## Technisch
- Datei: `src/pages/Comdirect.tsx`, mobiler Header-Block (Zeile 495).
- `sticky top-0 z-50` wird aus der festen Klassenliste entfernt und nur noch gesetzt, wenn `menuOpen` wahr ist:
  - geschlossen: `lg:hidden relative flex items-center justify-between px-5 py-3 h-[88px]`
  - offen: zusätzlich `sticky top-0 z-50`
- Das Scroll-Lock beim geöffneten Menü und das Overlay (`fixed left-0 right-0 bottom-0 top-[88px] z-40`) bleiben unverändert, damit das Menü auch nach dem Öffnen direkt unter dem Header andockt.

## Prüfung
- Build-Log auf „build OK“ kontrollieren.
- Playwright bei 393 × 852: Seite um ~300 px scrollen und messen, dass der Header nicht mehr am oberen Rand hängt (Oberkante wandert mit nach oben raus), Screenshot.
- Menü öffnen: Header bleibt sichtbar, Overlay beginnt bündig bei 88 px, Schließen per X/ESC unverändert.
