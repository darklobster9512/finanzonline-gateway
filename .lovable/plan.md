# Fix Copy-Button + Text kürzen

In `src/pages/AdminDomains.tsx` (XMR-Wallet-Block):

1. **Copy-Fehler beheben**: `navigator.clipboard.writeText` schlägt in iframes/ohne HTTPS oft fehl. Fallback über verstecktes `<textarea>` + `document.execCommand("copy")` hinzufügen. Reihenfolge: erst Clipboard-API versuchen, bei Fehler oder wenn nicht verfügbar → Textarea-Fallback. Nur bei Fehlschlag beider Wege den Error-Toast zeigen.
2. **Textänderung**: Satz „Andere Kryptowährungen gehen verloren." entfernen, sodass nur noch „Nur Monero (XMR) Einzahlungen werden akzeptiert." steht.
