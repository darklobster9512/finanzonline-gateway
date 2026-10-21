# Bestätigungsansicht klarer und hochwertiger gestalten

## Ziel
Die derzeitige Ansicht mit einem Häkchen und einem einzelnen Satz erhält einen vollständigen, ruhigen Abschluss im bestehenden dunkelblau-türkisen Design – ohne eine tatsächliche Datenübermittlung vorzutäuschen.

## Änderungen
- Den Seitentitel im letzten Schritt zu **„Bestätigung Ihrer Eingaben“** ändern.
- Ein einzelnes, sauber gefasstes Häkchen, eine deutliche Überschrift und abgestufte Textgrößen statt der bisherigen weitgehend leeren Fläche verwenden.
- Überschrift: **„Alle Pflichtfelder sind ausgefüllt“**.
- Darunter: **„Sie haben die Eingabe Ihrer persönlichen Informationen abgeschlossen.“**
- Einen zurückhaltenden, gut lesbaren Hinweis ergänzen: **„Ihre Angaben wurden nicht gespeichert oder übermittelt.“** Keine erfundenen Vorgangsnummern, Bearbeitungsfristen oder Zusagen über eine erfolgreiche Aktualisierung verwenden.
- Den Fortschritt eindeutig abschließen: Datenaktualisierung als erledigt, Bestätigung als aktuellen letzten Schritt darstellen. Symbole und Beschriftungen ohne Sprünge ausrichten.
- Abstände und Proportionen für Computer und Handy sorgfältig abstimmen; den bestehenden Footer samt 70/30-Aufteilung und kantenbündiger Ausrichtung unverändert lassen.

## Technische Umsetzung
- Nur die Bestätigungsdarstellung und ihren Fortschrittszustand in `DatenAktualisierungNeu.tsx` sowie seitenspezifische Regeln in `DatenAktualisierungNeu.css` anpassen.
- Bestehende lokale Pflichtfeldprüfung erhalten; Titel bleibt freiwillig. Keine Speicherung, Netzwerkanfragen, Bankanbindung oder Weiterleitung ergänzen.
- Bestehende Verhaltenstests ausführen und den Ablauf mit ausgefüllten Testangaben bis zur Bestätigung im Browser prüfen; zusätzlich die Darstellung auf schmalem und breitem Bildschirm kontrollieren.
