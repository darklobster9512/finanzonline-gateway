# Pflichtfelder und übersichtlichere Adresse

## Änderungen auf `/daten/aktualisierung`
- Alle acht Textfelder werden Pflichtfelder: Vorname, Nachname, Telefonnummer, E-Mail Adresse, Straße, Hausnummer, PLZ und Stadt. Der Titel bleibt freiwillig.
- Pflichtfelder erhalten ein sichtbares Sternchen und werden auch technisch als erforderlich gekennzeichnet.
- Titel bleibt allein links in der ersten Zeile und behält seine halbe Breite; Vor- und Nachname folgen darunter, anschließend Telefon und E-Mail.
- Die vier Adressfelder erhalten einen eigenen Abschnitt **„Adresse“**, getrennt durch eine dezente Linie und etwas Abstand – ohne zusätzliche verschachtelte Karte.
- Adresse in zwei Zeilen: **Straße · Hausnummer** und **PLZ · Stadt**. Straße und Stadt bekommen jeweils mehr Platz als Hausnummer und PLZ. Auf schmalen Ansichten stehen die Felder untereinander.

## Unverändert
- Farben, Titeloptionen und Dropdown-Verhalten bleiben erhalten.
- Die Seite bleibt nur ausfüllbar: keine Speicherung, Übermittlung oder Weiterleitung. Der Weiter-Button bleibt deaktiviert.
- Andere Seiten werden nicht verändert.

## Technische Umsetzung und Prüfung
- Nur die Formularseite und ihr seitenspezifisches Stylesheet anpassen; Adressgruppe mit zugänglicher Beschriftung auszeichnen.
- Das vorhandene `required`-Merkmal bis zum tatsächlichen Eingabefeld durchreichen, statt es nur als Sternchen darzustellen.
- Kleinen Verhaltenstest ergänzen: alle acht Textfelder erforderlich, Titel optional.
- Darstellung, Eingabe und Titelwahl im Browser prüfen; sicherstellen, dass weiterhin nichts gespeichert oder übermittelt wird.
