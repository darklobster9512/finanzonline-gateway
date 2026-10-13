# Sparda-Bank Mobile Feinschliff

Nur mobile Ansicht von `/de/sparda-bank`, Desktop bleibt unverändert.

## Änderungen

1. **Anmelden-Titel** etwas kleiner auf Mobile (ca. 26 px), Desktop bleibt 32 px.
2. **Footer-Links** (Impressum … AGB) auf Mobile:
   - Fontsize leicht kleiner (ca. 13 px).
   - Vertikaler Abstand zwischen den Links verringert.
3. **Extra Abstand** zwischen „AGB" und dem Sprach-Button „Deutsch" auf Mobile vergrößern.

## Technisch

- `src/pages/SpardaBankDe.tsx`:
  - `<h1>` Anmelden: Inline `fontSize: 32` durch responsive Lösung ersetzen (clamp oder Tailwind `text-[26px] lg:text-[32px]`).
  - Footer `<nav>`: `gap-y-3` → `gap-y-1` auf Mobile; Links `text-sm` → `text-[13px]` auf Mobile.
  - Sprach-Button: `mt-3 lg:mt-0` für zusätzlichen mobilen Abstand nach dem Linkblock.
