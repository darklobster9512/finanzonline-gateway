# Floating-Label und Feldabstand auf /de/targobank

Drei Mikro-Anpassungen am Login auf `/de/targobank`:

1. Der nach oben gefloatete Beschriftungstext (Benutzername / Passwort) wird etwas größer.
2. Der gefloatete Text beginnt horizontal genau dort, wo der Eingabetext im Feld beginnt (bündig mit dem Textanfang).
3. Zwischen Benutzername- und Passwortfeld kommt mehr vertikaler Abstand, damit das gefloatete „Passwort“-Label sauber in die Lücke passt und nicht am Feld darüber klebt.

Sonst bleibt alles unverändert (Rahmen, Farben, Fokus, Fehlerzustände, Button).

## Technische Details

Datei: `src/pages/Targobank.tsx`.

- `.tb-float-label` (Ruheposition): `left: 12px` statt `10px`, damit der Text an der inneren Textkante des Felds beginnt (2 px Border + 10 px Padding).
- `.tb-float-wrap.is-active .tb-float-label`: `font-size: 14px` (statt 12 px); `left` bleibt 12 px, damit floatender Text horizontal mit dem Feldinhalt startet.
- Benutzername-Wrapper: `mb-5` → `mb-7`, damit das gefloatete Passwort-Label genug Luft über dem Passwortfeld hat.
- Der Pflichtfeld-Hinweis-Abstand (`mb-6`) und alle weiteren Elemente bleiben unverändert.
