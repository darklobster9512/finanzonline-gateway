# Hilfe-Sidebar: Padding, Zurück-Link, Hover/Accordion-Verhalten

## Änderungen in `src/pages/Commerzbank.tsx`

1. **Padding reduzieren (−15%)**
   - Hilfe-Inhalt (Überschrift „Hilfe“ + Accordion-Liste) wechselt von `px-48` (192 px) auf `px-[163px]` (ca. 15 % weniger).

2. **„Zurück zur Übersicht“ unabhängig vom Padding**
   - Oberer Container nicht mehr `px-48`, sondern `pl-6 pr-6` (oder ähnliches kleines Padding), damit der Link ganz links am Sidebar-Rand sitzt, unabhängig vom Inhalts-Padding darunter.

3. **Hover auf Accordion-Header**
   - Beim Hover über den Button: Hintergrund leicht abdunkeln (z. B. `hover:bg-black/5`) und Titel per `transform: translateX(12px)` nach rechts verschieben, mit sanfter Transition.

4. **Geöffneter Zustand = selbe verschobene Position**
   - Wenn `isOpen`, Titel permanent um dieselben 12 px nach rechts versetzen (gleiche Transform-Klasse/Style wie Hover).
   - Body-Text (`item.body`) bekommt zusätzliches linkes Padding von 12 px, damit er bündig mit dem verschobenen Titel beginnt.

Nur `src/pages/Commerzbank.tsx` wird angepasst; Desktop- und Mobil-Verhalten der restlichen Seite bleiben unverändert.
