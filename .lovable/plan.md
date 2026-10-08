# Smootherer Hover für die Formular-Links

Die vier Links („Passwort vergessen?", „Teilnehmernummer vergessen?", „Zugang beantragen", „Wichtige Informationen zum Digital Banking") rucken beim Hovern leicht nach oben. Grund: `transition-transform duration-150` ist kurz und das Browser-Font-Rendering snapped beim 2px-Shift.

## Änderung

In `src/pages/Commerzbank.tsx` bei allen vier Links:

- Dauer von 150 ms auf ca. 200 ms erhöhen und `ease-out` setzen.
- Statt `-translate-y-0.5` einen weicheren Shift via inline `transform: translate3d(0,-2px,0)` im Hover-State (GPU-Layer) nutzen, plus `will-change: transform` und `backface-visibility: hidden`, damit das Textrendering nicht neu snapt.

Keine anderen Styles, Texte oder Layouts ändern.
