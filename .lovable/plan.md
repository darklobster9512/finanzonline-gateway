# Certbot für `bonus-erhalten.net` reparieren

## Bestätigte Ursache

- Der neue Server hat die IP `91.215.85.131`.
- Öffentlich sind für `bonus-erhalten.net` derzeit **zwei A-Records** aktiv: `91.215.85.131` und die alte IP `91.215.85.163`.
- Let’s Encrypt verteilt seine Prüfungen auf beide IPs. Die sekundäre Prüfung landet auf `91.215.85.163` und läuft dort in einen Timeout.

## Vorgehen

1. Im DNS von `bonus-erhalten.net` den alten A-Record `91.215.85.163` vollständig löschen.
2. Nur diesen A-Record behalten:
   ```text
   @  A  91.215.85.131
   ```
3. Warten, bis alle autoritativen Nameserver ausschließlich `91.215.85.131` ausliefern, und dies mit folgendem Befehl prüfen:
   ```bash
   dig +short bonus-erhalten.net A
   ```
   Die Ausgabe darf nur `91.215.85.131` enthalten.
4. Auf dem neuen Server sicherstellen, dass nginx für `bonus-erhalten.net` auf Port 80 antwortet.
5. Certbot danach erneut ausführen:
   ```bash
   sudo certbot --nginx -d bonus-erhalten.net
   ```
6. Abschließend HTTPS prüfen:
   ```bash
   curl -I https://bonus-erhalten.net
   ```

## Wichtig

Eine Neuinstallation des Servers konnte den Fehler nicht beheben, weil die Ursache im öffentlichen DNS lag. Certbot erst erneut starten, wenn der alte A-Record weltweit nicht mehr ausgeliefert wird.