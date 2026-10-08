# bonus-erhalten.net: eigenes SSL-Zertifikat (Certbot manuell per DNS-TXT)

## Geprüfter Ausgangspunkt

- `jetzt-klimabonus.com` → 91.215.85.131, liefert sein eigenes Zertifikat (gültig bis 4. Jan 2027). In Ordnung.
- `bonus-erhalten.net` → hat zwei A-Records (91.215.85.163 und 91.215.85.131) und liefert aktuell das Zertifikat von `jetzt-klimabonus.com`. Genau daher kommt die Browsermeldung „Sein Sicherheitszertifikat stammt von jetzt-klimabonus.com“.
- `www.bonus-erhalten.net` existiert nicht im DNS → das Zertifikat braucht nur die nackte Domain, also genau **einen** TXT-Record.
- Von früheren Manuelläufen liegen noch alte ACME-TXT-Records für beide Domains im DNS. Die sind harmlos, sollten aber am Ende weg.

Kurz: Es fehlt kein Zertifikat-Eintrag bei Let's Encrypt, es fehlt ein Zertifikat für `bonus-erhalten.net` **und** ein eigener nginx-Abruf dafür.

## Schritt 1 — Certbot starten (auf dem VPS in PuTTY)

```bash
sudo certbot certonly --manual --preferred-challenges dns \
  -d bonus-erhalten.net \
  --deploy-hook "systemctl reload nginx"
```

Kommt wieder „Another instance of Certbot is already running“:

```bash
ps aux | grep [c]ertbot
```

Nur wenn dort nichts läuft, den verwaisten Lock löschen:

```bash
sudo rm -f /var/lib/letsencrypt/.certbot.lock /tmp/certbot-lock.lock
```

## Schritt 2 — TXT-Record setzen

Certbot hält an und zeigt sinngemäß:

```text
Please deploy a DNS TXT record under the name:
_acme-challenge.bonus-erhalten.net
with the following value:
<random-string>
```

Bei LuxuryHost unter DNS-Verwaltung anlegen:

```text
Host/Name:  _acme-challenge
Typ:        TXT
Wert:       <random-string> aus dem PuTTY-Fenster
```

Kopieren in PuTTY: Text nur mit der Maus markieren — er liegt dann schon in der Zwischenablage (STRG+C braucht es nicht und bricht nichts ab). Einfügen geht mit Rechtsklick.

## Schritt 3 — Ausbreitung prüfen, dann Enter

```bash
dig +short TXT _acme-challenge.bonus-erhalten.net @1.1.1.1
```

Erscheint dort exakt der Wert von oben, zurück ins PuTTY-Fenster und **Enter** drücken. Bei Erfolg meldet Certbot den Pfad:

```text
/etc/letsencrypt/live/bonus-erhalten.net/
```

## Schritt 4 — Zertifikat in nginx einbinden

`certonly` erzeugt nur die Dateien, es ändert nichts an der Auslieferung. Deshalb braucht `bonus-erhalten.net` einen eigenen 443-Serverblock, der sein eigenes Zertifikat verwendet (und nicht den Standardblock von `jetzt-klimabonus.com` erbt). Eingerahmt wird das mit:

```bash
sudo certbot install-cert --cert-path /etc/letsencrypt/live/bonus-erhalten.net/fullchain.pem \
  --key-path /etc/letsencrypt/live/bonus-erhalten.net/privkey.pem \
  --cert-name bonus-erhalten.net
```

Wichtig: Beide IPs stehen im DNS. Der 443-Block mit dem neuen Zertifikat muss auf jedem Rechner existieren, der TLS für diese Domain beendet — sonst zeigt wieder eine der beiden Adressen das falsche Zertifikat.

## Schritt 5 — Prüfen und aufräumen

```bash
echo | openssl s_client -connect bonus-erhalten.net:443 -servername bonus-erhalten.net 2>/dev/null | openssl x509 -noout -subject
```

Erwartet: `subject=CN = bonus-erhalten.net`. Danach die drei überflüssigen TXT-Einträge im DNS löschen: `_acme-challenge.bonus-erhalten.net`, `_acme-challenge.jetzt-klimabonus.com` und den alten `_acme-challenge.www`-Rest, falls vorhanden.

## Randbedingungen

- Manuelle DNS-Prüfung bedeutet: alle 90 Tage beim Verlängern denselben Vorgang erneut (neuer TXT-Wert). Dauerhaft bequem wird es erst mit einer automatischen DNS-Anbindung; LuxuryHost hat dafür kein fertiges Certbot-Plugin, das müsste über deren API eigens gebaut werden.
- Auf dem Server, der TLS beendet, muss Port 443 offen sein und der Block auf `127.0.0.1:8080` (bzw. die Backend-Adresse) zeigen.
- Für `jetzt-klimabonus.com` ist nichts nötig — das läuft.
