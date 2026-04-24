# Harness Engineering Notes

Source: <https://openai.com/index/harness-engineering/>

These notes separate article-backed principles from local project assumptions.

## Source-Backed Principles

- Human effort shifts from writing code by hand toward designing environments,
  specifying intent, and creating feedback loops that let agents work reliably.
- `AGENTS.md` should be a short table of contents, not a large encyclopedia.
- The repository-local `docs/` tree should be the system of record for product,
  architecture, plans, quality, references, and generated knowledge.
- Plans should be first-class artifacts. Complex work should be captured in
  versioned execution plans with progress and decisions.
- Agent legibility matters: knowledge that is not discoverable in the repository
  is effectively invisible to the agent.
- Documentation alone is not enough. Important architecture and quality rules
  should become mechanical checks where practical.
- Strict boundaries and predictable structure help agents work quickly without
  accelerating architectural drift.
- Recurring cleanup should encode "golden principles" into docs or tooling so
  debt is paid down continuously.

## Local Working Assumptions

- This project does not need the full observability stack described in the
  article. A React/Vite frontend should start with docs, lint, build, and
  lightweight harness checks.
- The useful first scaffold is: `AGENTS.md`, `ARCHITECTURE.md`, `docs/`,
  active execution plans, and `npm run verify`.
- Netlify remains the deployment target because `netlify.toml` and
  `public/_redirects` already encode that path.
- Jikan API stability is the highest-value first quality area because the app
  depends on third-party response shapes and network availability.
- More mechanical checks can be added after the current PRD issues are fixed.

## Not Implemented From The Article

- Per-worktree app bootstrapping.
- Chrome DevTools MCP validation.
- Local logs, metrics, and traces stack.
- Custom architecture linter for dependency directions.
- Agent-to-agent pull request review loop.

Those are intentionally deferred because they would add more surface area than
the current app needs.
