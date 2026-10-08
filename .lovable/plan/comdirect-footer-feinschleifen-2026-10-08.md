# Comdirect-Footer feinschleifen

Alle Änderungen nur in `src/pages/Comdirect.tsx`.

## Was angepasst wird

1. **Hintergrund-SVGs kleiner und näher an den Inhalt**
   - Container der `FooterShape` begrenzen (nicht `inset-0`), z. B. absolut unten über volle Breite mit reduzierter Höhe (`h-[180px]`), sodass die Kreise/der Ring kleiner wirken und näher am Footer-Content sitzen.

2. **Drei Linkspalten kleiner und enger**
   - Spaltentext von `text-[14px]` auf `text-[13px]`.
   - Zeilenabstand von `space-y-3` auf `space-y-2`.
   - Spaltenabstand `gap-x-10` → `gap-x-6`.

3. **"Vertrag widerrufen" exakt an derselben linken Linie wie das comdirect-Logo**
   - Untere Zeile aus 3-Spalten-Grid herauslösen: Button in denselben äußeren Container packen, bündig links beginnen (gleiche Startkante wie Logo, kein zusätzliches Padding).

4. **Social-Icons bündig mit der breitesten Linkspalte (rechts)**
   - Social-Icons rechts auf dieselbe Endkante bringen wie die letzte (dritte) Linkspalte. Konkret: untere Reihe als Grid mit identischen Spalten wie oben (`[auto_1fr_1fr_1fr]`), Button in Spalte 1, Copyright zentriert über Spalten 2–3, Social-Icons rechtsbündig in Spalte 4 — damit enden sie auf derselben Linie wie der längste Text der Spalte darüber.

## Technische Hinweise

- Keine neuen Dateien, keine neuen Abhängigkeiten.
- Nur Markup/Klassen im Footer-Block zwischen `<footer>` und `</footer>`.
- Build-Check über die üblichen Observability-Logs; kein neuer visueller Flow nötig.
