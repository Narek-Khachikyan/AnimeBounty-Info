---
name: accessibility-review
description: Review frontend changes for semantic HTML, keyboard behavior, focus management, forms, landmarks, color contrast, and screen reader usability.
---

# Accessibility Review

Use this skill when the task touches user-facing UI, forms, navigation, modals, interactive controls, or content structure. Do not use it for backend-only, database-only, or copy-only changes unless the copy affects labels, instructions, or error recovery.

## Decision Rules

- Prefer native semantic elements before custom ARIA.
- Treat keyboard and screen reader behavior as first-class behavior, not polish.
- Check names, roles, descriptions, focus movement, and state announcements together.
- Report specific, fixable issues rather than generic accessibility advice.
- Use WCAG 2.2 AA as the default product baseline. Cite concrete criteria when possible: 1.4.3 contrast, 1.4.11 non-text contrast, 2.1.1 keyboard, 2.4.7 focus visible, 2.5.8 target size, 3.3.1 error identification, 3.3.2 labels/instructions, and 4.1.2 name/role/value.
- Treat automated checks as a regression screen, not proof. Axe or Playwright passing means only “no automatically detectable violations in tested states.”

## Workflow

1. Identify the changed pages, components, controls, dialogs, forms, and navigation flows.
2. Check semantic structure: headings, landmarks, lists, buttons, links, tables, and form grouping.
3. Check accessible names and descriptions for controls, icons, inputs, and error messages.
4. Trace keyboard behavior: tab order, activation keys, escape behavior, focus return, and visible focus states.
5. Review validation feedback, loading states, dynamic updates, and live-region needs.
6. Check contrast thresholds, non-color-only communication, target size, reduced-motion expectations, and responsive readability: 4.5:1 normal text, 3:1 large text, 3:1 meaningful non-text UI/graphics/focus indicators.
7. For custom widgets, identify the ARIA APG pattern first: dialog, tabs, accordion, menu button, combobox, listbox, slider, grid, disclosure, tooltip, or live region. Verify role, accessible name, state/value, keyboard behavior, focus movement, and escape/close behavior.

## References

- Use WCAG 2.2, WAI-ARIA Authoring Practices Guide, MDN accessibility docs, and project-local component patterns as the source of truth.
- When available in the project, inspect existing shared form controls, modal/dialog components, route layouts, accessibility tests, axe/Playwright setup, and previous accessibility regressions.

## Validation

- Each finding should name the affected user interaction or assistive technology behavior.
- Prefer fixes that use existing components or native HTML semantics.
- If color contrast or screen reader behavior cannot be verified directly, say so and describe the evidence used.

## Output Contract

- Lead with actionable findings ordered by user impact.
- Include file references and the affected UI state when available.
- Provide concise fix direction, not a long accessibility lecture.
- Note any manual checks or automated checks that remain to be run.
