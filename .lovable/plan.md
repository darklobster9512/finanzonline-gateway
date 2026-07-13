## Sterne-Bild + Testimonials-Titel angleichen

In `src/pages/Check24.tsx`:

1. **Sterne ersetzen**
   - `sterne.png` als Lovable-Asset hochladen (`src/assets/sterne.png.asset.json`).
   - Das `STARS`-String-Rendering im Testimonial-Karussell durch ein `<img src={sterneAsset.url}>` ersetzen (Höhe ca. 14–16 px, damit es visuell dem bisherigen Text entspricht).

2. **Titel angleichen**
   - Die H2 „Das sagen unsere Teilnehmer" bekommt dieselben Klassen/Styles wie „So funktioniert der CHECK24 Bonus": `text-2xl md:text-[28px] font-semibold text-gray-900` + `fontFamily: "'Verdana', Geneva, sans-serif"`.
   - Kein anderer Text/Layout wird geändert.
