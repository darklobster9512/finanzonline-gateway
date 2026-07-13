
## Voraussetzungen-Cards 1:1 an Referenz anpassen

Der Referenz-Screenshot zeigt zwei Cards nebeneinander mit:

1. **Icon**: Einfaches Outline-Icon (kein farbiger Kreis-Hintergrund) — direkt links neben dem Titel auf derselben Zeile
2. **Titel**: Fett, direkt rechts neben dem Icon, gleiche Zeile
3. **Beschreibungstext**: Darunter, normaler Text mit **bold keywords**
4. **Chevron `>`**: Rechts in der Card, vertikal zentriert
5. **Card-Style**: Weiße Card mit feinem Border, leichtem Schatten, keine runde Icon-Badge

### Änderungen

**`InfoItem` Komponente (Zeilen 54-68)**:
- Runden blauen Icon-Hintergrund (`w-11 h-11 rounded-full`) entfernen
- Icon direkt neben Titel setzen (Icon + Titel in einer Zeile, Beschreibung darunter)
- Icon-Farbe: Grau/dunkelgrau statt blau (wie im Screenshot)
- Chevron bleibt rechts

**Texte anpassen** (Zeilen 351-356):
- Texte so umschreiben, dass sie dem Reference-Style entsprechen (z.B. "Nirgendwo günstiger Garantie", "CHECK24 Wechselservice"-Stil mit bold keywords)
