# Architecture

AnimeBounty-Info is a client-side React application built with Vite and deployed
to Netlify.

## Runtime Flow

1. `src/main.jsx` mounts the React application.
2. `src/App.jsx` owns the route tree and top-level page composition.
3. Pages under `src/Page/` request anime or manga data and compose feature
   components.
4. `src/features/apiSlice.js` is the Jikan API boundary. It defines Redux
   Toolkit Query endpoints and builds search URLs with `URLSearchParams`.
5. Components under `src/components/` render cards, search controls, detail
   views, recommendations, loading states, and errors.
6. Netlify serves the built `dist/` directory and falls back all routes to
   `index.html`.

## Boundaries

- External data enters through `src/features/apiSlice.js`.
- Page components decide which queries run and which loading/error/empty states
  are shown.
- Reusable visual pieces belong in `src/components/`.
- Layout wrappers belong in `src/layouts/`.
- Global styling belongs in `src/index.css` and `src/globalStyles/`.
- Component-specific Sass should stay next to the component it styles.

## Agent-Oriented Invariants

- API response shapes are not trusted. Components must tolerate missing nested
  fields from Jikan.
- Search parameters are encoded structurally, not by string concatenation.
- A failed API request must produce a visible error state.
- Lists must receive arrays or locally coerce unknown values to arrays.
- Deployment assumptions are Netlify-specific unless a future plan changes them.
- Documentation that affects agent behavior must be repo-local and versioned.

## Current Gaps

- The app has no automated unit or browser test runner.
- `npm run lint` is the only static source check.
- `npm audit --audit-level=high` is not yet part of `npm run verify` because
  the existing dependency tree still needs remediation.
- There is no generated code map yet; use this document plus `AGENTS.md` as the
  current navigation layer.
