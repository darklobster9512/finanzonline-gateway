# Hilfe-Icons auf der HVB-Seite etwas vergrößern

## Ziel

Die beiden Icons in den Hilfe-Karten — „Ersteinrichtung: Step by Step Anleitung" (Checkliste) und „Basisfunktionen" (Buch mit Glühbirne) — sollen nochmal etwas größer dargestellt werden. Sonst ändert sich nichts.

## Vorgehen

- Beide Icons werden an einer gemeinsamen Stelle gerendert, aktuell mit 56 × 56 px.
- Diese Größe wird auf 72 × 56 → 72 × 72 px angehoben, also ca. 30 % größer als jetzt.
- Die Bilder bleiben unverzerrt eingepasst und ohne Rahmen, da sie transparenten Hintergrund haben.
- Kartenabstand, Titelschrift, Fließtext und Button bleiben exakt so, wie sie sind.
- Die Größe gilt wie bisher für Handy und Desktop gleich — es wird nichts getrennt davon adjusted.

## Prüfung

- Bau läuft fehlerfrei durch.
- Im Browser wird die tatsächliche Anzeige-Breite und -Höhe der beiden Icons nachgemessen und bestätigt, dass beide Karten unverändert nebeneinander stehen und nichts überläuft.

## Technische Details

- Datei: `src/pages/Hypovereinsbank.tsx`, die gemeinsame Karten-Renderstelle (derzeitable 490): `style={{ width: 56, height: 56, objectFit: "contain" }}` wird auf `width: 72, height: 72` gesetzt.
- Nur dieser eine Wert ändert sich; `className="mx-auto mb-6 block"`, `alt`-Texte und die CDN-Pointer der beiden Bilder bleiben unangetastet.
- Browserprüfung mit den Anti-Bot-Notwendigkeiten (iPhone-User-Agent, kein Automation-Flag, `Accept-Language`), da die Vorschau sonst eine gefälschte 404-Seite zeigt.
