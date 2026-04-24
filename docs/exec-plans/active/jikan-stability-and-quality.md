# Jikan Stability And Quality Plan

**Goal:** Finish the stabilization work described in `PRD.md` while keeping the
new harness documentation and verification flow current.

**Architecture:** Keep Jikan access behind `src/features/apiSlice.js`; pages own
query states; components render guarded data. Do not introduce a new framework or
state layer.

**Verification:** Prefer `npm run verify` before completion. Use
`npm audit --audit-level=high` before dependency-related claims.

## Tasks

- [ ] Confirm the current PRD status against the codebase.
- [ ] Ensure all Jikan query consumers render explicit loading, error, empty,
      and success states.
- [ ] Guard nested fields in detail and card components with optional chaining
      and fallbacks.
- [ ] Keep search URL generation centralized in `buildSearchQuery`.
- [ ] Fix all ESLint errors and hook dependency warnings.
- [ ] Update vulnerable dependencies in small batches and verify build/lint
      after each batch.
- [ ] Keep Netlify routing documented and aligned between `netlify.toml` and
      `public/_redirects`.
- [ ] Move this plan to `docs/exec-plans/completed/` once the acceptance
      criteria in `PRD.md` are satisfied.

## Decision Log

- 2026-04-24: Created a lightweight harness scaffold based on the OpenAI harness
  engineering article. Deferred observability, browser automation, and custom
  architecture linting until the frontend stabilization work is green.
