# Product Specs

The current product source of truth is `PRD.md`.

## Product Summary

AnimeBounty-Info is a browse and discovery UI for anime and manga content backed
by the public Jikan API. Users should be able to browse top items, search, filter,
open detail pages, and recover gracefully when the API is incomplete, slow, or
temporarily unavailable.

## Current Stabilization Goal

Stabilize the app for Netlify deployment by keeping build/lint checks green,
guarding against incomplete Jikan responses, preserving SPA routing, and reducing
dependency risk.

## Acceptance Criteria Index

The active acceptance criteria live in `PRD.md` and are implemented through
`docs/exec-plans/active/jikan-stability-and-quality.md`.
