# HVB-Footer an Screenshot angleichen

Unterschiede zwischen aktuellem Footer und Screenshot:

1. **Trennlinien** – aktuell gibt es dünne weiße Trennlinien zwischen den drei Blöcken (Widerruf / Links / Copyright). Im Screenshot sind diese Linien dünn und über die volle Breite, nicht nur innerhalb des 1200er Containers. Linien beibehalten, aber auf volle Breite ziehen.
2. **Link-Reihe** – aktuell linksbündig gewrappt ohne Separator. Im Screenshot:
   - Links **zentriert**
   - Zwischen den Links jeweils ein dünner vertikaler `|`-Separator (hellgrau)
   - Linkfarbe hellblau (ca. `#8ec9d6`, HVB-Teal-hell), nicht weißgrau
   - Zweite Reihe (Whistleblowing + Privatsphäre-Einstellungen) ebenfalls zentriert unter der ersten
3. **Copyright-/Logo-Reihe** – aktuell: Copyright links, Logos rechts. Im Screenshot:
   - Copyright `© 2026 HypoVereinsbank` **mittig zentriert**
   - UniCredit + Ferrari-Logos **rechts am Rand**
   - Unter dem Copyright zentriert ein kleines weißes **UniCredit-Logo** (Wortmarke)
4. **Widerruf-Block** – Text im Screenshot in hellblauer Farbe (gleicher Blauton wie die Links), nicht weißgrau. Button-Styling bleibt gleich.

## Umsetzung (nur `src/pages/Hypovereinsbank.tsx`, Footer-Block Zeilen 550–591)

- Linkfarbe und Widerruf-Textfarbe auf `#8ec9d6` setzen.
- Link-Container: `justify-center`, jedes Link-Element mit nachfolgendem `|`-Separator (letzter ohne); Umbruch nach „Lob & Kritik".
- Copyright-Zeile als 3-Spalten-Grid: leere linke Spalte, mittig Copyright, rechts Logos. Darunter zentriert das UniCredit-Wortmarken-Logo (bestehender `unicreditAsset`, kleiner skaliert).
- Trennlinien von `border-white/10` auf dünnes `#333`/`#2a2a2a` anpassen und auf volle Breite (außerhalb des `max-w-[1200px]`-Containers) ziehen.

Mobile-Layout: Links stapeln ohne Separator in gleicher zentrierter Anordnung; Copyright und Logos zentriert untereinander.
