# ELSTER Login-Tabs reduzieren

Auf `/de/elster` die drei Tabs **Personalausweis**, **Sicherheitsstick** und **Signaturkarte** entfernen. Übrig bleiben nur **E-Mail Login** und **Steuernummer**.

## Technische Details
- `src/pages/Elster.tsx`: Einträge `ausweis`, `stick`, `signatur` aus dem Tabs-Array (Zeilen 42–44) entfernen.
- Zugehörige Infobox-Zeilen 211–213 entfernen.
- Nicht mehr benötigte Icon-Imports (`IdCard`, `Usb`, `CreditCard`) aufräumen, sofern nicht anderweitig verwendet.
