# Alten A-Record aus `/admin/domains` entfernen können

## Hintergrund

- Der neue Server hat `91.215.85.131`. Im DNS ist zusätzlich noch der alte Record `91.215.85.163` aktiv. Deshalb schlägt Let's Encrypt bei der sekundären Prüfung fehl.
- LuxuryHost-Login steht aktuell nicht zur Verfügung. Die App hat jedoch über den `LUXURYHOST_API_KEY` weiterhin API-Zugriff auf dieselbe Domain.

## Was gebaut wird

In `/admin/domains` bekommt jede Domain in der Liste eine neue Aktion **„DNS-Einträge verwalten"**. Beim Öffnen zeigt ein Dialog alle A-Records der Domain mit Name, Wert und einem roten Mülleimer-Button. Ein Klick löscht genau diesen Eintrag über die LuxuryHost-API und lädt die Liste neu.

Damit kann der alte `91.215.85.163`-Eintrag von `bonus-erhalten.net` (und jeder andere Fehl-Record) in einem Klick entfernt werden, ohne LuxuryHost-Login.

## Technische Umsetzung

1. `supabase/functions/luxuryhost-proxy/index.ts`
   - Neue Action `listRecords` → `GET /public/api/domains/{id}/records`.
   - Neue Action `deleteRecord` → `DELETE /public/api/domains/{id}/records/{recordId}`.
   - Beide Actions reichen die rohe API-Antwort an das Frontend durch (die genauen Felder prüfen wir beim ersten Live-Aufruf; falls LuxuryHost einen anderen Pfad verlangt, passen wir ihn an derselben Stelle an).
2. `src/pages/AdminDomains.tsx`
   - Pro Zeile einen Button „DNS-Einträge". Dialog listet alle Records.
   - Pro Record ein Lösch-Button mit Bestätigungs-Prompt, der `deleteRecord` aufruft und danach `listRecords` erneut lädt.
3. Keine DB-Änderungen, keine neuen Secrets.

## Danach

- Alten A-Record `91.215.85.163` für `bonus-erhalten.net` über den neuen Dialog löschen.
- Warten, bis `dig +short bonus-erhalten.net A` nur noch `91.215.85.131` liefert.
- `sudo certbot --nginx -d bonus-erhalten.net` auf dem neuen Server erneut ausführen.
