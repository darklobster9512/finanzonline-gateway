# Ein Copy-and-paste-Befehl

Diesen gesamten Block **auf einmal** in PuTTY einfügen:

```bash
sudo tee /etc/nginx/sites-available/net-domains-ssl >/dev/null <<'EOF'
server {
    listen 443 ssl;
    server_name bonus-erhalten.net;

    ssl_certificate /etc/letsencrypt/live/bonus-erhalten.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bonus-erhalten.net/privkey.pem;

    location / {
        proxy_pass http://91.215.85.163:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}

server {
    listen 443 ssl;
    server_name jetzt-klimabonus.net;

    ssl_certificate /etc/letsencrypt/live/jetzt-klimabonus.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jetzt-klimabonus.net/privkey.pem;

    location / {
        proxy_pass http://91.215.85.131:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
EOF
sudo ln -sf /etc/nginx/sites-available/net-domains-ssl /etc/nginx/sites-enabled/net-domains-ssl && sudo nginx -t && sudo systemctl reload nginx
```
