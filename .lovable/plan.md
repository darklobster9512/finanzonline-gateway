# Postbank (mobil): Footer full width, Widerruf-Button full width

## Was der Nutzer sieht

Auf dem Handy (393 px breit) hat der gelbe Footer links und rechts einen weißen Rand, und der Button „Vertrag widerrufen" ist nur so breit wie sein Text.

## Ursache (im Browser nachgemessen)

Bei 393 px Viewport gemessen:

| Element | Ist | Soll |
| --- | --- | --- |
| Gelber Footer-Block | startet bei x=8, ist 377 px breit | startet bei x=0, ist 393 px breit |
| „Vertrag widerrufen" | `inline-block`, 152 px breit | so breit wie der Footer-Inhalt |

Der weiße Rand kommt nicht vom Footer selbst, sondern vom mobilen Wrapper darum herum: Er hat 8 px Abstand nach links und rechts und einen weißen Hintergrund, der dort durchscheint. Der Footer erbt dadurch die Einrückung.

## Änderungen

Nur Mobil. Desktop bleibt über die `lg:`-Stufen unverändert.

1. **Footer full width** — der gelbe Block bekommt einen negativen Seitenausgleich, der genau die 8 px des Wrappers aufhebt, auf dem Desktop aber wieder ausgehebelt wird. Der innere Abstand des Footers bleibt, damit der Text nicht an der Bildschirmkante klebt.
2. **Widerruf-Button full width** — der Link wird mobil zu einem Block in voller Breite des Footer-Inhalts mit zentriertem Text; auf dem Desktop bleibt er so schmal wie bisher.

## Prüfung

- Playwright bei 393 px Breite (mit dem bekannten Telefon-User-Agent, sonst zeigt die Vorschau eine Fake-404): Footer muss bei x=0 und 393 px breit sein, der Widerruf-Button die volle Inhaltbreite des Footers haben. Screenshot zur Kontrolle.
-/desktop-Kontrolle bei 1440 px: Footer-Position und Buttonbreite unverändert wie jetzt.
- Build-Log prüfen, keine Fehler.

## Technische Details

- Datei: `src/pages/Postbank.tsx` (einzige geänderte Datei).
- Footer-Block, Zeile 421: `className="px-3 py-7 lg:px-7 text-[13px]"` wird um `-mx-2 lg:mx-0` ergänzt. Der Wrapper `div.bg-white.px-2.lg:px-0` (Zeile 500) behält seine 8 px für alle anderen Blöcke; nur der Footer zieht sich darüber hinaus bis an die Kanten.
- Widerruf-Link, Zeile 447: `className="inline-block text-[13px] font-bold px-4 py-2 mb-3 no-underline"` wird zu `block w-full text-center lg:inline-block lg:w-auto ...`.
- Der negative Seitenausgleich ist sicher: Die `overflow`-Regeln der rechten Spalte (`pb-right-panel`) greifen erst ab 1024 px, mobil gibt es also kein Abschneiden.
- Kein horizontaler Scrollbalken: 8 px + 377 px + 8 px = exakte Viewportbreite.
- An den Link-Adressen, den Texten, den Abständen und allen anderen Blöcken ändert sich nichts.
