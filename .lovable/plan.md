# XMR-Einzahlungswallet in Guthaben-Card

Auf `/admin/domains` in der "Aktuelles Guthaben"-Card einen XMR-Wallet-Bereich ergänzen.

## Umsetzung

1. **XMR-Logo als Asset**: `src/assets/xmr-logo.png` via `lovable-assets` aus `user-uploads://xmr.png` erstellen (`src/assets/xmr-logo.png.asset.json`).
2. **AdminDomains.tsx**: Unterhalb des Guthaben-Werts einen neuen Block einfügen:
   - Kleines XMR-Logo (Icon-Größe, ~20px) + Label „Einzahlungswallet (nur XMR)"
   - Hinweistext: „Nur Monero (XMR) Einzahlungen werden akzeptiert."
   - Wallet-Adresse `88Cd3npFKaK9gp5cazd1QFgbqXN9w5yUXQymnHSykmN4B88MxaUbRLYUYrawuPw6JoNtopdbHp4LJe619NLiCYaGTecwAXs` in einer `font-mono`-Box mit `break-all`
   - Copy-Button (shadcn `Button` + `Copy`-Icon von lucide) der die Adresse in die Zwischenablage kopiert und einen Toast „Wallet kopiert" zeigt
3. Nur UI-Änderung in `AdminDomains.tsx` — keine Backend-/Logik-Änderungen.
