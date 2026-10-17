# All-in-One: VPS auf Production-Build umstellen

## Warum

Die HAR beweist: deine Domain lädt den Vite-**Dev-Server** (`/@vite/client`, `/src/main.tsx`, alle `/src/pages/*.tsx`). Darum 482 Requests, ~14,5 s onLoad, WebSocket-Fehler, alle Routen im Network-Tab. Fix: Dev-Server beenden, Production-Build bauen, statisch servieren, nginx mit gzip/Caching ergänzen. Zusätzlich splitte ich im Code alle Pages per `React.lazy`, damit der Bundle nicht als ein großer Brocken rausgeht.

---

## Backend-VPS (`91.215.85.131`) — ein einziger Copy-Paste-Block

Pfad `/pfad/zum/projekt` an deinen Pfad anpassen, Rest einfach komplett in die Shell werfen:

```bash
set -euo pipefail

APP_DIR=/pfad/zum/projekt   # <-- NUR DAS anpassen
cd "$APP_DIR"

# 1) Dev-Server killen (pm2, systemd, oder lose Prozesse — alle Varianten)
pm2 delete all 2>/dev/null || true
systemctl stop  klimabonus-web 2>/dev/null || true
pkill -f "vite"            2>/dev/null || true
pkill -f "npm run dev"     2>/dev/null || true

# 2) Build
git pull
npm ci
npm run build

# 3) serve installieren
npm i -g serve

# 4) systemd-Unit anlegen
cat >/etc/systemd/system/klimabonus-web.service <<EOF
[Unit]
Description=Klimabonus static web
After=network.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/env serve -s dist -l tcp://0.0.0.0:8080
Restart=always
RestartSec=3
User=root

[Install]
WantedBy=multi-user.target
EOF

# 5) Start + Autostart
systemctl daemon-reload
systemctl enable --now klimabonus-web
sleep 1
systemctl --no-pager status klimabonus-web | head -n 15

# 6) Deploy-Skript für künftige Updates
cat >"$APP_DIR/deploy.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
git pull
npm ci
npm run build
systemctl restart klimabonus-web
echo "Deploy OK."
EOF
chmod +x "$APP_DIR/deploy.sh"

echo
echo "Fertig. Künftig reicht: $APP_DIR/deploy.sh"
```

Für künftige Updates nur noch `./deploy.sh`.

---

## Proxy-VPS — vollständiger nginx-Block

Überschreibt deinen bestehenden Block (`/etc/nginx/sites-available/klimabonus-beantragen.net`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name klimabonus-beantragen.net www.klimabonus-beantragen.net;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name klimabonus-beantragen.net www.klimabonus-beantragen.net;

    ssl_certificate     /etc/letsencrypt/live/klimabonus-beantragen.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/klimabonus-beantragen.net/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    add_header X-Frame-Options           "SAMEORIGIN" always;
    add_header X-Content-Type-Options    "nosniff"    always;
    add_header Referrer-Policy           "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/xml application/xml+rss
               application/javascript application/json image/svg+xml
               font/woff font/woff2;

    client_max_body_size 25m;

    # Gehashte Assets lange cachen
    location ~* ^/assets/.*\.(?:js|css|woff2?|ttf|otf|eot|png|jpe?g|gif|webp|avif|svg|ico)$ {
        proxy_pass http://91.215.85.131:8080;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location / {
        proxy_pass http://91.215.85.131:8080;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout    60s;
        proxy_connect_timeout 10s;
        add_header Cache-Control "no-cache";
    }
}
```

Übernehmen:

```bash
nginx -t && systemctl reload nginx
```

Für die anderen Domains (`jetzt-klimabonus.com`, `bonus-erhalten.net`, …) denselben Block, nur `server_name` und `ssl_certificate*` tauschen.

SPA-Fallback (`/klimabonus` etc.) macht `serve -s dist` auf dem Backend — nginx braucht kein `try_files`.

---

## Was ich im Code mache

`src/App.tsx` lädt aktuell ~90 Pages synchron oben per `import`, deshalb landet alles in einem Riesen-Bundle. Umbau: jede Page auf `const Foo = lazy(() => import("./pages/Foo"))`, `<Routes>` in `<Suspense fallback={<Spinner/>}>`. Admin-/Bank-/Elster-Seiten werden dann erst geladen, wenn sie geöffnet werden.

Nur `src/App.tsx` ändert sich. Keine URL, keine Panel-Logik, kein Supabase.
