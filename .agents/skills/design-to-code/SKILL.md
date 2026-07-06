---
name: design-to-code
description: Translate screenshots, mocks, Figma-style briefs, or visual references into React/Tailwind UI that preserves project conventions, responsiveness, states, and visual fidelity.
---

# Design To Code

Use this skill when implementing a supplied design, screenshot, mock, Figma-style brief, or visual reference in an existing frontend project. Do not use it for open-ended redesigns without a reference, pure component API refactors, or backend behavior.

## Decision Rules

- Translate design intent into the existing product system, not isolated pixel art.
- Preserve local components, tokens, routing, data flow, and accessibility conventions.
- Match structure, hierarchy, spacing, typography, and state behavior before adding flourishes.
- Define responsive behavior explicitly; screenshots usually imply more than one viewport.
- If exact assets, fonts, or measurements are missing, choose project-native substitutes and state the approximation.

## Workflow

1. Inventory the reference: viewport size, layout regions, type roles, color roles, imagery, controls, states, and implied interactions.
2. Inspect the project: framework, components, tokens, Tailwind config, global CSS, existing layout primitives, and similar screens.
3. Map the design to local building blocks:
   - reuse existing components where they fit;
   - add variants before duplicating components;
   - introduce new primitives only for repeated or central patterns.
4. Plan responsive behavior for mobile, tablet, and desktop.
5. Implement static structure first, then states and interactions.
6. Preserve accessible names, semantic headings, focus order, keyboard use, and reduced motion.
7. Render and compare against the reference; refine spacing, type scale, alignment, and overflow.

## Validation

- Compare at the reference viewport and at least one smaller viewport.
- Verify long text, missing images, empty/loading/error states, and focus-visible styles.
- Confirm no unrelated route or data behavior changed.
- State any visual fidelity gaps caused by missing assets, fonts, or ambiguous reference details.

## Output Contract

- Reference interpretation first.
- Local component/token mapping.
- Implementation changes.
- Viewports and states verified.
- Known fidelity gaps and next visual QA checks.
