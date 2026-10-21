# Project rules
- Keep the data-preview presentation at its registered standalone path (`/daten/aktualisierung`) browser-only: local validation and confirmation state, separate from submission, banking, and panel flows; never persist or transmit its input values. Mount it outside panel providers to preserve its independence.
- Scope the data-preview styling to its page stylesheet and CSS variables to avoid altering existing pages.
- Use the shared accessible Select controls for data-preview dropdowns, with a page-specific portal class and scoped tokens so option states are consistent without changing other pages.
