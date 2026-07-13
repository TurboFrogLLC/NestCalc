<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all
differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation
notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md - NestCalc

## Project Overview

NestCalc is a Next.js 16 web PWA for fast rectangular nesting on shop-floor
scraps and remnants. It uses Clerk authentication, Serwist/PWA infrastructure,
and Vercel deployment patterns. Keep it web/PWA first for now; future iOS work
is out of scope unless a goal explicitly names it.

## Core Authority And Reading Order

Read these first for significant goals or feature waves:

1. `AGENTS.md`
2. `docs/WORKFLOW.md`
3. `LESSONS_LEARNED.md`
4. `docs/architecture/ARCHITECTURE_REVIEW_TODO.md`
5. `NestCalc_Build_Spec.md`
6. `NestCalc_Build_Spec_V2.md`
7. `NestCalc_Build_Spec_V3.md`
8. `README.md`

If a root `GOAL.md` exists for a future wave, read it immediately after
`AGENTS.md` and treat it as the active scope authority. `GOAL.md` must stay to
one active objective and must not become an execution transcript.

## Role Separation

### Chat Planning Layer

- Planning, architecture decisions, workflow enforcement, prompt drafting,
  review intake, and PR/Grok Build triage.
- Creates or refines `GOAL.md` only when the goal workflow is explicitly in use.
- Drafts thin Codex CLI `/goal` prompts when implementation should move to CLI.
- Reviews implementation results, diffs, evidence, and follow-up risk.

### Codex CLI / Grok Build CLI Execution Layer

- Primary implementation surface for non-trivial product changes.
- Reads active authority files first and treats the active goal as controlling
  scope.
- Runs local verification and reports exact evidence back to chat.
- Does not expand scope into protected surfaces unless the active goal names
  them.

### Grok Build Review Layer

- PR review and critique only unless the human explicitly directs otherwise.
- Findings are brought back to chat, triaged, and converted into scoped follow-up
  goals or commits.
- PR closeout uses the global `pr-closeout-breakdown` skill: post the breakdown
  comment with section 8 merge disposition, validate with
  `validate-closeout-breakdown`, and preview lesson persistence to the canonical
  checkout.

### Human

- Provides final approval on major waves, goal confidence, workflow deviations,
  merge readiness, deployment, and production decisions.
- Supplies valid local Clerk/Vercel credentials when authenticated browser proof
  is required.

## Workflow Rules

1. Discuss and select significant goals in chat before implementation.
2. Keep any root `GOAL.md` to exactly one active goal.
3. Commit goal-memory docs separately from implementation when using the goal
   workflow.
4. Hand non-trivial implementation to Codex CLI with a thin `/goal` prompt.
5. CLI execution must start from a hygiene preflight: read authority files,
   identify relevant `L-nestcalc-*` lessons, choose the smallest useful skill
   set, create a feature branch or worktree, and keep implementation off local
   `main`.
6. After CLI execution, review `git status`, inspect scope, run or confirm
   verification, then commit implementation separately.
7. Completed implementation waves should push a branch and open a
   ready-for-review GitHub PR, not a draft PR, unless the human explicitly asks
   for draft.
8. Treat required verification failures as blockers. Continue diagnosing
   in-scope failures instead of closing out with partial proof.
9. Browser/PWA proof is required for UI work before calling it complete.
10. After merge, sync `main`, prune stale refs, remove merged local branches or
    obsolete worktrees, and persist approved lessons from PR closeout into
    `LESSONS_LEARNED.md`.
11. Do not let architecture reviews, task lists, or PR closeout comments replace
    durable repo authority files.

See `docs/WORKFLOW.md` for the full operating model.

## Skill Routing

Choose the smallest skill/plugin set needed for the active goal. Do not load
every skill by default.

Default workflow skill order:

- `codex-repo-hygiene-gate` before goal prep, implementation, PR closeout, or
  cleanup.
- `ask-matt` only when the goal shape or skill path is genuinely unclear.
- `nestcalc-goal-grilling` for the autonomous NestCalc goal-prep loop:
  chat-side self-grilling, read-only sub-agents launched with `gpt-5.4-mini`,
  flagged decisions, and stop before commit or CLI prompt unless requested.
- `codex-goal-prep` for `GOAL.md` updates, separate goal-memory commits, and
  thin `/goal` prompts.
- `codex-pr-closeout`, `codex-grok-review-intake`, and
  `codex-post-merge-cleanup` for PR lifecycle work.
- `lessons-aware-plan-scanner` or direct `LESSONS_LEARNED.md` review before
  implementation and PR closeout.

Default web app skills/plugins:

- `vercel-plugin:nextjs`, `vercel-plugin:react-best-practices`,
  `vercel-plugin:next-best-practices`, and `vercel-plugin:verification` for
  Next.js/React/Vercel implementation and verification.
- `clerk` as the auth router skill. Use it to choose the specific Clerk skill.
- `clerk-setup` for Clerk app/env setup, key pulls, and integration health
  checks.
- `clerk-nextjs-patterns` for `proxy.ts`, protected routes, server/client auth
  APIs, route handlers, and caching behavior.
- `clerk-custom-ui` for sign-in appearance, `<Show>`, and auth UI polish.
- `clerk-testing` for Playwright/Cypress auth tests. It requires Clerk test keys
  and usually `CLERK_TESTING_TOKEN`.
- `clerk-cli` for Clerk CLI operations such as `clerk env pull`, `clerk doctor`,
  app linking, and environment refreshes.
- `playwright` or `playwright-interactive`, plus Browser plugin capabilities,
  for browser proof.
- `tdd` for test-first feature or bug work.
- `diagnosing-bugs` for failing, broken, slow, or unexplained behavior.
- `improve-codebase-architecture` and `codebase-design` for deep-module
  refactors and architecture review.
- `security-audit`, `security-threat-model`, and Codex security skills for
  auth, secrets, PWA, deployment, or public request-access surfaces.

Out of scope by default:

- iOS/SwiftUI/Xcode skills. Use them only when a future native app is explicitly
  in scope.
- Parsing-lab, Borg/wiki, CadQuery, Obsidian, RESOLV, and ShopQuote-specific
  skills unless the active goal explicitly crosses into those ecosystems.

## Product Guardrails

- Preserve calculator math unless the active goal explicitly changes it.
- Preserve current Clerk auth policy, request-access policy, and route shape
  unless the active goal explicitly changes them.
- Keep real secrets and production auth values out of committed files.
- Keep PWA/service-worker changes narrow and verified with browser/PWA proof.
- Keep the app small, fast, and shop-floor focused.

## Verification Expectations

Use the strongest verification practical for the active goal:

- `npm run lint`
- `npm run build`
- `npm run test` or `npm run test:unit`
- `npm run test:e2e` when valid Clerk publishable/secret keys are available
- `npm run test:e2e:auth` when full Clerk E2E values are available
- Playwright browser proof for UI flows
- PWA/offline-shell checks for PWA changes

When valid Clerk environment values are unavailable, report authenticated or
public Clerk-backed browser proof as blocked rather than weakening the
verification claim.

## Protected Surfaces

Do not touch these unless the active goal explicitly includes them:

- calculator math and nesting behavior
- calculator UI layout and input behavior
- Clerk production auth policy and request-access policy
- app routes and sign-up behavior
- secrets, `.env*`, deployment credentials, or Vercel project settings
- PWA service-worker/runtime cache behavior
- repository governance files outside the requested workflow scope
- native iOS companion app planning or implementation

## Useful Files

- `docs/WORKFLOW.md` - operating model and skill map
- `docs/SKILL_AND_PLUGIN_RECOMMENDATIONS.md` - capability inventory and defaults
- `docs/architecture/ARCHITECTURE_REVIEW_TODO.md` - current architecture
  recommendations
- `LESSONS_LEARNED.md` - reusable PR closeout lessons
- `NestCalc_Build_Spec.md`, `NestCalc_Build_Spec_V2.md`, and
  `NestCalc_Build_Spec_V3.md` - product direction
- `README.md` - high-level project description

Update this file when the project workflow, protected surfaces, or skill routing
changes.
