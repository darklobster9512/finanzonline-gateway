## Changes to `src/pages/Check24.tsx`

### 1. Category cards — add URLs and wrap in `<a>` tags
Each of the 6 category cards gets a `href`:
- Hotels entdecken → https://hotel.check24.at/
- Stromtarife vergleichen → https://www.check24.at/strom
- Ferienwohnung buchen → https://ferienwohnung.check24.at/
- Handytarife vergleichen → https://www.check24.at/handytarife
- Steuer gratis erledigen → https://www.check24.at/baufinanzierung
- Finanzprodukte vergleichen → https://www.check24.at/kredit

### 2. Hero text
Line 408: Change `für alle Kunden – Neu- und Bestandskunden` to `für alle Neu- und Bestandskunden`

### 3. Footer links — replace all `href="#"` with real URLs
- Unternehmen → https://www.check24.at/unternehmen/ueber-uns
- Neuigkeiten → https://www.check24.at/news
- Karriere → https://jobs.check24.de/de/standorte/wien1/
- Spanien → https://www.check24.es/
- Deutschland → https://www.check24.de/
- Hilfe und Kontakt → https://www.check24.at/unternehmen/kontakt/
- CHECK24 App → https://www.check24.at/app/
- CHECK24 Smily Punkte → https://kundenbereich.check24.at/
- Vertrag widerrufen → https://www.check24.at/vertrag-widerrufen
- AGB → https://www.check24.at/popup/agb
- Datenschutz → https://www.check24.at/popup/datenschutz
- Impressum → https://www.check24.at/unternehmen/impressum

### 4. Social media icons — real URLs
- Facebook → https://www.facebook.com/share/18nC33EG35/?locale=de_DE
- YouTube → https://www.youtube.com/@check24at
- Instagram → https://instagram.com/check24.at
- TikTok → https://www.tiktok.com/@check24.at

All external links get `target="_blank" rel="noopener noreferrer"`.
