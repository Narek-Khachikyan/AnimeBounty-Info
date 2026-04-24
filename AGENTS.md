# AnimeBounty-Info Agent Guide

This file is the short map for agent work in this repository. Keep durable
project knowledge in `docs/`, not in this file.

## Start Here

- Product context: `docs/product-specs/index.md`
- Current stabilization PRD: `PRD.md`
- Architecture map: `ARCHITECTURE.md`
- Active execution plans: `docs/exec-plans/active/`
- Quality and verification rules: `docs/quality/index.md`
- Harness source notes: `docs/design-docs/harness-engineering-notes.md`

## Project Shape

AnimeBounty-Info is a React 18 and Vite app for browsing anime and manga data
from the public Jikan API. It uses Redux Toolkit Query for API access, Sass for
component styles, React Router for client routes, and Netlify for deployment.

## Commands

- Install dependencies: `npm install`
- Start local app: `npm run dev`
- Production build: `npm run build`
- Lint source: `npm run lint`
- Check harness docs: `npm run harness:check`
- Full local verification: `npm run verify`

## Working Rules

- Prefer small, focused changes that preserve the existing React/Vite structure.
- Treat `src/features/apiSlice.js` as the API boundary for Jikan requests.
- Encode query strings with `URLSearchParams`; do not concatenate raw user input.
- Normalize or guard external API data before rendering nested fields.
- User-facing API failures should render visible error states, not blank screens.
- Keep Netlify routing in sync between `netlify.toml` and `public/_redirects`.
- Do not add new dependencies unless they remove real complexity.
- Do not introduce broad architecture rewrites while fixing narrow stability bugs.

## Documentation Rules

- `AGENTS.md` stays short and points to deeper docs.
- Put durable product decisions in `docs/product-specs/`.
- Put multi-step implementation plans in `docs/exec-plans/active/`.
- Move completed plans to `docs/exec-plans/completed/` after the work lands.
- Put quality gates, known risks, and verification expectations in `docs/quality/`.
- When a repo convention comes from an article or external source, separate the
  sourced rule from local assumptions in the relevant doc.

## Verification Expectations

Before claiming a change is complete, run the narrowest relevant command and
prefer `npm run verify` for cross-cutting edits. If a check cannot run, record
the command, the failure, and whether it is a code issue or an environment issue.

## Current Priority

Follow `docs/exec-plans/active/jikan-stability-and-quality.md`: stabilize Jikan
API handling, keep lint/build green, and reduce high/critical dependency risk.
