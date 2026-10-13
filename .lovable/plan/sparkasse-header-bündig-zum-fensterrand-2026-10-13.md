# Sparkasse-Header bündig zum Fensterrand

Der rote Header und die Topbar nutzen aktuell einen auf 1200 px zentrierten Innenbereich. Auf breiteren Bildschirmen entsteht dadurch links und rechts freier roter Platz — Logo und Navigation „kleben" nicht an der Kante.

## Änderung

In `src/pages/Sparkasse.tsx`:

- Topbar (Zeile ~125) und Header (Zeile ~145): die inneren `max-w-[1200px] mx-auto px-0`-Wrapper durch einen vollbreiten Container mit minimalem Seitenabstand (z. B. `w-full px-4 lg:px-6`) ersetzen.
- Dadurch sitzt das Logo links direkt am Fensterrand und Suche/Navigation rechts.
- Nur Desktop/Tablet-Header; Mobile-Verhalten bleibt unverändert.
- Keine weiteren Dateien oder Komponenten anfassen.
