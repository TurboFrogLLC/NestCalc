# GOAL.md - NestCalc

## Active Goal: AutoNest Pure Domain Engine Slice

### Objective

Implement the first real AutoNest engine slice as pure domain logic only: deterministic two-group rectangular packing, straight trim-line placement, usefulness/fallback decisions, and session integration through the existing AutoNest result vocabulary.

This goal must not add visible UI. It should replace the current `engine-not-implemented` placeholder path with tested pure calculation output where inputs are sufficient, while preserving the manual calculator behavior exactly.

### Why This Is Next

PR #22 added the mode-aware app state, AutoNest settings, `AutoNestResult` union, and `createNestSession()` placeholder. The remaining blocker before UI/preview work is a real pure engine that can produce `fallback` or `computed` AutoNest results from current `NestInputs` and `AutoNestSettings`.

The engine should live behind a small domain interface. `src/lib/nestcalc.ts` should remain the uniform/manual helper layer; do not turn it into the AutoNest engine module.

### Required Reading

Read these before editing code:

- `AGENTS.md`
- `GOAL.md`
- `docs/WORKFLOW.md`
- `LESSONS_LEARNED.md`
- `docs/AutoNest_Spec.md`
- `docs/roadmap.md`
- `docs/AutoNest_Integration_Analysis.md`
- `NestCalc_Build_Spec_V3.md`
- `src/lib/types.ts`
- `src/lib/nestSession.ts`
- `src/lib/nestcalc.ts`
- `src/lib/nestSession.test.ts`
- `src/lib/nestcalc.test.ts`
- `src/lib/storage.test.ts`

Relevant lessons to account for:

- `L-nestcalc-autonest-app-state-v3`
- `L-nestcalc-autonest-not-ready-result`
- `L-nestcalc-session-boundary-test-surface`
- `L-nestcalc-goal-required-docs-commit`
- `L-nestcalc-grok-review-role-separation`
- `L-nestcalc-codex-stale-sha-guard`
- `L-nestcalc-pr-branch-main-sync`

### Scope

Add a pure AutoNest engine module, likely `src/lib/autoNestEngine.ts`, or an equivalent name that fits the codebase.

The engine should:

- consume `NestInputs` and `AutoNestSettings`
- reuse existing uniform/manual helpers such as `calculateNest` and `partsInDimension` where appropriate
- compute best uniform comparison for 0-degree and 90-degree orientations
- pack a 0-degree group and a 90-degree group independently with gap-only inner spacing
- use simple orthogonal grid/shelf/level-style rectangular packing only
- compute each group minimum bounding rectangle
- place the two group bounding rectangles on one remnant with one straight horizontal or vertical trim line
- respect origin/clamp margins from the AutoNest settings model
- include full trim-facing margin clearance in the fit check
- return `AutoNestResult` using the existing `fallback` or `computed` branches
- keep `bestUniform` present in AutoNest results

Wire `createNestSession()` so AutoNest mode calls the engine instead of always returning the `not-ready` placeholder when enough inputs exist.

It is acceptable to keep an explicit `not-ready` or `fallback` result for insufficient inputs or other invalid inputs, but do not leave the normal valid-input path as `engine-not-implemented`.

### Engine Rules

Keep this practical and deterministic.

- Parts are rectangles only.
- Orientations are only `0deg` and `90deg`.
- Groups do not interleave.
- No irregular nesting, no no-fit-polygon logic, no part-in-part logic.
- No automatic skeleton or complex scrap trimming.
- Trim line is calculated after group packing.
- Prefer total part count first, then clean/useful blanks.
- Fall back when two-group output is not useful.

Usefulness/fallback rules:

- fall back if the two-group result produces fewer total parts than best uniform
- fall back if either resulting blank is impractically thin or unusable
- fall back if anchored origin/clamp margin rules are violated
- fall back on insufficient or invalid input

If a practical thin-blank threshold is needed, choose a conservative deterministic rule, document it in code/tests, and flag it in the closeout.

### Out Of Scope

Do not do any of the following in this goal:

- visible AutoNest toggle UI
- settings gear UI
- preview rendering
- results/comparison UI
- color-coded groups or trim-line SVG drawing
- app-shell layout changes
- storage schema changes
- Clerk auth, request-access, routes, middleware, `.env*`, Vercel, or PWA changes
- native iOS work
- historical spec rewrites
- broad shell/component refactors

Do not change manual calculator behavior or manual UI behavior.

### Protected Manual Behaviors

Manual calculator behavior must remain exactly intact:

- default/manual mode behavior remains unchanged
- manual result numbers remain unchanged for equivalent inputs
- remnant rotation swaps remnant X/Y and gap X/Y
- part rotation swaps part X/Y only
- margins remain fixed on remnant rotation by default
- margins rotate only when `moveMarginsWithRotation` is enabled
- linked Part X/Y and Gap X/Y behavior remains unchanged
- Swap Part and Swap Gap behavior remains unchanged
- unit toggle conversion remains unchanged
- Clear returns the same current manual default state
- existing Clerk-gated app behavior remains unchanged

### Expected Implementation Shape

Likely implementation files:

- `src/lib/autoNestEngine.ts`
- `src/lib/autoNestEngine.test.ts`
- `src/lib/nestSession.ts`
- `src/lib/nestSession.test.ts`
- `src/lib/types.ts` only if the existing result vocabulary needs a narrow additive refinement

Avoid touching:

- `src/components/NestCalcApp.tsx`
- `src/components/NestGrid.tsx`
- `src/hooks/useNestInputs.ts`
- `src/lib/storage.ts`

Only touch avoided files if TypeScript compatibility requires a tiny non-visual adapter change. Stop if UI or storage changes become necessary.

### Verification

Run and report:

- `git diff --check`
- `npm run lint`
- `npm run build`
- `npm run test`

Playwright is not required unless the implementation unexpectedly changes app shell, UI, storage hydration, or browser-visible behavior. If Playwright becomes warranted and Clerk env is unavailable, report it as blocked by missing valid Clerk env, not passed.

### Acceptance Criteria

This goal is complete when:

- a pure AutoNest engine module exists
- valid AutoNest inputs can produce a `computed` two-group result
- invalid/insufficient/not-useful inputs produce a clear `fallback` or not-ready result
- `bestUniform` is computed and included
- group bounding boxes, blank sizes, trim-line orientation/position, achieved margins, per-group counts, and origin offset are populated for computed results
- `createNestSession()` uses the engine for AutoNest mode
- existing manual session tests still pass
- new engine tests cover computed, fallback, insufficient input, orientation, and margin/trim-line behavior
- lint, build, and unit tests pass

### Required Execution Closeout

The CLI execution must finish with a ready-for-review GitHub PR, not just a local commit.

At closeout:

- create or use a `codex/` feature branch
- commit implementation files separately from `GOAL.md`
- push the feature branch
- open a ready-for-review PR to `main`, not a draft
- include verification evidence in the PR body
- mention explicitly that no UI, Clerk, PWA, storage schema, or manual behavior changes were made
- trigger or request the normal review loop after the PR opens

GitHub auth, push, and PR creation are publication steps that may need to run
outside the managed sandbox. Preload the needed GitHub tools/skills, check
`gh auth status`, and request or use the required outside-sandbox permission for
`git push` / `gh pr create` rather than treating a sandbox restriction as an
auth or remote blocker. Stop and report blocked only if the authorized
outside-sandbox path is unavailable, GitHub auth is genuinely missing, push is
rejected, or PR creation fails for a real GitHub/remote reason.

### Stop Conditions

Stop and ask for direction before proceeding if:

- a visible UI change appears necessary
- storage/schema changes appear necessary
- the engine requires changing current manual calculator math
- Clerk, PWA, route, env, or deployment changes appear necessary
- AutoNest scope starts expanding into preview/results UI
- deterministic usefulness/fallback rules cannot be chosen from the spec and existing code

### Expected Closeout Evidence

The implementation closeout should include:

- changed files
- feature branch name
- implementation commit hash
- PR URL
- engine behavior summary
- fallback/usefulness rule summary
- tests added or updated
- verification command results
- explicit statement that visible AutoNest UI and preview were not implemented
- residual risks before the AutoNest UI/preview goal
