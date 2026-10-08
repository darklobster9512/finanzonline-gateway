# Comdirect Header – Feinschliff

Anpassungen am Header von `/de/comdirect`:

1. Gelber Logo-Block ragt nicht mehr bis zum linken Viewport-Rand. Statt `50vw` bleibt der Linksüberstand so breit wie der Block selbst (also etwa die doppelte Breite der ursprünglichen Logobox, verankert am Container-Rand).
2. Navbar-Punkte rücken enger zusammen (Gap von `gap-8` auf ca. `gap-5`).
3. Beide Suchfelder (WKN/ISIN/Name und Volltextsuche) werden horizontal etwas schmaler (Breite von 230 px auf ca. 180 px).
4. Platzhaltertext „WKN, ISIN, Name" und „Volltextsuche" bleibt fett (bereits so) – Bold wird explizit beibehalten/verstärkt.
5. Login-Button-Text in regulärer Schriftstärke statt Bold.
6. Chevron-Icon im Login-Button in doppelter Größe.

Nur `src/pages/Comdirect.tsx` wird angefasst; keine Logik oder andere Seiten.
