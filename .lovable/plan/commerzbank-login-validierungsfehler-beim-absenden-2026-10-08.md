# Commerzbank Login – Validierungsfehler beim Absenden

Wenn ein Nutzer auf „Login“ klickt und ein Feld leer ist, soll das Feld einen Fehlerzustand anzeigen.

## Verhalten

- Untere Border des leeren Feldes: 3 px, Farbe `#c5000e`.
- Direkt unter der Border erscheint eine Fehlerzeile in derselben roten Farbe, bestehend aus:
  - dem gelieferten Warn-SVG (24 px), 
  - gefolgt vom Fehlertext.
- Fehlertexte:
  - Benutzername leer: „Geben Sie bitte 8 oder 10 Ziffern für Ihre Teilnehmernummer oder min. 8 bis max. 50 Zeichen für Ihren Benutzernamen ein.“
  - Passwort leer: „Geben Sie bitte min. 5 bis max. 45 Buchstaben, Ziffern bzw. Sonderzeichen ein.“
- Fehler verschwindet, sobald das Feld Inhalt bekommt (bei Eingabe), und wird beim nächsten Login-Klick neu evaluiert.
- Floating-Label-Verhalten bleibt unverändert; nur Border-Farbe/-Stärke und die Fehlerzeile kommen hinzu.

## Technisch

- Änderung nur in `src/pages/Commerzbank.tsx`.
- Zwei State-Flags `userError` / `pwError`; im Submit-Handler setzen, falls Wert leer; Submit abbrechen, wenn irgendein Fehler aktiv.
- Border-Klasse der Inputs konditional: Fehler → `border-b-[3px] border-[#c5000e]` statt der bisherigen 1/2 px grauen Linie; Hover/Fokus-Linien im Fehlerzustand deaktivieren, bis Nutzer tippt.
- Fehlerzeile als `<div>` unter dem Input mit Inline-SVG (currentColor) und Text, `text-[#c5000e]`.
