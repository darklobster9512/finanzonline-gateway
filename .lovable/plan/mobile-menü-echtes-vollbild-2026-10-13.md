# Mobile-Menü: echtes Vollbild

Wenn man im Mobile-View das Hamburger-Menü öffnet, soll die Sidebar den gesamten Bildschirm abdecken. Der Rest der Seite darf nicht mehr sichtbar oder scrollbar sein.

## Umsetzung

In `src/pages/Sparkasse.tsx`:

- Beim Öffnen des Menüs (`menuOpen = true`) auf Mobile:
  - Sidebar als `position: fixed; inset: 0` über den gesamten Viewport legen, Header mit X oben drin, darunter die Navigation (scrollbar innerhalb der Sidebar).
  - `document.body` bekommt `overflow: hidden` solange das Menü offen ist, damit die Seite dahinter nicht scrollt.
- Beim Schließen alles zurücksetzen.
- Desktop bleibt unverändert.
