# NestCalc Skill And Plugin Recommendations

This inventory mirrors the current NanoTate operating model, adapted for a
Next.js 16 Clerk-authenticated calculator PWA.

## Installed Skills To Use By Default

Workflow and governance:

- `nestcalc-goal-grilling` - repo-local autonomous goal-prep loop for NestCalc:
  self-grilling in chat, read-only sub-agents launched with `gpt-5.4-mini`,
  flagged decisions, and stop before commit or CLI prompt unless requested.
- `ask-matt` - route ambiguous work into goal prep, grilling, implementation,
  review, or cleanup.
- `codex-goal-prep` - update one active `GOAL.md` and produce thin `/goal`
  handoffs when the full goal workflow is in use.
- `codex-repo-hygiene-gate` - classify branch/worktree/generated-artifact state
  before goal prep, implementation, closeout, or cleanup.
- `codex-pr-closeout` - prepare evidence-heavy PR closeout.
- `codex-grok-review-intake` - triage Grok Build PR findings.
- `codex-post-merge-cleanup` - sync and clean local branches/worktrees after
  merge.
- `define-goal`, `grill-me`, `grilling`, `grill-with-docs` - sharpen goals
  before execution when the repo-local skill is not the right fit.

Architecture and design:

- `improve-codebase-architecture` - periodic deepening review.
- `codebase-design` - deep module vocabulary for turning shared behavior into
  stable, testable interfaces.
- `domain-modeling` - use if NestCalc needs a durable glossary or `CONTEXT.md`.

Web implementation:

- `vercel-plugin:nextjs`
- `vercel-plugin:next-best-practices`
- `vercel-plugin:react-best-practices`
- `vercel-plugin:verification`
- `vercel-plugin:turbopack`
- `vercel-plugin:deployments-cicd`
- `vercel-plugin:env-vars`
- `vercel-plugin:vercel-cli`

Auth:

- `clerk` - router skill for choosing the right Clerk path.
- `clerk-setup` - Clerk app/env setup, `clerk env pull`, app linking, and
  `clerk doctor` guidance.
- `clerk-nextjs-patterns` - `proxy.ts`, protected routes, server/client auth,
  Server Actions, and caching.
- `clerk-custom-ui` - sign-in appearance, `<Show>`, conditional auth UI, and
  Clerk theming.
- `clerk-testing` - Playwright/Cypress auth flows. Requires valid Clerk test
  keys and usually `CLERK_TESTING_TOKEN`.
- `clerk-cli` - direct Clerk CLI operations and environment refreshes.
- `clerk-backend-api`, `clerk-webhooks`, and `clerk-orgs` only when explicitly
  scoped.

Testing and browser proof:

- `tdd`
- `diagnosing-bugs`
- `playwright`
- `playwright-interactive`
- Browser plugin capabilities when an in-app browser is useful.
- Computer Use plugin only when local desktop interaction is required and
  browser/terminal tools are insufficient.

Security:

- `security-audit`
- `security-threat-model`
- `security-best-practices`
- Codex Security plugin skills for explicit repository/security scans.

GitHub and PRs:

- GitHub plugin skills: `github`, `gh-address-comments`, `gh-fix-ci`, `yeet`.
- Local `gh-address-comments`, `gh-fix-ci`, and `shared-pr-workflow` when plugin
  skills are unavailable or local CLI flow is preferred.

## Plugin Capabilities Already Useful

Vercel plugin:

- Best fit for this repo because NestCalc is Next.js 16, React 19, Tailwind,
  Serwist/PWA, and Vercel-hosted.
- Use for App Router patterns, React performance, env vars, deployment/preview,
  Turbopack, routing middleware, and verification.

GitHub plugin:

- Use for PR/issue inspection, review comment intake, and CI failure triage.
- Keep PR publish operations in the execution lane unless the human explicitly
  asks chat to do them.

Browser plugin:

- Use for browser/PWA proof, visual inspection, and authenticated flow checks
  when valid env/session state exists.
- If a localhost-only auth bypass or review harness is used, label evidence as
  bypassed-local proof and still run Clerk-specific proof separately before
  claiming auth coverage.

## Recommended NestCalc Defaults

For goal prep:

1. `codex-repo-hygiene-gate`
2. `nestcalc-goal-grilling` for autonomous self-loop goal shaping
3. `codex-goal-prep` for `GOAL.md` updates, separate goal-memory commits, and
   thin `/goal` prompts
4. `grilling` only as the generic fallback when the repo-local skill is
   unavailable
5. `vercel-plugin:nextjs` or `clerk-*` only if the goal touches those surfaces

For implementation:

1. `vercel-plugin:nextjs`
2. `vercel-plugin:react-best-practices`
3. `tdd` for behavior changes
4. `playwright` for UI proof
5. `clerk-*` when auth or request-access behavior is in scope

For Clerk/auth goals:

1. `clerk` to route the exact task
2. `clerk-nextjs-patterns` for route protection and `proxy.ts`
3. `clerk-custom-ui` for auth UI appearance
4. `clerk-testing` for Playwright auth proof
5. `security-audit` for env, middleware, rate-limit, and bypass-related changes

For architecture refactors:

1. `improve-codebase-architecture`
2. `codebase-design`
3. `tdd`
4. `vercel-plugin:react-best-practices`

For PR closeout:

1. `codex-pr-closeout`
2. `security-audit` when auth, public server actions, PWA, or deployment surfaces
   changed
3. GitHub plugin skills if PR comments or CI are in scope
4. `codex-post-merge-cleanup` after merge

## Guardrails

- Do not use iOS/SwiftUI/Xcode skills for NestCalc web/PWA work unless a future
  native app goal explicitly requests them.
- Do not use parsing-lab, ShopQuote, Borg/wiki, CadQuery, Obsidian, RESOLV, or
  governance-specialized skills unless the active goal names those surfaces.
- When documenting read-only sub-agent lanes, state `gpt-5.4-mini` anywhere the
  lane is described: skill file, `AGENTS.md`, workflow docs, and this document.
- Quote `SKILL.md` frontmatter descriptions that contain `: ` so YAML loaders
  can discover repo-local skills reliably.
