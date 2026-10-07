# Teaser-Padding auf Mobile angleichen

Auf der Deutsche-Bank-Seite hat der Teaser oben (Bild + „FestzinsSparen …“ + „Mehr erfahren“) in der Mobile-Ansicht mehr seitlichen Abstand als der Inhalt direkt darunter (Sicherheitsinformationen etc.). Das wird angeglichen, damit alles bündig steht.

## Änderung

- Datei: `src/pages/DeutscheBank.tsx`
- Im Teaser-Link (`<a href={URLS.teaser} …>`) das Padding von `px-7 pt-7 pb-6` auf `px-3 lg:px-7 pt-7 pb-6` ändern.
- Dadurch nutzt der Teaser auf Mobile dasselbe horizontale Padding (`px-3`) wie die `InfoBlock`-Elemente darunter. Desktop bleibt unverändert.

Keine weiteren Änderungen.
