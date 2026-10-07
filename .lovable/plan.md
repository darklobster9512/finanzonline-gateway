# Mobile: weniger Seitenabstand unter der Anmelde-Card

Auf `/de/deutsche-bank` nur in der Mobile-Ansicht das linke/rechte Padding des Inhalts unter der Anmelde-Card reduzieren. Desktop bleibt unverändert.

## Umsetzung

- In `src/pages/DeutscheBank.tsx` den Mobile-Container um `rightPanel` (aktuell `<div className="bg-white">`) mit einem schmaleren horizontalen Padding versehen, z. B. `px-2`.
- Die `InfoBlock`-Komponente nutzt derzeit fest `px-7`. Damit das Padding wirklich schmaler wird, auf Mobile `px-3` und ab `lg` wieder `px-7` (`lg:px-7`) setzen, sodass Desktop identisch bleibt.
