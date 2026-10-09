# Comdirect Footer mobil: 4/4/3 pro Zeile, Links in Weiß

Nur die mobile Ansicht von `/de/comdirect`. Desktop bleibt unverändert.

## Was sich ändert

Die drei Linkgruppen im Footer stehen mobil untereinander. Künftig bricht jede Gruppe genau dort um, wo es gesagt wurde:

```text
Zeile 1: Kontakt   Über uns   Presse   Magazin
         Barrierefreiheit
Zeile 2: Karriere  Community  Apps     Kunden werben Kunden
Zeile 3: Impressum Datenschutz  Einwilligungseinstellungen
         Sicherheit  Nutzungsbedingungen  AGB
```

- Gruppe 1 (5 Links): 4 pro Zeile, der 5. rutscht in die Folgezeile.
- Gruppe 2 (4 Links): alle 4 in einer Zeile.
- Gruppe 3 (6 Links): 3 pro Zeile, also zwei Zeilen.

Alle 15 Linktexte sind mobil weiß (`#FFFFFF`). Auf dem Desktop bleibt es beim bisherigen Hellgrau.

## Technisch

- `src/pages/Comdirect.tsx`, Footer-Abschnitt (Linklisten, Zeilen ca. 714–741).
- Pro Gruppe wird nach der gewünschten Anzahl ein leeres `<li className="basis-full lg:hidden" />` eingefügt; es erzwingt den Zeilenumbruch, ohne die natürliche Breite der Links zu verändern. Auf dem Desktop ist es ausgeblendet, dort bleibt alles wie bisher.
- Die Umbruchstellen kommen aus einer kleinen Tabelle pro Gruppenindex (nach dem 4., nach dem 4., nach dem 3. Link).
- Linkfarbe: die Inline-Farbe `#e5e7e8` an den Links wird durch `text-white lg:text-[#e5e7e8]` ersetzt, damit Weiß nur mobil gilt und Desktop exakt gleich bleibt. Hover-Hintergrund und Abstände bleiben unverändert.
- Der horizontale Abstand zwischen den Links wird mobil leicht reduziert, damit „Kunden werben Kunden“ und „Einwilligungseinstellungen“ in die Zeilen passen; Desktop-Abstände bleiben.

## Prüfung

- Nach dem Build: Messung im Preview-Fenster 393×852 (Mobil-User-Agent), dass die Zeilenzahlen 2 / 1 / 2 sind, kein Text übersteht und die Linkfarbe mobil weiß ist.
- Desktop-Messung bei 1280 px: weiterhin vier Spalten, Linkfarbe unverändert hellgrau.
