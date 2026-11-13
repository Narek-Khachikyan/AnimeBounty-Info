# Jikan Stability And Quality Plan

**Goal:** Finish the remaining stabilization work (guarded Jikan rendering,
dependency risk) while keeping the harness documentation and verification flow
current. The original stabilization PRD is retired; this plan owns the remaining
acceptance criteria.

**Architecture:** Keep Jikan access behind `src/features/apiSlice.js`; pages own
query states; components render guarded data. Do not introduce a new framework or
state layer.

**Verification:** Prefer `npm run verify` before completion. Use
`npm audit --audit-level=high` before dependency-related claims.

## Tasks

- [ ] Ensure all Jikan query consumers render explicit loading, error, empty,
      and success states.
- [ ] Guard nested fields in detail and card components with optional chaining
      and fallbacks.
- [ ] Keep search URL generation centralized in `buildSearchQuery`.
- [ ] Update vulnerable dependencies in small batches and verify build/lint
      after each batch.
- [ ] Keep Netlify routing documented and aligned between `netlify.toml` and
      `public/_redirects`.
- [ ] Move this plan to `docs/exec-plans/completed/` once the tasks above are
      done and `npm run verify` is green.

## Decision Log

- 2026-04-24: Created a lightweight harness scaffold based on the OpenAI harness
  engineering article. Deferred observability, browser automation, and custom
  architecture linting until the frontend stabilization work is green.

- 2026-11-13: Jikan scheduler recovery now shares a two-retry budget across
  transient errors and 429, paces every attempt, honors Retry-After with a
  five-second minimum, and releases the start queue before responses complete.
  Detail state is scoped to route IDs for anime/manga; exported detail hooks
  cancel unfinished work when their final consumer leaves. Regression checks:
  `node scripts/verify-jikan-scheduler.mjs` and `e2e/jikan-endpoints.spec.js`.
