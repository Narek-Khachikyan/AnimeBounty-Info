---
name: testing-strategy
description: Plan and review frontend testing strategy across unit, integration, component, end-to-end, accessibility, and regression coverage.
---

# Frontend Testing Strategy

Use this skill when planning or reviewing test coverage for frontend web applications, especially changes that need unit, integration, component, end-to-end, accessibility, or regression coverage decisions. Do not use it for debugging a single Playwright failure when the dedicated Playwright debug skill is a better fit, or for backend-only test architecture.

## Decision Rules

- Match test type to risk: pure logic, component behavior, route integration, browser workflow, visual regression, or accessibility.
- Prefer a small number of high-signal tests over broad snapshots that lock in implementation details.
- Separate missing coverage from brittle coverage, slow coverage, and duplicate coverage.
- Respect the project's existing test runner and fixture patterns before proposing new tooling.

## Workflow

1. Identify changed user flows, components, data contracts, validation rules, and edge states.
2. Map each risk to the narrowest useful test layer: unit, integration, component, end-to-end, accessibility, visual, or smoke.
3. Check existing tests for overlap, brittle selectors, excessive mocking, missing cleanup, and unclear assertions.
4. Look for gaps around loading, error, empty, permission, responsive, and keyboard states.
5. Recommend test additions or refactors that fit the current runner, naming conventions, fixtures, and CI constraints.
6. Call out cases where manual QA or product acceptance criteria are still needed beyond automated tests.

## References

- No packaged references are required for this MVP skill.
- When available in the project, inspect test config, existing test files, fixtures, page objects, and CI workflow before proposing changes.

## Validation

- Each recommended test should tie to a concrete behavior or regression risk.
- The proposed test layer should explain why it is cheaper or more reliable than alternatives.
- If the project has no test runner, recommend an incremental first test surface rather than a full test stack migration.

## Output Contract

- Summarize the risk areas first.
- Provide a short coverage plan grouped by test layer.
- Include specific files, flows, or assertions to add or adjust.
- List test commands run or recommended, and note any coverage that remains manual or unverified.
