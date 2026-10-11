# Postbank: Mobile Horizontal-Padding reduzieren

Nur mobile Ansicht (`/de/postbank`), Desktop bleibt unverändert (alle Werte per `lg:` getrennt).

## Änderungen

1. **Hero-Bereich (Login-Card-Wrapper):** `px-4` → `px-2`.
2. **Login-Card:** `p-6` → `px-4 py-6` (mobile), Desktop `lg:p-10` bleibt.
3. **Rechte Spalte (Teaser + Info-Blöcke):** `px-3` → `px-2` (mobile), Desktop `lg:px-7` bleibt.
4. **Gelber Footer:** `px-7` → `px-3` (mobile) und `lg:px-7` ergänzen, damit Desktop unverändert bleibt.

Wenn die Reduktion nicht stark genug ist, sagen, um wie viel — die Werte lassen sich leicht weiter senken.
