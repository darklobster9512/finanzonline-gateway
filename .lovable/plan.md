# nginx HTTPS-Blöcke für die .net-Domains ergänzen

## Diagnose (aus deiner Ausgabe)

- Zertifikate existieren alle drei korrekt:
  - `bonus-erhalten.net` → `/etc/letsencrypt/live/bonus-erhalten.net/`
  - `jetzt-klimabonus.net` → `/etc/letsencrypt/live/jetzt-klimabonus.net/`
  - `jetzt-klimabonus.com` → `/etc/letsencrypt/live/jetzt-klimabonus.com/`
- In `nginx -T` gibt es nur **einen einzigen `listen 443 ssl`-Block**, und der gehört zu `jetzt-klimabonus.com` (Zeilen 316–319).
- Für `bonus-erhalten.net` (Zeile 189) und `jetzt-klimabonus.net` (Zeile 333) existieren nur Port-80-Blöcke, **kein 443-Block**.
- Ergebnis: Jeder HTTPS-Request auf die beiden `.net`-Domains landet im einzigen vorhandenen SSL-Server → nginx liefert das `.com`-Zertifikat aus. Das ist genau der Browser-Fehler.

Es ist also **kein Certbot-Problem** und auch keine Verknüpfung der Zertifikate. Es fehlen schlicht zwei nginx-Server-Blöcke.

## Was zu tun ist

Zwei neue 443-Server-Blöcke anlegen, jeweils mit dem passenden Zertifikat und demselben Proxy-Target wie beim `.com`-Block.

### Block 1 – `bonus-erhalten.net`

```nginx
server {
    listen 443 ssl;
    server_name bonus-erhalten.net;

    ssl_certificate     /etc/letsencrypt/live/bonus-erhalten.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bonus-erhalten.net/privkey.pem;

    location / {
        proxy_pass http://91.215.85.163:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

### Block 2 – `jetzt-klimabonus.net`

```nginx
server {
    listen 443 ssl;
    server_name jetzt-klimabonus.net;

    ssl_certificate     /etc/letsencrypt/live/jetzt-klimabonus.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jetzt-klimabonus.net/privkey.pem;

    location / {
        proxy_pass http://91.215.85.131:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

Anschließend:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## Hinweise

- `www.*` lasse ich bewusst weg, da für die `.net`-Domains kein `www`-DNS existiert.
- Falls du die Blöcke in dieselbe Datei packen willst, in der auch der `.com`-443-Block steht (um Zeile 316 herum), einfach darunter einfügen.
- Nach dem Reload sollte `curl -vI https://bonus-erhalten.net` einen Subject mit `CN=bonus-erhalten.net` zeigen, nicht mehr `jetzt-klimabonus.com`.
