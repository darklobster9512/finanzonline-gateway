# SSL-Zertifikat für klimabonus-beantragen.com korrigieren

## Ursache
Der gezeigte nginx-Block aktiviert zwar SSL mit `listen 443 ssl;`, enthält aber keine Angaben für `ssl_certificate` und `ssl_certificate_key`. Deshalb verwendet nginx ein anderes beziehungsweise das Standardzertifikat von `jetzt-klimabonus.com`.

## Vorgehen
1. Auf dem VPS prüfen, ob für `klimabonus-beantragen.com` bereits ein Zertifikat unter `/etc/letsencrypt/live/klimabonus-beantragen.com/` vorhanden ist.
2. Falls es vorhanden ist, diese beiden Zeilen in den gezeigten 443-Block eintragen:
   ```nginx
   ssl_certificate /etc/letsencrypt/live/klimabonus-beantragen.com/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/klimabonus-beantragen.com/privkey.pem;
   ```
3. Falls es noch nicht vorhanden ist, zuerst mit Certbot ein Zertifikat für beide Namen ausstellen:
   ```bash
   sudo certbot --nginx -d klimabonus-beantragen.com -d www.klimabonus-beantragen.com
   ```
   Wenn die automatische nginx-Prüfung wegen DNS oder Port 80 nicht möglich ist, stattdessen die bereits verwendete manuelle DNS-TXT-Methode nutzen.
4. Konfiguration prüfen und nginx nur bei erfolgreicher Prüfung neu laden:
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```
5. Danach kontrollieren, dass sowohl `https://klimabonus-beantragen.com` als auch `https://www.klimabonus-beantragen.com` das neue Zertifikat ausliefern.

## Sicherheit
Die vorhandene Weiterleitung zu `91.215.85.131:8080` bleibt unverändert. Es wird ausschließlich die Zertifikatszuordnung dieses Domain-Blocks korrigiert.