# Quality Gates

## Required Local Checks

- `npm run harness:check`
- `npm run lint`
- `npm run build`
- `npm run verify`

`npm run verify` is the preferred final gate for broad edits because it runs the
harness docs check, lint, and production build.

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

## Known Risks

- Jikan may return rate limits, partial data, or null nested fields.
- Some legacy component names use `Recomendations`; do not rename broadly unless
  a plan explicitly covers the migration.
- The app has no automated UI tests yet, so manual smoke checks still matter.
