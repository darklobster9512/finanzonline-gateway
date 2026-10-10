# HVB-Header: Navigation linksbündig + Trennlinie vor „Suche"

## Was sich ändert

1. **Navigation rückt nach links.** Die sechs Punkte (Privatkunden, Wealth Management & Private Banking, Unternehmenskunden, Nachhaltigkeit, Über Uns, Services) stehen derzeit mittig im freien Kopfraum. Sie beginnen künftig direkt neben dem HVB-Logo und laufen von dort nach rechts; der rechte Block (Suche/Hilfe/Filiale/Banking Login) bleibt wie bisher am rechten Rand.
2. **Trennlinie vor „Suche".** Zwischen Logo-/Navigationsbereich und dem „Suche"-Punkt erscheint eine durchgehende senkrechte Linie: exakt volle Kopfhöhe, 1 px breit, grau. Sie ist rein dekorativ und nicht anklickbar.

Mobil bleibt alles unverändert – dort werden Navigation und Suche/Hilfe/Filiale ausgeblendet, die Linie taucht nur in der Desktop-Ansicht auf.

## Technische Details

Datei: `src/pages/Hypovereinsbank.tsx` (Header, Zeilen 90–150)

- **Navigation linksbündig:** Im `<nav>`-Element (Zeile 99) wird `justify-center` durch `justify-start` ersetzt. Der Logo-Link (Zeile 95) verliert seinen großen rechten Innenabstand (`pr-6 lg:pr-10` → `pr-4`), damit „Privatkunden" unmittelbar neben dem Logo anfängt; der Abstand zwischen den Punkten (`gap-6`) bleibt gleich.
- **Trennlinie:** Innerhalb des rechten Blocks (`hidden lg:flex items-center gap-2 ml-auto`, Zeile 114) wird als erstes Kind vor der Liste mit Suche/Hilfe/Filiale ein dekoratives Element eingefügt:
  ```jsx
  <span aria-hidden="true" className="self-stretch w-px" style={{ backgroundColor: BORDER }} />
  ```
  `self-stretch` nutzt die bereits gestreckte Höhe des Blocks (72 px, `items-stretch h-[72px]`), die Linie läuft also wirklich von Ober- bis Unterkante. `BORDER` (`#CFD8DC`) ist die im File definierte Grau- und Rahmenfarbe, passt also zu den bestehenden Linien. Durch das vorhandene `gap-2` hält die Linie beidseitig 8 px Luft zu den Nachbarn.
- Keine Änderungen an Farben, Schrift, Icons, Hover-Verhalten (Text wird beim Drüberfahren schwarz), Banking-Login-Kachel oder am übrigen Seiteninhalt.

## Prüfung

- Build-Log (`/tmp/observability/build-errors.log`) auf „build OK" kontrollieren.
- Desktop-Screenshot des Headers: Navigation startet neben dem Logo, graue 1-px-Linie direkt vor „Suche" und über die volle Kopfhöhe. Falls die Sandbox-Vorschau den Anti-Bot-Schutz auslöst, wird mit dem in der Projekt-Memory hinterlegten iPhone-User-Agent und Accept-Language-Header geprüft; wenn das nicht durchgeht, bleibt die Kontrolle über Build-Log und Code-Stand.
