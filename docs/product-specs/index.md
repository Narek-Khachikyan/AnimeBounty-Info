# Product Specs

This file is the product source of truth. The original stabilization PRD was
retired after its issues were fixed; ongoing work is tracked in
`docs/exec-plans/active/`.

## Product Summary

AnimeBounty-Info is a browse and discovery UI for anime and manga content backed
by the public Tenrai API using Jikan-compatible data. Users should be able to browse top items, search, filter,
open detail pages, and recover gracefully when the API is incomplete, slow, or
temporarily unavailable.

## Current Stabilization Goal

Stabilize the app for Netlify deployment by keeping build/lint checks green,
guarding against incomplete catalogue API responses, preserving SPA routing, and reducing
dependency risk.

## Acceptance Criteria Index

Acceptance criteria for in-flight work live in
`docs/exec-plans/active/jikan-stability-and-quality.md`. The behavioral
contracts pinned by the e2e suite (copy, counts, offline behavior, update
notice) are listed in `AGENTS.md` under "Verifying before you claim done".

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
