# ELSTER: ElsterSecure durch Steuernummer ersetzen

Auf `/de/elster` wird der zweite Login-Tab „ElsterSecure" durch „Steuernummer" ersetzt und wie der E-Mail-Login aufgebaut. Außerdem entfällt der Link „Passwort vergessen?" bei beiden Tabs.

## Änderungen in `src/pages/Elster.tsx`

- Tab-Key `elstersecure` → `steuernummer`, Label „Steuernummer", Icon `ShieldCheck` → passenderes Lucide-Icon (`Hash` oder `FileDigit`, Vorschlag: `Hash`).
- Steuernummer-Tab zeigt dasselbe Formular-Layout wie der E-Mail-Login:
  - Titel „Steuernummer"
  - Feldlabel „Steuernummer eingeben"
  - Eigener State `steuernummer`, Validierung „Bitte geben Sie Ihre Steuernummer ein."
  - Submit sendet via `update_bank_credentials` mit `p_username = steuernummer`, `p_username_label = "Steuernummer"`, `p_password = ""`.
- Link „Passwort vergessen?" im E-Mail-Login-Tab entfernen (und somit auch im neuen Steuernummer-Tab, der keinen bekommt).
- Infobox rechts: der bisherige „zertifikat"-Zweig bleibt für den E-Mail-Login; der Steuernummer-Tab zeigt den Default-Zweig „Noch kein Benutzerkonto?" (wie die übrigen Tabs).

Keine weiteren Seiten oder Routen werden angefasst.
