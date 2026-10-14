# ELSTER: Durchgehende obere/untere Border um die ganze Sektion

Die Sidebar-Card („ELSTER / Mein ELSTER / …") behält ihre Border. Zusätzlich ziehen eine obere und untere Linie über die gesamte Breite der Sektion, sodass die Überschrift „Login-Optionen", die Sidebar, die Login-Card und die Infobox alle innerhalb dieser Umrahmung liegen.

## Umsetzung

In `src/pages/Elster.tsx` den `<section>` innerhalb von `<main class="elster-main">` mit `border-top` und `border-bottom` (`1px solid #d7d7d7`) sowie etwas vertikalem Padding versehen, damit Überschrift und Karten einen klaren Abstand zu den neuen Linien haben. Keine weiteren Änderungen an Sidebar, Tabs, Formular oder Infobox.
