# Hilfe-Sidebar: Hover mit abgerundeten Ecken

Beim Überfahren der Accordion-Header in der Hilfe-Sidebar auf `/de/commerzbank` soll die graue Hover-Fläche abgerundete Ecken bekommen.

## Änderung

In `src/pages/Commerzbank.tsx` beim Accordion-Button `rounded-lg` ergänzen, damit `hover:bg-black/5` keine eckige Fläche mehr erzeugt. Padding/Verhalten bleiben unverändert.
