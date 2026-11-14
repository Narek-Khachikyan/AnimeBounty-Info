# AnimeBounty-Info Agent Guide

Short map for agent work here. Durable project knowledge lives in `docs/`, not in this file.

## Start Here

- Product context: `docs/product-specs/index.md`
- Architecture map: `ARCHITECTURE.md`
- Quality gates and known risks: `docs/quality/index.md`
- Active execution plans: `docs/exec-plans/active/`
- Harness source notes: `docs/design-docs/harness-engineering-notes.md`

## Never compromise

The app is publicly deployed and installable as a PWA, with the user library in `localStorage`. Four rules protect that:

- Offline still renders cached catalogue content. The `jikan-api-cache` Workbox runtime cache serves up to 7 days of anime and manga data; changing the cache name or `navigateFallback` leaves installed users with an empty app.
- A catalogue API failure renders a visible error state, never a blank screen. `/anime` and `/manga` already render `ErrorState` with `role="alert"` and retry; match that shape.
- A hard refresh of any nested route works. `/anime/1`, `/manga/2`, and `/character/777` come from the SPA fallback, not from a file on disk.
- No API secrets in client code. The Gemini key is read only inside the Netlify Function, so a key under `src/` is a leaked key.

## Project shape

Read `package.json` for the dependency list. These parts it does not explain:

- Routes live in `src/App.jsx`: 8 URLs plus a `*` catch-all to `/`.
- `src/features/` owns logic: `apiSlice.js` (Tenrai, Jikan-compatible), `userLibrary.js` (localStorage), `aiRecommendations.js` (AI payload).
- `src/Page/` uses a capital P and is flat; `src/components/` groups components into folders with no barrel file (`Filter/` holds `Filter.jsx`, `Rating.jsx`, `Sort.jsx`).
- Tailwind utilities sit in JSX, design tokens in `src/App.scss`, and each component imports its own `.scss`.
- `e2e/` specs run against the built `dist/` through `npm run preview` on port 4173.
- The legacy spelling `Recomendations` (one "m") is load-bearing in folder names, exports, and endpoint names.

## Commands

Every entry below exists verbatim in `package.json`. Run `npm install` after pulling, and do not invent a check.

- Dev server: `npm run dev`
- Preview the built app: `npm run preview`
- Production build: `npm run build`
- Lint source: `npm run lint`
- Harness docs check: `npm run harness:check`
- User library storage checks: `npm run library:check`
- AI recommendation checks: `npm run ai:check`
- PWA config checks: `npm run pwa:check`
- PWA built-output checks: `npm run pwa:dist-check`
- Browser suite: `npm run pwa:e2e`
- Full chain: `npm run verify`

## Ways to hurt yourself here

- Stop only servers you started. Never kill by port or process-name pattern; Playwright reuses an existing server on 4173, so a pattern kill takes down work you did not start.
- Never hardcode a localhost or deploy origin. Vite inlines any `VITE_*` value into `dist/` at build time and Workbox precaches those assets, so a baked origin ships to every installed client.
- Never run `npm audit fix --force` or mass-upgrade dependencies. The tree pins a `serialize-javascript` override, targets Node 22 on Netlify, and `npm run build` plus the e2e suite are the only proof it still boots.

## Hit every surface

The most common defect here is a fix applied to one path only. Before calling frontend work done, state which of these applied:

- Anime/manga parity: `Page/Anime.jsx` vs `Manga.jsx`, `AnimeCard` vs `MangaCard`, `TopAnimeSlider` vs `TopManga`, `AnimeSearch` vs `MangaSearch`, `FullAnime` vs `FullManga`, `RecomendationsAnime` vs `RecomendationsManga`.
- Loading, error, empty, and success states for every data view, on both the online and offline paths.
- Search, the detail page, and the cards they share.
- The a11y landmarks: exactly one `<main id="main-content">` per route, plus the skip link that targets it.
- `netlify.toml` and `public/_redirects`, which must keep agreeing on `/* -> /index.html` with status 200.
- Docs accuracy: if the change makes `ARCHITECTURE.md`, `docs/product-specs/index.md`, or `docs/quality/index.md` wrong, fix them in the same change.

## Reverse states

A one-way door is a bug. If you add a way in, add the way out and the way to see it.

- A library add needs a remove, and a filter or genre chip needs a clear; status and favorite must be reversible.
- A dismissed update notice must not strand the user. `registerType: 'prompt'` is a contract: keep `needRefresh`, `offlineReady`, and `updateServiceWorker(true)`.
- Every new state needs a visible label. A control that changes data silently is unfinished.

## API and data rules

- `src/features/apiSlice.js` is the only place catalogue API requests are built. Add new endpoints there.
- Encode query strings with `URLSearchParams`; never concatenate raw user input into a URL.
- Normalization for missing nested fields lives in `src/features/`; components render what they are handed and never touch raw response shapes.
- Keep the pacing constants: request gap 900ms, 429 cooldown 5s, `maxRetries: 2`, `timeout: 15000`. `e2e/jikan-endpoints.spec.js` asserts recovery after one 429.

## Taste and drift control

- Complexity belongs at the feature boundary: `src/features/` owns normalization and shaping, components stay dumb.
- Prefer small, focused changes that preserve the existing React/Vite structure. Do not add a dependency unless it removes real complexity, and never run a broad architecture rewrite while fixing a narrow bug.
- No continuously repainting animation beyond short-lived loading shimmers. `aos` and `swiper` are already heavy on sliders and long card lists.
- No lying spinner and no stale label. A loading flag that outlives its request, or a version label that names the wrong build, is a bug.

## Verifying before you claim done

- Run the narrowest check that proves the change: one harness script (`npm run ai:check`) or the one affected spec (`npx playwright test e2e/pwa.spec.js`); reserve `npm run verify` for cross-cutting edits. There is no CI here: Netlify runs only `npm run build`, and the e2e suite serves the built `dist/`, so re-check the built output for any change touching `vite.config.js` or the manifest.
- A bad spec asserts callback wiring or mirrors the implementation. Assert the rendered outcome from a fixture instead.
- `plugin:react/recommended` fails lint on a missing `propTypes` (error), and `--max-warnings 0` fails it on warnings such as an unused `eslint-disable` directive. Components that accept props must declare them.
- The e2e specs pin user-facing copy and counts: `Top Anime`, `Top Manga`, `Your library`, `Generate picks`, `Favorites only`, `Skip to main content`, and `Generated with gemini-3.1-flash-lite`.
- If a check cannot run, record the exact command, the failure, and whether it is a code problem or an environment problem.

## Documentation rules

- Most code changes need no doc change. Before adding a paragraph, ask what a maintainer would get wrong without it; if reading the code answers it, leave it out.
- When a constraint changes, rewrite the affected text instead of appending a second account of the new behavior.
- When a rule comes from an external source, separate the sourced claim from local assumptions in the same doc.
- Keep `AGENTS.md` a short map. `scripts/verify-harness-docs.mjs` caps it at 120 lines and requires the `ARCHITECTURE.md`, `docs/product-specs/index.md`, and `docs/quality/index.md` links.
- When a plan lands, create `docs/exec-plans/completed/` if needed and move the file into it.

## In-flight work

- One artifact owns status: `docs/exec-plans/active/jikan-stability-and-quality.md`; `docs/quality/index.md` states gates and risks.
- When work lands, update those files in place. Do not add another tracking list.

## Fixtures and secrets

- The specs intercept `https://api.tenrai.org/v1/**` and fulfill fixtures, so assert rendered output, not that a fetch happened. Every fixture set needs one realistic full Jikan-compatible record and one record with missing nested fields.
- Never place a real Gemini key or Netlify env value in a fixture, a spec, or a committed file. `ai:check` reads `.env.example`, not `.env`, and requires the literal `GEMINI_API_KEY=` and `GEMINI_MODEL=gemini-3.1-flash-lite`.

## Authority

- These are good defaults, not law. A direct instruction from Narek in the chat overrides anything here; if a rule fights the task, say so and get an explicit decision before breaking it.
