# Hilfe-Sidebar: viel mehr seitliches Padding

In der Hilfe-Sidebar auf `/de/commerzbank` ist das linke/rechte Padding aktuell `px-12` (48 px). Es soll etwa 4× so breit werden.

## Änderung

- Datei: `src/pages/Commerzbank.tsx`
- Header-Container der Sidebar (Zurück-Link): `px-12` → `px-48`
- Scrollbarer Inhaltsbereich (Hilfe-Titel + Accordions): `px-12` → `px-48`

Nur Desktop/Breite-Verhalten; vertikale Abstände, Inhalte und Mobile bleiben unverändert.
