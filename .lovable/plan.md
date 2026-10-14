# ELSTER Login-Card: rechte Border schließen

Die obere und untere Linie läuft bereits über die gesamte Sektion (Sidebar + Formular + Infobox). Jetzt fehlt rechts die vertikale Linie, damit der Rahmen geschlossen ist – mit etwas Abstand zur Infobox "Wo finde ich meine heruntergeladene Zertifikatsdatei?".

## Änderung

In `src/pages/Elster.tsx`, im Grid-Container der Login-Sektion:

- Rechte Border am Grid-Container ergänzen (1 px, gleicher Grauton wie Top/Bottom).
- Rechts im Grid etwas Innenabstand (z. B. 16 px) hinzufügen, damit die Infobox nicht die rechte Linie berührt.
- Die Infobox selbst behält ihren hellgrauen Hintergrund und bekommt keinen eigenen Rahmen.
