# HVB Header & Warnhinweis

Zwei kleine Anpassungen auf `/de/hypovereinsbank`:

1. **Banking-Login-Kachel im Header**: Beim Hovern wird der rote Hintergrund minimal dunkler. Textfarbe und Icon bleiben gleich.
2. **Warnhinweis**: Der Text „Warnung - Vorsicht vor (Krypto-)Anlagebetrug!“ bekommt eine Unterstreichung.

## Technisch

- `src/pages/Hypovereinsbank.tsx`: Hover-Hintergrund der Banking-Login-Kachel von aktuellem HVB-Rot auf einen leicht dunkleren Ton (ca. 6–8 % dunkler) setzen.
- Warntext-Element: `underline` ergänzen (Farbe/Weight unverändert).
