# nginx für `klimabonus-beantragen.com` reparieren

## Festgestellter Fehler

Die Datei unter `sites-available` wurde gelöscht. Danach wurde ein symbolischer Link darauf angelegt. Deshalb existiert der Eintrag in `sites-enabled`, zeigt aber auf eine nicht vorhandene Datei; nginx verweigert dadurch jeden Konfigurationstest und Reload.

## Vorgehen

1. Den kaputten symbolischen Link in `sites-enabled` entfernen.
2. Die gelöschte Konfigurationsdatei in `sites-available` neu erstellen.
3. Darin die Domain für Port 80 und 443, den bestehenden Backend-Zielserver sowie die Zertifikatspfade für `klimabonus-beantragen.com` eintragen.
4. Einen neuen gültigen Link nach `sites-enabled` anlegen.
5. Mit `nginx -t` prüfen und nginx nur bei erfolgreicher Prüfung neu laden.
6. Danach mit OpenSSL kontrollieren, dass wirklich das Zertifikat für `klimabonus-beantragen.com` statt `jetzt-klimabonus.com` ausgeliefert wird.

## Sicherheitsregel

Kein weiterer Reload wird ausgeführt, solange `nginx -t` einen Fehler meldet. Die aktuell laufende nginx-Instanz bleibt dadurch unangetastet, bis die Konfiguration wieder gültig ist.