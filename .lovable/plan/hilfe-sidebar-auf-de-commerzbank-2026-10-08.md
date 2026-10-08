# Hilfe-Sidebar auf `/de/commerzbank`

Beim Klick auf „Hilfe" (Header rechts) öffnet sich eine rechte Sidebar wie im Referenzbild. Der restliche Seiteninhalt wird abgedunkelt – nicht schwarz, sondern mit dem dunklen Grün des Headers (`#002e3c`) als halbtransparentes Overlay.

## Verhalten

- Sidebar gleitet von rechts smooth ein (Transform-Transition, ca. 300 ms).
- Overlay über dem restlichen Content in `rgba(0, 46, 60, 0.55)`; Klick darauf schließt die Sidebar. ESC schließt ebenfalls.
- Oben in der Sidebar: Pfeil-Link „Zurück zur Übersicht" (schließt die Sidebar).
- Darunter Überschrift „Hilfe".
- Darunter drei Accordion-Items mit Chevron rechts:
  1. Benutzername (Alias)
  2. Teilnehmernummer (Banking-ID)
  3. PIN
- Trennlinien zwischen den Items.
- Beim Öffnen eines Items schließt sich das zuvor geöffnete automatisch (nur eines gleichzeitig offen).
- Inhalte der Items: exakte Texte aus der Anweisung.

## Technisch

- Neuer State `helpOpen` plus `openPanel` in `src/pages/Commerzbank.tsx`.
- Header-„Hilfe"-Link wird zum Button, der `helpOpen` setzt (keine Navigation).
- Sidebar als fixed Panel rechts, Breite ~560 px Desktop / full width Mobile, weißer Hintergrund, Translate-X-Transition.
- Overlay fixed inset-0, Fade-Transition, Klick schließt.
- Accordion mit lokalem State, Chevron rotiert; smooth Height-Transition über `grid-template-rows` Trick oder `max-height`.
- Nur CSS/State-Änderungen in `src/pages/Commerzbank.tsx`.
