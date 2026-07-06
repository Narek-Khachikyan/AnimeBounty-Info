---
name: performance-review
description: Review frontend web app performance for rendering cost, bundle size, data loading, image delivery, caching, and Core Web Vitals risk.
---

# Frontend Performance Review

Use this skill when reviewing frontend web app changes that may affect runtime performance, loading speed, bundle size, rendering cost, data fetching, image delivery, caching, or Core Web Vitals. Do not use it for backend-only profiling, database query tuning, or infrastructure capacity planning with no browser-facing surface.

## Decision Rules

- Start from user-visible performance impact before suggesting micro-optimizations.
- Separate initial load, route transition, interaction latency, and render stability concerns.
- Prefer evidence from changed code, framework configuration, bundle boundaries, and existing measurements.
- Treat performance and accessibility as linked when loading states, disabled states, or layout shifts affect usability.

## Workflow

1. Identify changed routes, components, data loaders, media assets, client components, and shared utilities.
2. Check whether code moved unnecessary work to the client, added broad imports, unstable keys, repeated effects, or expensive render loops.
3. Review data fetching and caching behavior for duplicate requests, waterfall risk, missing loading/error states, and stale data assumptions.
4. Inspect image, font, script, and third-party usage for blocking resources, missing dimensions, or avoidable client payload.
5. Look for route-level bundle risks such as large dependencies in shared layouts or components that could stay server-rendered.
6. Recommend the smallest change that reduces measurable risk while preserving existing framework conventions.

## References

- No packaged references are required for this MVP skill.
- When available in the project, inspect framework config, changed route files, component boundaries, package dependencies, and existing performance tests or reports.

## Validation

- Findings should name the likely performance dimension: load, interaction, render stability, memory, or data latency.
- Suggestions should include what evidence would confirm the issue, such as profiler output, bundle analysis, trace, or user-facing timing.
- If no measurement exists, label the recommendation as risk-based rather than proven.

## Output Contract

- Lead with the highest user-impact performance risks.
- Include file references and the specific behavior that creates the risk.
- State the expected benefit and any tradeoff for each recommendation.
- List commands or measurements run or recommended, and note unverified assumptions.
