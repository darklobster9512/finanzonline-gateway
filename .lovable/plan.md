Remove the entire `<!-- Header -->` `<tr>...</tr>` block from `defaultHtmlTemplate` in `src/pages/AdminEmailSpoof.tsx`, and replace it with a minimal row that only renders the blue divider line (equivalent to the current `border-bottom:3px solid #004899`).

Replacement row:
```html
<tr>
  <td style="height:3px;background-color:#004899;font-size:0;line-height:0;">&nbsp;</td>
</tr>
```

Bump `STORAGE_KEY` to `admin_email_spoof_html_v9` so cached older templates get refreshed.

No other changes.