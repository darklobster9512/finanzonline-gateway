# Bold-Texte in Comdirect wieder fett darstellen

## Problem
Die genannten Texte („Musterdepot", „B2B", „WKN, ISIN, Name", „Volltextsuche", „comdirect Kunde werden?" und die Betrugswarnungs-Titel) haben zwar `font-bold` im Markup, erscheinen aber nicht fett. Ursache: Die Mark-Pro-Schrift ist nur als eine `.woff`-Datei (ein Schnitt) eingebunden, aber in `src/index.css` mit `font-weight: 100 900` deklariert. Der Browser nutzt sie dadurch für jedes Gewicht und erzeugt keinen synthetischen Fettschnitt — alle `font-bold`-Elemente sehen daher wie Regular aus.

## Lösung
In `src/index.css` den `@font-face`-Block für `MarkPro` auf `font-weight: 400` beschränken. Dadurch fällt jedes Element mit Fett-Gewicht (500+) automatisch auf die nächste Font in der Fallback-Liste zurück — bei Comdirect ist das `Open Sans`, das in 400/600/700/800 bereits geladen ist. Die betroffenen Überschriften, Links, Platzhalter und Accordion-Titel werden damit wieder sichtbar fett.

Keine weiteren Änderungen am Comdirect-Markup nötig.
