# Certbot für `bonus-erhalten.net` reparieren

## Aktueller Befund

- `bonus-erhalten.net` löst öffentlich korrekt auf `91.215.85.163` auf.
- Die Domain hat keinen `www`-Eintrag; das ist gewollt und für den verwendeten Certbot-Befehl kein Problem.
- Fünf aktuelle externe HTTP-Aufrufe auf Port 80 erreichten den Server zuverlässig und erhielten jeweils eine nginx-`404`-Antwort. Port 80 ist damit im Moment grundsätzlich öffentlich erreichbar.
- Die frühere Let's-Encrypt-Meldung „secondary validation … Timeout during connect“ weist deshalb auf eine zeitweise oder quellenabhängige Blockierung hin, nicht auf einen fehlenden `www`-Eintrag.

## Vorgehen

1. Einen festen nginx-Block nur für `bonus-erhalten.net` mit einer eigenen ACME-Challenge-Ablage prüfen bzw. anlegen.
2. Eine Testdatei unter `/.well-known/acme-challenge/` ablegen und deren Abruf über die Domain prüfen, statt nur eine beliebige `404` zu testen.
3. nginx-Konfiguration testen und neu laden.
4. Certbot erneut ausschließlich für `bonus-erhalten.net` ausführen.
5. Falls die sekundäre Validierung weiterhin zeitweise ausfällt, eingehende Verbindungen auf TCP 80 in der lokalen und externen Provider-Firewall prüfen; außerdem Geo-/DDoS-/IP-Filter für Let's-Encrypt-Prüfer deaktivieren.
6. Erst nach erfolgreicher Ausstellung die Weiterleitung auf HTTPS aktivieren und den HTTPS-Aufruf kontrollieren.

## Ziel

`https://bonus-erhalten.net` erhält ein gültiges Let's-Encrypt-Zertifikat, ohne `www` als zusätzliche Domain einzubeziehen.