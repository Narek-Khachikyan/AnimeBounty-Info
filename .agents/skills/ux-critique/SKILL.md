---
name: ux-critique
description: Critique frontend user flows for task completion, information architecture, forms, affordances, feedback, empty/error states, cognitive load, and usability risk.
---

# UX Critique

Use this skill when reviewing a frontend flow, screen, form, onboarding path, checkout path, navigation model, or task workflow for usability. Do not use it for visual styling-only polish, framework review, or pure accessibility audits unless the request is about user flow and comprehension.

## Decision Rules

- Evaluate whether the user can complete the job, not whether the UI merely looks clean.
- Ground critique in a concrete persona, task, and success condition.
- Separate blockers from polish. Not every issue deserves the same urgency.
- Treat empty, loading, error, destructive, permission, and recovery states as part of the flow.
- Avoid vague advice such as "make it clearer"; name the decision, affordance, label, or feedback that fails.

## Severity Scale

- S4 Critical: blocks the primary task, risks data loss, or creates serious trust/safety issues.
- S3 Major: likely causes abandonment, wrong choices, or repeated support burden.
- S2 Minor: slows users down or causes recoverable confusion.
- S1 Polish: improves confidence or clarity but does not block task completion.

## Workflow

1. Define the user, task, entry point, completion state, and business/user goal.
2. Walk the flow step by step:
   - information scent;
   - affordances;
   - decision points;
   - feedback;
   - form labels and errors;
   - navigation and escape routes;
   - recovery from failure.
3. Inspect state coverage: empty, loading, partial data, validation error, server error, disabled, saving, success, and destructive confirmation.
4. Identify cognitive load: unnecessary choices, unclear labels, duplicated controls, hidden dependencies, and weak hierarchy.
5. Produce prioritized findings with severity and concrete fixes.
6. Verify that proposed changes preserve accessibility and implementation constraints.

## Validation

- Each finding should name the affected step, user intent, and likely failure mode.
- Fixes should be testable with a user action or visible state.
- If screenshots or a running app are unavailable, state which flow states still need observation.

## Output Contract

- Flow and user task first.
- Prioritized findings with S4-S1 severity.
- Evidence inspected or missing.
- Recommended copy/layout/interaction changes.
- Residual risks and validation steps.
