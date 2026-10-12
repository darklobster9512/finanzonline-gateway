# 502 Bad Gateway auf klimabonus-beantragen.com beheben

Nginx liefert jetzt ein eigenes 502 aus – das heißt: TLS/vhost greifen korrekt, aber der `proxy_pass`-Upstream antwortet nicht (oder nicht sauber). Zertifikat-Problem ist damit gelöst.

## Mögliche Ursachen
- Upstream-Port `91.215.85.131:8080` lauscht nicht / Dienst down
- Upstream lauscht nur auf `127.0.0.1`, nicht auf der öffentlichen IP
- Firewall (UFW/Hoster) blockt Port 8080 vom VPS aus
- Falsche IP im `proxy_pass` (andere Bank liegt dort)
- Upstream erwartet bestimmten `Host`-Header und antwortet sonst mit Reset

## Diagnose-Schritte (auf dem VPS)
1. Upstream direkt testen:
   ```
   curl -v -H "Host: klimabonus-beantragen.com" http://91.215.85.131:8080/
   ```
2. Nginx-Errorlog für den Request:
   ```
   sudo tail -n 50 /var/log/nginx/error.log
   ```
3. Prüfen welche IP/Port im aktiven Serverblock steht:
   ```
   sudo nginx -T | grep -A2 "server_name klimabonus-beantragen.com"
   ```
4. Port-Erreichbarkeit:
   ```
   nc -vz 91.215.85.131 8080
   ```

## Fix je nach Ergebnis
- curl liefert HTML → `proxy_set_header Host $host;` und Reload prüfen.
- curl Connection refused/timeout → Upstream-Dienst starten bzw. richtige IP eintragen.
- Nur `127.0.0.1` lauscht → Upstream auf `0.0.0.0` binden oder nginx auf derselben Maschine mit `proxy_pass http://127.0.0.1:8080` nutzen.

Nach Diagnose folgt der konkrete Einzel-Befehl.
