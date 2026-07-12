## Ziel

Pro Domain (nur Panel-Typ **Klimabonus**) optional einen Meta-Tag Snippet (z.B. Facebook Pixel `<meta>` / `<script>`) hinterlegen. Nur wenn der aktuelle Host mit dieser Domain übereinstimmt UND der Toggle aktiv ist:
- Snippet wird auf der Klimabonus-Landingpage in den `<head>` injiziert.
- Der "Jetzt voranmelden"-Button feuert zusätzlich `fbq('track', 'Lead')`.

Standard: Alles aus. Kein Snippet erscheint, wenn Toggle aus oder Domain nicht übereinstimmt.

## Änderungen

### 1. Datenbank (Migration)
Zwei neue Spalten auf `public.panels`:
- `meta_tag_enabled boolean NOT NULL DEFAULT false`
- `meta_tag_snippet text` (nullable)

RLS-Policies bleiben wie sie sind (Admin-Verwaltung), plus: die bereits bestehende Read-Policy für `panels` muss auch diese Felder liefern, damit `PanelProvider` sie lesen kann.

### 2. `src/components/PanelProvider.tsx`
- Kontext um `metaTagEnabled: boolean` und `metaTagSnippet: string | null` erweitern.
- Beim Laden zusätzlich `meta_tag_enabled, meta_tag_snippet` aus `panels` selecten.
- Nur wenn `matched && meta_tag_enabled && snippet` vorhanden ist, werden diese Felder gesetzt. Sonst leer.

### 3. Snippet-Injection (nur Klimabonus)
In `src/pages/Klimabonus.tsx`:
- `usePanel()` benutzen. Wenn `type === "klimabonus"` UND `matched` UND `metaTagEnabled` UND Snippet vorhanden:
  - In einem `useEffect` das Snippet in `document.head` injizieren (via temporärem Container, das HTML wird geparst und `<script>`/`<meta>`/`<noscript>` Nodes in den Head verschoben — Scripts werden manuell neu erzeugt, damit sie ausgeführt werden). Beim Unmount wieder entfernen.
- Anders: nichts einbauen.

### 4. `fbq('track', 'Lead')` beim CTA
`CtaButton` in `Klimabonus.tsx`:
- Vor dem `navigate(...)` prüfen: wenn Pixel aktiv (siehe oben) UND `window.fbq` existiert → `window.fbq('track', 'Lead')` aufrufen.
- Sonst nur navigieren. Kein hartkodiertes Pixel-Script auf anderen Seiten.

### 5. `src/pages/AdminPanels.tsx` – neue Spalte "Meta Tag"
In der Panels-Tabelle eine weitere Spalte:
- **Toggle** (shadcn `Switch`) — aktiviert / deaktiviert Meta Tag für diese Domain.
  - Bei Änderung: `UPDATE panels SET meta_tag_enabled = ...`.
- **Button "Snippet bearbeiten"** — erscheint nur wenn Toggle an ist. Öffnet einen Dialog mit `Textarea` für das HTML-Snippet.
  - Speichern → `UPDATE panels SET meta_tag_snippet = ...`.
- Sichtbar für alle Panel-Typen in der Liste, aber die Injection wirkt aktuell NUR beim Klimabonus. Optional: den Toggle nur für `type === "klimabonus"` aktiv anzeigen (sonst deaktiviert mit Tooltip "nur Klimabonus"). → Wähle Variante: **nur bei Klimabonus aktivierbar**, damit klar bleibt.

### 6. Kein globales Pixel
Wichtig: Weder `index.html` noch `LandingSwitch` noch andere Panels bekommen das Snippet. Injection läuft ausschließlich innerhalb `Klimabonus.tsx`, nachdem `PanelProvider` bestätigt hat, dass die Host-Domain matcht.

## Domain-Match-Regel (nochmal explizit)
Snippet und `fbq`-Call sind nur aktiv wenn ALLE erfüllt:
1. `PanelProvider.matched === true` (Host = ein Eintrag in `panels`)
2. Der gematchte Panel-Eintrag hat `type === 'klimabonus'`
3. `meta_tag_enabled === true` für genau diesen Panel-Eintrag
4. `meta_tag_snippet` ist nicht leer

Fehlt eine Bedingung → keinerlei Änderung am DOM, kein `fbq`-Aufruf.

## Ergebnis
- `/admin/panels`: neue Spalte mit Toggle + Bearbeiten-Button + Dialog.
- Klimabonus-Landingpage lädt Pixel nur auf der konfigurierten Domain.
- CTA-Button feuert `fbq('track','Lead')` nur unter denselben Bedingungen.
