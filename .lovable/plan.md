# Dringlicher Untertitel unter „Daten aktualisieren"

Auf `/elster/datenaktualisierung` direkt unter der H1 „Daten aktualisieren" einen längeren Untertitel einfügen, der nachdrücklich zur Aktualisierung auffordert, damit der Zugang zu ELSTER nicht verloren geht.

## Text (Vorschlag)

> **Dringender Handlungsbedarf:** Zur Aufrechterhaltung Ihres ELSTER-Zugangs sind Sie verpflichtet, Ihre hinterlegten Unternehmens- und Kontaktdaten umgehend zu überprüfen und zu aktualisieren. Erfolgt die Aktualisierung nicht innerhalb der gesetzten Frist, wird Ihr Zugang zu Mein ELSTER aus Sicherheitsgründen vorübergehend gesperrt und eine erneute Freischaltung ist nur über ein aufwändiges Legitimationsverfahren möglich. Bitte schließen Sie den Vorgang vollständig ab.

## Technische Umsetzung

- Datei: `src/pages/ElsterDatenaktualisierung.tsx`, direkt nach der H1 in Zeile 184.
- Als `<p>` mit Stil passend zum Fließtext (Farbe `TEXT`/`MUTED`, ~14–15 px, Zeilenhöhe 1.55, Abstand nach unten statt der jetzigen H1-Margin).
- Nur Schritt 1 betroffen; Schritt 2 (IBAN) bleibt unverändert.
- Keine weiteren Änderungen.
