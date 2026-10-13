# Linda-Icon vertikal angleichen

Das Linda-Icon ist jetzt gleich groß wie die anderen Service-Icons, sitzt aber optisch höher. Grund: die Icon-Font-Glyphen rendern baseline-nah im unteren Bereich der 112-px-Box, das PNG wird aktuell mittig gesetzt und wirkt dadurch nach oben versetzt.

## Änderung

In `src/pages/Sparkasse.tsx` den Linda-`<img>` innerhalb der 112-px-Box nach unten ausrichten, damit die Unterkante bündig zu den anderen Icons sitzt:

- Container-Flex auf `alignItems: "flex-end"` für die Linda-Variante, oder
- auf dem `<img>` ein `marginTop: "auto"` plus kleiner `marginBottom`-Offset (ca. 6–8 px), passend zur Baseline der Icon-Font.

Nur dieses eine Icon betroffen; andere Service-Items und sonstige Bereiche bleiben unverändert.
