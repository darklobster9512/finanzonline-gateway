# ELSTER-Footer: Linkspalte am „ELSTER“-Schriftzug ausrichten

Im Footer sollen die Links (Aktuelles, Rechtliches, …) horizontal genau dort beginnen, wo das Wort „ELSTER“ beginnt – nicht beim Stern davor.

## Umsetzung

In `src/pages/Elster.tsx` erhält der Links-Grid links einen Einzug in Breite von Stern + Lücke (28 px Stern + 10 px Gap = 38 px), sodass die Linkspalte bündig unter dem „E“ von ELSTER startet.

Keine weiteren Änderungen.
