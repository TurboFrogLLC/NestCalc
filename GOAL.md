# GOAL.md - NestCalc

## Active Goal: AutoNest-Ready Nest Session Module

### Objective

Prepare NestCalc for AutoNest by deepening the manual nest session/domain boundary while preserving the current manual calculator behavior exactly.

This is a readiness goal. Do not implement AutoNest packing, the AutoNest toggle, AutoNest settings, AutoNest preview, or AutoNest result comparison in this pass.

### Why This Is Next

`docs/AutoNest_Spec.md` introduces AutoNest as a second operating mode with different inputs, result shape, preview needs, and margin semantics. The current app still works as a compact manual calculator, but too much session behavior lives inline in `src/components/NestCalcApp.tsx`:

- remnant rotation
- part rotation
- link and swap controls
- unit conversion
- clear/reset behavior
- margin updates and margin rotation behavior
- persistence wiring
- result calculation handoff

Adding AutoNest directly to that component would create brittle mode branches and increase the risk of breaking the manual calculator. The highest-leverage next move is to make the manual session behavior explicit, tested, and mode-ready before AutoNest is added.

### Required Reading

Read these before editing code:

- `AGENTS.md`
- `docs/WORKFLOW.md`
- `LESSONS_LEARNED.md`
- `docs/AutoNest_Spec.md`
- `docs/roadmap.md`
- `docs/AutoNest_Integration_Analysis.md`
- `docs/architecture/ARCHITECTURE_REVIEW_TODO.md`
- `NestCalc_Build_Spec_V3.md`
- `src/components/NestCalcApp.tsx`
- `src/hooks/useNestInputs.ts`
- `src/lib/nestcalc.ts`
- `src/lib/storage.ts`
- `src/lib/types.ts`
- existing tests under `src/lib/*.test.ts`

Relevant lessons to account for:

- `L-nestcalc-next16-serwist-turbopack`
- `L-nestcalc-clerk-pwa-public-routes`
- `L-nestcalc-env-example-gitignore`
- `L-nestcalc-ios-quickbar-touch`
- `L-nestcalc-landscape-overflow-qa`
- `L-nestcalc-split-layout-css`
- `L-nestcalc-playwright-clerk-boot`
- `L-nestcalc-e2e-split-layout-locator`
- `L-nestcalc-playwright-auth-setup-order`
- `L-nestcalc-grok-review-role-separation`
- `L-nestcalc-codex-stale-sha-guard`

### Scope

Create or deepen a small session/domain module for the manual calculator. Prefer names and structure that fit the existing codebase, for example `src/lib/nestSession.ts`, but choose the final shape based on the current code.

The module should provide a clear interface for current manual-session actions:

- update a field
- update one margin side
- clear all inputs
- rotate part
- rotate remnant
- link part values
- swap part values
- link gap values
- swap gap values
- toggle unit and convert persisted values
- calculate the manual result from the current inputs

Move behavior out of `src/components/NestCalcApp.tsx` only as far as needed to make this boundary real. Keep the UI component responsible for rendering and event wiring, not business rules.

Add focused tests around the new session interface. Cover at minimum:

- remnant rotation swaps remnant dimensions and gap dimensions
- part rotation swaps part dimensions only
- `moveMarginsWithRotation` rotates margins when enabled and preserves fixed margins when disabled
- linked part and gap behavior matches current UI behavior
- part and gap swap behavior matches current UI behavior
- unit conversion preserves current numeric semantics
- clear/reset returns current default inputs
- manual result calculation still matches existing `calculateNest` behavior
- storage migration still handles the existing persisted shape

Keep existing helper tests if they remain useful. It is fine to add higher-level tests without deleting lower-level ones.

### AutoNest Readiness Constraints

The new boundary should make a future AutoNest mode easier to add, but it should not persist inactive AutoNest state yet unless there is a clear, low-risk reason.

Prefer an interface-first design:

- keep existing `NestInputs` stable where possible
- preserve existing storage compatibility
- avoid speculative AutoNest fields in persisted local storage
- allow future mode-specific result types without forcing them into the current UI
- keep `calculateNest` available as the manual calculation primitive

### Out Of Scope

Do not do any of the following in this goal:

- implement AutoNest packing
- add the AutoNest toggle
- add the hidden AutoNest settings gear
- add AutoNest global clamp margin or four-margin override UI
- add AutoNest preview rendering
- add two-group, trim-line, shelf, BLF, or guillotine packing logic
- change user-visible manual calculator behavior
- redesign the UI
- change Clerk authentication, request-access flow, routes, middleware, or environment files
- change PWA caching or Serwist behavior
- start native iOS work
- delete, rename, or rewrite older build specs

### Protected Manual Behaviors

Manual calculator behavior must remain exactly intact:

- default mode is still the existing manual calculator
- remnant rotation swaps remnant X/Y and gap X/Y
- part rotation swaps part X/Y
- margins remain fixed on remnant rotation by default
- margins rotate on remnant rotation only when `moveMarginsWithRotation` is enabled
- linked Part X/Y and Gap X/Y behavior remains unchanged
- Swap Part and Swap Gap behavior remains unchanged
- unit toggle conversion remains unchanged
- Clear returns the same current default state
- manual preview and result numbers remain unchanged for equivalent inputs
- existing Clerk-gated app behavior remains unchanged

### Verification

Run and report:

- `git diff --check`
- `npm run lint`
- `npm run build`
- `npm run test`
- `npm run test:e2e` when valid local Clerk test keys are present
- `npm run test:e2e:auth` when valid Clerk E2E credentials are present

If Clerk credentials are not present, report Playwright as blocked by missing valid Clerk env, not as passed.

### Acceptance Criteria

This goal is complete when:

- manual session behavior is concentrated behind a small tested domain/session interface
- `NestCalcApp.tsx` no longer owns the core manual transition rules inline
- manual behavior is preserved with no intentional user-visible changes
- storage compatibility is preserved
- test coverage exercises the extracted session behavior
- lint, build, and unit tests pass
- Playwright status is reported honestly based on available Clerk env

### Stop Conditions

Stop and ask for direction before proceeding if:

- preserving current manual behavior requires a visible UI change
- storage migration would need a breaking change
- AutoNest implementation pressure starts pulling this goal beyond readiness work
- Clerk, route, PWA, or environment changes appear necessary
- current behavior is ambiguous and cannot be resolved from specs, tests, or existing code

### Expected Closeout Evidence

The implementation closeout should include:

- changed files
- summary of the session/domain boundary created
- explicit statement that AutoNest was not implemented
- manual behaviors covered by tests
- verification command results
- Playwright credential status
- any residual AutoNest-readiness gaps left for the next goal
