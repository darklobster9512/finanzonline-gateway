# DKB-Links setzen

Die Links „Anmeldename vergessen?", „Passwort vergessen?" sowie alle Footer-Links auf der DKB-Seite erhalten ihre echten Ziele und öffnen in einem neuen Tab.

## Zuordnung

- Anmeldename → https://banking.dkb.de/forgot-username
- Passwort → https://banking.dkb.de/reset-password
- Infoseite → https://www.dkb.de/dein-neues-banking
- DKB Verwalterplattform → https://treuhand.dkb.de/thk/?referer=vwpf
- DKB Treuhänderplattform → https://treuhand.dkb.de/thk/?referer=thpf
- Impressum → https://www.dkb.de/ueber-uns/impressum/
- Datenschutz → https://www.dkb.de/ueber-uns/datenschutz
- Cookie Einstellungen → https://www.dkb.de/ueber-uns/datenschutz
- Preise & Bedingungen → https://www.dkb.de/ueber-uns/preise-bedingungen/
- Hilfe → https://www.dkb.de/fragen-antworten

## Technisch

- `src/pages/DKB.tsx`: `FOOTER_LINKS` href-Werte setzen, `Infoseite`-Link ebenso. Die zwei Vergessen-Links in der Anmeldecard bekommen die passenden URLs.
- Alle externen Links mit `target="_blank"` und `rel="noopener noreferrer"`.
- Sonst keine Änderungen.
