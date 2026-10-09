# Mobile Header: Login und Menü oben rechts

## Was sich ändert

- Der mobile Header bleibt so hoch, wie er jetzt ist (88 px) – daran wird nichts mehr gedreht.
- Das C-Logo behält Größe und aktuelle Position.
- Der Login-Button und das Menü-Zeichen rücken von der senkrechten Mitte nach **oben rechts** in die Ecke des Headers.
- Alles andere bleibt unverändert: Desktop-Ansicht, das Menü fährt weiterhin direkt unter dem Header auf, Suchfelder, Teaser, Footer.

## Technisch

- Datei: `src/pages/Comdirect.tsx`, mobile Header-Zeile (ca. Zeilen 469–495).
- Die Header-Zeile nutzt aktuell `flex items-center justify-between`; dadurch werden beide Kinder in den 88 px senkrecht zentriert.
- Die rechte Gruppe (`<div className="flex items-center gap-3">` mit Login und Menü-Button) bekommt `self-start`, damit nur diese beiden Elemente oben ausgerichtet werden. Das Eltern-Element behält `items-center`, dadurch bleibt das C-Logo an seiner jetzigen Position.
- Das vorhandene `py-3` liefert 12 px Abstand von oben und rechts, sodass die Elemente in der Ecke sitzen, ohne die Kante zu berühren.
- Prüfung: Build-Log sowie eine Messung im mobilen Viewport (393x852) – Oberkante Login-Button gegen Oberkante Header, Headerhöhe weiterhin 88 px, und das Menü öffnet weiterhin direkt darunter.
