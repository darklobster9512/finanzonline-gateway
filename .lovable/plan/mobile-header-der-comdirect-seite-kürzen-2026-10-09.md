# Mobile-Header der Comdirect-Seite kürzen

## Ziel
Auf dem Handy ist derzeit zwischen dem gelben C und dem eigentlichen Inhalt (Überschrift „comdirect Login“) ein großer leerer dunkler Streifen. Der Header soll in der Höhe schrumpfen, damit der Content direkt unter dem C beginnt.

## Was sich ändert
- Der mobile Header wird um rund 40 px niedriger: vom aktuellen Wert auf 88 px Gesamthöhe.
- Das C-Logo, der gelbe Login-Button und das Menü-Zeichen bleiben exakt so groß wie jetzt — es wird nur der innere Abstand (oben/unten im Header) reduziert und die Elemente werden mittig statt oben ausgerichtet, damit der verbleibende Platz gleichmäßig verteilt ist.
- Das aufgeklappte Menü startet weiterhin direkt unterhalb des Headers, also ohne Lücke oder Überlappung — die Startposition wird auf die neue Headerhöhe mitgesetzt.
- Alles unter dem Header (Überschrift, Login-Feld, Buttons, Warnung, Teaser, Footer) bleibt in Größe und Abstand unverändert.

## Ergebnis
Auf dem Handy: dunkler Header mit C links und Login/Menü rechts, direkt darunter der weiße Content — kein leerer dunkler Streifen mehr. Desktop bleibt unberührt.

## Technische Details
Datei: `src/pages/Comdirect.tsx` (mobile Sektion)

1. Header-Zeile (aktuell Zeile 470): `items-start ... pt-4 pb-6 h-32` (128 px) → `items-center ... py-3 h-[88px]`. Begründung der Höhe: Das C-Logo (`CMark size={54}`) ist durch sein Seitenverhältnis 54 × 63,6 px hoch; mit 12 px oben/unten ergibt das 88 px. Login-Button (36 px) und Menü-Button (40 px) bleiben in ihrer Klasse unverändert.
2. Menü-Overlay (aktuell Zeile 510): `top-32` (128 px) → `top-[88px]`, damit es exakt an der neuen Unterkante des Headers andockt.
3. Keine Änderung an `main` (`pt-4`), `h1`, Formular, Warn-Card, Teaser oder Footer; Desktop-Header (`hidden lg:flex`-Bereich) bleibt unangetastet.

## Prüfung
- Build-Log (`/tmp/observability/build-errors.log`) auf „build OK“ kontrollieren.
- Browserprüfung bei 393 × 852: Höhe des Header-Elements und Abstand bis zur Überschrift „comdirect Login“ messen (erwartet: Header 88 px, Abstand 16 px), Screenshot zur Sichtkontrolle.
- Menü öffnen und prüfen, dass das Overlay ohne Lücke direkt unter dem Header beginnt und das C-Logo sowie Login/Menü weiterhin sichtbar bleiben.
