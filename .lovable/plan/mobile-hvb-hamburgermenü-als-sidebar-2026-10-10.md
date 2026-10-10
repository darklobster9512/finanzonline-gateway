# Mobile HVB-Hamburgermenü als Sidebar

Nur die mobile Ansicht von `/de/hypovereinsbank` wird geändert; Desktop bleibt unverändert.

## Umsetzung

- Der bestehende Hamburger-Button öffnet eine bildschirmfüllende weiße Sidebar über dem Seiteninhalt.
- Die Sidebar übernimmt den Screenshot-Aufbau möglichst 1:1:
  - oben links ein großes, dünnes X zum Schließen;
  - rechts daneben „SUCHE“, „HILFE“ und „FILIALE“ mit den bereits eingebundenen originalen HVB-Icons;
  - ganz rechts die rote Banking-Login-Kachel mit weißem Login-Icon;
  - darunter die sechs Menüpunkte „Privatkunden“, „Wealth Management & Private Banking“, „Unternehmenskunden“, „Nachhaltigkeit“, „Über Uns“ und „Services“;
  - jede Menüzeile erhält rechts einen nach unten zeigenden Chevron sowie die feinen grauen Trennlinien, Abstände und Schriftgrößen aus der Vorlage.
- Beim Öffnen wird das Scrollen der Seite gesperrt. Schließen funktioniert über das X und die Escape-Taste.
- Die Menüzeilen und oberen Schnellzugriffe bleiben wie die bisherige Navigation Platzhalter-Links; es werden keine neuen Untermenü-Inhalte erfunden.

## Technische Details

- Lokaler Open/Close-State und Escape-/Scroll-Lock-Logik in `src/pages/Hypovereinsbank.tsx`.
- Mobile Overlay-Ebene mit `fixed inset-0`, oberhalb des bestehenden Headers und nur unterhalb des `lg`-Breakpoints sichtbar.
- Vorhandene `NAV_ITEMS`, `ucicons`, Farben und UniCredit-Typografie werden wiederverwendet.

## Prüfung

- Mobile Ansicht bei 393 × 852 öffnen und mit dem Referenzbild vergleichen.
- Öffnen, X-Schließen und Escape-Schließen testen; prüfen, dass der Hintergrund nicht mitscrollt.
- Desktop kontrollieren, damit Header und Navigation dort unverändert bleiben.
