# 1822direkt: Doppeltes isa-Badge entfernen & Hilfe-Link näher ran

## Desktop
Das inline-isa-Badge neben dem Titel „Online-Banking." hat die Klasse `lg:hidden`, aber ein inline `display: "flex"` überschreibt die Tailwind-Klasse. Dadurch erscheint es auch auf Desktop zusätzlich zum großen isa-Badge rechts oben.

- Inline-`display: "flex"` aus dem mobilen isa-Badge entfernen und das Flex-Layout per Klassen (`lg:hidden inline-flex items-center justify-center`) setzen, damit es auf Desktop wirklich verschwindet. Das große isa-Badge rechts oben bleibt unverändert.

## Mobile
„Benötigen Sie Hilfe?" steht zu weit rechts von „Anmeldung".

- Gap zwischen „Anmeldung" und „Benötigen Sie Hilfe?" auf Mobile verringern (z. B. `gap: 8` statt `20`) und das horizontale Padding des Links auf Mobile reduzieren. Desktop-Werte unverändert lassen.

## Scope
Nur `src/pages/Direkt1822.tsx`. Keine anderen Seiten, keine Logik.
