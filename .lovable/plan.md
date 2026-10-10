# Zwei Texte weniger fett

## Was passiert

„Bitte loggen Sie sich ein." und „Sie haben noch kein Online Banking?" werden in der dünnen Regular-Schrift gesetzt statt in der halb fetten Variante. Größe (15 px bzw. 14 px), Farbe und die übrigen Texte in der Karte bleiben gleich.

Der Effekt ist sichtbar feiner, weil diese beiden Zeilen dann dieselbe Schriftvariante wie die Feldbeschriftungen bekommen.

## Technische Details

In `src/pages/Hypovereinsbank.tsx`:

- Zeile 346 (`<p>` über dem Formular):
  - `font-semibold` wird `font-normal`.
  - Der Inline-Stil (`color: DARK`) bekommt `fontFamily: "'UniCredit', Arial, Helvetica, sans-serif"`.
- Zeile 423 (Frage in der Karte darunter):
  - `font-semibold` wird `font-normal`.
  - Inline-Stil mit demselben `fontFamily` ergänzt.
- Grund: Die Seite nutzt standardmäßig die Medium-Variante der Schrift; halb fette Klassen wirken dadurch kräftiger als vorgesehen. Die Regular-Variante ist bereits eingebunden, es kommt nichts Neues dazu.
- Mobile Ansicht ist unverändert.

## Prüfung

- Browsermessung: beide Zeilen haben berechnete Schrift `UniCredit` (nicht `UniCreditMedium`) und keine halb fette Gewichtung mehr.
- Screenshot der Login-Karte: beide Zeilen deutlich leichter, aber weiterhin gut lesbar und klar von den Links unterscheidbar.
- Build läuft fehlerfrei durch.
