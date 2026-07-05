# GOAL.md - NestCalc

## Active Goal: AutoNest Engine Performance Guard

### Objective

Add a deterministic performance guard around AutoNest calculation so extreme
inputs cannot lock the UI render path when AutoNest mode is active.

This is a narrow engine/session safety slice. It should keep normal shop-floor
AutoNest results unchanged, but short-circuit impractically large search spaces
to a clear fallback result before the two-group search can run for too long.

Manual mode, the current AutoNest UI, Clerk, PWA, storage schema, and the full
AutoNest preview/settings roadmap are out of scope.

### Why This Is Next

PR #24 made AutoNest visible in the calculator UI. A Codex review thread flagged
that `calculateAutoNest()` now runs synchronously from the render/session path,
so extreme part/remnant ratios can lock the UI while the engine loops through a
very large two-group candidate search.

The current hotspot is `findBestTwoGroupCandidate()` in
`src/lib/autoNestEngine.ts`: it iterates possible first-group columns/rows for
both orientations. That is fine for typical shop remnants, but it is unbounded
for pathological inputs.

The best next move is to guard the pure engine search before adding full preview
or settings UI.

### Required Reading

Read these before editing code:

- `AGENTS.md`
- `GOAL.md`
- `docs/WORKFLOW.md`
- `LESSONS_LEARNED.md`
- `docs/AutoNest_Spec.md`
- `docs/roadmap.md`
- `docs/AutoNest_Integration_Analysis.md`
- `src/lib/autoNestEngine.ts`
- `src/lib/autoNestEngine.test.ts`
- `src/lib/nestSession.ts`
- `src/lib/nestSession.test.ts`
- `src/lib/types.ts`
- `src/components/NestCalcApp.tsx`
- `e2e/authenticated.spec.ts`
- `e2e/locators.ts`

Relevant lessons to account for:

- `L-nestcalc-autonest-app-state-v3`
- `L-nestcalc-autonest-pure-engine-module`
- `L-nestcalc-autonest-thin-blank-guard`
- `L-nestcalc-autonest-minimal-ui-activation`
- `L-nestcalc-rotate-aria-label-e2e`
- `L-nestcalc-session-boundary-test-surface`
- `L-nestcalc-playwright-clerk-boot`
- `L-nestcalc-grok-review-role-separation`
- `L-nestcalc-codex-stale-sha-guard`
- `L-nestcalc-pr-branch-main-sync`

### Required Skills And Agent Model

Start with repo hygiene and authority-file preflight.

Use the smallest useful skill set:

- `codex-repo-hygiene-gate`
- `tdd` or equivalent test-first discipline for the guard behavior
- `diagnosing-bugs` only if an existing regression/failure appears
- GitHub / PR workflow skills for closeout

If read-only sub-agents are useful during execution, launch every read-only
sub-agent with model override `gpt-5.4-mini`. The orchestrator owns all writes
and final decisions.

### Scope

Add a deterministic guard for AutoNest engine work.

Expected behavior:

- Estimate or bound the candidate search before expensive two-group iteration.
- For normal, practical shop-floor inputs, return the same `computed` or
  `fallback` results as today.
- For extreme inputs that would produce an impractically large search space,
  skip the two-group search and return a safe fallback to `bestUniform`.
- Make the fallback reason explicit if the existing result vocabulary cannot
  clearly distinguish the guard path.
- Keep `bestUniform` populated for guarded fallback results.
- Preserve invalid-input handling and the existing thin-blank guard.
- Keep all engine behavior deterministic.

The guard may use one of these implementation shapes:

- a preflight search-budget estimate before `findBestTwoGroupCandidate()`
- a bounded candidate counter inside the two-group search
- a small combination of both if needed for correctness and clarity

Prefer a simple, readable threshold with tests over a clever optimizer. If a
threshold is introduced, document why it exists in code or tests and mention it
in closeout.

Allowed implementation files:

- `src/lib/autoNestEngine.ts`
- `src/lib/autoNestEngine.test.ts`
- `src/lib/types.ts` only if adding a narrow fallback reason
- `src/lib/nestSession.ts` only if a tiny session-facing adapter is needed
- `src/lib/nestSession.test.ts` only if session behavior needs coverage
- `src/components/NestCalcApp.tsx` only if a new fallback reason must be
  formatted for the existing compact UI

Prefer not to touch:

- `src/components/NestGrid.tsx`
- `src/hooks/useNestInputs.ts`
- `src/lib/storage.ts`
- `src/lib/nestcalc.ts`
- `e2e/*`

Only touch preferred-avoid files if TypeScript compatibility or existing tests
require a tiny adapter. Stop if larger UI, storage, or browser-test changes
appear necessary.

### Out Of Scope

Do not implement any of the following in this goal:

- web worker execution
- async/deferred React calculation state
- debounce/throttle UI behavior
- full AutoNest preview rendering
- settings gear UI
- editable AutoNest settings UI
- storage schema changes
- Clerk auth, request-access, routes, middleware, `.env*`, Vercel, or PWA changes
- native iOS work
- broad algorithm replacement such as MaxRects/guillotine library adoption
- broad layout or component refactors

### Protected Behaviors

Manual calculator behavior must remain exactly intact:

- manual mode remains default
- manual result numbers remain unchanged
- manual preview remains unchanged
- manual rotations, link/swap, clear, margins, and unit conversion remain
  unchanged
- existing Clerk-gated app behavior remains unchanged

AutoNest behavior must remain stable for existing practical cases:

- current computed test cases still compute the same total parts, trim line, and
  blank geometry
- current fallback test cases still fall back for the same reasons unless the
  new guard explicitly covers only extreme search-budget cases
- invalid or insufficient inputs still return safe zero fallback values
- `calculateBestUniformNest()` behavior remains unchanged

### Performance Guard Guidance

The guard exists to prevent UI lockups, not to make AutoNest globally optimal.

Choose a deterministic budget that is clearly above normal expected shop-floor
inputs and low enough that pathological inputs cannot freeze a browser render.
The exact value is a scoped engineering decision for this goal, but it must be
covered by tests and reported in closeout.

Do not silently clamp dimensions or part counts. If the search is skipped due to
budget, return a clear fallback result rather than pretending a two-group result
was evaluated.

### Verification

Run and report:

- `git diff --check`
- `npm run lint`
- `npm run build`
- `npm run test`

Playwright is not required if this remains a non-visual engine/session guard.
Run `npm run test:e2e` and `npm run test:e2e:auth` only if the implementation
touches browser-visible behavior, locators, UI formatting beyond a tiny fallback
string, Clerk/PWA surfaces, or app-shell interaction behavior.

If Playwright becomes required and valid Clerk test env values are missing,
report the affected proof as blocked by missing valid Clerk env, not passed. Do
not commit secrets or `.env.local`.

### Acceptance Criteria

This goal is complete when:

- AutoNest has a deterministic search/performance guard.
- Extreme inputs return quickly with a safe fallback to `bestUniform`.
- The guarded fallback is explicit and tested.
- Existing practical AutoNest computed/fallback tests still pass unchanged.
- New tests cover the guard path and prove it does not return invalid geometry.
- Manual session behavior remains unchanged.
- No storage, Clerk, PWA, route, settings UI, preview, or manual math changes
  were introduced.
- lint, build, and unit tests pass.

### Required Execution Closeout

The CLI execution must finish with a ready-for-review GitHub PR, not just a
local commit.

At closeout:

- create or use a `codex/` feature branch
- commit implementation files separately from `GOAL.md`
- push the feature branch
- open a ready-for-review PR to `main`, not a draft
- include verification evidence in the PR body
- mention explicitly that UI layout, full AutoNest preview, settings gear,
  Clerk, PWA, storage schema, routes, and manual calculator math were not
  changed
- trigger or request the normal review loop after the PR opens

GitHub auth, push, and PR creation are publication steps that may need to run
outside the managed sandbox. Preload the needed GitHub tools/skills, check
`gh auth status`, and request or use the required outside-sandbox permission for
`git push` and `gh pr create` rather than treating a sandbox restriction as an
auth or remote blocker. Stop and report blocked only if the authorized
outside-sandbox path is unavailable, GitHub auth is genuinely missing, push is
rejected, or PR creation fails for a real GitHub/remote reason.

### Stop Conditions

Stop and ask for direction before proceeding if:

- preventing the lockup appears to require async React state, a web worker, or
  broader UI scheduling work
- the guard would change normal practical AutoNest outputs
- storage/schema changes become necessary
- current manual calculator math needs to change
- Clerk, PWA, route, env, or deployment changes appear necessary
- browser-visible behavior changes enough that new Playwright proof is required
  but cannot run because both sandbox and authorized outside-sandbox execution
  paths are unavailable

### Expected Closeout Evidence

The implementation closeout should include:

- changed files
- feature branch name
- implementation commit hash
- PR URL
- guard strategy and threshold/budget used
- summary of protected surfaces left untouched
- tests added or updated
- verification command results
- whether Playwright was not required or was run
- residual risks before full AutoNest preview/settings work
