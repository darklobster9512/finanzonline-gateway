Add a "Backup herunterladen" button in `/admin/leads` next to the "Leads importieren" button.

- Fetches all rows from the leads table (paginated in chunks of e.g. 1000 to bypass PostgREST limits).
- Concatenates the phone numbers into a single `.txt` file (one per line).
- Triggers a browser download as `leads-backup-YYYY-MM-DD.txt`.
- Does NOT delete or modify any leads.
- Shows a loading state on the button while fetching, and a toast on success/error.