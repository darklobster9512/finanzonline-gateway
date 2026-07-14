## Zwei kleine Anpassungen in `src/pages/FinanzonlineSteuer.tsx`

1. **„Jetzt prüfen"-Button** ist bereits `border-[#00436b]` + `text-[#00436b]` — keine Änderung nötig. Falls doch abweichend, sicherstellen dass Outline + Text `#00436b` sind.
2. **Warnhinweis-Box** („Achtung! Bitte geben Sie Ihre Handynummer ein…") auf Desktop ausblenden: dem umschließenden `<div className="mx-5 mt-4 rounded-md bg-[#fff3cd] ...">` die Klasse `md:hidden` hinzufügen. Mobile bleibt unverändert.