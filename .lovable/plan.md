## Änderungen (nur `src/pages/Check24.tsx`)

### 1. Header – Logo zentriert
- `justify-between` → `justify-center`, Chat/Anmelden-Links entfernen.

### 2. Hero – einspaltig & zentriert (wie Screenshot)
- Zweispaltiges Grid (`md:grid-cols-2`) entfernen → alles in einer zentrierten Spalte.
- Preis-Kachel (rechte Seite) entfernen.
- Hintergrund bleibt CHECK24-Blau-Verlauf, Konfetti-Deko bleibt dezent.
- H1, Subline und CTA mittig zentriert.

### 3. Live-Countdown bis 01.08.2026
- Countdown-Komponente mit `useState` + `useEffect` (Intervall jede Sekunde).
- Ziel: `2026-08-01T00:00:00` (Mitternacht).
- Darstellung: 4 weiße/halbtransparente Boxen nebeneinander: **TAGE · STD · MIN · SEK** (wie im Screenshot).
- Platzierung: zwischen Subline und CTA-Button.
