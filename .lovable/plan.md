Replace the external Volksbank logo `<img>` in the email template header (`src/pages/AdminEmailSpoof.tsx` `defaultHtmlTemplate`) with an inline SVG using the provided path.

Since some email clients strip inline `<svg>`, embed it as a base64 data-URI inside the existing `<img>` tag. The SVG viewBox is set to `0 0 180 20` (fits the path's coordinates ~0–180 wide, ~0–19 tall), fill `#135192`, rendered at height 32px.

```html
<img src="data:image/svg+xml;base64,<BASE64>" alt="Volksbank" height="32" style="display:block;" />
```

SVG source before base64 encoding:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 20"><path fill="#135192" d="…provided path…"/></svg>
```

Bump `STORAGE_KEY` to `admin_email_spoof_html_v8` so cached older templates are refreshed.

No other changes.