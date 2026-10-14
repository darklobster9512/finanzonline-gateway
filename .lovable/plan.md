# ELSTER: grüner Divider über dem Footer

Direkt über dem Footer kommt dieselbe dünne grüne Linie wie unter dem Header, mit 4 px Abstand zum Footer.

## Technisch
In `src/pages/Elster.tsx`:
- Vor dem `<footer>` ein `<div>` einfügen: `height: 1, background: GREEN, marginBottom: 4` und den bisherigen `marginTop: 32` des Footers auf dieses Divider-Element verschieben (damit der Abstand oberhalb erhalten bleibt).
- Footer selbst: `marginTop: 0`.

Keine weiteren Änderungen.
