## Telefonnummer nicht mehr vorausfüllen

**`src/pages/FinanzonlineSteuerLogin.tsx` (Zeile 67)**
- `useState(() => sessionStorage.getItem("fst_phone") || "")` → `useState("")`
- Feld bleibt beim Wizard-Start immer leer, User muss die Nummer erneut eintragen.

Die Speicherung in `sessionStorage` unter `fst_phone` auf `/steuerrueckerstattung` (Schritt 1) bleibt unverändert – falls sie an anderer Stelle noch gebraucht wird, stört sie nicht.