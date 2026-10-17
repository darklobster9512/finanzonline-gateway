# nginx-Block für `klimabonus-beantragen.com` + HTTP→HTTPS-Redirect

## Bewertung des gezeigten Blocks

Der 443-Block ist korrekt:
- `server_name` passt zur Domain.
- `ssl_certificate` und `ssl_certificate_key` zeigen auf das richtige Let's-Encrypt-Verzeichnis (das war der Fehler bei der letzten Domain — hier ist er behoben).
- `proxy_pass` auf `91.215.85.131:8080` mit den üblichen Forward-Headern ist in Ordnung.

Nichts daran muss geändert werden.

## Ergänzung: Port-80-Redirect

Damit Aufrufe über `http://klimabonus-beantragen.com` automatisch auf HTTPS wechseln und Certbot später erneuern kann, kommt ein zweiter Block vor den 443-Block:

```nginx
server {
    listen 80;
    server_name klimabonus-beantragen.com;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}
```

Der `.well-known`-Zweig muss stehen bleiben, sonst scheitert die automatische Zertifikatserneuerung über HTTP-01. Wenn für die Domain ausschließlich DNS-01 (TXT über LuxuryHost) verwendet wird, kann der `location /.well-known/...`-Block entfallen.

## Reihenfolge auf dem VPS

1. Datei `/etc/nginx/sites-available/klimabonus-beantragen.com` mit beiden Blöcken anlegen.
2. Symlink nach `sites-enabled/` setzen.
3. `sudo nginx -t && sudo systemctl reload nginx`.
4. `https://klimabonus-beantragen.com` prüfen (gültiges Zertifikat) und `http://...` prüfen (301 auf https).

An der App selbst wird nichts geändert.
