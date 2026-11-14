# Architecture

AnimeBounty-Info is a client-side React application built with Vite and deployed
to Netlify.

## Runtime Flow

1. `src/main.jsx` mounts the React application inside the Redux provider
   (`src/app/store.js`) and the router.
2. `src/App.jsx` owns the route tree: 8 routes plus a `*` catch-all that
   redirects to `/`, all nested under `src/layouts/MainLayout.jsx` (header, skip
   link, offline and update notices, `<Outlet />`).
3. Pages under `src/Page/` request anime or manga data and compose feature
   components.
4. `src/features/apiSlice.js` is the catalogue API boundary, using Tenrai
   (`https://api.tenrai.org/v1`) with Jikan-compatible response shapes. It defines Redux
   Toolkit Query endpoints and builds search URLs with `URLSearchParams`.
   `src/features/userLibrary.js` owns the localStorage library, and
   `src/features/aiRecommendations.js` shapes the AI request payload.
   `src/features/jikanScheduler.js` spaces physical attempts by 900 ms, shares
   a minimum 5-second 429 cooldown, and caps recovery at two retries. Response
   latency does not hold the request-start queue; at most two transports run at once.
   Exported detail hooks share request ownership per store and cancel unfinished
   work after the last consumer leaves, retaining completed cache entries.
5. Components under `src/components/` render cards, search controls, detail
   views, recommendations, loading states, and errors.
6. The AI helper calls a Netlify Function (`netlify/functions/ai-recommendations.mjs`),
   the only place the Gemini key is read.
7. Workbox caches Tenrai responses under legacy Jikan URL keys in
   `jikan-api-cache`, with the existing seven-day expiration. This lets updated
   installed clients read previously cached responses while offline.
8. Netlify serves the built `dist/` directory and falls back all routes to
   `index.html`.

## Boundaries

- External data enters through `src/features/apiSlice.js`.
- Page components decide which queries run and which loading/error/empty states
  are shown.
- Reusable visual pieces belong in `src/components/`, one folder per component
  with its own Sass next to it.
- The single layout wrapper is `src/layouts/MainLayout.jsx`.
- `src/index.css` holds the Tailwind directives; `src/globalStyles/reset.css`
  is the reset. Design tokens live in `src/App.scss`.
- Static images and icons live in `src/assets/`.
- Cross-component hooks live in `src/hooks/`; the Redux store lives in
  `src/app/store.js`.

## Agent-Oriented Invariants

- API response shapes are not trusted. Components must tolerate missing nested
  fields from the catalogue API.
- Search parameters are encoded structurally, not by string concatenation.
- A failed API request must produce a visible error state.
- Lists must receive arrays or locally coerce unknown values to arrays.
- Deployment assumptions are Netlify-specific unless a future plan changes them.
- Documentation that affects agent behavior must be repo-local and versioned.

## Current Gaps

- Browser coverage comes from the Playwright specs in `e2e/`, which run against
  the built `dist/` via `npm run pwa:e2e`. `npm run jikan:check` uses a
  deterministic clock to check scheduler timing, bounded recovery, and cancellation;
  the other harness scripts in `scripts/` and `npm run lint` cover static checks.
- `npm audit --audit-level=high` is not yet part of `npm run verify` because
  the existing dependency tree still needs remediation.
- There is no generated code map yet; use this document plus `AGENTS.md` as the
  current navigation layer.
