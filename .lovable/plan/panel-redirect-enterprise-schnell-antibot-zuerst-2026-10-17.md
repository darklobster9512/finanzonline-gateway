# Panel-Redirect enterprise-schnell + Antibot zuerst

## Was heute langsam ist

- `PanelProvider` ruft **sequenziell** zwei Supabase-Queries ab (`panels` → danach `panel_type_settings`) und blockiert bis beide fertig sind. Favicon-Query hat mit dem Redirect nichts zu tun.
- `AntiBotGuard` rendert bislang sofort und prüft nur im Hintergrund – d. h. der Redirect kann aktuell **vor** der Antibot-Entscheidung passieren. Soll nicht sein.
- `antibot-check` Edge Function macht einen DB-Insert für `page_visits` auch im Allowed-Pfad – das verzögert die Antwort unnötig.

## Zielablauf

Beim Aufruf einer Panel-Domain parallel starten:

```text
    boot
     ├── panels?domain=…           (holt type → Redirect-Pfad)
     └── antibot-check              (allowed? ja/nein)
          ↓ beide fertig
     redirect auf Panel-Pfad   (nur wenn allowed)
     ↓
     Favicon/Meta-Tags im Hintergrund nachladen
```

Ziel: unter ~1 s auf gesunder Verbindung, kein unnötiges Blockieren.

## Änderungen

1. **`src/components/PanelProvider.tsx`**
   - `ready` wird gesetzt, sobald die `panels`-Query durch ist – **nicht** mehr auf `panel_type_settings` warten.
   - `panel_type_settings`-Fetch läuft entkoppelt (eigener Promise-Chain, kein `await` im Haupt-Flow).
   - Weißer Spinner bleibt nur für die eine Query sichtbar.

2. **`src/components/AntiBotGuard.tsx` / `src/hooks/use-antibot.ts`**
   - Guard rendert `null` solange `status === "checking"` (statt sofort Kinder zu zeigen). Damit kann der Redirect erst nach Antibot-OK stattfinden.
   - Timeout von 4000 ms auf **1200 ms** reduzieren; läuft er ab, `fail open` wie bisher.
   - Client-Headless-Signal läuft weiter synchron (0 ms).

3. **`supabase/functions/antibot-check/index.ts`**
   - Antwort sofort schicken, `page_visits`-Insert per `EdgeRuntime.waitUntil(...)` im Hintergrund (reduziert Response-Zeit um einen DB-Roundtrip).
   - `check_ip_blocked`-RPC bleibt (ein Roundtrip, günstig).

Nichts an Routen, DB-Schema oder anderen Seiten.

## Erwartung

Erster Aufruf einer Panel-Domain: Antibot ~200–500 ms, `panels`-Query parallel ~100–300 ms. Redirect in ~0.5–1 s nach Antibot-OK. Favicon kommt kurz danach ohne spürbaren Flash.
