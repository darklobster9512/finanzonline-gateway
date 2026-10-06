# nginx HTTPS für jetzt-klimabonus.com

Zertifikat liegt schon unter `/etc/letsencrypt/live/jetzt-klimabonus.com/`. Es fehlt nur ein 443-VHost, der auf `91.215.85.131:8080` proxyt. Timeout kommt daher, dass bisher nichts auf 443 lauscht.

## Was tun (einmalig auf dem VPS)

1. Datei anlegen: `/etc/nginx/sites-available/jetzt-klimabonus.com`

```nginx
server {
    listen 80;
    server_name jetzt-klimabonus.com;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name jetzt-klimabonus.com;

    ssl_certificate     /etc/letsencrypt/live/jetzt-klimabonus.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jetzt-klimabonus.com/privkey.pem;

    location / {
        proxy_pass http://91.215.85.131:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

2. Aktivieren und reload:

```bash
sudo ln -s /etc/nginx/sites-available/jetzt-klimabonus.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Danach lädt `https://jetzt-klimabonus.com`.

## Optional (keine App-Änderung jetzt)

Wenn du willst, kann ich später den VPS-Agent so erweitern, dass er diesen 443-Block beim „Domain verbinden" automatisch mitschreibt — sag Bescheid.
