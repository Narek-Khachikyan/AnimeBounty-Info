---
name: tailwind-ui-polish
description: Improve Tailwind-based UI through screenshot-driven visual QA, responsive layout repair, spacing, density, typography, state styling, accessibility checks, token consistency, and subject-specific design polish.
---

# Tailwind UI Polish

Use this skill when Tailwind classes, local Tailwind components, shadcn/Tailwind tokens, or Tailwind-driven layouts are the implementation surface for visual polish, responsive repair, density tuning, or state styling. Do not use it for pure backend work, non-visual refactors, brand redesign from scratch, illustration work, or projects where Tailwind is not part of the UI layer.

## Decision Rules

- Start from the product's subject, audience, and primary job. A manga library, CRM dashboard, and health portal should not receive the same palette, density, typography, or decorative moves.
- Match the existing app style before introducing a new visual direction, unless the request explicitly asks to move the direction.
- Treat screenshots, rendered browser state, and real viewport checks as stronger evidence than code inspection alone.
- Prioritize layout stability, readable density, hierarchy, and state coverage over decorative changes.
- Treat overflow, wrapping, contrast, focus visibility, sticky overlap, and responsive breakage as correctness issues.
- Prefer semantic Tailwind tokens, local variants, `cn` helpers, CVA/class helpers, or shared components when repeated utility clusters become meaningful duplication.
- Avoid one-note palettes, generic gradient/blob/card layouts, nested cards, ornamental shadows, random icon grids, and animation without a job.
- Keep dashboard, CRM, admin, and operational tools compact and scannable. Save hero-scale type, large imagery, and editorial spacing for content that actually needs it.
- Keep boundaries sharp: use `frontend.design-system` for token/theme architecture, `frontend.visual-design-polish` for broad visual direction, `frontend.ux-critique` for task-flow redesign, and `frontend.interaction-polish` for motion systems beyond local state styling.

## Workflow

1. Capture the polish envelope: screen or component, user workflow, Tailwind version, design system conventions, target breakpoints, and states that must remain intact.
2. Inspect local UI vocabulary before changing classes: shared components, `tailwind.config.*`, global CSS, `components.json`, shadcn theme tokens, `cn`/CVA utilities, nearby screens, and existing radii/shadow/spacing/type patterns.
   For Tailwind v4, inspect CSS-first `@theme`, `@theme inline`, `@custom-variant`, `@source`, and theme variable namespaces; for Tailwind v3, inspect `tailwind.config.*`.
3. Form a compact design thesis for the pass:
   - subject and audience;
   - primary content/action hierarchy;
   - density target: compact tool, balanced product UI, or editorial/marketing page;
   - one allowed visual move and what it communicates.
4. Render or request visual evidence. Check at minimum mobile narrow, mobile common, tablet if relevant, and desktop. Prefer before/after screenshots when a browser is available.
5. Audit visual hierarchy:
   - primary action/content is obvious;
   - headings, labels, metadata, and controls have distinct type roles;
   - spacing groups related items and separates unrelated items;
   - color and emphasis guide attention without becoming decoration.
6. Audit responsive robustness:
   - no page-level horizontal scroll;
   - long text, translated labels, badges, icons, and buttons fit or truncate intentionally;
   - sticky headers/footers/action bars do not cover content;
   - grids, sidebars, tables, modals, menus, and toolbars keep stable dimensions.
7. Audit interaction and state styling:
   - hover, focus-visible, active, disabled, selected, loading, empty, error, success, skeleton, and dirty states;
   - keyboard focus order and visible focus rings;
   - reduced motion for transitions;
   - contrast for text, icons, borders, focus rings, charts, and disabled states.
8. Audit Tailwind implementation quality:
   - conflicting utilities such as multiple spacing, display, width, or color classes;
   - arbitrary values where tokens or semantic classes exist;
   - repeated class bundles that should become a variant or local component;
   - fragile absolute positioning, magic negative margins, and viewport-sized hacks;
   - inconsistent radii, shadows, borders, gaps, and typography scale.
   - dynamically constructed class names such as `bg-${color}-600`; map props to complete static class strings so Tailwind can detect them;
   - missing container-query handling when a reusable component should adapt to parent width rather than viewport width.
9. Make the smallest useful change:
   - prefer local convention over a new mini design system;
   - extract only when duplication or variants justify it;
   - preserve behavior, routing, data fetching, and component ownership boundaries.
10. Verify with screenshots or state the exact manual/browser checks still needed.

## Screenshot QA Checklist

- Capture before and after when possible for `320px`, `390px`, `768px`, and desktop-width viewports, adjusted to the app's supported breakpoints.
- Compare first viewport hierarchy, scroll depth, sticky elements, long-text cases, and modal/menu/table overflow.
- Inspect at least one empty, loading, error, disabled, selected, and focused state when those states exist.
- Check that hover/focus/active states do not resize controls or shift layout.
- Check dark mode separately when the project supports it.
- Treat screenshot differences as useful only when they improve hierarchy, task completion, readability, accessibility, or robustness. Decoration alone is not a win.

## Tailwind Fix Patterns

- Replace raw hex or arbitrary color values with project tokens unless the visual direction explicitly needs a new token.
- Prefer `gap`, `space-*`, grid tracks, and flex wrapping over hard-coded margins between repeated items.
- Use `min-w-0`, `max-w-*`, `truncate`, `line-clamp`, stable icon sizes, and explicit grid/flex constraints for long content.
- Use `focus-visible:*` styles that are visible against the actual background, not only the default light surface.
- Keep cards shallow: use cards for repeated items or framed tools, not for every section inside another card.
- Keep button and control dimensions stable across states. Loading text/spinners should not resize the control.
- Use semantic variants for repeated states such as intent, size, tone, density, and selected/active.

## References

- Use official Tailwind docs for utility classes, responsive design, theme variables, arbitrary values, source detection, and functions/directives; use shadcn/ui theming and `components.json` docs when shadcn is present.
- When available in the project, inspect existing layout primitives, shared buttons/inputs/cards, Tailwind config or CSS theme variables, shadcn theme, screenshots, design tokens, and adjacent pages with similar density.

## Validation

- Name the viewport, state, or component variant affected by every material issue.
- Tie color, spacing, typography, and motion comments to hierarchy, consistency, accessibility, or usability.
- Verify no horizontal scroll, no text/control overlap, visible focus, and stable controls across relevant breakpoints.
- If screenshots or browser verification are unavailable, state the missing evidence and the safest exact checks to run.
- Do not claim visual improvement without comparing against the product's subject, local conventions, and at least one concrete user workflow.

## Output Contract

- Classification first: responsive bug, state styling gap, hierarchy issue, token drift, accessibility risk, density problem, or subjective polish.
- Evidence inspected: screenshot/browser viewport, code, local component pattern, tokens/config, state coverage, or missing.
- Proposed visual thesis when the task is subjective.
- Changes made or recommended, scoped to Tailwind classes, local variants, or small component extraction.
- Viewports and states verified.
- Remaining visual/accessibility risk and any screenshots or manual checks still needed.
