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
4. `src/features/apiSlice.js` is the Jikan API boundary. It defines Redux
   Toolkit Query endpoints and builds search URLs with `URLSearchParams`.
   `src/features/userLibrary.js` owns the localStorage library, and
   `src/features/aiRecommendations.js` shapes the AI request payload.
5. Components under `src/components/` render cards, search controls, detail
   views, recommendations, loading states, and errors.
6. The AI helper calls a Netlify Function (`netlify/functions/ai-recommendations.mjs`),
   the only place the Gemini key is read.
7. Netlify serves the built `dist/` directory and falls back all routes to
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
  fields from Jikan.
- Search parameters are encoded structurally, not by string concatenation.
- A failed API request must produce a visible error state.
- Lists must receive arrays or locally coerce unknown values to arrays.
- Deployment assumptions are Netlify-specific unless a future plan changes them.
- Documentation that affects agent behavior must be repo-local and versioned.

## Current Gaps

- Browser coverage comes from the Playwright specs in `e2e/`, which run against
  the built `dist/` via `npm run pwa:e2e`. There are no unit tests; the
  harness scripts in `scripts/` plus `npm run lint` are the static checks.
- `npm audit --audit-level=high` is not yet part of `npm run verify` because
  the existing dependency tree still needs remediation.
- There is no generated code map yet; use this document plus `AGENTS.md` as the
  current navigation layer.
