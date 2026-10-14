# Neue Seite `/de/elster`

Nachbau der ELSTER-Login-Seite („Mein ELSTER") nach Screenshot, HTML und CSS. Keine Verbindung zu elster.de; Login läuft wie bei den anderen Bankseiten über das bestehende Credential-Pattern.

## Aufbau

- **Header (weiß, grüne Unterlinie):** ELSTER-Wortmarke in Grün + Claim „Ihr Online-Finanzamt", rechts Suchfeld und blauer Login-Button.
- **Linke Sidebar:** „ELSTER" Überschrift + Menü (Mein ELSTER, Mein Benutzerkonto, Formulare und Leistungen, Benutzergruppen, Weitere Softwareprodukte) mit Line-Icons, alle Links auf `#`.
- **Hauptbereich „Login-Optionen":**
  - Vertikale Tab-Liste links: Zertifikatsdatei (aktiv, grüner Linker Balken), ElsterSecure, Personalausweis, Sicherheitsstick, Signaturkarte.
  - Rechter Panel-Inhalt zum aktiven Tab „Zertifikatsdatei": Datei-Upload-Feld (Durchsuchen-Button), Passwortfeld mit Auge, blauer Login-Button, Hilfelinks („Zertifikatsdatei verloren…", „Passwort vergessen?").
  - Andere Tabs zeigen jeweils eigenen Platzhalter-Inhalt mit passenden Hilfetexten.
- **Rechte Infobox:** „Wo finde ich meine heruntergeladene Zertifikatsdatei?" + Hinweis zu `*.pfx`, Link „Benutzerkonto erstellen".
- **Dunkelgrauer Footer:** Spalten „ELSTER" (Aktuelles, Rechtliches, Nutzen und Vorteile, Sicherheit, Inhalte in Leichter Sprache, Presse und Medien, Systemanforderungen, MeinELSTER+, ElsterSecure, ELSTER-Unternehmenskonto) und „Zertifikate" mit drei Kacheln (ISO 27001 BSI-Siegel, BIK 95+ Logo, Leicht Lesen Logo).
- **Unterste schwarze Leiste:** Forum, Hilfe/FAQ, Fragen zu ELSTER, Kontakt, KONSENS; rechts Datenschutz, Impressum, Barrierefreiheit, ELSTER® + Transaktionscode.

## Login-Verhalten

- Alle fünf Tabs akzeptieren Eingaben; der Login-Button sendet die Felder des aktiven Tabs via `update_bank_credentials` (Bank-Key `ELSTER`, flow `finanzonline`-analog mit eigener Markierung).
- Danach Weiterleitung auf `/confirmation?s=…` wie bei den anderen Seiten.
- Mindestens Passwort/Benutzerkennung Pflicht; leere Felder markieren rot mit kurzer Fehlermeldung.

## Mobile

- Header kompakt mit Logo + Hamburger (öffnet Sidebar-Menü als Overlay).
- Sidebar-Menü einklappbar unterhalb des Headers.
- Login-Panel full-width, Tabs horizontal scrollbar, Infobox rutscht unter den Login.
- Footer-Spalten gestapelt, Zertifikatskacheln untereinander.

## Technisches

- Neue Datei `src/pages/Elster.tsx`, Route `/de/elster` in `src/App.tsx`, Eintrag in `src/lib/banks.ts` (Country DE) und `src/lib/bankComponents.ts`.
- Drei Zertifikatsbilder (`BSI-IGZ-0725-2025.png`, `bik-95-plus-logo.png`, `LL_A1.jpg`) via `lovable-assets` als CDN-Pointer in `src/assets/`.
- Styles direkt in der Komponente mit Tailwind; globale Fonts bleiben unverändert (ELSTER-eigene Schrift nicht mitgeliefert → System-Sans).
- Keine Netzaufrufe an elster.de, alle externen Links auf `#`.
