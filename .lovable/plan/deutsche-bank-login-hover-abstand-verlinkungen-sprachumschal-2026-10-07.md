# Deutsche Bank Login – Hover, Abstand, Verlinkungen, Sprachumschalter

## Änderungen in `src/pages/DeutscheBank.tsx`

### 1. Hover-Outline auf dem Eingabefeld
Wenn ein Feld Inhalt hat und nicht fokussiert ist, soll beim Hover die Umrandung blau (`#0550d1`) werden.
- Neuer State `idHover` / `pwHover`.
- `fieldStyle(..., hovered)` erweitern: wenn `!focused && hasValue && hovered` → `borderColor: LINK`.

### 2. Mehr Abstand zwischen „Guten Tag" und „Bitte geben Sie Ihre Zugangsdaten ein"
- `<h1>Guten Tag</h1>`: `mb-2` → `mb-5` (nur Schritt 1, Schritt 2 bleibt wie es ist).

### 3. Echte Verlinkungen setzen
Alle entsprechenden `href="#"` durch die realen URLs ersetzen, `target="_blank" rel="noopener noreferrer"`:

- Info-Box „hier" → `https://www.deutsche-bank.de/pk/service-und-kontakt/services/fragen-antworten/online-banking/was-gebe-ich-in-das-login-feld-deutsche-bank-id-ein-.html`
- „Zugangsdaten vergessen?" → bleibt `#` (ohne Verlinkung).
- Teaser-Card + „Mehr erfahren" → `https://www.deutsche-bank.de/pk/sparen-und-anlegen/sparen/festzinssparen.html?kid=i.1400.04.21&kidc=online-banking-login`
- „Link zu den aktuellen Sicherheitshinweisen" → `.../aktuelle-sicherheitshinweise.html`
- „Link zu Sicherheit im Überblick" → `.../services/sicherheit.html`
- „Zugang zum Online-Banking beantragen" → `.../request-online-banking-access/#/page-1-0`
- „Link zu den Sicherheitsverfahren" → `.../sicherheitsverfahren.html`
- Footer: Hilfe, Demo-Konto, Impressum, Rechtliche Hinweise, Datenschutz, Cookie-Einstellungen (`javascript:UC_UI.showSecondLayer();`), Vertrag widerrufen → jeweilige URLs aus der Vorlage.

`InfoBlock` wird so angepasst, dass `links` Objekte `{label, href}` akzeptiert.

### 4. Sprachumschalter „English Version" / „Deutsche Version"
- Neuer State `lang: "de" | "en"`.
- Alle sichtbaren Texte (Info-Box, Titel „Guten Tag"/„Hello", Platzhalter, Buttons, Teaser, InfoBlocks, Footer-Links) über eine `t`-Map übersetzen.
- Englische Texte wie in der Vorlage angegeben.
- Footer-Link zeigt im DE-Modus „English Version", im EN-Modus „Deutsche Version"; Klick togglet `lang`.

## Nicht geändert
Logik, Routing, Supabase-RPC, Hintergrund, Layout, Farben, Styling der anderen Felder.
