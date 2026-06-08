# e-RISE Partner Hub — Cloudflare Pages Version

Files:
- `index.html` — fixed dashboard HTML. No Airtable token is stored in this file.
- `functions/api/airtable.js` — Cloudflare Pages Function that securely calls Airtable.

Cloudflare Pages variables required:
- `AIRTABLE_BASE_ID` = your Airtable base ID
- `AIRTABLE_TOKEN` = your Airtable personal access token. Store as a secret.

After deployment, test:
`/api/airtable?table=partners`
