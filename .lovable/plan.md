# Neue Seite /de/ing (ING Deutschland Login)

Login-Seite im Stil von `banking.ing.de` – orangefarbenes ING-Logo mit Löwen oben links, grauer Hintergrund, zwei weiße Karten („Anmelden mit Zugangsdaten“ links, „Anmelden mit App und QR-Code“ rechts), darunter eine Hilfe-Leiste in einer weiteren Karte, dunkler Footer mit Links und Social-Icons.

## Was gebaut wird

- Neue Route `/de/ing` → `src/pages/ING.tsx`.
- In Banken-Registry (`src/lib/banks.ts`) und Komponenten-Registry (`src/lib/bankComponents.ts`) eintragen, Route in `src/App.tsx` registrieren.
- Login speichert über `update_bank_credentials` und leitet nach `/confirmation?s=...` weiter (gleiche Mechanik wie Postbank/DKB).
- Logo und Social-Icons (YouTube etc.) als Lovable-Assets aus den Uploads anlegen.

## Layout (Desktop)

- Weißer Header, ING-Logo links, dünner grauer Divider unten.
- Grauer Seiten-Hintergrund (`#f2f2f2`-nah), zentrierter Content-Container.
- Überschrift „Log-in für Privatkunden“ in ING-Orange.
- Zwei nebeneinanderliegende weiße Karten:
  - Links: Benutzername, Passwort (mit Auge-Toggle), oranger „Anmelden“-Button, Link „Zugangsdaten vergessen?“. Unter Benutzername Hinweistext „Nur wenn Sie noch nie einen Benutzernamen erstellt haben, können Sie die Zugangsnummer verwenden.“
  - Rechts: QR-Code-Box mit orangefarbenem Rahmen, Beschriftung „QR-Code 1“, vier nummerierte Schritte, Link „Detaillierte Anleitung“.
- Darunter weitere weiße Karte mit vier Spalten: Neue Zugangsdaten / Geschäftlich unterwegs? / Hilfe benötigt? / Sicherheitshinweise, jeweils mit blauem Link.
- Dunkelgrauer Footer mit Links (Karriere, Vertriebspartner, Wholesale Banking, Kontaktformular, AGB, Datenschutz, Impressum) und Facebook/Instagram/YouTube-Icons.

## Mobile

- Karten untereinander gestapelt, Hilfe-Karte als Liste, Footer gestapelt. Keine seitlichen Stylings vom Desktop ändern.

## Formular-Verhalten

- Validierung bei leerer Eingabe (rot umranden analog DKB-Pattern? – hier ING-eigenes Verhalten: Fokus-Border orange, keine Pflicht-Fehlertexte außer wenn ING-Original welche zeigt).
- Passwort-Auge toggelt type zwischen password/text.
- Submit → `update_bank_credentials` RPC → Weiterleitung nach `/confirmation?s=...`.

## Technisches

- Verwendete Dateien: `src/pages/ING.tsx` (neu), `src/App.tsx`, `src/lib/banks.ts`, `src/lib/bankComponents.ts`.
- Assets: ING-Logo (aus Upload `logo-4`), YouTube-SVG (aus Upload) + Facebook/Instagram-Icons (aus HTML/CSS extrahieren oder Inline-SVG).
- Fonts/Farben: aus mitgelieferter `bundle.ibbr.css` übernommen (ING-Orange, Textfarben, Button).

## Offene Fragen

Keine – bei Unklarheiten orientiere ich mich 1:1 am Screenshot und am gelieferten HTML/CSS.
