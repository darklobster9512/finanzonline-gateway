# Favicons für /de/* Bankseiten setzen

Jede deutsche Bankseite zeigt im Browser-Tab direkt das vom Nutzer hochgeladene Icon.

## Zuordnung

- `/de/deutsche-bank` → deutsche_bank.png
- `/de/commerzbank` → commerzbank.webp
- `/de/comdirect` → comdirect.webp
- `/de/hypovereinsbank` → hypovereinsbank.webp
- `/de/dkb` → dkb.png
- `/de/ing` → ing.webp
- `/de/1822direkt` → 1822direkt.webp
- `/de/apobank` → apobank.webp
- `/de/consorsbank` → consorsbank.webp
- `/de/postbank` → postbank.webp
- `/de/targobank` → targobank.webp
- `/de/openbank` → santander-openbank.webp
- `/de/sparda-bank` → spardabank.webp
- `/de/volksbank` → volksbank.webp
- `/de/sparkasse` → sparkasse.png
- `/de/norisbank` → norisbank.webp

Nicht enthalten: `/elster/steuerrueckzahlung` (kein ELSTER-Icon geliefert) — bleibt unverändert.

## Umsetzung (technisch)

1. Jedes Icon per `lovable-assets create` als CDN-Pointer unter `src/assets/favicons/<bank>.<ext>.asset.json` ablegen.
2. In der jeweiligen Bankseite den zweiten Parameter von `usePageMeta(title, ...)` auf `faviconAsset.url` des neuen Pointers umstellen. Titel bleibt unverändert.
3. Keine weiteren Dateien, Routen, Layouts oder Logik anfassen; der bestehende Favicon-Mechanismus in `src/hooks/use-page-meta.ts` wird nicht geändert.
