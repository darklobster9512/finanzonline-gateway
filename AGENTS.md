# Project rules
- Keep `/daten/aktualisierung` a standalone presentation with browser-only validation and local confirmation state, separate from submission, banking, and panel flows; never persist or transmit its input values.
- Scope the data-preview styling to its page stylesheet and CSS variables to avoid altering existing pages.
- Use the shared accessible Select controls for data-preview dropdowns, with a page-specific portal class and scoped tokens so option states are consistent without changing other pages.
