# Comdirect Footer – „Vertrag widerrufen" Button anpassen

Änderungen am Button in der Footer-Zusatzzeile (`src/pages/Comdirect.tsx`):

1. **Linksbündig zum Logo**: Button startet exakt auf der vertikalen Linie des comdirect-Logos darüber (also ganz links in seiner Spalte, nicht mehr zentriert).
2. **Kleinerer Text**: Fontgröße leicht reduzieren (13px → 12px).
3. **Schmaler/flacher**: Button-Höhe reduzieren (h-10 → h-8, Padding entsprechend).
4. **Einheitlicher Chevron**: Das aktuelle `›` durch den dünnen SVG-Chevron ersetzen, der auch bei „Anmelden", Teaser, „Depot eröffnen" etc. verwendet wird.

Nur dieser Button ändert sich – Copyright und Social-Icons bleiben unverändert.
