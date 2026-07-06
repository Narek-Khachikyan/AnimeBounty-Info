---
name: visual-design-polish
description: Improve frontend visual design with subject-specific direction, hierarchy, typography, spacing, palette, density, responsive screenshot QA, and anti-generic UI critique.
---

# Visual Design Polish

Use this skill when a frontend screen works but feels generic, visually weak, poorly prioritized, too crowded, too empty, or mismatched to the product's subject and audience. Do not use it for pure Tailwind class cleanup, backend work, accessibility-only audits, or design-system extraction unless the main request is visual direction and polish.

## Decision Rules

- Start from the product, audience, and screen job. A design direction must be specific enough that it would not fit a random SaaS page.
- Make one memorable visual move and keep the rest disciplined.
- Prefer hierarchy, readability, density, and subject fit over decoration.
- Treat screenshots as evidence. Visual claims should refer to what is visible at real viewports.
- Avoid generic AI-layout defaults: purple-blue gradients, floating blobs, nested cards, random icon grids, vague SaaS copy, one-note palettes, and ornamental shadows.
- Preserve existing product conventions unless the task explicitly asks for a new direction.

## Workflow

1. Capture the design brief: screen, audience, primary job, current complaint, implementation surface, and available screenshots.
2. Inspect local visual language: adjacent pages, tokens, type scale, spacing, buttons, cards, forms, empty states, and brand cues.
3. Write a compact visual thesis:
   - subject and audience;
   - hierarchy target;
   - palette role;
   - typography role;
   - density target;
   - one signature move.
4. Critique the current UI against the thesis:
   - first-viewport priority;
   - typography scale and weight;
   - spacing rhythm and grouping;
   - contrast and palette discipline;
   - content density;
   - imagery or icon relevance;
   - responsive fit.
5. Remove or reduce generic decoration before adding new decoration.
6. Make scoped implementation changes using local components, tokens, and CSS/Tailwind conventions.
7. Verify with before/after screenshots or state the exact viewport checks still needed.

## Validation

- Check mobile narrow, common mobile, and desktop viewports when possible.
- Ensure no text/control overlap, horizontal scroll, or focus-state loss.
- Verify long titles, empty states, loading states, and primary actions still work visually.
- If the change is subjective, explain why it fits this product better than the previous direction.

## Output Contract

- Visual thesis first.
- Evidence inspected: screenshots, viewports, local components, tokens, or missing.
- Top visual issues ordered by user impact.
- Changes made or recommended.
- Viewports/states verified.
- Remaining subjective risk or missing screenshots.
