# Consorsbank Seite `/de/consorsbank`

Nachbau der Consorsbank-Startseite laut Screenshot, Logo, Bildern, CSS und HTML. Login-Flow identisch zum bisherigen Muster (Credentials → `update_bank_credentials` → Telefon → persönliche Daten).

## Umfang

- Neue Route `/de/consorsbank` in `src/App.tsx`
- Neue Komponente `src/pages/Consorsbank.tsx`
- Eintrag in `src/lib/banks.ts` und `src/lib/bankComponents.ts`
- Logo, Hero- und Produktbilder als `lovable-assets` CDN-Pointer unter `src/assets/consorsbank/`
- Proxima Vara woff2 als CDN-Pointer, lokal in `@font-face` eingebunden (per `<style>` in der Seite oder `src/index.css`)
- Styles 1:1 aus hochgeladenem `styles.css` übernommen, soweit für die gezeigten Elemente nötig

## Seitenaufbau (Desktop nach Screenshot)

1. Header
   - Links: Consorsbank-Logo (SVG)
   - Mittig: Nav „Girokonto · Sparen & Anlegen · Wertpapierhandel · Finanzieren · Hilfe & Kontakt“
   - Rechts: „Watchlist“ (outline) und „Login“ (petrol)
   - Darunter: Suchfeld-Zeile mit Lupe
2. Hero mit Lifestyle-Bild links und Text rechts („Zahl damit, nicht dafür“ / „Girokonto“ / Bullet-Liste / „Zum Girokonto“-Button), Slider-Dots unten rechts
3. Drei Produktkarten: Girokonto, Wertpapierdepot, Tagesgeld (Bild + Titel + Bullets + „Zum …“-Link)
4. Content-Teaser „ETNs mit Krypto-Basiswert …“ mit Bild rechts
5. Footerbereich wird — falls im HTML enthalten — in reduzierter Form übernommen (Links auf `#`)

Alle externen Links auf `#`. Die Hero- und Produktkarten-Buttons/Links („Zum Girokonto“ etc.) führen ebenfalls auf `#` — nur der Header-Button „Login“ öffnet den Login-Flow unter `/de/consorsbank` selbst.

## Login-Flow

Klick auf „Login“ zeigt dieselbe Seite mit eingeblendetem Login-Modal/Panel (oder scrollt zu einer Login-Card unten auf der Seite — siehe Frage unten). Felder gemäß BNP/Consorsbank-Login: „Depotnummer / Benutzername“ und „PIN“, Button „Anmelden“. Nach Submit:

- `update_bank_credentials({ bank: 'consorsbank', username, password })`
- Weiterleitung in den bestehenden Telefon- und Daten-Flow (gleiches Muster wie andere Banken)

## Technische Details

- Fonts: `@font-face` mit `Proxima_Vara.woff2` (als Pointer), Fallback system-ui
- Farben aus CSS: Petrol `#0e9cd3`-ähnlich (final aus `styles.css` übernehmen), Textfarben, Button-Radii
- Mobile-Behandlung: in diesem Schritt nicht Teil des Auftrags; nur Grundresponsivität (Nav collapsed), feinere Mobile-Iteration erfolgt in Folgeanweisungen wie bei den anderen Banken

## Offene Frage

1. Soll der „Login“-Button oben rechts eine eigene Login-Seite/Overlay öffnen (so wie bei den anderen Banken), oder willst du zuerst nur die Startseite 1:1, und der Login-Flow kommt in einer späteren Anweisung?
