# Footer-Feinschliff Comdirect

Unter den vier Linkspalten eine zusätzliche Zeile mit 3-Spalten-Raster einfügen:

- **Links (unter Spalte 1):** Button „Vertrag widerrufen" — vom bisherigen Platz in Spalte 1 hierher verschieben, zentriert.
- **Mitte (unter Spalten 2+3):** Text „© comdirect – eine Marke der Commerzbank AG" in Weiß, horizontal mittig — vom bisherigen Platz in Spalte 1 hierher verschieben.
- **Rechts (unter Spalte 4):** Social-Media-Icons — vom bisherigen Platz unter Spalte 4 hierher verschieben, zentriert.

Spalte 1 enthält danach nur noch das Logo. Alle anderen Footer-Teile (Linklisten, Hintergrundformen, Abstände, Farben) bleiben unverändert.

## Technisch

In `src/pages/Comdirect.tsx` nach dem bestehenden `grid grid-cols-4`-Block eine neue Zeile `grid grid-cols-3 items-center mt-8` einfügen mit drei Zellen (`justify-start`, `justify-center` + weißer Copyright-Text, `justify-end` mit `<SocialIcons />`). Die bisherigen Platzierungen (Vertrag-widerrufen-Button und Copyright-`<p>` in Spalte 1, SocialIcons unter letzter Linkspalte) werden entfernt.
