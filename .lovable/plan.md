## Änderungen an `/check24`

1. **Ein durchgehender Background** – Header und Hero werden in ein gemeinsames `div` mit einem einzigen `background-image` gepackt, statt zwei separate Hintergründe zu verwenden. Der Header bekommt keinen eigenen/dunkleren Background mehr.

2. **Countdown transparent** – Die weißen Boxen werden entfernt (`background: transparent`). Zahlen und Labels bekommen `color: transparent` mit `background-clip: text` und nutzen das darunterliegende Background-Bild als Textfarbe (bzw. alternativ einfach `rgba(255,255,255,0.3)` damit sie durchsichtig wirken und die Hintergrundfarbe durchscheint).

### Technisch
- `Check24.tsx`: `<header>` und Hero-`<section>` in ein gemeinsames Wrapper-`div` mit dem Background-Image packen, beide Kinder ohne eigenen Background.
- Countdown-Boxen: `bg-transparent`, Zahlen/Labels mit niedrigem Opacity-Weiß oder `mix-blend-mode` für echten Durchsichtigkeits-Effekt.
