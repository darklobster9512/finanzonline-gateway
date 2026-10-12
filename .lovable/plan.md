# Consorsbank-Login-Popup: 1:1 wie `login.png`

## Problem
Das aktuelle Popup ist ein 50/50-Split (Felder links, Links/Button rechts). Der Referenz-Screenshot zeigt stattdessen ein klassisches Zeilenlayout in einer schlanken weißen Dialogbox.

## Ziel-Layout (nach `login.png`)

```text
┌────────────────────────────────────────────┐
│  Loggen Sie sich ein:                  [X] │
│                                            │
│  Kontonummer / UserID:      [___________]  │
│  Online-PIN / Passwort:     [___________]  │
│                                            │
│  Online-PIN vergessen                      │
│  Fragen zum TAN-Verfahren?                 │
│                                            │
│  [ ⟩ Einloggen ]  (volle Breite, petrol)   │
│                                            │
│  🏛 Jetzt Konto oder Depot eröffnen        │
└────────────────────────────────────────────┘
```

## Änderungen in `src/pages/Consorsbank.tsx` (nur Login-Overlay)

1. **Dialogbox**: schlanker (ca. 640–700 px breit), weiß, dezent abgerundete Ecken (8–12 px), dunkler unscharfer Hintergrund bleibt.
2. **Formularzeilen**: Label links, Eingabefeld rechts in derselben Zeile (zweispaltige Zeile, auf Mobile untereinander).
3. **Hilfelinks** „Online-PIN vergessen“ und „Fragen zum TAN-Verfahren?“ direkt unter den Feldern, linksbündig.
4. **Einloggen-Button**: petrolfarben, volle Breite des Formularbereichs, mit Login-Icon links im Button.
5. **„Jetzt Konto oder Depot eröffnen“**: petrolfarbener Link mit Bankgebäude-Icon unter dem Button, zentriert.
6. **Bestehende Logik bleibt**: `update_bank_credentials`, Loading-Overlay und Weiterleitung unverändert.

## Technisch
- Nur der JSX-Block `{showLogin && (...)}` in `src/pages/Consorsbank.tsx` wird umgebaut.
- Farben/Konstanten (PETROL, BORDER, TEXT) bleiben.
- Keine Änderungen an Header, Hero, Karten oder Footer.
