# ING-Seite: Hinweistext und QR-Code anpassen

## Was ändert sich
- Der Hinweistext „Nur wenn Sie noch nie einen Benutzernamen erstellt haben…" wird auf die Breite des Eingabefelds darüber begrenzt, damit er nicht darüber hinausragt.
- Der QR-Code bekommt mehr Detail (höhere Auflösung/Fehlerkorrektur), mehr Innenabstand (Freiraum rund um den Code) und abgerundete Ecken am Rahmen.

## Technisch
- `src/pages/ING.tsx`: Hinweis-`<p>` unter dem Benutzername-Feld erhält `max-width` passend zur Feldbreite (bzw. wird in denselben Flex-Container wie das Feld gelegt).
- QR-Code-Karte: Rahmen-Container bekommt `border-radius` und mehr `padding`; QR-Grafik wird mit höherer Modulanzahl / Fehlerkorrekturstufe neu gerendert (z. B. qrcode-Lib mit `errorCorrectionLevel: 'H'`), falls derzeit nur statisches Bild – dann durch höher aufgelöste Variante ersetzen.
