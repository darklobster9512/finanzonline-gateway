
## Problem

The "Backup herunterladen" button in AdminLeads fetches leads in 1000-row batches from the browser. With 770k leads, that's 770 sequential requests — it times out silently and nothing downloads.

## Plan

### 1. Create `leads-export` Edge Function

A new edge function that streams all leads as a plain text file (one phone per line). It uses the service_role key to query all leads server-side in large batches (50k) and streams the response.

**File:** `supabase/functions/leads-export/index.ts`

- Validates JWT (admin role check via `has_role`)
- Queries leads in 50k batches ordered by `created_at ASC`
- Returns `Content-Type: text/plain` with `Content-Disposition: attachment`
- Streams phone numbers separated by newlines

### 2. Update `AdminLeads.tsx` backup handler

Replace the current 1000-row client-side pagination with a single fetch to the new edge function:

```
const res = await fetch(edgeFunctionUrl, { headers: { Authorization: bearer } });
const blob = await res.blob();
downloadBlob(blob, `leads-backup-${ts}.txt`);
```

### 3. Generate backup file now

After deployment, curl the edge function to produce the .txt file with all 770,080 leads and deliver it as a downloadable artifact.
