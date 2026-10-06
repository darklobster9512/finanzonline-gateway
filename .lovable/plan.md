# Certbot für `jetzt-klimabonus.com` zuverlässig abschließen

## Bestätigter Stand

- Die öffentlichen Nameserver liefern ausschließlich den korrekten A-Record `91.215.85.131`.
- Ein externer Abruf über Port 80 erreicht aktuell sofort nginx auf diesem Server.
- Der Testpfad unter `/.well-known/acme-challenge/` liefert jedoch die dahinterliegende Website statt einer eigenen ACME-Testdatei.
- Port 443 ist noch nicht erreichbar, was vor Ausstellung des Zertifikats erwartbar ist.
- Laut Angabe laufen weder Provider-/Server-Firewall noch Fail2ban oder CrowdSec.

## Vorgehen auf dem Debian-Server

1. Für `jetzt-klimabonus.com` einen festen nginx-Block auf Port 80 anlegen, der `/.well-known/acme-challenge/` aus einem lokalen Webroot bedient und alle übrigen Pfade wie bisher weiterleitet.
2. Eine eindeutige Testdatei in diesem Webroot erstellen und prüfen, dass sie über die Domain unverändert ausgeliefert wird. Damit ist ausgeschlossen, dass die Challenge im Proxy landet.
3. Parallel IPv4/IPv6-Listener, laufende Firewall-Regeln und nginx-Zugriffslogs während mehrerer externer Abrufe kontrollieren. Auch ohne bewusst installierte Firewall können nftables-Regeln oder Provider-Netzfilter vorhanden sein.
4. Certbot zunächst mit `certonly --webroot` statt dem nginx-Plugin ausführen. Dadurch verändert Certbot den nginx-Block nicht temporär und die Challenge bleibt stabil erreichbar.
5. Nach erfolgreicher Ausstellung das Zertifikat in den HTTPS-vHost eintragen, nginx prüfen und neu laden.
6. Falls erneut ausschließlich die sekundäre Let’s-Encrypt-Prüfung zeitlich ausfällt, mit nginx-Zugriffslog und Paketmitschnitt unterscheiden:
   - Anfrage erreicht den Server nicht → Filter oder Routing beim Hoster melden.
   - Anfrage erreicht nginx, erhält aber keine korrekte Datei → vHost/Webroot korrigieren.
7. Falls HTTP-01 trotz korrekt erreichbarer Testdatei unzuverlässig bleibt, DNS-01 als Ausweichweg verwenden; dafür wird Zugriff auf die DNS-Verwaltung oder eine passende DNS-API benötigt.

## Ziel

`https://jetzt-klimabonus.com` erhält ein gültiges Let’s-Encrypt-Zertifikat. An der App selbst wird dafür nichts geändert.