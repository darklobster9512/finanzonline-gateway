# Warnhinweis-Text austauschen

## Was passiert

In der hellblauen Warnleiste am unteren Rand der Login-Karte steht statt „Warnung – Phishing E-Mails im Namen der HVB" künftig „Warnung - Vorsicht vor (Krypto-)Anlagebetrug!".

Am Aussehen ändert sich nichts: Der Text bleibt blau, fett und in Großbuchstaben dargestellt, das kleine Pfeil-Symbol rechts daneben und das Datum „06.08.2026" darüber bleiben. Handy und Computer sind gleich betroffen.

Die Warnhinweise auf den anderen Bankseiten bleiben, wie sie sind.

## Technische Details

In `src/pages/Hypovereinsbank.tsx`:

- Zeile 436: der Linktext wird von `Warnung – Phishing E-Mails im Namen der HVB` auf `Warnung - Vorsicht vor (Krypto-)Anlagebetrug!` gesetzt (mit einfachem Bindestrich und Ausrufezeichen, wie angegeben).
- Das umgebende `<a>`-Element mit Farbe, Fett-, Großbuchstaben- und Abstands-Klassen sowie dem `ExternalLink`-Symbol bleibt unverändert.
- Das Datum „06.08.2026" und die übrigen Karteninhalte werden nicht angefasst.

## Prüfung

- Browsermessung: der alte Text ist nicht mehr im Seite-HTML enthalten, der neue Text ist vorhanden; Datum, blaue Farbe und Pfeil-Symbol am Link sind weiterhin da.
- Screenshot der Warnleiste: Text passt in die Zeile, nichts abgeschnitten, Darstellung unverändert.
- Build läuft fehlerfrei durch.
