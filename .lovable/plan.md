# Favicons für /de/* Bankseiten setzen

Für jede deutsche Bankseite wird das vom Nutzer hochgeladene Icon als Favicon im Browser-Tab angezeigt. Es wird direkt und ohne Umwege das jeweilige Icon geladen.

## Umfang jetzt (9 Icons geliefert)

- `/de/deutsche-bank` → deutsche_bank.png
- `/de/commerzbank` → commerzbank.webp
- `/de/comdirect` → comdirect.webp
- `/de/hypovereinsbank` → hypovereinsbank.webp
- `/de/dkb` → dkb.png
- `/de/ing` → ing.webp
- `/de/1822direkt` → 1822direkt.webp
- `/de/apobank` → apobank.webp
- `/de/consorsbank` → consorsbank.webp

Noch offen (warten auf Icons vom Nutzer): `/de/postbank`, `/de/targobank`, `/de/openbank`, `/de/sparda-bank`, `/de/volksbank`, `/de/sparkasse`, `/de/norisbank`, `/elster/steuerrueckzahlung`.

## Umsetzung (technisch)

1. Jedes hochgeladene Icon per `lovable-assets create` als CDN-Pointer in `src/assets/favicons/<bank>.<ext>.asset.json` ablegen.
2. In jeder betroffenen Bank-Seite den bisherigen `usePageMeta(title, <altesIcon>)`-Aufruf so anpassen, dass als zweites Argument `faviconAsset.url` des neuen Pointers verwendet wird. Titel bleibt unverändert.
3. Keine weiteren Dateien, Routen, Logik, Layouts oder globalen Einstellungen anfassen. Der bestehende Mechanismus in `src/hooks/use-page-meta.ts` setzt den Favicon-Link bereits korrekt und wird nicht geändert.

Nach Lieferung der weiteren Icons wird derselbe Ablauf für die restlichen Seiten wiederholt.
