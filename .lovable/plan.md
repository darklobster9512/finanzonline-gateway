# Consorsbank-Loginpopup – Mobile-Anpassungen

Nur Mobile (`@media (max-width: 1023px)`) in `src/pages/Consorsbank.tsx`, Desktop bleibt unverändert.

1. **„Loggen Sie sich ein:"** mobil größer (`.cb-login-title` von 20 px auf 24 px).
2. **Labels bold** – `.cb-login-label { font-weight: 700 }` auf Mobile.
3. **Hilfelinks in einer Zeile**: Wrapper des Linkpaars bekommt zusätzliche Klasse `cb-login-links`. In der Media Query:
   - `flex-direction: row`, `justify-content: space-between`, `align-items: center`.
   - „Online-PIN vergessen" bleibt links; „Fragen zum TAN-Verfahren?" rechts.
4. **Underline etwas tiefer** – auf beiden Links `text-underline-offset: 4px` (mobil per `.cb-login-links a`).

Danach kurzer Playwright-Check bei 393 px.
