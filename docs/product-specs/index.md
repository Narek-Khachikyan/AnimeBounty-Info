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

## AI Recommendations

The AI helper recommends anime and manga from the user's saved library. It uses
`completed` as the primary positive signal, `plan` as an intent signal and
duplicate-exclusion list, and `dropped` as the strongest negative signal. The
client maps the stored `planning` status to the AI-facing `plan` status before
sending the compact profile to the server-side Gemini function.

The first model target is `gemini-3.1-flash-lite` because the Google Gemini model
catalog lists it as a stable Gemini 3.1 Flash-Lite model and the Gemini Developer
API pricing page lists its Free Tier input/output as free of charge as of
2026-05-14.
