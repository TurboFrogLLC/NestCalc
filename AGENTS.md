<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all
differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation
notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md - NestCalc

## Project Overview

HowMany is the product name for this Next.js 16 web PWA for fast rectangular
nesting on shop-floor scraps and remnants. **NestCalc remains the repository
name.** The full locked brand line is **HowMany by wReckless Toddler LLC**. It
uses Clerk authentication, Serwist/PWA infrastructure, and Vercel deployment
patterns. Keep it web/PWA first for now; future iOS work is out of scope unless
a goal explicitly names it.

The product name, full brand line, and header wordmark are locked authority:
the header is the left gradient square with its icon plus free-standing
lowercase `h`, Lucide `CircleQuestionMark`, and `wMany`, with no surrounding
pill, box, outline, or grouped text container. Do not change its icon, letter
case, spacing, or structure without a new human decision. The accepted
`docs/ui-shell` lineage (canonical source:
`docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html`) is the locked
visual/structure authority for future wiring. It is protected from casual
overwrite, replacement, or reinterpretation without a new human decision.

## Core Authority And Reading Order

Read these first for significant goals or feature waves. Later items do not
override earlier ones unless the active goal explicitly narrows product scope:

1. `AGENTS.md` (this file)
2. `GOAL.md` when present — active scope authority for the current wave
3. `docs/WORKFLOW.md`
4. `docs/governance/goal-lifecycle-contract.md` and `docs/governance/README.md`
   when the goal or handoff path is in scope
5. `LESSONS_LEARNED.md`
6. `docs/architecture/ARCHITECTURE_REVIEW_TODO.md`
7. `NestCalc_Build_Spec.md`
8. `NestCalc_Build_Spec_V2.md`
9. `NestCalc_Build_Spec_V3.md`
10. `README.md`

`GOAL.md` must stay to one active objective and must not become an execution
transcript. Soft inference is forbidden: if authority conflicts, stop and flag.

Governance contracts are **enforce-grade**. `docs/governance/MODE` is
`advisory` until promotion criteria in
`docs/governance/GAP-AND-HARDENING.md` are met. MODE does not make contracts
optional.

## Role Separation

### Chat Planning Layer

- Planning, architecture decisions, workflow enforcement, prompt drafting,
  review intake, and PR/Grok Build triage.
- Creates or refines `GOAL.md` only when the goal workflow is explicitly in use.
- Autonomous NestCalc goal prep **MUST** use `nestcalc-goal-grilling`.
- Drafts thin Codex CLI `/goal` prompts when the human asks for CLI handoff.
- Reviews implementation results, diffs, evidence, and follow-up risk.

### Codex CLI / Grok Build CLI Execution Layer

- Primary implementation surface for non-trivial product changes.
- Reads active authority files first and treats the active goal as controlling
  scope.
- Runs B4-style preflight before first implementation edit (see WORKFLOW).
- Runs local verification and reports exact evidence back to chat.
- Does not expand scope into protected surfaces unless the active goal names
  them.
- Does not invent approvals, Flow-IDs mid-cycle, or merge authority.

### Grok Build Review Layer

- PR review and critique only unless the human explicitly directs otherwise.
- Findings are brought back to chat, triaged, and converted into scoped follow-up
  goals or commits.
- PR closeout uses the global `pr-closeout-breakdown` skill: post the breakdown
  comment with section 8 merge disposition, required Flow ID, validate with
  `validate-closeout-breakdown`, and preview lesson persistence to the canonical
  checkout.
- NestCalc closeout stage codes: **B6** review, **B7** closeout, **B8** human
  merge, **B9** post-merge. Do not invent conflicting stage codes.

### Human

- Provides final approval on major waves, goal confidence, workflow deviations,
  merge readiness, deployment, and production decisions.
- Supplies valid local Clerk/Vercel credentials when authenticated browser proof
  is required.
- Sole authority for MODE promotion and merge.

## Workflow Rules (Fail-Closed)

1. Discuss and select significant goals in chat before implementation.
2. Keep any root `GOAL.md` to exactly one active goal.
3. Commit goal-memory docs separately from implementation when using the goal
   workflow.
4. Hand non-trivial implementation to Codex CLI with a thin `/goal` prompt and a
   durable B3-style execution handoff (`create-handoff`, prompt hash only).
5. CLI execution **MUST** start from B4-style preflight: read authority files,
   validate goal, confirm handoff/branch/lessons, choose the smallest useful
   skill set, create a feature branch or worktree, keep implementation off local
   `main`. Preflight failure → stop.
6. After CLI execution, review `git status`, inspect scope, run or confirm
   verification, then commit implementation separately.
7. Completed implementation waves push a branch and open a ready-for-review
   GitHub PR, not a draft PR, unless the human explicitly asks for draft.
8. Required verification failures are blockers. Continue diagnosing in-scope
   failures; do not close out with partial proof claimed as pass.
9. Browser/PWA proof is required for UI work before calling it complete.
10. After merge, sync `main`, prune stale refs, remove merged local branches or
    obsolete worktrees, and persist approved lessons from PR closeout into
    `LESSONS_LEARNED.md`.
11. Architecture reviews, task lists, or PR closeout comments do not replace
    durable repo authority files.
12. Do not flip `docs/governance/MODE` outside a dedicated promotion goal that
    meets `docs/governance/GAP-AND-HARDENING.md`.

See `docs/WORKFLOW.md` for the full operating model.

## Skill Routing

Choose the smallest skill/plugin set needed for the active goal. Do not load
every skill by default. Name material skills in `GOAL.md` or the CLI prompt.

Default workflow skill order:

- `codex-repo-hygiene-gate` before goal prep, implementation, PR closeout, or
  cleanup. Unrelated dirty state → stop.
- `ask-matt` only when the goal shape or skill path is genuinely unclear.
- `nestcalc-goal-grilling` for autonomous NestCalc goal prep: evidence →
  confidence → decision → residual risk / flagged decisions; read-only
  sub-agents with `gpt-5.6-terra` at medium reasoning effort only;
  orchestrator retains write authority; stop before commit or CLI prompt unless
  the human asks.
- `codex-goal-prep` for `GOAL.md` updates, separate goal-memory commits, and
  thin `/goal` prompts when the human requests handoff.
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

Out of scope by default (hard wall unless the active goal names them):

- iOS/SwiftUI/Xcode skills.
- Parsing-lab, Borg/wiki, CadQuery, Obsidian, RESOLV, and ShopQuote-specific
  skills.
- NanoTate enterprise long-tail (SBOM, env-proxy, golden pipeline) as NestCalc
  required gates.

## Product Guardrails

- Preserve calculator math unless the active goal explicitly changes it.
- Preserve AutoNest packing ranking, counts, trim-edge policies, fallback
  guards, and search budget unless the active goal explicitly changes them.
- Preserve current Clerk auth policy, request-access policy, and route shape
  unless the active goal explicitly changes them.
- Preserve the locked HowMany identity, header wordmark, and `docs/ui-shell`
  authority lineage unless a new human decision explicitly changes them.
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
- `npm run governance:check` and `npm run test:governance` for governance waves
- Playwright browser proof for UI flows
- PWA/offline-shell checks for PWA changes

When valid Clerk environment values are unavailable, report authenticated or
public Clerk-backed browser proof as **blocked**, never as a pass.

## Protected Surfaces

Do not touch these unless the active goal explicitly includes them:

- calculator math and nesting behavior
- AutoNest engine packing, ranking, counts, trim-edge policies, fallback guards,
  and search budget
- calculator UI layout and input behavior
- Clerk production auth policy and request-access policy
- app routes and sign-up behavior
- secrets, `.env*`, deployment credentials, or Vercel project settings
- PWA service-worker/runtime cache behavior
- repository governance files outside the requested workflow scope
- HowMany product identity, locked header wordmark, and `docs/ui-shell`
  visual/structure authority lineage; changing these requires a new human
  decision, not merely an active goal that names them
- active product `GOAL.md` content during governance-only waves
- `docs/governance/MODE` outside a dedicated promotion goal
- native iOS companion app planning or implementation

## Useful Files

- `docs/WORKFLOW.md` — operating model and skill map
- `docs/governance/goal-lifecycle-contract.md` — harden-grade lifecycle gates
- `docs/governance/GAP-AND-HARDENING.md` — soft→hard record and MODE promotion
- `docs/SKILL_AND_PLUGIN_RECOMMENDATIONS.md` — capability inventory and defaults
- `docs/architecture/ARCHITECTURE_REVIEW_TODO.md` — architecture recommendations
- `LESSONS_LEARNED.md` — reusable PR closeout lessons
- `NestCalc_Build_Spec.md`, `NestCalc_Build_Spec_V2.md`, and
  `NestCalc_Build_Spec_V3.md` — product direction
- `README.md` — high-level project description

Update this file when the project workflow, protected surfaces, or skill routing
changes.
