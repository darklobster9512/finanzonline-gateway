# Comdirect-Footer: 4-Spalten-Layout

Der Footer soll als vier gleichwertige Spalten nebeneinander aufgebaut werden:

```text
[ Logo              ] [ Links Spalte 1 ] [ Links Spalte 2 ] [ Links Spalte 3 ]
[ Vertrag widerrufen]                                        [ Social Icons   ]
[ © comdirect …     ]
```

## Änderungen in `src/pages/Comdirect.tsx`

- Oberen Footer-Bereich auf ein 4-Spalten-Grid umstellen (`md:grid-cols-4`), damit die drei Linkspalten gleichmäßig neben der Logo-Spalte verteilt sind und nicht mehr nach rechts gedrängt wirken.
- Erste Spalte: Logo oben, darunter der „Vertrag widerrufen"-Button und das Copyright.
- Spalten 2–4: die bestehenden `footerCols`-Linklisten (eine Liste pro Spalte).
- Social-Icons rechtsbündig unter der dritten Linkspalte (Spalte 4) platzieren.
- Dekorative Hintergrund-SVGs und Farben bleiben unverändert.
