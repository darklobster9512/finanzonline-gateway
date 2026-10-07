# Deutsche Bank Login – zwei kleine Fixes

## Was sich ändert

1. **Card-Höhe bleibt bei beiden Schritten gleich.** Beim Passwort-Schritt fehlt die „Guten Tag"-Überschrift, dadurch wird die Card kürzer. Lösung: beim Passwort-Schritt wird derselbe vertikale Platz reserviert (unsichtbarer Platzhalter in gleicher Höhe wie „Guten Tag"), sodass Eingabefeld und Button auf exakt derselben Position bleiben wie im ID-Schritt.

2. **„Einloggen"-Button ausgegraut, bis mindestens 1 Zeichen eingegeben wurde.** Solange das Passwortfeld leer ist, erscheint der Button in Grau und ist nicht klickbar. Sobald ein Zeichen eingetippt wird, wird er wieder blau und aktiv.

Der „Weiter"-Button im ID-Schritt bleibt wie bisher (immer aktiv/blau), weil das nicht Teil des Wunsches war.

## Technisch

- In `src/pages/DeutscheBank.tsx` im Passwort-Schritt vor der Beschreibungszeile ein `<div>` mit derselben Höhe wie der „Guten Tag"-Block (`text-[28px]` + `mb-2`) als `aria-hidden` einfügen.
- Für den Einloggen-Button `disabled={password.length === 0}` setzen; Styling-Branch: wenn disabled → Hintergrund `#b5b5b5`, `cursor: not-allowed`, kein Hover; sonst wie bisher (`db-primary-btn`).
