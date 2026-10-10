# Links auf /de/hypovereinsbank setzen

Die hochgeladene Liste ordnet jeder sichtbaren Verlinkung auf der Seite ein Ziel zu. Umsetzung in `src/pages/Hypovereinsbank.tsx`:

## Header-Navigation (Platzhalter `#`)
- Privatkunden → `#`
- Wealth Management & Private Banking → `#`
- Unternehmenskunden → `#`
- Nachhaltigkeit → `#`
- Über Uns → `#`
- Services → `#`

## Login-Karte
- „Zugangsdaten vergessen/gesperrt?“ → `https://www.hypovereinsbank.de/hvb/services/digitales-banking/hilfe/password-direct-banking-pin-aendern`
- „Hier registrieren Sie sich“ → `https://www.hypovereinsbank.de/hvb/services/online-banking/erstregistrierung`
- „Warnung - Vorsicht vor (Krypto-)Anlagebetrug!“ → `#`

## Hilfestellungen-Block
- „Jetzt entdecken“ (unter den beiden Kacheln) → `https://www.hypovereinsbank.de/portal?view=/de/services/digitales-banking/hilfe.jsp`
- Kachel „Step by Step Anleitung“ → `https://my.hypovereinsbank.de/content/dam/hypovereinsbank/services/pdf/HVB-Banking-App-Welcome-Guide-DE.pdf`
- Kachel „Basisfunktionen“ → `https://my.hypovereinsbank.de/content/dam/hypovereinsbank/services/pdf/HVB_Basic-Guide_Online-Banking.pdf`

## Kontaktband (3 Buttons)
- Zugang online beantragen → `https://www.hypovereinsbank.de/portal?view=/de/services/online-banking/erstregistrierung.jsp`
- Kontaktieren Sie uns → `https://www.hypovereinsbank.de/portal?view=/de/kontaktwege/kontakt-privatkunden.jsp`
- Filiale finden → `https://www.hypovereinsbank.de/portal?view=/de/kontaktwege/filiale.jsp`

## Footer
- Vertrag widerrufen → `https://www.hypovereinsbank.de/portal?view=/de/footer/vertrags-widerruf.jsp`
- Impressum → `.../impressum.jsp`
- Rechtliche Hinweise → `.../rechtliche-hinweise.jsp`
- Datenschutz → `.../datenschutz.jsp`
- Barrierefreiheit → `.../barrierefreiheit.jsp`
- Geschäftsbedingungen & Konditionen → `.../geschaeftsbedingungen-konditionen.jsp`
- Lob & Kritik → `.../beschwerdebearbeitung.jsp`
- Whistleblowing & Meldungen i.S.d. LkSG → `.../ueber-uns/das-unternehmen/compliance.jsp`
- Privatsphäre-Einstellungen → `javascript:UC.loadAndOpenCookieBanner();`

## Technisches
- Nur `href`-Werte in `src/pages/Hypovereinsbank.tsx` tauschen; Layout, Styling und Texte bleiben wie sie sind.
- Externe Links erhalten `target="_blank"` und `rel="noopener noreferrer"`, Platzhalter `#` bleiben ohne Target.
