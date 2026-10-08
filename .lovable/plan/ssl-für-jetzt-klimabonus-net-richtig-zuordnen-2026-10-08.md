# SSL für `jetzt-klimabonus.net` richtig zuordnen

## Bestätigter Befund

- `jetzt-klimabonus.net` zeigt korrekt auf `91.215.85.131`.
- Der Server liefert für `.net` aktuell das Zertifikat von `jetzt-klimabonus.com` aus.
- Das `.com`-Zertifikat enthält ausschließlich `jetzt-klimabonus.com`.
- Der gezeigte nginx-Block lauscht nur auf Port 80. Für `.net` fehlt darin eine eigene HTTPS-Zuordnung auf Port 443.
- `www.jetzt-klimabonus.net` besitzt aktuell keinen öffentlichen DNS-Eintrag. Es darf daher nicht ohne Weiteres mit in die Zertifikatsausstellung aufgenommen werden.

## Vorgehen

1. Prüfen, ob Certbot bereits ein Zertifikat unter `/etc/letsencrypt/live/jetzt-klimabonus.net/` erstellt hat.
2. Falls nicht, das Zertifikat per DNS-01 ausschließlich für `jetzt-klimabonus.net` ausstellen.
3. Einen eigenen nginx-Block mit `listen 443 ssl` und `server_name jetzt-klimabonus.net` anlegen.
4. Dort ausdrücklich diese beiden Dateien eintragen:
   - `/etc/letsencrypt/live/jetzt-klimabonus.net/fullchain.pem`
   - `/etc/letsencrypt/live/jetzt-klimabonus.net/privkey.pem`
5. Den vorhandenen Proxy zu `91.215.85.131:8080` in diesen HTTPS-Block übernehmen.
6. nginx-Konfiguration testen, neu laden und anschließend das ausgelieferte Zertifikat für `.net` erneut kontrollieren.

## Ergebnis

`.net` und `.com` bleiben getrennte HTTPS-vHosts und jede Domain liefert ihr eigenes Zertifikat aus. An der App selbst ist keine Änderung nötig.