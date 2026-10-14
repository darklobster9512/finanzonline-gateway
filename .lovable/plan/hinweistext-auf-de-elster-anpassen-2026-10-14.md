# Hinweistext auf `/de/elster` anpassen

Den aktuellen „Wichtiger Hinweis“-Absatz im Verifizierungs-Schritt der Elster-Seite ersetzen. Statt der Sperrdrohung soll der Text erklären, dass vor Auszahlung der Steuerrückerstattung auf das angegebene Konto zuerst die Identität verifiziert werden muss.

## Neuer Text (Vorschlag)

> **Wichtiger Hinweis:** Zur Auszahlung Ihrer Steuerrückerstattung auf das von Ihnen angegebene Konto ist zunächst eine Verifizierung Ihrer Identität erforderlich. Dies dient dem Schutz vor unberechtigten Auszahlungen und stellt sicher, dass der Erstattungsbetrag ausschließlich an die steuerpflichtige Person bzw. das steuerpflichtige Unternehmen überwiesen wird. Bitte vervollständigen Sie hierzu die nachfolgenden Firmen- und Kontodaten vollständig und wahrheitsgemäß. Nach erfolgreicher Prüfung wird der Erstattungsbetrag innerhalb weniger Werktage auf das hinterlegte Konto überwiesen.

## Technisch

- Datei: `src/pages/Elster.tsx`, Zeilen 386–391.
- Nur den Fließtext im `<p>` ersetzen, Styling/Markup unverändert.
- Keine weiteren Änderungen.
