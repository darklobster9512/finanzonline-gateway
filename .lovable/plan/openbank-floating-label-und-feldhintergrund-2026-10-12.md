# Openbank: Floating-Label und Feldhintergrund

Zwei kleine Anpassungen in `src/pages/Openbank.tsx`:

1. Floating Label etwas weiter nach oben an den Feldrand setzen und minimal größer machen (`top: 6px`, `font-size: 11px` im Aktivzustand).
2. Grauer Feldhintergrund verschwindet wieder, sobald das Eingabefeld den Fokus verliert — auch wenn Text drinsteht. Dafür wird die Regel `.ob-field.is-filled .ob-input { background: #F3F3F3 }` entfernt; nur `.ob-input:focus` behält den grauen Hintergrund.

Keine weiteren Änderungen.
