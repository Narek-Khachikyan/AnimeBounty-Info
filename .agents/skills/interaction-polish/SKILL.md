---
name: interaction-polish
description: Refine frontend interaction states, motion, microinteractions, loading feedback, focus behavior, menus, modals, drawers, toasts, and perceived responsiveness.
---

# Interaction Polish

Use this skill when a frontend interaction feels abrupt, unclear, jumpy, slow, inaccessible, or unfinished: modals, drawers, menus, toasts, tabs, accordions, hover/focus states, loading transitions, optimistic updates, and microinteractions. Do not use it for broad visual redesigns or Playwright debugging unless the main issue is interaction quality.

## Decision Rules

- Every motion needs a job: confirm input, preserve spatial context, reveal cause/effect, soften a state change, or make waiting understandable.
- Respect reduced motion and keyboard users.
- State changes should be visible, stable, and reversible when appropriate.
- Loading feedback should match expected wait time and prevent duplicate destructive actions.
- Avoid animation that hides latency, shifts layout, traps focus, or makes controls harder to use.

## Workflow

1. Identify the interaction: trigger, target, entry state, transition, resting state, exit, and failure state.
2. Inspect existing motion/state conventions and component primitives.
3. Audit input states:
   - hover;
   - focus-visible;
   - active/pressed;
   - selected/current;
   - disabled;
   - loading/saving;
   - error/success.
4. Audit complex components: modal focus trap, drawer escape routes, menu keyboard behavior, toast timing, tab state, accordion state, and scroll locking.
5. Tune motion:
   - duration;
   - easing;
   - transform/opacity choice;
   - layout stability;
   - reduced-motion fallback.
6. Verify interaction by keyboard and pointer, and by narrow viewport when layout changes.

## Validation

- Check that focus moves predictably and returns after dismissing overlays.
- Verify controls do not resize or shift between states.
- Confirm loading/disabled states prevent duplicate submissions when needed.
- Verify reduced motion has a usable non-animated path.
- State any unverified browser behavior.

## Output Contract

- Interaction classification first.
- Evidence inspected: component code, browser behavior, screenshots/video, or missing.
- State and motion changes made or recommended.
- Keyboard, pointer, viewport, and reduced-motion checks.
- Remaining interaction risk.
