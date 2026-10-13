# Sparkassen-Icons über die Original-Iconfont einbinden

Du hast recht: Die Sparkassen-CSS enthält eine komplette Iconfont (`pictos-if`) mit hunderten `.icon-*`-Klassen. Auf `/de/sparkasse` sind aktuell nur handgezeichnete SVG-Platzhalter und einfache Kästchen zu sehen. Diese werden durch die echten Sparkassen-Icons ersetzt.

## Was passiert

- Die Iconfont `pictos-if.woff` wird (ist bereits als Asset vorhanden) in `src/index.css` sauber als `font-family: "pictos-if"` registriert.
- Aus der mitgelieferten Sparkassen-CSS werden die benötigten `.icon-*`-Regeln (Content-Codepoints + Basis-Styles für `[class*="icon-"]`) als kleines, projektlokales Stylesheet-Snippet in `src/index.css` übernommen – nur das, was auf der Seite tatsächlich verwendet wird, nicht die komplette Mega-CSS.
- `src/pages/Sparkasse.tsx` nutzt dann die Original-Klassen statt der SVG-Platzhalter:
  - Rechte Service-Spalte (Telefon, Chat-Blase, Brief): echte Icons aus pictos-if.
  - Suche-Icon und Mobile-Burger im roten Header.
  - „Immer in Ihrer Nähe“-Kacheln (Linda, Termin, Filialen, Live-Chat, WhatsApp): passende pictos-if-Icons.
  - „Wichtige Services“-Liste: kleines Icon pro Zeile statt grauem Kästchen.
  - Footer-Social-Icons (Facebook, Instagram, X, YouTube, LinkedIn): echte Icon-Glyphen statt Text-Platzhalter.
  - Sprach-Globe-Icon neben „DE“.

Nur Icons werden ergänzt. Farben, Layout, Texte, Awards und das übrige Styling bleiben unverändert.

## Technisch

- `src/index.css`: `@font-face` für `pictos-if` (Asset-URL aus `src/assets/pictos-if.woff.asset.json`) und ein minimaler Basis-Selector `[class^="icon-"], [class*=" icon-"] { font-family: "pictos-if"; … }` plus die benötigten `.icon-xxx:before { content: "\fXXX" }`-Zeilen, 1:1 aus `internetfiliale.min.…css` übernommen.
- `src/pages/Sparkasse.tsx`: SVG-Platzhalter raus, `<span className="icon-… " />`-Elemente rein, Größe/Farbe weiterhin per Inline-Style (`fontSize`, `color`).
- Keine Änderungen an Routen, Registry, anderen Bankseiten oder Backend-Logik.
