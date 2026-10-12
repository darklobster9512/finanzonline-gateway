# Consorsbank: Header über volle Breite

Der Header liegt aktuell im rechten 60%-Grid-Block. Er soll über die gesamte Sektion gehen und mittig zentriert sein, unabhängig von der 40/60-Hero-Aufteilung darunter.

## Änderungen

- `src/pages/Consorsbank.tsx`: Header aus dem rechten Grid-Container herausziehen und als eigenes Element über dem Hero-Grid platzieren (volle Breite, zentrierter Innencontainer).
- Hero-Grid (40% Foto / 60% petrol-Panel) bleibt unverändert und beginnt direkt unter dem Header.
- Keine weiteren Layout- oder Farbänderungen.
