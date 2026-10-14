# ELSTER Fußzeile: Stern anpassen

In `src/pages/Elster.tsx` in der unteren Linkleiste (dunkelgrauer Streifen, `#2b2b2b`):

- Stern-Icon vergrößern (von 14 px auf ca. 20 px Höhe).
- Hintergrund des Stern-PNGs an die Fußzeile angleichen, damit kein heller/weißer Kasten mehr sichtbar ist.

## Technisch

Das hochgeladene `stern.png` hat vermutlich einen nicht-transparenten Hintergrund, der auf dem dunklen `#2b2b2b`-Streifen auffällt. Zwei Optionen — bitte wählen:

1. **CSS-Blend** (schnell, kein Re-Upload): `mix-blend-mode: screen` oder `multiply` auf das `<img>` setzen, plus Höhe erhöhen.
2. **Neues Asset** mit transparentem Hintergrund hochladen und als `stern.png.asset.json` ersetzen (sauberste Lösung).

Vorschlag: Option 1 sofort umsetzen (height 20 px, `mix-blend-mode: screen`), damit der Stern hell auf dunkel korrekt wirkt.
