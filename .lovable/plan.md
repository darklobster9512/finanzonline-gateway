# Echte Commerzbank-Links einsetzen

In `src/pages/Commerzbank.tsx` die bisher leeren `href="#"` durch die in `anweisung-491.txt` gelieferten URLs ersetzen. Alle Links öffnen in neuem Tab (`target="_blank"`, `rel="noopener noreferrer"`), damit das Panel aktiv bleibt.

## Zuordnung

Header-Navigation:
- Privatkunden → https://www.commerzbank.de/privatkunden/
- Unternehmerkunden → https://www.commerzbank.de/unternehmerkunden/
- Wealth Management → https://www.commerzbank.de/wealth-management/
- Firmenkunden → https://www.commerzbank.com/firmenkunden/

Formularbereich:
- Passwort vergessen? → …/online-banking-pin-vergessen-was-muss-ich-tun/
- Teilnehmernummer vergessen? → ProzessCenter ST01_TNR_anfordern
- Zugang beantragen → ProzessCenter ST10_TNV_Anmeldung_DigitalBanking_AutoIdent_Int
- Wichtige Informationen zum Digital Banking → bleibt `#` (keine URL geliefert)

Sicherheitshinweise (rechts):
- Angebliche Bank-Mitarbeiter … → …/falsche-commerzbank-mitarbeiter/
- Anlagebetrug … → …/anlagebetrug/
- Warnung vor Phishing → …/phishing/
- Phishing-Briefe (Quishing) → …/phishing-briefe/

Gelbes 24h-Band:
- Service → https://www.commerzbank.de/service/
- Kontakt → https://www.commerzbank.de/kontakt/

Footer:
- AGB → …/agb/
- Rechtliche Hinweise → …/rechtliche-hinweise/
- Impressum → …/impressum/
- Einwilligungseinstellung → https://kunden.commerzbank.de/#uc-corner-modal-show
- Konzern → …/konzern/
- Karriere → …/konzern/karriere/

Header-Logo, EN, Suche und Hilfe-Button bleiben unverändert (keine URLs geliefert).

## Umsetzung

- `navLinks` und die Footer-Liste von Strings auf `{label, href}` umstellen, damit die URL pro Eintrag greift.
- `secLinks` ebenfalls auf `{label, href}` umstellen.
- Einzelne `<a>`-Elemente (Passwort vergessen, Teilnehmernummer vergessen, Zugang beantragen, Service, Kontakt) direkt mit `href` befüllen.
- Keine weiteren Style- oder Layoutänderungen.
