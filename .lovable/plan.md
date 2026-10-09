# „Direkt zu" Dropdown Feinschliff

Nur `src/pages/Comdirect.tsx`.

## Änderungen

1. **Panel ohne Abstand zum Feld**: `mt-1` am aufgeklappten Panel entfernen, sodass es bündig unter dem Eingabefeld sitzt.
2. **Hover/Selected-Farbe `#767676`**: In den `.dz-item` CSS-Regeln `#4a5a60` durch `#767676` ersetzen (Hover + Selected).
3. **Selected gewinnt nur, wenn nichts gehovert wird**: Wenn das Dropdown geöffnet ist und über einen anderen Eintrag gehovert wird, soll der ausgewählte Eintrag seinen Hintergrund verlieren. Umsetzung per CSS: `.dz-list:hover .dz-item[data-selected="true"]:not(:hover){background:transparent;color:#0B1E25 !important;}`. Dafür erhält der Panel-Container die Klasse `dz-list`.
4. **Trennlinie linksbündig**: Separator-Wrapper nicht mehr zentrieren (`justify-center` entfernen), stattdessen mit linkem Padding (`padding: 6px 12px`) ausrichten, Linie bleibt 120 px breit.
5. **Vertikaler Divider im Feld links neben dem Chevron**: Im Button ein zusätzliches absolutes Element einfügen: 1 px breit, volle Feldhöhe (`top:0; bottom:0`), rechts bei `right: 40px` (also links des Chevrons), Farbe `rgb(133, 142, 146)`.
6. **Chevron ohne Rotation**: Im `DirektZuDropdown` ein eigenes statisches Chevron-SVG (nach unten) nutzen statt der `Chevron`-Komponente mit Rotation. Keine Transform-Animation.
