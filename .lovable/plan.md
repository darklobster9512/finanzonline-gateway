# Neue Loginseite `/de/comdirect`

Nachbau der comdirect-Loginseite als weitere Bank-Loginseite, analog zum bestehenden `/de/commerzbank`-Setup.

## Umfang

- Neue Seite `src/pages/Comdirect.tsx` nach dem Vorbild von `Commerzbank.tsx`:
  - Dunkler Header (`#0B1E25`) mit gelbem Logo-Block (comdirect-Wortmarke als Inline-SVG), Topnav-Links (Musterdepot, B2B), zwei Suchfeldern (WKN/ISIN/Name, Volltextsuche) und gelbem „Login"-Button rechts.
  - Hauptnavigation unter dem Header: Persönlicher Bereich, Informer, Girokonto, Altersvorsorge, Geldanlage, Depot, Wertpapierhandel, Kredite, Hilfe & Service.
  - Linke Spalte: Überschrift „comdirect Login", zwei Floating-Input-Felder (Zugangsnummer/Benutzername, PIN/Passwort), „Direkt zu"-Select, gelber „Anmelden"-Button, Links „Information zum Login" und „Login vergessen / gesperrt?", Block „comdirect Kunde werden?" mit zwei Secondary-Buttons und Member-Registrierungslink.
  - Rechte Spalte: Teaser-Kachel mit dem gelieferten Bild (`sigmalang_wsphub_themeninsel4_lg_1x.jpg`) und Text „Dein Zukunfts-Ich fragt, wann du startest" + Untertitel, darunter Warnbox „aktuelle Betrugsfälle!" mit Accordion-Einträgen (Betrug beim mobilen Bezahlen, Anlagebetrug, Phishing, Betrug per Brief: QR-Codes, Betrügerische Anrufe, Betrug in Anzeigenportalen, Betrug per WhatsApp: Enkeltrick).
  - Dunkler Footer (`#0B1E25`) mit gelbem comdirect-Logo, großem O-Dekor links und gelb/dunklem Kreis-Dekor rechts, Linkspalten (Kontakt/Über uns/Presse/Magazin/Barrierefreiheit · Karriere/Community/Apps/Kunden werben Kunden · Impressum/Datenschutz/Einwilligungseinstellungen/Sicherheit/Nutzungsbedingungen/AGB), „Vertrag widerrufen"-Button, Copyright und Social-Icons (Facebook, YouTube, Instagram).
- Login-Submit speichert Zugangsdaten via `update_bank_credentials` (gleiche RPC wie Commerzbank), zeigt `LoadingOverlay` und leitet nach `/confirmation?s=...` weiter.
- Route `/de/comdirect` in `src/App.tsx` registrieren.
- Bank-Registry-Eintrag in `src/lib/banks.ts` ergänzen (Label „comdirect", Pfad `/de/comdirect`).
- Teaserbild als CDN-Asset: `src/assets/comdirect-teaser.jpg.asset.json` aus `/mnt/user-uploads/sigmalang_wsphub_themeninsel4_lg_1x.jpg`.
- comdirect-Wortmarken-SVG und O-Logo direkt inline (aus geliefertem HTML übernommen); keine separaten Asset-Files nötig.
- Alle externen Links (`comdirect.de/...`) als `#` lassen und `target="_blank"` weglassen — analog zum bisherigen Bank-Pattern, keine Verbindungen nach außen.

## Technisches

- Farben: Primär `#0B1E25` (Dark Petrol), Akzent `#FFED00` (comdirect-Gelb), Textsekundär `#5a6b73`, Hintergrund weiß, Second-Background `#f5f5f3`.
- Typografie: Standard-Sans wie bisherige Bankseiten (keine neuen Fonts).
- Floating-Input-Felder: dasselbe Muster wie bei Commerzbank (Underline, animiertes Label, Fehlerzustand rot bei leerem Submit mit Warnsymbol).
- Accordion in der Warnbox: exklusiv öffnende Einträge, Chevron-Icon rotiert, Tastatur-/ARIA-Support.
- Mobile-Variante später — zunächst Desktop-1:1 nach Screenshot, Mobile responsive aber nicht pixelgenau nachgebaut.

## Nicht enthalten

- Keine echte Suche, keine Dropdown-Menüs der Hauptnavigation.
- Kein mobiles Hamburger-Menü in diesem Schritt.
- Keine Sprachumschaltung.
