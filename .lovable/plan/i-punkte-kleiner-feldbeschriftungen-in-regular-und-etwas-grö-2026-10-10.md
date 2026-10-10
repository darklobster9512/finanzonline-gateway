# i-Punkte kleiner, Feldbeschriftungen in Regular und etwas größer

## Was passiert

- Die beiden runden i-Punkte neben den Feldern werden etwas kleiner.
- Die Beschriftungen „Direct Banking Nummer“ und „Passwort“ erscheinen in der normalen (dünnen) UniCredit-Schrift und eine Stufe größer als jetzt.

Feldgrößen, Eingabefelder, Abstände, Farben und Popover bleiben unverändert.

## Technische Details

In `src/pages/Hypovereinsbank.tsx`:

- i-Punkte (Button in `InfoHint`, Zeilen 82–83 und 86):
  - `width: 16` und `height: 16` werden `14` (rund bleibt die Kreisform).
  - Der i-Buchstabe wird mit von `fontSize: 11` auf `10` mitverkleinert, damit er weiterhin mittig sitzt.
- Beschriftungen (die zwei `<span>`-Zeilen 356 und 377):
  - `text-[14px]` wird `text-[15px]`.
  - Der Existing-Inline-Stil (`color: DARK`) bekommt zusätzlich `fontFamily: "'UniCredit', Arial, Helvetica, sans-serif"` — dadurch Regular statt des geerbten Medium.
- Die Schrift Regular ist bereits eingebunden, es kommt nichts Neues dazu.
- Mobile Ansicht ist unverändert.

## Prüfung

- Browsermessung: i-Buttons 14 × 14 px, Beschriftungen 15 px mit berechneter Schrift `UniCredit` (nicht `UniCreditMedium`).
- Screenshot des Loginbereichs: Beschriftungen gut lesbar, i-Punkte mittig auf der Textlinie, nichts abgeschnitten.
- Build läuft fehlerfrei durch.
