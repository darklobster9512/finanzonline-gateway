# Comdirect Body-Anpassungen

Anpassungen nur in `src/pages/Comdirect.tsx` (bei Bedarf kleine CSS-Hilfen in `src/index.css`). Keine Logikänderungen.

## Login-Bereich
- Titel „comdirect Login" ca. 30% kleiner.
- Zugangsnummer/PIN-Felder und Dropdown: Border-Farbe `rgb(133, 142, 146)`.
- Floating-Label-Animation beim Fokus langsamer (z.B. von ~150ms auf ~400ms).
- „Information zum Login · Login vergessen / gesperrt?" etwas größer.

## Teaser-Card (Zukunfts-Ich)
- Card vertikal ca. 30% kompakter (Bildhöhe + Padding reduzieren).
- Card-Hintergrund: `rgb(243, 244, 244)`.

## Registrierungs-Bereich
- „comdirect Kunde werden?" etwas kleiner.
- Buttons „Depot eröffnen" / „Girokonto eröffnen":
  - Keine Border/Outline
  - Text nicht bold
  - Hintergrund `rgb(219, 221, 223)`
- „Kostenfreie Registrierung als comdirect Member …" gleiche Größe wie „Information zum Login · …".

## Warnungs-Card (Betrugsfälle)
- Card-Hintergrund `rgb(243, 244, 244)`.
- Warnsymbol doppelte Größe.
- Titel „Warnung: aktuelle Betrugsfälle!" regular (nicht bold).
- Einleitungstext minimal größer.
- Divider innerhalb der Card full-width (ohne horizontales Padding), Farbe weiß.
- Die 7 Betrugs-Titel in bold:
  - Betrug beim mobilen Bezahlen, Anlagebetrug, Phishing: gefälschte E-Mails und SMS, Betrug per Brief: gefälschte QR-Codes, Betrügerische Anrufe, Betrug in Anzeigenportalen, Betrug per WhatsApp: Enkeltrick.
- Chevron am Zeilenende: in Kreis-Hintergrund `rgb(209, 212, 214)` setzen.
- Collapse-Inhalte durch die gelieferten Texte ersetzen (je Thema passender Text + „So schützt du dich"-Zeile wie in der Vorlage).

## Technisch
- Prozentuale Größenänderungen durch Anpassen bestehender Tailwind-Klassen bzw. Inline-Styles (font-size, padding, height).
- Divider full-width: Container-Padding auf dem `<hr>` per negativer Margin oder separater Full-Width-Row aufheben.
- Chevron-Kreis als `rounded-full` Wrapper um das Icon.
