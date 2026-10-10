# HVB-Header: Icons ans Seitenende + Navbar-Hover schwarz

## Was geändert wird (nur `src/pages/Hypovereinsbank.tsx`, Desktop)

### 1. Suche / Hilfe / Filiale / Banking Login komplett an den rechten Seitenrand
- Der Header-Container hat aktuell `px-4 lg:px-6` (beidseitiges Padding). Das rechte Padding wird entfernt (`pr-0`), damit die Icon-Gruppe bündig am Seitenrand sitzt.
- Die rote „Banking Login"-Kachel bekommt keinerlei Abstand nach rechts — sie schließt exakt mit dem Fensterrand ab (kein `gap`/`pl` zwischen Gruppe und Rand).
- Damit die Gruppe wirklich am Fensterrand und nicht am Inhalts-Container hängt, wird der Header innerhalb der Zeile auf volle Breite gelegt: Logo und Navbar bleiben im `max-w-[1360px]`-Raster, die Icon-Gruppe wird per `ml-auto` ganz nach rechts geschoben und ragt bis an den Rand.

### 2. Navbar-Hover: Text wird schwarz
- Die Navbar-Punkte („Privatkunden", „Wealth Management & Private Banking", „Unternehmenskunden", „Nachhaltigkeit", „Über Uns", „Services") haben die Farbe aktuell als Inline-Style (`color: #4a4a4a`). Inline-Styles schlagen die Tailwind-Klasse `hover:text-black`, deshalb funktioniert der Hover nicht.
- Fix: Die Farbe wird aus dem Inline-Style entfernt und als CSS-Klasse umgesetzt (z. B. `text-[#4a4a4a] hover:text-black transition-colors`), sodass der Text beim Drüberfahren schwarz wird.

## Technische Details
- Datei: `src/pages/Hypovereinsbank.tsx` (Header-Bereich, Zeilen ~90–150)
- Keine Änderungen an Mobile-Header, Hero, Farben oder sonstigem Layout.
- Danach: Build prüfen und Hover sowie Randposition im Browser verifizieren.
