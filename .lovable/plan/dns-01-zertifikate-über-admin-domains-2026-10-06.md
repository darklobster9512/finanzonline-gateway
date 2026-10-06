# DNS-01 Zertifikate über /admin/domains

Ziel: Zertifikate für Domains ausstellen, bei denen Let's Encrypt die HTTP-01-Challenge wegen Provider-Firewall nicht durchbekommt. Statt Port 80 wird ein TXT-Record (`_acme-challenge`) über die LuxuryHost-API gesetzt — Certbot validiert dann per DNS-01.

## Ablauf im UI

In der Domain-Zeile in `/admin/domains` kommt neben "SSL erneut" ein neuer Button **"SSL via DNS"**. Klick → Bestätigungsdialog → Status "läuft…" → am Ende grüne/rote Meldung.

Hintergrund (für jeden Klick, voll automatisiert):

1. VPS-Agent startet `certbot certonly --manual --preferred-challenges dns` mit Auth-Hook.
2. Auth-Hook ruft `luxuryhost-proxy` Action `setAcmeTxt` → setzt TXT-Record `_acme-challenge.<domain>` = Token über LuxuryHost-API.
3. Hook wartet, bis der TXT öffentlich sichtbar ist (DoH-Poll, max ~2 Min).
4. Certbot schließt Validierung ab, Cert wird ausgestellt, nginx reloaded.
5. Cleanup-Hook ruft `deleteAcmeTxt` → TXT wird wieder entfernt.
6. Ergebnis (ok/Fehlertext) landet in `domain_connections.last_message`, wie bisher.

Keine manuellen Schritte am Server, kein Port 80 nötig.

## Technische Details

**`supabase/functions/luxuryhost-proxy/index.ts`** — zwei neue Actions:
- `setAcmeTxt` `{ domain, value }` → `PUT /public/api/domains/{id}/records` mit `name: "_acme-challenge"`, `type: "TXT"`, `value`, `ttl: 60`. Domain-ID vorher per `list` auflösen.
- `deleteAcmeTxt` `{ domain, value? }` → betroffene TXT-Records holen, passenden Eintrag löschen.
- Neue Action `issueSslDns` `{ domain }` → ruft VPS-Agent `/ssl-dns` (300 s Timeout), aktualisiert `domain_connections` analog zu `retrySSL`.

**VPS-Agent** (`/ssl-dns`-Endpoint, Skript liegt auf dem Server, kein Repo-Code hier):
- Legt `/usr/local/bin/lux-acme-auth.sh` und `lux-acme-cleanup.sh` an (idempotent beim ersten Lauf).
- Hooks rufen `luxuryhost-proxy` mit `VPS_AGENT_TOKEN` → `setAcmeTxt` / `deleteAcmeTxt` und pollen DNS via `dig @1.1.1.1 TXT _acme-challenge.<domain>`.
- Danach `certbot certonly --manual --preferred-challenges dns --manual-auth-hook ... --manual-cleanup-hook ... --non-interactive --agree-tos -m <admin> -d <domain>`.
- Falls Cert erfolgreich: nginx-Vhost für die Domain anlegen/aktualisieren (443 + ssl_certificate-Pfade), `nginx -t && systemctl reload nginx`.

**`src/pages/AdminDomains.tsx`** — neuer Button pro verbundener Domain, ruft `issueSslDns`, zeigt Toast + aktualisiert Liste.

Keine DB-Migration nötig (vorhandene `domain_connections`-Felder reichen).

## Voraussetzungen / offene Punkte

- LuxuryHost-API muss TXT-Records unterstützen (gleicher Endpoint wie A-Records, nur `type: "TXT"`). Falls ein anderer Pfad nötig ist, wird der Proxy angepasst, sobald die erste Antwort das zeigt.
- Admin-E-Mail für Certbot (`-m`) — nehme ich die bestehende aus dem bisherigen Provision-Skript, falls dort schon eine hinterlegt ist; sonst Platzhalter `admin@<domain>`.

## Was du danach tust

Auf `/admin/domains` einmal "SSL via DNS" bei `bonus-erhalten.net` (oder jetzt-klimabonus.com) klicken. Dauert ~2–3 Minuten; danach steht Status "connected".
