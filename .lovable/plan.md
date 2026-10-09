# Comdirect „Direkt zu"-Dropdown feinjustieren

Drei kleine Anpassungen am Dropdown in `src/pages/Comdirect.tsx`:

1. **Weniger Abstand zwischen den Einträgen** – `py-2.5` auf `py-1.5` reduzieren.
2. **Trennlinie** – gestrichelte Linie mit größerer Strichweite (dickere, längere Dashes) und schmalerer Gesamtbreite, sodass weniger, aber deutlichere Striche sichtbar sind. Umsetzung über `borderTop: "2px dashed"` und `width: 80px`.
3. **Lücke zum Eingabefeld entfernen** – beim Öffnen erzeugt der 2px-`box-shadow` optisch Platz unter dem Button. Panel mit `marginTop: -1px` direkt an die Button-Unterkante setzen und `box-shadow` beim geöffneten Zustand so anpassen, dass unten kein Outline-Ring sichtbar ist (nur Rahmen bleibt).

Sonst nichts ändern.
