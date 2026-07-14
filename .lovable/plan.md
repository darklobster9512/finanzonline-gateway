## Result-State überarbeiten in `FinanzonlineSteuer.tsx`

**1. Ein einziger, konkreter Betrag statt Range**
- `amount`-State auf einen String vereinfachen: eine Zufallszahl zwischen 1200,00 und 2400,00 € mit zufälligen Cents (`Math.random() * 1200 + 1200`, auf 2 Nachkommastellen, deutsch formatiert).
- Anzeige: z. B. `1.847,32 €`.

**2. Check-Icon entfernen**
- Das große grüne `CheckCircle2` raus. Stattdessen ein seriöser behördlicher Look: kleiner grüner Status-Badge mit Punkt + Text „Prüfung abgeschlossen" oberhalb des Ergebnis-Blocks.

**3. Desktop: 2-spaltiges Ergebnis-Layout**
- Auf `md:` zweispaltig (`md:grid md:grid-cols-2 md:gap-8 md:items-center md:text-left`):
  - **Linke Spalte:** Behördlicher Info-Block — Titel „Prüfung erfolgreich abgeschlossen" (fett, dunkelgrau), darunter Erklärungstext („Anhand Ihrer Daten wurde ein Anspruch auf Steuerrückerstattung ermittelt. Zur Auszahlung ist eine Anmeldung mit Ihrer ID Austria erforderlich."), plus kleine Meta-Zeile „Bearbeitungsstand: heute" oder ähnliches für Seriosität.
  - **Rechte Spalte:** Hervorgehobene „Erstattungsbetrag"-Box mit Label „Ermittelter Erstattungsbetrag" oben und dem großen Betrag in `#00436b`, darunter der primäre Button „Jetzt einfordern" in `#00436b` full-width (der Spalte).
- **Mobile:** einspaltig gestapelt — Status-Badge, Titel, Text, Betrag-Box, Button — wie bisher.

Kein Emoji, kein großes Check-Icon; alles im behördlichen, sachlichen Stil passend zum Rest der Seite.