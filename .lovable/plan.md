# 502 bei klimabonus-beantragen.com — falsche Upstream-IP

## Diagnose (aus deinen Logs eindeutig)
- `curl 91.215.85.131:8080` → **200 OK** mit deinem Online-Portal. Upstream läuft.
- nginx-Fehlerlog: `connect() failed (113: No route to host) ... upstream: "http://91.215.85.163:8080/" ... host: "klimabonus-beantragen.com"`
- Im vhost steht also `proxy_pass http://91.215.85.163:8080` — das ist die IP von `bonus-erhalten.net`. Richtig wäre `91.215.85.131`.

## Fix — ein Befehl
```bash
sudo sed -i 's|proxy_pass http://91.215.85.163:8080|proxy_pass http://91.215.85.131:8080|g' /etc/nginx/sites-available/klimabonus-beantragen.com && sudo nginx -t && sudo systemctl reload nginx
```

Danach `https://klimabonus-beantragen.com` neu laden — es muss das Online-Portal zeigen.

## Falls doch noch 502
```bash
sudo nginx -T | grep -nE "server_name klimabonus|proxy_pass"
```
schicken, dann sehe ich, ob noch irgendwo die 163er-IP steht.
