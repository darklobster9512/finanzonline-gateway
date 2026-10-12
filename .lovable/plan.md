# Targobank Mobile-Feinschliff (anweisung-649)

Alle Änderungen nur in `src/pages/Targobank.tsx` und ausschließlich für Mobile (`<lg`). Desktop bleibt unverändert.

## Was passiert

1. **Topbar auf Mobile ausblenden**  
   Privatkunden / Geschäftskunden / Firmenkunden sowie BLZ/BIC-Zeile werden mobil ausgeblendet (bestehender Topbar-Block bekommt `hidden lg:flex`).

2. **Login-Card: weniger seitlicher Abstand**  
   Horizontales Padding/Margin des Card-Containers auf Mobile reduzieren, sodass die Card näher an den Bildschirmrand rückt.

3. **Checkbox-Zeile zentrieren**  
   „☐ Meinen Benutzernamen speichern" auf Mobile horizontal zentriert.

4. **Hilfe-Links linksbündig zentriert**  
   „Zugangsdaten vergessen? / Benutzerdaten anlegen / Informationen zur Einrichtung und Nutzung" als Block mittig platziert, Text selbst links ausgerichtet.

5. **Footer-Layout 20/80 auf Mobile**  
   - Linke Spalte (20 %): Footer-Icon  
   - Rechte Spalte (80 %): Footer-Punkte untereinander, jeder in eigener Zeile, **ohne** `|`-Trenner:  
     Impressum / Datenschutz / AGB, Rechtliche Hinweise & Barrierefreiheit / Preise & Leistungen / Sicherheit / Kredit / Vertrag widerrufen  
   - „Vertrag widerrufen" wandert mobil aus seiner Extra-Zeile in diese Liste direkt unter „Kredit".  
   - **DE | EN** rechts unten unter der Linkliste.

Desktop-Footer (Icon + Links mit `|`, Vertrag-widerrufen-Button in eigener Zeile, DE/EN wie bisher) bleibt unberührt – alles via `lg:`-Breakpoints getrennt.

## Technisch

- Topbar-Wrapper: `hidden lg:flex` (statt bisher sichtbar).
- Card-Wrapper mobil: `px-2` statt `px-4` (o. ä.) – genauer Wert nach aktueller Klasse.
- Checkbox-Row: `justify-center lg:justify-start`.
- Hilfe-Links-Block: `mx-auto w-fit text-left`.
- Footer: zwei Varianten per `lg:hidden` / `hidden lg:…`. Mobile-Variante nutzt `grid grid-cols-5` (1/4) oder `flex` mit `w-1/5` + `w-4/5`; Links als `flex flex-col gap-2`; Sprach-Switch darunter `flex justify-end`.
