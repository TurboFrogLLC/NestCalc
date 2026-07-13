# NestCalc Workflow

This repo uses a NanoTate-style verification workflow adapted for a Next.js 16
shop-floor calculator PWA. Keep product behavior changes separate from workflow,
verification, and architecture-support changes.

## Core Operating Model

1. Plan and align the next goal in chat.
2. For non-trivial goals, run a short goal-sharpening pass before
   implementation to lock scope, protected surfaces, verification, and stop
   conditions.
3. Use root `GOAL.md` only when the full goal workflow is requested. Keep it to
   exactly one active objective.
4. Commit `GOAL.md` and goal-supporting docs separately before implementation
   when using the full goal workflow.
5. Hand execution to Codex CLI with a thin `/goal` prompt that tells the CLI to
   read authority files first.
6. Codex CLI performs the required preflight, then executes to the stopping
   condition on a feature branch or isolated worktree.
7. Verify with deterministic checks: lint, build, unit tests, Playwright browser
   proof, PWA/offline checks when relevant, and Clerk-authenticated proof when
   valid local env values are available.
8. Bring the implementation report and diff back to chat for review.
9. Push the implementation branch and open a ready-for-review PR, not a draft,
   unless the human explicitly asks for draft.
10. Run Grok Build or GitHub review, triage findings in chat, and convert
    accepted findings into scoped follow-up work.
11. Merge only after evidence and scope are clear.
12. After merge, sync local `main`, prune stale refs, and remove obsolete local
    branches/worktrees.
13. Persist approved reusable lessons from PR closeout into
    `LESSONS_LEARNED.md`.

Keep planning, implementation, review evidence, and durable repo authority files
distinct. Architecture reviews, task lists, and PR comments do not replace
`AGENTS.md`, this workflow file, build specs, or approved lessons.

## Advisory Governed Goal Pipeline

NestCalc governance v1 is repository-local and advisory. Run
`npm run governance:check` during goal preflight and closeout. Future goals use
`docs/governance/goal-template-v1.md`; generated handoff, closeout, and
post-merge artifacts stay under the gitignored `.nestcalc/governance/`
directory. `scripts/nestcalc-governance.py` is the single command interface for
goal validation, sanitized handoff creation, closeout validation, and
stale-state-safe post-merge capture/verification. It never merges, deletes
branches, or applies lessons. Promotion to enforce mode is a separate goal and
requires the criteria in `docs/governance/README.md`.

## Autonomous Goal-Grilling Cycle

Use this cycle when the human asks to prepare the next `GOAL.md` with the
autonomous self-loop pattern. It is the preferred NestCalc planning loop for
non-trivial goals that are not ready for immediate CLI execution. Fall back to
generic grilling only when the repo-local skill is unavailable.

1. Start from chat, not the CLI. The chat planning layer owns the goal shape,
   evidence synthesis, and final `GOAL.md` edit.
2. Run repo hygiene first and classify dirty state. Continue only when the
   worktree is clean or the dirt is clearly in scope.
3. Read authority files and task-specific source before drafting:
   `AGENTS.md`, `GOAL.md` if present, `docs/WORKFLOW.md`,
   `LESSONS_LEARNED.md`, and the narrow code/test surfaces implied by the
   candidate goal.
4. Use `ask-matt`, `grilling`, and `codex-goal-prep` as the controlling skills.
   Use the repo-local `nestcalc-goal-grilling` skill when it is available.
5. Spawn bounded read-only sub-agents for independent evidence lanes such as
   source ownership, test harness state, lesson/workflow constraints, Clerk/PWA
   proof requirements, and browser/testability risks.
6. Launch every read-only sub-agent in this cycle with model override
   `gpt-5.4-mini`. No other model is permitted for read-only evidence gathering;
   do not spend the orchestrator's stronger model on those lanes.
7. The orchestrator keeps all reasoning and write authority. Sub-agents report
   evidence; they do not decide scope, edit files, or create commits.
8. Do not ask the human grilling questions during this autonomous pass. If
   evidence is incomplete or a decision is risky, choose the best scoped answer
   and flag it for review after `GOAL.md` is written.
9. Iterate internally until every open question has either repo-backed evidence
   or a flagged decision. Stop looping once no blocking questions remain and all
   residual uncertainty is explicitly flagged.
10. Update `GOAL.md` only, unless the human explicitly asked for workflow or
    support-document changes.
11. Validate with `git diff --check` and `git status --porcelain=v1`.
12. Stop before committing or generating the CLI prompt unless the human asks
    for those next steps.

The final chat response for this cycle must include confidence against that
concrete gate, validation, and flagged decisions. Flagged decisions should say
what was questionable, what was chosen, why that choice was made, and what it
means for CLI execution.

## Authority Order

Read these first for non-trivial Codex work:

1. `AGENTS.md`
2. `GOAL.md` if present
3. `LESSONS_LEARNED.md`
4. `docs/WORKFLOW.md`
5. `docs/architecture/ARCHITECTURE_REVIEW_TODO.md`
6. `NestCalc_Build_Spec.md`
7. `NestCalc_Build_Spec_V2.md`
8. `NestCalc_Build_Spec_V3.md`
9. `README.md`

The active goal controls implementation scope. The build specs control product
behavior. Architecture review docs guide refactor priorities but do not override
the active goal.

## Skill Selection Protocol

At the start of each active goal, choose the smallest useful skill set. Name the
chosen skills in `GOAL.md` or the CLI prompt when they materially affect
execution.

CLI preflight must include:

- Read active authority files first and treat the active goal as controlling
  scope.
- Identify relevant `L-nestcalc-*` lessons before editing.
- Inspect branch/worktree state and create a feature branch or isolated worktree
  for implementation.
- Load or follow only the skills needed for the active goal: goal/repo hygiene,
  Next/React/Vercel, Clerk, Playwright, security, architecture, or GitHub skills
  as applicable.
- Confirm whether browser proof must run with host/outside-sandbox permissions.
  On macOS, Playwright Chromium can fail in the managed sandbox with Mach port
  permission errors; rerun required browser proof outside the sandbox instead of
  weakening verification.

Default workflow:

1. **Repo hygiene:** run `codex-repo-hygiene-gate` before goal prep,
   implementation, PR closeout, or cleanup.
2. **Goal routing:** use `ask-matt` only when the goal shape or skill path is
   genuinely unclear.
3. **Goal sharpening:** use `nestcalc-goal-grilling` for NestCalc's autonomous
   self-loop goal-prep cycle when available. Otherwise use `define-goal`,
   `grill-me`, `grilling`, or `grill-with-docs` when acceptance criteria are
   fuzzy.
4. **Goal handoff:** use `codex-goal-prep` to update one active `GOAL.md`, keep
   goal-memory commits separate, and generate thin `/goal` prompts when asked.
5. **Implementation:** Vercel/Next/React skills for app work, Clerk skills for
   auth, Playwright/browser skills for UI proof.
6. **Architecture:** `improve-codebase-architecture` and `codebase-design` for
   deep-module refactors.
7. **Testing and bugs:** `tdd` for test-first changes and `diagnosing-bugs` for
   failures or regressions.
8. **Security/privacy:** `security-audit`, `security-threat-model`, or Codex
   security skills when auth, secrets, PWA caching, request-access forms, or
   deployment trust surfaces are in scope.
9. **PR closeout:** `codex-pr-closeout`, GitHub plugin skills, Grok review
   intake, then `codex-post-merge-cleanup` after merge.

Web/PWA skills and plugins to prefer:

- `vercel-plugin:nextjs`
- `vercel-plugin:next-best-practices`
- `vercel-plugin:react-best-practices`
- `vercel-plugin:verification`
- `vercel-plugin:deployments-cicd`
- `vercel-plugin:env-vars`
- `vercel-plugin:turbopack`
- `clerk` for routing to the right Clerk skill
- `clerk-setup` for integration setup, key pulls, and `clerk doctor`
- `clerk-nextjs-patterns` for `proxy.ts`, route protection, server/client auth,
  route handlers, and caching
- `clerk-custom-ui` for Clerk UI appearance and conditional auth rendering
- `clerk-testing` for Playwright/Cypress auth flow tests with
  `CLERK_TESTING_TOKEN`
- `clerk-cli` for Clerk CLI app/env operations
- `playwright`, `playwright-interactive`, Browser plugin
- GitHub plugin skills when PRs, CI, or comments are in scope

Not default:

- iOS/SwiftUI/Xcode skills. Use only for a future native companion app.
- Parsing-lab, ShopQuote, Borg/wiki, CadQuery, Obsidian, RESOLV, and
  governance-specialized skills unless the active goal names those surfaces.
- Firecrawl or broad web research unless current external information is needed.

## Verification Commands

Use these checks before closeout when the touched surface warrants them:

- `npm run lint`
- `npm run build`
- `npm run test` or `npm run test:unit`
- `npm run test:e2e`
- `npm run test:e2e:auth` when valid Clerk test env is available

Treat missing Clerk authenticated E2E values as blocked auth proof, not a pass.
The public Playwright suite still covers the public PWA/offline shell and
manifest without signing in, but the Playwright `webServer` still needs valid
Clerk test-mode `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in
`.env.local` so `next start` can boot behind `clerkMiddleware`.

## Clerk Authenticated E2E Env

Use Clerk test-mode keys and a non-production test user only. Keep real values
in `.env.local` or CI secrets, never in committed files.

Required for public Clerk-backed Playwright proof:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` or `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Required for authenticated Playwright proof:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` or `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `E2E_CLERK_USER_EMAIL`
- `E2E_CLERK_USER_PASSWORD`

Optional:

- `CLERK_TESTING_TOKEN`

`E2E_CLERK_USER_EMAIL` must be a Clerk test email containing `+clerk_test`.
The setup project creates or updates that test user, signs in through Clerk's
official Playwright helpers, and writes local storage state under
`playwright/.clerk/`.

## Browser And PWA Evidence

Use Playwright for app-shell, PWA-sensitive, auth, and interaction work. Prefer
evidence from:

- desktop browser proof for normal calculator shell behavior
- mobile viewport proof for layout/touch-sensitive changes
- `/~offline` proof for Serwist/offline shell work
- authenticated `/` proof when Clerk test env is present

Restart stale local `next start` or `next dev` processes before diagnosing
browser proof failures after a rebuild. A stale process can serve obsolete
chunks and make app behavior look broken when the current build is valid.

Do not add localhost-only production auth bypasses. If a future harness needs a
development shortcut, document it as local-only scaffolding and keep it out of
production behavior. Label any bypassed evidence as bypassed-local proof and do
not claim production auth coverage from it.

## Security Gate

Run a security/privacy review before merging changes that touch:

- Clerk middleware, auth routes, or environment handling
- request-access form handling, Resend, rate limits, or public server actions
- localhost auth bypass or Clerk testing harness behavior
- service worker or cache strategy
- deployment configuration

## Protected Surfaces

Do not change calculator math, calculator UI, PWA runtime behavior, Clerk
production auth policy, app routes, sign-up behavior, or request-access policy
unless the active goal explicitly includes that work.

For the next architecture wave, implement the Nest session module refactor only
after verification infrastructure is green or any auth proof blocker is clearly
external.

## PR Publication And Merge Hygiene

Implementation waves should normally end in a ready-for-review PR. Do not open
draft PRs by default; ready PRs allow Vercel, Socket, Codex, and GitHub review
automation to run without a human manually pressing "Ready for review."

PRs should include:

- Why the change exists.
- What changed.
- Module or ownership boundaries when relevant.
- Verification commands and results.
- Known limitations, skipped proof, or follow-up lessons.

When triaging Codex or Grok review threads, compare the reviewed commit SHA to
current PR HEAD. Ignore, resolve, or explicitly defer stale-SHA threads that
were already fixed by later commits.

Do not merge with required verification partially failed. If a required command
fails, treat it as a blocker and continue diagnosing when the failure is inside
the active goal or its proof harness. Close out as blocked only when the failure
is genuinely external and cannot be resolved from the current goal.

After a PR is merged:

- `git fetch --prune origin`
- `git checkout main`
- `git pull --ff-only origin main`
- Remove obsolete worktrees first, after confirming they belong to the merged PR
  and have no uncommitted user changes.
- Delete merged local feature branches with `git branch -d <branch>` only after
  their worktrees are gone.
- Persist approved reusable lessons from PR closeout into `LESSONS_LEARNED.md`.
