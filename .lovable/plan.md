## Hero splitten – Bild links, Content rechts

1. Bild `c24200.png` als Lovable-Asset hochladen → `src/assets/c24200.png.asset.json`.
2. In `src/pages/Check24.tsx` die Hero-Section auf ein 2-Spalten-Grid (`md:grid-cols-2`, `gap-8`, `items-center`) umstellen:
   - **Links**: `<img>` mit `c24200.png` (Höhe passt zum Content, `object-contain`, mit Drop-Shadow für Lesbarkeit auf blauem BG).
   - **Rechts**: bestehender Content (Headline, Untertitel, Countdown, CTA, SSL-Hinweis) — Text-Ausrichtung von `text-center` auf `md:text-left` (mobil bleibt zentriert und Bild stapelt oben).
3. Header + gemeinsamer Background bleiben unverändert. Keine anderen Sections betroffen.
