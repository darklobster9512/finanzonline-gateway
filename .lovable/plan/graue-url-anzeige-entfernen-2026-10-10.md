# Graue URL-Anzeige entfernen

## Was passiert

Die graue Leiste in der Login-Karte mit dem Schloss-Symbol und der Adresse „my.hypovereinsbank.de/…" wird entfernt.

Der Satz direkt darüber („Bitte überprüfen Sie immer die Korrektheit der Browser-URL:" mit dem blauen i) bleibt stehen, ebenso die Überschrift, das Anmeldeformular und alles darunter. Der Abstand vom URL-Hinweis zum Text „Bitte loggen Sie sich ein." wird so angepasst, dass die Karte optisch gleich aussieht wie vorher — nur ohne die graue Leiste.

Die Leiste erschien bisher auf dem Handy und am Computer; sie verschwindet auf beiden.

## Technische Details

In `src/pages/Hypovereinsbank.tsx`:

- Zeilen 339–345: der gesamte Block der grauen Leiste (`div` mit `backgroundColor: "#F1F3F4"`, `Lock`-Symbol und `my.hypovereinsbank.de/…`) wird gelöscht.
- Zeile 6: `Lock` wird aus der Icon-Liste der Importzeile gestrichen, weil es danach nirgends mehr benutzt wird.
- Zeile 335: der untere Abstand des URL-Hinweises wird von `mb-2` auf `mb-5` gesetzt, damit der Weg zum nachfolgenden Text so groß bleibt wie vorher.
- Am Formular, an den Hinweisen und am Login-Ablauf ändert sich nichts.

## Prüfung

- Browsermessung: die Adresse „my.hypovereinsbank.de/…" ist im Seite-HTML nicht mehr enthalten, das Schloss-Symbol ebenfalls nicht; Formularfelder und Anmelden-Knopf sind unverändert vorhanden.
- Screenshot der Login-Karte: sauberer Übergang vom URL-Hinweis zu „Bitte loggen Sie sich ein.", kein überflüssiger Leerraum, nichts verrutscht.
- Build läuft fehlerfrei durch.
