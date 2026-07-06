---
name: react-component-design
description: Design and review React component APIs, composition boundaries, state ownership, accessibility, and reusable UI behavior.
---

# React Component Design

Use this skill when creating, refactoring, or reviewing reusable React components. Do not use it for one-off page markup unless the work is becoming a shared component or affects a shared component API.

## Decision Rules

- Let existing component conventions set the default shape.
- Add abstraction only when reuse, ownership, or state complexity justifies it.
- Design accessibility and interaction states into the API instead of patching them at call sites.
- Prefer explicit composition boundaries over prop bags that hide behavior.

## Workflow

1. Identify the component's consumers, ownership boundary, and whether it is shared or local.
2. Review props for stable names, minimal surface area, sensible defaults, and escape hatches.
3. Decide controlled versus uncontrolled state and document event/value contracts through the code shape.
4. Check loading, empty, error, disabled, selected, focused, responsive, and overflow states.
5. Verify accessibility: semantic element choice, keyboard behavior, labels, focus management, and ARIA only when needed.
6. Compare styling and composition with existing local components before introducing new patterns.
7. Remove premature abstraction if only one usage exists and the abstraction does not reduce real complexity.

## References

- No packaged references are required for this MVP skill.
- When available in the project, inspect nearby components, shared UI primitives, Storybook stories, tests, and usage call sites.

## Validation

- Recommendations should name the API, state, or usage contract that changes.
- Suggested component APIs should be usable without hidden knowledge from a single call site.
- If consumer needs are unknown, prefer a narrower local component and call out the missing evidence.

## Output Contract

- Summarize the component boundary and state ownership.
- List findings or design recommendations by risk and maintainability impact.
- Include example prop/API direction only when it clarifies the fix.
- State test or story coverage needed for meaningful states.
