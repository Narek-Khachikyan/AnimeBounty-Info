# Quality Gates

## Required Local Checks

- `npm run harness:check`
- `npm run pwa:check`
- `npm run lint`
- `npm run build`
- `npm run pwa:dist-check`
- `npm run pwa:e2e`
- `npm run verify`

`npm run verify` is the preferred final gate for broad edits because it runs the
harness docs check, PWA checks, lint, production build, and the PWA browser
smoke test.

## Security Check

Run this before dependency or release work:

```bash
npm audit --audit-level=high
```

This is not yet included in `npm run verify` because the current dependency tree
may still contain high or critical findings from the stabilization PRD.

## Manual Smoke Checks

After user-facing changes, start the app with:

```bash
npm run dev
```

Check these flows in a browser:

- Home page loads.
- Anime search works with spaces and special characters.
- Manga search works with spaces and special characters.
- Anime detail page tolerates missing trailer or image fields.
- Manga detail page tolerates missing nested fields.
- Refreshing a nested route still loads through the Netlify SPA fallback after
  deployment.
- After opening Anime and Manga online, switch the browser offline and confirm
  those views still show previously cached Jikan-backed content.
- Trigger or wait for a changed service worker and confirm the app shows a
  visible "New version" update notice with an Update action.

## Netlify PWA Checks

On a real Netlify deploy-preview, run Chrome Lighthouse against the deployed URL
and confirm the PWA/installability audit does not flag missing manifest, service
worker, icon, or offline fallback requirements.

Also manually check this deploy-preview flow:

1. Open the home page, `/anime`, and `/manga` while online.
2. Use DevTools to switch the page offline.
3. Reload `/anime` and `/manga`; the app shell should load and previously opened
   Jikan data should still render from cache.
4. Deploy a changed build and confirm the update notice appears before applying
   the new service worker.

## Known Risks

- Jikan may return rate limits, partial data, or null nested fields.
- Jikan runtime cache can serve data up to 7 days old while offline.
- Some legacy component names use `Recomendations`; do not rename broadly unless
  a plan explicitly covers the migration.
- The PWA browser smoke is intentionally narrow, so manual smoke checks still
  matter for full release confidence.
