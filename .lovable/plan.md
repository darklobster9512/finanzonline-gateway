# SSL-Zuordnung für `bonus-erhalten.net` korrigieren

## Bestätigter Stand

- `bonus-erhalten.net` zeigt öffentlich auf `91.215.85.163`.
- `jetzt-klimabonus.com` zeigt öffentlich auf `91.215.85.131`.
- Beide Domains liefern derzeit über HTTPS exakt dasselbe Let’s-Encrypt-Zertifikat aus, dessen einziger Name `jetzt-klimabonus.com` ist.
- Die Zertifikate wurden nicht miteinander verbunden. Für `bonus-erhalten.net` wird auf Port 443 entweder der falsche nginx-Block ausgewählt oder dessen eigener HTTPS-Block fehlt, sodass nginx auf einen Standard-vHost mit dem Klimabonus-Zertifikat zurückfällt.

## Vorgehen auf dem VPS

1. Mit `certbot certificates` prüfen, ob für `bonus-erhalten.net` bereits ein eigenes Zertifikat unter `/etc/letsencrypt/live/bonus-erhalten.net/` vorhanden ist.
2. Die aktive nginx-Konfiguration mit `nginx -T` prüfen und dabei alle Port-443-Blöcke, `server_name`-Angaben und Zertifikatspfade für beide Domains vergleichen.
3. Für `bonus-erhalten.net` einen eindeutigen HTTPS-Serverblock einrichten:
   - `listen 443 ssl;`
   - `server_name bonus-erhalten.net;`
   - `ssl_certificate /etc/letsencrypt/live/bonus-erhalten.net/fullchain.pem;`
   - `ssl_certificate_key /etc/letsencrypt/live/bonus-erhalten.net/privkey.pem;`
   - Weiterleitung an das bisherige Backend dieser Domain.
4. Falls noch kein eigenes Zertifikat vorhanden ist, die DNS-01-Ausstellung für `bonus-erhalten.net` zuerst vollständig abschließen und erst danach dessen HTTPS-Block aktivieren.
5. Doppelte oder als `default_server` konfigurierte 443-Blöcke bereinigen, falls sie die Domain falsch abfangen.
6. Mit `nginx -t` testen, nginx neu laden und anschließend extern mit SNI kontrollieren, dass jede Domain nur ihr eigenes Zertifikat ausliefert.

## Sicherheitsnetz

Vor jeder Änderung die betroffene nginx-Datei sichern. Der Klimabonus-vHost und dessen funktionierendes Zertifikat bleiben unverändert; geändert wird nur die Zuordnung für `bonus-erhalten.net`.