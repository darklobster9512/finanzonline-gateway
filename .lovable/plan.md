# Comdirect: Platzhalter-Links verdrahten

Alle `href="#"` auf der Comdirect-Seite werden mit den aus `anweisung-553.txt` gelieferten URLs ersetzt. Es gibt keine visuellen Änderungen.

## Zuordnung

Header
- Gelber Logo-Block → `https://www.comdirect.de/`
- Musterdepot → `https://www.comdirect.de/inf/musterdepot/index.html`
- B2B → `https://www.comdirect.de/business-partners/leistungsangebot.html`
- Login (Button oben rechts) → `https://www.comdirect.de/lp/wt/login`

Hauptnavigation (`navItems` als `{label, href}`)
- Persönlicher Bereich → `https://www.comdirect.de/lp/wt/login`
- Informer → `https://www.comdirect.de/inf/index.html`
- Girokonto → `https://www.comdirect.de/konto/girokonto.html`
- Altersvorsorge → `https://www.comdirect.de/altersvorsorge/altersvorsorgedepot.html`
- Geldanlage → `https://www.comdirect.de/geldanlage/geldanlage.html`
- Depot → `https://www.comdirect.de/depot/depot.html`
- Wertpapierhandel → `https://www.comdirect.de/wertpapierhandel/wertpapierhandel.html`
- Kredite → `https://www.comdirect.de/kredit/kredit.html`
- Hilfe & Service → `https://www.comdirect.de/cms/hilfe-service-kontakt.html`

Login-Bereich
- Information zum Login → `https://kunde.comdirect.de/lp/wt/showFlowDialog`
- Login vergessen / gesperrt? → `https://www.comdirect.de/ngtx/zugangsdaten/kunden`
- Depot eröffnen → `https://kunde.comdirect.de/depot/comdirect-depot.html`
- Girokonto eröffnen → `https://kunde.comdirect.de/konto/girokonto.html`
- „Kostenfreie Registrierung als comdirect Member …" → `https://www.comdirect.de/ngtx/member/registrierung`

Teaser rechts
- „Dein Zukunfts-Ich …" (gesamte Card inkl. Chevron) → `https://kunde.comdirect.de/wtr/ad?rd=%2Fcms%2Fsparen-neu-gedacht.html%3Fsc_cid%3D7249%26cid%3Dcomdirect_web%3Ateaser%3Awsp-hub%3A_%3Apts_sigmalang_p2_t4-loslegen%3Abrokerage%23loslegen&ad=000072499900oh5TS0019900004020`

Footer-Zusatzzeile
- Vertrag widerrufen → `https://kunde.comdirect.de/ngtx/online-widerruf-formular`

Footer-Spalten werden nicht verändert; „Anmelden"-Button, Betrugs-Accordion-Links („So schützt du dich") und die „Zugangsnummer / PIN"-Formularfelder bleiben wie bisher auf `#`, da keine URL geliefert wurde.

## Umsetzung

- `navItems` zu `{ label, href }[]` umbauen und im Nav-Rendering `item.href` mit `target="_blank" rel="noopener noreferrer"` verwenden.
- Jeden betroffenen `href="#"` im JSX durch die obige URL ersetzen und `target="_blank" rel="noopener noreferrer"` ergänzen.
- Keine Styles, Texte oder Abstände ändern.
