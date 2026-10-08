# Comdirect: Teaser-Karte & Mark-Pro-Font

## Änderungen

**Teaser-Karte „Dein Zukunfts-Ich fragt, wann du startest"**
- Höhe/Tiefe schmaler: vertikales Padding `py-3` → `py-1.5`.
- Titel nicht mehr fett: `font-semibold` → `font-normal`.
- Fließtext darunter leicht größer: `text-[13px]` → `text-[15px]`.

**Font Mark Pro für die gesamte Comdirect-Seite**
- Hochgeladene `Mark_Pro.woff` als CDN-Pointer unter `src/assets/mark-pro.woff.asset.json` ablegen (keine Binaries ins Repo).
- In `src/index.css` eine `@font-face`-Regel „MarkPro" ergänzen, die diese URL lädt.
- Auf `/de/comdirect` die ganze Seite auf `font-family: 'MarkPro', ...` setzen (Wrapper-Style im Root-Container von `Comdirect.tsx`), damit Header, Formular, Teaser, Warnungs-Card und Footer die Schrift übernehmen. Andere Seiten bleiben unverändert.

## Technische Details
- Nur ein Font-Weight verfügbar (eine .woff-Datei) → Bold/Normal nutzen denselben Schnitt; Browser faked ggf. Bold. Falls du zusätzliche Schnitte willst, bitte entsprechende Dateien liefern.
- Scope auf `/de/comdirect` via Inline-Style am Seitenroot, nicht global.
