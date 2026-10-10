# HVB „Sie haben eine Frage?“ Sektion anpassen

Nur die Kontakt-Sektion in `src/pages/Hypovereinsbank.tsx` ändern. Rest der Seite bleibt wie er ist.

## Änderungen

1. **Hintergrundfarbe** der Sektion von aktuellem `TEAL` auf `#007a91` umstellen.
2. **Vertikales Padding** verringern: `py-14` → `py-8`, damit weniger Freiraum oben/unten.
3. **Telefon-Icon größer** und in 2-Spalten-Layout:
   - Spalte 1: Telefonhörer (ca. 56–60px).
   - Spalte 2 (2 Zeilen): Telefonnummer oben, Öffnungszeiten darunter.
   - Block horizontal zentriert.
4. **Chevron hinter der Telefonnummer**: Höhe = Höhe der Zahl (also an die Zeilenhöhe/Fontgröße ~34px koppeln, nicht fix 24px).
5. **Buttons**: Position bleibt gleich, Border aber **2px** statt 1px (`border-2`), damit die Outline dicker wirkt.

## Technisches

- Datei: `src/pages/Hypovereinsbank.tsx`, Zeilen 513–546.
- `backgroundColor: TEAL` → `backgroundColor: "#007a91"`.
- Container `py-14` → `py-8`.
- Markup umbauen zu Flex-Row mit zwei Kindern: `<Phone size={60} ... />` und ein Container mit Nummer + Öffnungszeiten.
- Chevron: `size` auf die Zahlengröße setzen (34) oder per Icon-Styling an Zeilenhöhe anpassen.
- Buttons: `border` → `border-2` beibehalten der aktuellen Breiten/Paddings.
