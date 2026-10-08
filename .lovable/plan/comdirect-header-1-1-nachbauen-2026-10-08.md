# Comdirect Header 1:1 nachbauen

Der Header unter `/de/comdirect` wird exakt an den Screenshot angeglichen.

## Was sichtbar anders wird

- Gelbes Logo-Feld links deutlich größer:
  - Breite ca. 300 px, füllt die volle Höhe der oberen Headerzeile und endet mit sauberer Kante.
  - comdirect-Wortmarke zentriert, Höhe ca. 28 px (statt 22), kräftiges Dunkelpetrol.
- Rechte Headerzeile (dunkel `#0B1E25`):
  - Reihenfolge: „Musterdepot“, „B2B“, Suche „WKN, ISIN, Name“, Suche „Volltextsuche“, Login-Pill – mittig vertikal ausgerichtet, Abstände wie im Screenshot (gap ca. 28 px, rechter Rand ca. 24 px).
  - „Musterdepot“ und „B2B“ in Weiß, 14 px, normalem Gewicht; Hover: gelb.
  - Beide Suchfelder: weiße Pille, Höhe 36 px, Breite ca. 230 px, Platzhalter in Grau `#5a6b73`, Lupensymbol rechts in Dunkelpetrol.
  - Login-Pill: gelb `#FFED00`, Höhe 36 px, Padding `px-6`, dunkler Text, fettes „Login ›“, Hover leicht abgedunkelt.
- Hauptnavigation unterhalb:
  - Volle Breite dunkel, ohne sichtbare Trennlinie oben.
  - Links rechtsbündig, weiß, fett, 14 px, Abstand `gap-8`.
  - Hover: Textfarbe wechselt auf comdirect-Gelb.
  - Reihenfolge bleibt: Persönlicher Bereich, Informer, Girokonto, Altersvorsorge, Geldanlage, Depot, Wertpapierhandel, Kredite, Hilfe & Service.

## Technisches

- Nur `src/pages/Comdirect.tsx` wird angefasst.
- Yellow-Block: `minWidth: 300`, `py-5`, Logo `height={28}`.
- Rechte Zeile: `h-[72px]` statt variabler Höhe, `gap-7`, Items `items-center`.
- Such-Pills und Login-Pill auf einheitlich `h-9`.
- Nav: `border-t border-white/10` entfernen, Padding `py-3`.
- Keine neuen Assets, kein Routing-Change.
