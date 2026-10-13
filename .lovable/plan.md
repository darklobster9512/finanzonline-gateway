# Warnsymbol als Dreieck

In den Fehlermeldungen unter den Login-Feldern wird das runde Warnsymbol durch ein Dreieck ersetzt.

## Technisch
- `src/pages/SpardaBankDe.tsx`: Import `AlertCircle` → `AlertTriangle`, beide Verwendungen (Zeile 121, 150) entsprechend tauschen.
