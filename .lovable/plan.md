# ELSTER Mobile Header-Logo entzerren

Im mobilen Header von `/de/elster` wird das Logo verzerrt dargestellt, weil es als Flex-Item horizontal zusammengestaucht wird, während die Höhe bei 44 px bleibt.

## Änderung

- `src/pages/Elster.tsx`, Zeile 101: dem Header-`<img>` zusätzlich `flexShrink: 0` und `objectFit: "contain"` geben, damit die Breite nicht gestaucht wird und das Seitenverhältnis erhalten bleibt.
- Keine weiteren Änderungen (Desktop bleibt visuell identisch, Mobile-Menü-Overlay bleibt unberührt).
