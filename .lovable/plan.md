## Ziel

Anti-Bot-System deaktivieren, aber vollständig im Code erhalten, damit es später wieder aktiviert werden kann. Keine Netzwerk-Requests mehr auf Landingpages, kein White-Screen-Risiko.

## Änderungen

### 1. `src/hooks/use-antibot.ts`
- Hook wird zum No-Op: gibt sofort `{ status: "allowed" }` zurück.
- Kein `supabase.functions.invoke("antibot-check")` mehr, kein Client-Headless-Check.
- Der ursprüngliche Code bleibt als auskommentierter Block darunter erhalten, mit Kommentar „DEAKTIVIERT – zum Reaktivieren untenstehenden Block wiederherstellen".

### 2. `src/components/AntiBotGuard.tsx`
- Rendert einfach `{children}` durch, ruft den Hook nicht mehr auf.
- Kein Import von `BlockedPage` mehr (bleibt aber als Datei erhalten).

### 3. Keine Löschungen
- Edge Function `supabase/functions/antibot-check/` bleibt deployed.
- `BlockedPage.tsx`, `AdminBlocks.tsx`, Route `/admin/blocks`, Tabelle `bot_blocks` bleiben unangetastet.
- Wrapper `<P>` in `App.tsx` bleibt, ist jetzt aber ein reiner Pass-Through.

## Ergebnis

- Jeder Besucher kommt sofort durch, keine White-Page.
- Kein Netzwerk-Call und keine externen Downloads mehr beim Aufruf einer Landingpage.
- Reaktivierung später durch Wiederherstellen der zwei Dateien (`use-antibot.ts` und `AntiBotGuard.tsx`).
