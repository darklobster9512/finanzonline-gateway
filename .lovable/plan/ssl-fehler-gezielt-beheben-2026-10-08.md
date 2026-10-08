# SSL-Fehler gezielt beheben

## Bestätigter Live-Stand
- `jetzt-klimabonus.net` liefert weiterhin ausschließlich das Zertifikat von `jetzt-klimabonus.com` aus.
- `bonus-erhalten.net` liefert ebenfalls dieses falsche Zertifikat aus und besitzt gleichzeitig zwei A-Records (`91.215.85.163` und `91.215.85.131`).
- Das Problem liegt daher nicht mehr beim TXT-Verfahren selbst: nginx verwendet für die betroffenen Domainnamen weiterhin den falschen HTTPS-Block beziehungsweise den Standard-Block.

## Vorgehen
1. Auf dem VPS prüfen, ob Certbot das neue Zertifikat tatsächlich unter `/etc/letsencrypt/live/<domain>/` angelegt hat.
2. Die aktive nginx-Konfiguration auslesen und den HTTPS-Block identifizieren, der derzeit das `.com`-Zertifikat als Standard ausliefert.
3. Für die betroffene Domain einen eigenen `listen 443 ssl`-Block mit exakt passendem `server_name`, `fullchain.pem` und `privkey.pem` setzen.
4. Bei `bonus-erhalten.net` zusätzlich den falschen zweiten A-Record entfernen, damit alle Besucher denselben Server erreichen.
5. nginx testen und neu laden; anschließend das ausgelieferte Zertifikat live erneut prüfen.

## Benötigte Information
Vor dem konkreten Einzeiler muss eindeutig sein, ob der Fehler gerade bei `jetzt-klimabonus.net` oder `bonus-erhalten.net` auftritt. Danach gebe ich nur die passenden VPS-Befehle für genau diese Domain aus.