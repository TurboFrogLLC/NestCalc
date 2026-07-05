# GOAL.md - NestCalc

## Active Goal: AutoNest Mode State And Settings Foundation

### Objective

Prepare NestCalc for AutoNest by adding a mode-aware session/state model, an AutoNest-ready result vocabulary, and the small persisted AutoNest settings model, while preserving the current manual calculator behavior exactly.

This is a foundation goal. Do not implement AutoNest packing, the AutoNest toggle UI, the settings gear UI, the AutoNest preview, trim-line layout, or comparison/results UI in this pass.

### Why This Is Next

PR #21 created the manual nest session boundary. The remaining blocker before real AutoNest work is that the app still has only:

- one flat `NestInputs` shape
- one manual-only `NestResult`
- one manual-only `ManualNestSession`
- one flat persisted input object under the existing storage key
- one `useNestInputs` store that exposes only `NestInputs`

`docs/AutoNest_Spec.md` and `docs/AutoNest_Integration_Analysis.md` make AutoNest a second operating mode, not a replacement for manual mode. The next implementation needs domain vocabulary for that second mode before any engine or UI work lands.

### Required Reading

Read these before editing code:

- `AGENTS.md`
- `GOAL.md`
- `docs/WORKFLOW.md`
- `LESSONS_LEARNED.md`
- `docs/AutoNest_Spec.md`
- `docs/roadmap.md`
- `docs/AutoNest_Integration_Analysis.md`
- `docs/architecture/ARCHITECTURE_REVIEW_TODO.md`
- `NestCalc_Build_Spec_V3.md`
- `src/lib/types.ts`
- `src/lib/nestSession.ts`
- `src/lib/storage.ts`
- `src/hooks/useNestInputs.ts`
- `src/lib/nestSession.test.ts`
- `src/lib/storage.test.ts`
- `src/lib/nestcalc.test.ts`

Relevant lessons to account for:

- `L-nestcalc-goal-required-docs-commit`
- `L-nestcalc-session-boundary-test-surface`
- `L-nestcalc-next16-serwist-turbopack`
- `L-nestcalc-clerk-pwa-public-routes`
- `L-nestcalc-env-example-gitignore`
- `L-nestcalc-playwright-clerk-boot`
- `L-nestcalc-e2e-split-layout-locator`
- `L-nestcalc-playwright-auth-setup-order`
- `L-nestcalc-grok-review-role-separation`
- `L-nestcalc-codex-stale-sha-guard`

### Scope

Add the smallest useful AutoNest foundation in the domain/session layer.

The implementation should introduce or equivalent-fit the following concepts:

- `NestMode`, with at least `manual` and `autonest`.
- A top-level app/session state shape that can hold the existing manual inputs and AutoNest settings without losing current manual behavior.
- A manual result type that preserves the existing `NestResult` contract for current manual callers.
- An AutoNest result vocabulary or placeholder union branch that can represent the future engine output without calculating it yet.
- A mode-aware session/result wrapper that lets future UI choose between manual and AutoNest output without bolting fields onto the old flat `NestResult`.
- A small `AutoNestSettings` model:
  - enabled/mode state
  - global clamp margin
  - override-global-margins flag
  - optional four-margin override values for special jobs

Prefer a deep module interface over many shallow helpers. The session module should hide migration/defaulting/control-state details from callers where practical.

### Storage And Migration

Preserve existing saved manual calculator state.

The current app stores flat `NestInputs` under `nestcalc-state-v2`. This goal must add a deliberate versioning/migration path instead of accidentally changing that shape.

Acceptable approaches:

- introduce a new versioned app-state key and migrate from `nestcalc-state-v2`, or
- keep the existing key only if the loader and tests clearly accept both old flat manual shape and the new wrapped shape.

Whichever approach is chosen, tests must prove:

- no saved state returns current defaults correctly
- old flat `nestcalc-state-v2` manual state still loads
- legacy `gap` / `remRotation` migration still works
- new mode/settings state saves and reloads
- missing AutoNest settings default safely
- unit conversion covers dimensioned AutoNest settings if they share the active unit

Do not modify `.env*`, Clerk configuration, PWA cache behavior, or deployment settings.

### AutoNest Settings Semantics

Keep settings domain-level only in this goal.

Use the AutoNest spec as the source of truth:

- global clamp margin is the primary simple setting
- override mode enables full four-margin control for special jobs
- the main UI should eventually stay light and not show four margin fields by default

For this goal, it is acceptable to expose settings only through types/session/storage/tests. Do not build the settings gear or visible AutoNest controls yet.

### Result Vocabulary

Add enough type shape for the future engine without implementing engine math.

Future AutoNest results need to be able to represent:

- best uniform comparison
- two-group result
- fallback state
- trim-line orientation and position
- blank sizes
- achieved margins per blank side
- per-group counts and bounding boxes
- suggested origin offset

This pass can return an explicit uncomputed/not-ready AutoNest result state while manual mode still returns the current calculated manual result. Do not add fake packing or fake preview data.

### Out Of Scope

Do not do any of the following in this goal:

- implement the AutoNest engine
- implement shelf, level, BLF, guillotine, or trim-line packing
- calculate two-group layouts
- add the visible AutoNest toggle
- add the settings gear UI
- disable or lock visible manual rotation controls
- add AutoNest preview rendering
- add comparison/results UI
- change manual calculator math
- change manual calculator layout or input behavior
- change Clerk auth, request-access flow, routes, middleware, `.env*`, or Vercel settings
- change PWA service-worker/runtime cache behavior
- start native iOS work
- rewrite historical build specs

### Protected Manual Behaviors

Manual calculator behavior must remain exactly intact:

- default behavior remains manual mode
- existing manual inputs retain their current values and meanings
- manual result numbers remain unchanged for equivalent inputs
- remnant rotation swaps remnant X/Y and gap X/Y
- part rotation swaps part X/Y only
- margins remain fixed on remnant rotation by default
- margins rotate only when `moveMarginsWithRotation` is enabled
- linked Part X/Y and Gap X/Y behavior remains unchanged
- Swap Part and Swap Gap behavior remains unchanged
- unit toggle conversion remains unchanged for current manual values
- Clear returns the same current manual default state
- existing Clerk-gated app behavior remains unchanged

### Expected Implementation Shape

Keep the future implementation narrow. Likely files:

- `src/lib/types.ts`
- `src/lib/nestSession.ts`
- `src/lib/storage.ts`
- `src/hooks/useNestInputs.ts` or a renamed/sibling session hook if needed
- `src/lib/nestSession.test.ts`
- `src/lib/storage.test.ts`

Avoid touching `src/components/NestCalcApp.tsx` unless a small adapter change is required for TypeScript compatibility with the new session/store shape. Any component change must be non-visual and behavior-preserving.

### Verification

Run and report:

- `git diff --check`
- `npm run lint`
- `npm run build`
- `npm run test`
- `npm run test:e2e` only if browser-visible behavior changes or the implementation touches the app shell/store in a way that warrants browser proof
- `npm run test:e2e:auth` only if the same condition applies and valid Clerk E2E credentials are present

If Clerk credentials are not present, report Clerk-backed Playwright proof as blocked by missing valid Clerk env, not as passed.

### Acceptance Criteria

This goal is complete when:

- a mode-aware session/state type exists
- AutoNest settings have defaults, persistence, migration, and tests
- manual result behavior remains compatible with the current `NestResult`
- AutoNest result vocabulary exists without fake calculations
- old flat saved manual state still loads correctly
- legacy storage migration remains covered
- manual session tests still pass
- new storage/session tests cover mode/settings behavior
- lint, build, and unit tests pass

### Stop Conditions

Stop and ask for direction before proceeding if:

- preserving old saved manual state requires a destructive storage change
- a visible UI change appears necessary
- AutoNest engine or preview work starts becoming necessary
- Clerk, PWA, route, or environment changes appear necessary
- current manual behavior is ambiguous and cannot be resolved from specs, tests, or existing code
- the implementation would require changing public manual calculator behavior

### Expected Closeout Evidence

The implementation closeout should include:

- changed files
- the chosen storage versioning/migration approach
- the added mode/settings/result type shape
- explicit statement that AutoNest engine/UI/preview were not implemented
- manual behavior preservation notes
- tests added or updated
- verification command results
- any residual risks before the AutoNest engine goal
