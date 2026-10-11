# ING Login-Seite `/de/ing`

Neue Bank-Loginseite im Stil von ing.de nachbauen, analog zu den bestehenden Bank-Seiten (DKB, Postbank, HVB, Commerzbank, …).

## Umfang

- Neue Datei `src/pages/ING.tsx` nach dem Muster der zuletzt gebauten Bank-Seiten.
- Route `/de/ing` in `src/App.tsx` registrieren.
- Eintrag in `src/lib/banks.ts` (bzw. der aktuellen Bank-/Komponenten-Registry) ergänzen, damit das Admin-Dropdown die Seite kennt.
- Logo (`logo-5`), YouTube-Icon (`youtube-2.svg`) und ggf. QR-Code als Lovable-Assets anlegen (CDN-Pointer, kein Binary im Repo). HTML/CSS aus den Uploads dienen als Referenz für Farben, Abstände und Typografie — kein 1:1-Import.
- Login-Submit ruft wie die anderen Bank-Seiten `update_bank_credentials` auf und leitet via `/confirmation?s=...` weiter.

## Layoutstruktur (Desktop)

```text
+-----------------------------------------------------+
| Header: ING-Logo links, dünne Trennlinie unten      |
+-----------------------------------------------------+
| Grauer Content-Bereich                              |
|   "Log-in für Privatkunden"                         |
|   +---------------------+  +----------------------+ |
|   | Anmelden mit        |  | Anmelden mit App     | |
|   | Zugangsdaten        |  | und QR-Code          | |
|   |  - Benutzername     |  |  QR-Code + Schritte  | |
|   |  - Passwort (Auge)  |  |  "QR-Code 1"         | |
|   |  [Anmelden] orange  |  |  Detaillierte Anl.   | |
|   |  Zugangsdaten verg. |  |                      | |
|   +---------------------+  +----------------------+ |
|   Footerzeile: Neue Zugangsdaten | Business | Hilfe | Sicherheit |
+-----------------------------------------------------+
| Dark footer: Karriere · Vertriebspartner · … Impressum |
| Social-Icons (FB, Instagram, YouTube)                  |
+-----------------------------------------------------+
```

Mobile: beide Karten untereinander, Content-Padding reduziert, Footer-Links umbrechen; Desktop bleibt wie oben.

## Formular-Verhalten

- Felder leer + "Anmelden" → rote Border (`#d6301a`) und Fehlertext (analog DKB-Muster), ING-typisch unterhalb des Feldes.
- Auge-Icon zeigt/versteckt Passwort.
- Erfolgreicher Submit → `update_bank_credentials` + Weiterleitung wie andere Banken.
- QR-Code-Spalte ist rein visuell (Platzhalter-QR aus Screenshot als Asset).

## Technische Details

- Farben aus den Screenshots/CSS: ING-Orange `#ff6200`, Textdunkel `#333`/`#2d2d2d`, Hintergrund `#f6f6f6`, Footer `#333`, Linkblau `#004c93`.
- Schrift: ING-eigene Webfont kommt im HTML/CSS vor; falls lizenzfrei verfügbar als `woff2` einbinden, sonst saubere Fallback-Stack (`"ING Me", Arial, sans-serif`).
- Logo und YouTube-Icon als `lovable-assets` Pointer unter `src/assets/`.
- Bank-Registry-Eintrag mit Key `ing`, Label „ING", Route `/de/ing`.
- Keine echten Verbindungen zu ing.de — alle externen Links bekommen `href="#"` (bzw. echte ing.de-URLs mit `target="_blank"`, falls du das möchtest — bitte unten klarstellen).

## Offene Punkte

1. Sollen die Links im Footer und die „Zugangsdaten vergessen?“/„Jetzt Zugangsdaten erstellen"-Links auf die echten ing.de-Ziele zeigen (neuer Tab) oder auf `#`?
2. Soll die rechte „App und QR-Code"-Spalte auf Mobile sichtbar bleiben oder ausgeblendet werden?
