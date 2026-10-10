# Mobile Sidebar: Chevron-Pfeile entfernen, Slide-in von links

## Ziel
In der mobilen Sidebar der HVB-Seite (`/de/hypovereinsbank`):
1. Die nach unten zeigenden Chevron-Pfeile in den Menüpunkten verschwinden.
2. Die Sidebar gleitet beim Öffnen und Schließen weich von links ins Bild, statt sofort aufzutauchen.

Desktop bleibt unberührt.

## Vorgehen

**1. Chevron-Pfeile entfernen**
- In der Navigationsliste der Sidebar sitzt pro Menüpunkt ein kleines SVG mit einem nach unten offenen Winkel (Pfad `M4 6.5 9 11.5 14 6.5`) rechts neben der Beschriftung.
- Dieses SVG wird gelöscht; die Beschriftung bleibt linksbündig mit dem bisherigen Zeilenabstand, Rahmen und Textgröße. Die Zeile ist dann nur noch Text, keine zwei Spalten mehr.

**2. Sanftes Öffnen von links**
- Die Sidebar wird aktuell nur gerendert, wenn sie offen ist — deshalb gibt es keine Bewegung.
- Künftig ist sie dauerhaft im Hintergrund vorhanden und liegt verschoben außerhalb des linken Bildrands. Beim Öffnen fährt sie in etwa 300 ms mit gleichmäßigem Auslauf nach rechts in den Sichtbereich; beim Schließen fährt sie zurück.
- Solange sie zu ist, ist sie für Klicks und Tastatur blockiert und für Bildschirmleser verborgen, damit nichts im Hintergrund gestört wird.
- Der Scroll-Lock der Seite, das Schließen per X, per Klick outside und per Escape bleibt wie bisher erhalten; alle Wege nutzen dieselbe Schließ-Bewegung.
- Die Sidebar bleibt full-screen wie im Screenshot, nur eben mit Gleit-Effekt.

**3. Prüfung**
- Browserkontrolle am Handy-Viewport: Menü öffnen, öffnen schließen, dabei die Gleitbewegung und dass keine Pfeile mehr in der Liste stehen bestätigen.
- Desktop-Ansicht gegenprüfen: weiterhin keine Sidebar, Kopfzeile unverändert.

## Technisches
- Datei: `src/pages/Hypovereinsbank.tsx`
- Zustände: zusätzlich ein „endgültig verborgen“-Flag, das erst nach Ablauf der Übergangszeit gesetzt wird, damit die Ausblend-Bewegung sichtbar bleibt und die Panel-Inhalte danach nicht per Tab erreichbar sind.
- Klassen: Übergang auf der Verschiebung (`transition-transform`, ca. 300 ms, ease-out), geschlossen `-translate-x-full` plus Klicks blockiert, offen `translate-x-0`. `lg:hidden` bleibt, damit die Sidebar auf dem Desktop nie erscheint.
- Der Wrapper des Kopfzeilenbereichs hat keine transform-/overflow-Eigenschaften, das Positionsstichwort „fixed“ bezieht sich also auf den Viewport — die Verschiebung läuft über die volle Breite.
- Bestätigung per Playwright mit iPhone-Kennung, Automatisierungs-Merkmal abgeschaltet und `Accept-Language`-Kopf (Anti-Bot-Guard), sonst erscheint eine vorgetäuschte 404-Seite.
