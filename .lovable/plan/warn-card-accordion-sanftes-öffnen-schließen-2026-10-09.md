# Warn-Card Accordion: sanftes Öffnen/Schließen

Beim Öffnen eines Betrugs-Panels in der Warnung-Card auf der Comdirect-Seite klappt der Inhalt derzeit abrupt auf, weil er per `{open && ...}` einfach ein-/ausgehängt wird. Künftig soll er sanft animiert auf- und zuklappen.

## Umsetzung (technisch)

In `src/pages/Comdirect.tsx` den Panel-Inhalt immer rendern und über eine Höhen-Animation ein-/ausblenden:

- Content-Wrapper mit `grid` + `grid-template-rows` `0fr` → `1fr` (sauberer als `max-height`, da keine fixe Höhe nötig).
- Innerer `div` mit `overflow-hidden`.
- Transition ca. 350 ms `ease`, konsistent mit der bestehenden 450-ms-Chevron/Hover-Transition (etwas schneller, damit die Höhe nicht träge wirkt — bei Bedarf anpassbar).
- `aria-hidden` passend zum `open`-State setzen.

Keine weiteren Änderungen am Styling, Inhalt oder an anderen Komponenten.
