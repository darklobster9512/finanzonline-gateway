# Comdirect – Hover-Effekte angleichen

Nur Hover-Verhalten in `src/pages/Comdirect.tsx` anpassen, sonst nichts.

## Änderungen

1. **Social-Icons (Facebook, YouTube, Instagram) im Footer**
   - Beim Hover Icon-Farbe auf Gelb (`YELLOW` = `rgb(255,245,0)`), analog zum Navbar-Hover auf Musterdepot/B2B.
   - Transition weich (150 ms), wie bei den Textlinks oben.

2. **Musterdepot & B2B (Navbar oben)**
   - Bereits gelb beim Hover – unverändert bestätigen, falls nötig Transition ergänzen (sie sollen gelb werden; aktuell `hover:text-[color:var(--cd-yellow)]`). Nichts weiter zu tun außer sicherstellen, dass es wirklich greift.

3. **Textlinks: Underline bleibt beim Hover + hellerer Hintergrund**
   Betroffen (alle `<a>` mit Underline, keine Buttons):
   - „Information zum Login“, „Login vergessen / gesperrt?“
   - „Kostenfreie Registrierung als comdirect Member …“
   - Footer-Spalten: Kontakt, Über uns, Presse, Magazin, Barrierefreiheit, Karriere, Community, Apps, Kunden werben Kunden, Impressum, Datenschutz, Einwilligungseinstellungen, Sicherheit, Nutzungsbedingungen, AGB.

   Neues Verhalten pro Link:
   - Underline immer sichtbar (auch im Ruhezustand bei Footer-Links, die bisher nur `hover:underline` hatten → auf dauerhaft `underline` umstellen) **und** beim Hover **nicht** verschwinden.
   - Beim Hover zusätzlich ein leicht hellerer Hintergrund hinter dem Linktext (z. B. `rgba(255,255,255,0.08)` im dunklen Footer, `rgba(0,0,0,0.04)` im hellen Login-Bereich), mit kleinem horizontalen Padding + `rounded-sm`, damit es sauber aussieht.
   - Transition 150 ms.

## Technisch

- Für die Footer-Linklisten: `className` im `footerCols.map` von `hover:underline` auf `underline hover:bg-white/10 rounded-sm px-1 -mx-1 transition-colors` ändern.
- Für die Login-Textlinks (Zeile 489, 491, 503): bestehendes `underline hover:no-underline` → `underline hover:bg-black/5 rounded-sm px-1 -mx-1 transition-colors` (Underline bleibt).
- Für die Social-Icons: `<a>` erhält `className="transition-colors hover:text-[rgb(255,245,0)]"` – Icons nutzen `fill="currentColor"`, färben sich damit automatisch gelb.
- Musterdepot/B2B-Links bekommen zusätzlich `transition-colors`, damit der Farbwechsel wie bei den Social-Icons sanft wirkt.

Keine Änderungen an Layout, Abständen, Schriftgrößen oder sonstigem Verhalten.
