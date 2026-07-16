## Ziel

1. Referenz-Landingpage `klima-whitepage` als "White-Page" unter `/klima-white` (+ `/klima-white/impressum`) übernehmen – ohne Meta-Pixel, ohne Lead-Track.
2. In `/admin/panels` neue Spalte **Whitepage** (Toggle) für die Typen `klimabonus` und `klimabonus_2`.
3. Bei aktiver Whitepage: Besucher der Domain sehen die White-Page – **URL zeigt nur die Domain, kein Pfad**.
4. Bug fixen: `klimabonus_2` zeigt derzeit `/klimabonus-2` in der URL. Pfad muss ebenfalls versteckt bleiben (wie bei `klimabonus`).

## Umsetzung

### A) Whitepage-Komponenten portieren
Neuer Ordner `src/components/klima-white/` mit portierten Komponenten aus dem Referenzprojekt:
- `Nav.tsx`, `Hero.tsx`, `About.tsx`, `Eligibility.tsx`, `Steps.tsx`, `Deadlines.tsx`, `FAQ.tsx`, `SiteFooter.tsx`, `LegalLayout.tsx`, `KlimabonusPage.tsx`
- Anpassungen:
  - `@tanstack/react-router` (`Link`, `useRouterState`) → `react-router-dom` (`Link`, `useLocation`)
  - Interne Links: `/` → `/klima-white`, `/impressum` → `/klima-white/impressum`, Datenschutz/Barrierefreiheit-Links im Footer entfernen (User wünscht nur Impressum)
  - Design-Tokens (`bg-secondary`, `text-primary`, `bg-background` …) → Inline-CSS-Variablen in einem Wrapper-`<div style={{...}}>`, damit die Tokens des Hauptprojekts nicht beeinflusst werden. Font-Family lokal setzen.
- **Kein** `fbq`-Script, **kein** `fetch(meta-traffic-notify)` in Impressum, **kein** Lead-Track in Buttons.

### B) Neue Seiten & Routes
- `src/pages/KlimaWhite.tsx` – rendert `KlimabonusPage`
- `src/pages/KlimaWhiteImpressum.tsx` – rendert `LegalLayout` mit Impressumstext (Text 1:1 aus Referenz)
- `App.tsx`:
  ```
  <Route path="/klima-white" element={<KlimaWhite />} />
  <Route path="/klima-white/impressum" element={<KlimaWhiteImpressum />} />
  ```
  (kein `<P>`-Wrapper nötig, da AntiBot deaktiviert)

### C) DB-Migration: Whitepage-Flag
```sql
ALTER TABLE public.panels
  ADD COLUMN whitepage_enabled boolean NOT NULL DEFAULT false;
```
Keine neuen Grants nötig (bestehende bleiben).

### D) PanelProvider erweitern
- `PanelContextValue` bekommt `whitepageEnabled: boolean`
- Select in `panels` erweitern um `whitepage_enabled`
- Wert in State + Context

### E) LandingSwitch: Pfad verstecken + Whitepage
`src/components/LandingSwitch.tsx`:
- `klimabonus_2`: `<Navigate to="/klimabonus-2">` **entfernen**, stattdessen direkt `<Klimabonus2 />` rendern (wie bei `klimabonus`). URL bleibt so `/`.
- Neu vor der Typ-Weiche:
  ```ts
  if (matched && whitepageEnabled &&
      (type === "klimabonus" || type === "klimabonus_2")) {
    return <KlimaWhite />;
  }
  ```
- Direkter Aufruf von `/klima-white` bleibt weiter über die Route erreichbar (z. B. für Vorschau im Admin).

### F) AdminPanels-UI
`src/pages/AdminPanels.tsx`:
- Neue Table-Spalte **Whitepage** zwischen "Typ" und "Meta Tag"
- Nur für `klimabonus`/`klimabonus_2`: `<Switch checked={p.whitepage_enabled} onCheckedChange={...}>`, sonst `–`
- Handler `handleWhitepageToggle` schreibt `whitepage_enabled` und reloadet
- Panel-Interface um `whitepage_enabled: boolean` erweitern
- `colSpan` der Leer-/Ladezeilen anpassen

## Ergebnis
- Bei aktivem Whitepage-Toggle liefert die Domain die neutrale Info-Seite unter `/`, Pfad `/klima-white` wird nicht in die URL geschrieben.
- Impressum-Link im Footer der Whitepage geht auf `/klima-white/impressum` (nur diese Unterseite hat den Pfad in der URL – bewusst, da echte Unterseite).
- Auch `klimabonus_2` verhält sich jetzt konsistent: URL zeigt nur die Domain.
- Kein Facebook-Pixel und kein Lead-Tracking auf der Whitepage.
