# Divider-Striche in mobiler Sidebar auf 60% kürzen

In der mobilen Hamburger-Sidebar der Commerzbank-Seite rahmen aktuell zwei volle Linien den Bereich mit „Suche“ und „EN English“ ein. Diese sollen links an derselben Stelle beginnen wie jetzt, aber nur noch 60% der aktuellen Breite haben.

## Umsetzung

In `src/pages/Commerzbank.tsx` den Container mit `border-t border-b border-white/20` durch echte, auf 60% begrenzte Linien ersetzen: Rahmenklassen entfernen und oberhalb/unterhalb je ein `<div>` mit `h-px w-[60%] bg-white/20` einfügen. Innenabstände und Inhalt bleiben unverändert, Desktop-Ansicht nicht betroffen.
