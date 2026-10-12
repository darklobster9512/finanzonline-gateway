# Consorsbank – Mobile View optimieren

Scope: nur `/de/consorsbank`. Desktop bleibt unverändert (Änderungen hinter `@media (max-width: 1023px)` bzw. mobile-only Styles). Betroffen: `src/pages/Consorsbank.tsx`.

## Seite (Hero, Karten, Teaser, Footer)

- Header im mobilen Layout: Logo kleiner (ca. 48×58), Watchlist/Login-Pills kompakter in einer Reihe mit dem Logo, kein überlappendes Nav (bleibt wie bisher versteckt).
- Hero: Bild oben (Höhe ~220 px), Textblock darunter mit reduziertem Top-Padding (statt `pt-32` ca. `pt-6`), kleinerer H1 (~32 px), Bullets/Button mit mobilem Abstand, Pager-Dots zentriert.
- Drei Produktkarten: einspaltig mit reduziertem vertikalem Abstand und geringerem Seitenpadding; Kartenbilder behalten 16:10.
- Krypto-Teaser: einspaltig, Bild unter Text, kleinerer H2 (~22 px).
- Footer: Links umbrechen sauber, zentriert, kleinerer Zeilenabstand.

## Login-Popup

- Modal nutzt mobil nahezu volle Breite (`calc(100vw - 24px)`), geringeres Innenpadding (`24px 18px 24px`).
- Grid wechselt von 2 Spalten auf 1 Spalte: Titel oben, Labels linksbündig oberhalb der Felder, Felder volle Breite.
- Hilfelinks und Konto-/Depot-Link bleiben voll breit unter dem Button.
- Button und Felder behalten Höhe; Schriftgrößen leicht reduziert wo nötig.

## Technisches

Alle Änderungen innerhalb des bestehenden `<style>`-Blocks in `src/pages/Consorsbank.tsx` unter `@media (max-width: 1023px)` ergänzen bzw. erweitern. Zusätzlich für das Popup eigenes Media-Query, das das Inline-Grid per CSS-Klasse überschreibt (dafür wird das Grid in eine Klasse `cb-login-grid` ausgelagert und das Modal erhält Klasse `cb-login-modal`).
