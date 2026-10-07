# Rechte Spalte /de/deutsche-bank aufräumen

Nur `src/pages/DeutscheBank.tsx`.

1. **Mehr Padding in der rechten Card**: InfoBlock und Teaser-Links von `px-5 py-4` / `px-5 pt-5 pb-4` auf `px-7 py-6` erhöhen; Footer-Block von `px-5 py-5` auf `px-7 py-7`.
2. **Icon-Farbe** der drei Blöcke (Sicherheitshinweise, Online-Banking Zugang, Unsere Sicherheitsverfahren) auf `#171945` setzen (statt BLUE).
3. **Linkgröße zurücksetzen**: Alle `text-[6.8px]` Vorkommen (Teaser „Mehr erfahren", InfoBlock-Links, Footer-Links, „Zugangsdaten vergessen?") auf `text-[13px]` erhöhen – lesbare Standardgröße wie in der Referenz.
