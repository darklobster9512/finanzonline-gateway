# ELSTER: Zertifikatsdatei → E-Mail Login

Im ersten Tab der ELSTER-Loginseite (`/de/elster`) wird aus dem Zertifikatsdatei-Upload ein einfacher E-Mail-Login.

## Änderungen in `src/pages/Elster.tsx`

- Tab-Label „Zertifikatsdatei“ → „E-Mail Login“ (im `TABS`-Array und beim `p_username_label`-Mapping).
- Im Formular des aktiven Tabs „zertifikat“: Datei-Upload-Feld entfernen; stattdessen ein einzelnes Eingabefeld „E-Mail-Adresse“ (`type="email"`). Das Passwortfeld entfällt ebenfalls, da nur noch ein Feld gewünscht ist.
- `handleSubmit`: Validierung auf E-Mail statt Passwort; an `update_bank_credentials` wird die E-Mail als `p_username` übergeben, `p_username_label` = „E-Mail“, `p_password` leer.
- Button-Text „Login“ → „Anmelden“ (im Formular und im Header rechts oben).
