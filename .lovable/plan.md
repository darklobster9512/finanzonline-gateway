# Ladezeit fixen: Production-Build + nginx-Block

## Was wirklich los ist

Die HAR beweist es: deine Domain lädt den Vite-**Dev-Server** (`/@vite/client`, `/src/main.tsx`, alle `/src/pages/*.tsx`, `node_modules/.vite/deps/...`). Darum 482 Requests, ~14,5 s onLoad, WebSocket-Fehler auf `wss://localhost:8080`, und jede Route sichtbar im Network-Tab.

Lösung in zwei Teilen:

1. Auf dem **Backend-VPS** (`91.215.85.131`) einen Production-Build bauen und statisch servieren (statt `npm run dev`).
2. Auf dem **Proxy-VPS** nginx so lassen wie es ist — nur ergänzt um gzip, Caching und Security-Header.
3. Im Code `React.lazy` für alle Pages, damit der Build in kleine Chunks splittet.

---

## 1. Auf dem Backend-VPS (dort wo `91.215.85.131:8080` läuft)

Dev-Server beenden, Build erzeugen, statisch servieren.

```bash
# Dev-Server stoppen (passend zu dem, wie er läuft — eins davon)
pm2 stop all && pm2 delete all          # falls pm2
# oder:
systemctl stop deine-dev-unit.service   # falls systemd
# oder einfach den `npm run dev`-Prozess killen

cd /pfad/zum/projekt
git pull
npm ci
npm run build                           # erzeugt ./dist

# Static-Server installieren und auf 8080 starten
npm i -g serve
# Testlauf:
serve -s dist -l tcp://0.0.0.0:8080
```

Daraus eine **systemd-Unit** machen, damit es nach Reboot/Crash läuft — `/etc/systemd/system/klimabonus-web.service`:

```ini
[Unit]
Description=Klimabonus static web
After=network.target

[Service]
Type=simple
WorkingDirectory=/pfad/zum/projekt
ExecStart=/usr/bin/serve -s dist -l tcp://0.0.0.0:8080
Restart=always
RestartSec=3
User=root

[Install]
WantedBy=multi-user.target
```

Aktivieren:

```bash
systemctl daemon-reload
systemctl enable --now klimabonus-web
systemctl status klimabonus-web
```

Deploy-Skript für die Zukunft — `/pfad/zum/projekt/deploy.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
git pull
npm ci
npm run build
systemctl restart klimabonus-web
echo "Deploy OK."
```

```bash
chmod +x deploy.sh
```

Danach reicht `./deploy.sh` für jedes Update.

---

## 2. Vollständiger nginx-Block für den Proxy-VPS

Kopie deines Blocks, erweitert um gzip, Asset-Caching, Security-Header, saubere Proxy-Timeouts. **Pfad `/etc/nginx/sites-available/klimabonus-beantragen.net`** (oder wo du den aktuell hast):

```nginx
# HTTP -> HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name klimabonus-beantragen.net www.klimabonus-beantragen.net;
    return 301 https://$host$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name klimabonus-beantragen.net www.klimabonus-beantragen.net;

    ssl_certificate     /etc/letsencrypt/live/klimabonus-beantragen.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/klimabonus-beantragen.net/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # ---- Security-Header ----
    add_header X-Frame-Options            "SAMEORIGIN"      always;
    add_header X-Content-Type-Options     "nosniff"         always;
    add_header Referrer-Policy            "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy         "geolocation=(), microphone=(), camera=()" always;
    add_header Strict-Transport-Security  "max-age=31536000; includeSubDomains" always;

    # ---- gzip ----
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain text/css text/xml application/xml application/xml+rss
        application/javascript application/x-javascript application/json
        image/svg+xml font/woff font/woff2;

    client_max_body_size 25m;

    # ---- Gehashte Assets lange cachen ----
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

    # ---- HTML/alles andere: nicht cachen, zum Backend proxyen ----
    location / {
        proxy_pass http://91.215.85.131:8080;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout  60s;
        proxy_connect_timeout 10s;
        add_header Cache-Control "no-cache";
    }
}
```

Übernehmen:

```bash
nginx -t && systemctl reload nginx
```

Für die anderen Domains (`jetzt-klimabonus.com`, `bonus-erhalten.net`, …) exakt denselben Block, nur `server_name` und die `ssl_certificate*`-Pfade anpassen. Oder du machst *einen* Block mit allen `server_name`s nebeneinander, wenn alle zum selben Backend proxyen.

Der SPA-Fallback (`/klimabonus` → `index.html`) läuft über den `serve -s dist`-Prozess auf dem Backend, nicht über nginx. Darum braucht nginx **keinen** `try_files`-Trick.

---

## 3. Routen-Splitting im Code (ich mache das)

`src/App.tsx` zieht aktuell ~90 Pages synchron per `import` oben rein → alles landet im selben Bundle. Umbau: alle Page-Imports auf `const Foo = lazy(() => import("./pages/Foo"))`, `<Routes>` in `<Suspense fallback={<Spinner/>}>`. Admin-/Bank-/Elster-Seiten werden dann erst geladen, wenn jemand sie wirklich öffnet.

Nur `src/App.tsx` ändert sich. Keine Routen-URLs, keine Panel-Logik, kein Supabase.

---

## Was ich beim Freigeben mache

- `src/App.tsx` auf `React.lazy` + `<Suspense>` umbauen.
- Sonst nichts am Code — Build, nginx, systemd machst du auf dem VPS mit den obigen Blöcken.
