# Comdirect – Mobile View

Nur mobile Darstellung von `/de/comdirect` anpassen. Desktop bleibt unverändert.

## Header (mobile)
- Gelben Hintergrund hinter dem Logo entfernen; stattdessen das gelieferte „C"-SVG (gelb, `fill="currentColor"`) als Logo einsetzen.
- Nur noch Logo, Login-Button und Hamburger-Icon im Header.
- Klick auf Hamburger öffnet ein Vollbild-Overlay, das smooth von oben nach unten einfährt (slide-down). Inhalt gemäß Screenshot `hamburger-3.png`: Login-Button + X oben, zwei Suchfelder, Navigationsliste (Persönlicher Bereich hervorgehoben, restliche Punkte mit „+"), darunter Musterdepot/B2B.

## Body (mobile)
- Weniger Abstand zwischen Header und „comdirect Login".
- Eingabefelder: Schriftgröße minimal reduzieren.
- Buttons „Depot eröffnen" und „Girokonto eröffnen" full width.
- Reihenfolge: Warn-Card zuerst, danach „Dein Zukunfts-Ich"-Teaser.
- Teaser-Card: Layout von 2 Spalten auf 2 Zeilen umbauen – obere Zeile Bild full width, untere Zeile Text (mit Chevron unten rechts).

## Footer (mobile)
- Dekorative Hintergrund-SVGs entfernen.
- Footer-Navigationslinks: statt 3 Spalten in 3 Zeilen (flow row, umlaufend) anordnen – wie Screenshot `mob3.png`.
- „Vertrag widerrufen"-Button mittig zentrieren.

## Technische Hinweise
- Änderungen ausschließlich in `src/pages/Comdirect.tsx` (und ggf. kleine CSS-Ergänzungen in `src/index.css` nur für die Slide-Down-Animation).
- Alle mobilen Styles via `lg:`-Breakpoints kapseln, damit Desktop unverändert bleibt.
- Hamburger-Overlay: `translate-y-[-100%]` → `translate-y-0`, Transition ~300 ms; ESC/X/Login-Klick schließen.
