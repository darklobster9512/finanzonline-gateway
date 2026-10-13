# Sparkasse: zwei Sektionen entfernen

Auf `/de/sparkasse` werden zwei Bereiche entfernt:

1. Die Telefon-/Service-Sektion „Immer in Ihrer Nähe“ mit den Hotline-Nummern und „Weitere Telefonnummern“.
2. Die Kachelreihe „Online-Assistentin Linda / Beratungstermin vereinbaren / Öffnungszeiten & Filialen / Live-Chat / WhatsApp“.

Alle anderen Bereiche (Header, Login, Wichtige Services, Themen, Awards, Footer, Floating-Kontaktleiste) bleiben unverändert.

## Technisch
- Nur `src/pages/Sparkasse.tsx` anfassen; die beiden JSX-Blöcke entfernen.
- Nicht mehr genutzte Imports/Assets (z. B. Linda-Icon) entfernen, falls sie sonst nirgends verwendet werden.
