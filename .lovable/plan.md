## Telefonnummer nicht mehr als Submission speichern

**`src/pages/FinanzonlineSteuer.tsx`**
- `handleSubmit` (Z. 52–74): den `supabase.from("submissions").insert(...)` Aufruf entfernen. Statt DB-Insert nur `setStage("loading")` triggern (Ladeanimation + Ergebnis wie bisher). Keine Telefonnummer wird beim Check gespeichert.
- Fehlerbehandlung/Alert entfällt entsprechend.
- `sessionStorage.setItem("fst_phone", phone)` beim „Jetzt einfordern"-Button (Z. 191) bleibt erhalten, damit im Wizard nichts kaputtgeht — der Wizard nutzt es aktuell aber ohnehin nicht mehr (leeres Feld). Alternativ: auch das entfernen.

Ergebnis: Die Telefonnummer aus der Anspruchsprüfung wird nirgends in `submissions` geschrieben. Erst wenn der User im Wizard (`/steuerrueckerstattung/login`) seine Daten inklusive Telefonnummer eingibt, wird gespeichert.