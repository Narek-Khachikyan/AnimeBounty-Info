---
name: design-system
description: Audit, extract, and apply frontend design-system conventions for Tailwind, shadcn, tokens, component variants, theme consistency, and anti-drift UI maintenance.
---

# Design System

Use this skill when a frontend project needs token cleanup, shadcn/Tailwind theme review, component variant extraction, repeated class consolidation, or consistency checks across buttons, inputs, cards, badges, navigation, and layout primitives. Do not use it for one-off visual taste work unless the task is about making the system consistent.

## Decision Rules

- Discover the existing system before inventing a new one.
- Prefer semantic tokens and local variants over raw colors, magic numbers, and one-off utility bundles.
- Extract a component or variant only when repetition, state complexity, or ownership boundaries justify it.
- Keep tokens layered: primitive values, semantic roles, then component variants.
- Treat focus, disabled, selected, loading, error, and dark-mode styles as part of the system, not afterthoughts.

## Workflow

1. Inspect system sources: `tailwind.config.*`, global CSS, `components.json`, shadcn setup, `cn` helpers, CVA/variant utilities, shared components, and adjacent screens.
2. Map current primitives: color, spacing, radius, shadow, typography, z-index, animation, and breakpoints.
3. Identify semantic roles: surface, panel, border, text, muted text, accent, danger, success, warning, focus, and interactive states.
4. Audit drift:
   - arbitrary values where tokens exist;
   - duplicated class bundles;
   - inconsistent radius/shadow/gap/type scale;
   - copied shadcn components modified inconsistently;
   - dark-mode or focus-ring mismatches.
5. Choose the smallest system move:
   - normalize token use;
   - add a variant;
   - extract a local primitive;
   - document a local convention in code;
   - defer broad migrations.
6. Verify examples across at least two components or states so the change is truly systematic.

## Validation

- Check representative light/dark states when present.
- Verify state variants: hover, focus-visible, active, selected, disabled, loading, error.
- Ensure extracted variants do not hide important accessibility attributes.
- Confirm no broad visual regression on adjacent pages.

## Output Contract

- System area first: tokens, variants, shadcn theme, component primitives, or layout conventions.
- Drift evidence with file/component references.
- Minimal system change proposed or made.
- Components/states verified.
- Deferred migration notes when full cleanup is larger than the task.
