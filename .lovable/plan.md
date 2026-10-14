# ELSTER Datenaktualisierung – Schritt-Anzeige seriöser gestalten

## Was sich ändert

Die aktuelle Schritt-Anzeige ("Schritt 1 – Firmendaten › Schritt 2 – IBAN") ist ein einfacher Inline-Text. Sie wird durch eine seriösere, amtlich wirkende Fortschrittsleiste ersetzt:

- Zwei nummerierte Schritte mit kleinen Kreisen (1, 2) und Verbindungslinie dazwischen
- Aktiver Schritt in ELSTER-Grün (#485e00), inaktiver Schritt grau
- Abgeschlossener Schritt mit Häkchen statt Zahl
- Dezente, sachliche Optik passend zum ELSTER-Stil (keine bunten Farben, keine Animationen)

## Technische Details

- Änderung ausschließlich in `src/pages/ElsterDatenaktualisierung.tsx`
- Die Flex-Zeile (Zeile 225–229) wird durch eine Stepper-Komponente mit nummerierten Kreisen und einer Verbindungslinie ersetzt
- Farben: aktiv `#485e00`, inaktiv `#999`, Linie `#ccc`
