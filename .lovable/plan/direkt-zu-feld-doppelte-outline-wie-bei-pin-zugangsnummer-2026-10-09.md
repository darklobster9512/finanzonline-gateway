# „Direkt zu"-Feld: Doppelte Outline wie bei PIN/Zugangsnummer

## Problem
Das „Direkt zu"-Dropdown-Feld zeigt im geöffneten Zustand eine eigene, dreiseitige Outline (`-1px 0 0 0 …, 1px 0 0 0 …, 0 -1px 0 0 …`). Die Eingabefelder „Zugangsnummer" und „PIN" nutzen dagegen beim Fokus eine doppelte Outline: `0 0 0 1px #fff, 0 0 0 2px rgb(11, 30, 37)`.

## Änderung (nur `src/pages/Comdirect.tsx`)
- Die `boxShadow` des „Direkt zu"-Buttons im geöffneten Zustand wird exakt auf die gleiche doppelte Outline wie bei den Eingabefeldern gesetzt: `0 0 0 1px #fff, 0 0 0 2px rgb(11, 30, 37)`.
- Die aufgeklappte Dropdown-Liste bleibt unverändert (eigener dünner 1-px-Rahmen, keine Outline).
- Rahmenfarbe, Hover-Verhalten und Übergänge des Feldes bleiben wie bisher; Desktop und Mobile betroffen, sonst nichts.

## Verifikation
- Build-Log prüfen.
- Per Playwright (mit AntiBot-Bypass) das Feld öffnen und Screenshot des Eingabebereichs mit doppelter Outline aufnehmen; Liste ohne Outline bestätigen.
