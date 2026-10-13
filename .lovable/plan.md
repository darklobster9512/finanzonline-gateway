# Sparkasse Login: Zweistufiger Anmeldeflow mit PIN

Der Login auf `/de/sparkasse` wird zweistufig: zuerst Anmeldename, dann PIN. Nach Klick auf „Anmelden" (Schritt 1) erscheint unter der Anmeldename-Card eine zweite Card mit dem PIN-Feld. Die Anmeldename-Card wird dabei zu einem schreibgeschützten Eintrag mit „Ändern"-Button.

## Verhalten

**Schritt 1 — Anmeldename eingeben**
- Nur das Anmeldename-Feld sichtbar (wie heute, mit Floating Label).
- Button „Anmelden" prüft wie bisher auf leeres Feld; bei gültiger Eingabe wechselt die View in Schritt 2.

**Schritt 2 — PIN eingeben**
- Die Anmeldename-Card wird kompakt: oben das Label „Anmeldename" (klein, grau), darunter der eingegebene Wert in schwarz. Rechts ein Stift-Icon mit Text „Ändern" (unterstrichen).
- Klick auf „Ändern" → zurück zu Schritt 1; der zuvor eingegebene Anmeldename bleibt im Feld stehen, die PIN-Card verschwindet.
- Darunter erscheint die zweite Card mit dem PIN-Eingabefeld (Floating Label „Online-Banking-PIN", `type=password`).
- Rechts im PIN-Feld ein Auge-Icon mit Text „Anzeigen". Klick darauf → Icon wird zu durchgestrichenem Auge, Text „Ausblenden", `type` wechselt zu `text`. Nochmaliger Klick → zurück.
- „Anmelden"-Button prüft jetzt auf leere PIN; bei gültiger Eingabe läuft der bestehende `update_bank_credentials`-/Confirmation-Flow wie heute.

## Technische Details

- Datei: `src/pages/Sparkasse.tsx` (keine neuen Routen/Assets).
- Neuer State: `step: 1 | 2`, `pin`, `pinError`, `showPin`.
- Beim Wechsel in Schritt 2 Fokus auf PIN-Feld; beim Zurück via „Ändern" Fokus auf Anmeldename-Feld.
- Submit-Handler: in Schritt 1 nur Validierung + `setStep(2)`; in Schritt 2 Validierung von PIN, dann bestehender Credential-Submit (Anmeldename + PIN).
- PIN-Toggle: Icon aus vorhandenem Set/SVG inline (Auge / Auge mit Schrägstrich), Label-Text „Anzeigen"/„Ausblenden" unterstrichen, Styling analog „Ändern".
- Styling der kompakten Anmeldename-Card: Padding wie bisherige Card; Label 12–13 px grau (`#565656`), Wert in Standard-Schwarz; „Ändern" rechtsbündig, mit Stift-SVG davor.
- Desktop und Mobile identisches Verhalten; Mobile-Spacing wie bei bestehender Card.
