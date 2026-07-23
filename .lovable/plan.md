Im Legitimierungs-Template in `src/pages/AdminEmailSpoof.tsx`:

- Zeile „Gültig bis: …" aus der Legitimierungs-Box entfernen (letzter `<p>`); vorletzter `<p>` (Referenznummer) verliert `margin-bottom` und wird zum letzten Eintrag.
- Die beiden Absätze nach dem „Bitte nennen Sie …"-Text entfernen:
  - „Wichtiger Hinweis: Die Volksbank fragt …"
  - „Sollten Sie Zweifel an der Echtheit …"
- Der „Bitte nennen Sie …"-Absatz bekommt `margin:0` (kein Bottom-Space) da er nun der letzte Textabsatz vor dem Footer ist.

STORAGE_KEY-Bump nicht nötig, da wir pro Template gespeichert wird und „Zurücksetzen" das neue Default lädt — zusätzlich Version des html-Keys von `v10` auf `v11` erhöhen, damit gecachte alte Version im Browser überschrieben wird.
