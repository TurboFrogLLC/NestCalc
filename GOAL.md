# GOAL.md - NestCalc

## Active Goal: AutoNest Minimal UI Activation

### Objective

Activate AutoNest as an opt-in mode in the existing calculator UI using the
already-merged mode state, settings model, session boundary, and pure AutoNest
engine.

This is a narrow UI activation slice, not the full AutoNest visualization pass.
The goal is for an authenticated operator to turn AutoNest on, see that the app
is evaluating the two-group engine, see a compact comparison against best
uniform, and have conflicting manual rotation controls locked while AutoNest is
active.

Manual mode must remain the default and must behave exactly as it does today
when AutoNest is off.

### Why This Is Next

PR #21 added the manual session boundary. PR #22 added mode-aware app state,
AutoNest settings, storage migration, and result vocabulary. PR #23 added the
pure AutoNest engine and wired it through `createNestSession()`.

The app edge is still manual-only: `NestCalcApp` uses `useNestInputs()` and
`createManualNestSession()` directly, so the AutoNest engine is not yet visible
to an operator. The smallest useful next step is to wire the existing app state
and session result into the UI without taking on the full trim-line preview or
settings-gear UI.

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
- `src/components/NestCalcApp.tsx`
- `src/components/NestGrid.tsx`
- `src/hooks/useNestInputs.ts`
- `src/lib/types.ts`
- `src/lib/nestSession.ts`
- `src/lib/autoNestEngine.ts`
- `src/lib/storage.ts`
- `src/lib/nestSession.test.ts`
- `src/lib/autoNestEngine.test.ts`
- `src/lib/storage.test.ts`
- `e2e/authenticated.spec.ts`
- `e2e/public.spec.ts`
- `e2e/locators.ts`

Relevant lessons to account for:

- `L-nestcalc-autonest-app-state-v3`
- `L-nestcalc-autonest-pure-engine-module`
- `L-nestcalc-autonest-thin-blank-guard`
- `L-nestcalc-session-boundary-test-surface`
- `L-nestcalc-playwright-clerk-boot`
- `L-nestcalc-playwright-auth-setup-order`
- `L-nestcalc-e2e-split-layout-locator`
- `L-nestcalc-goal-required-docs-commit`
- `L-nestcalc-grok-review-role-separation`
- `L-nestcalc-codex-stale-sha-guard`
- `L-nestcalc-pr-branch-main-sync`

### Required Skills And Agent Model

Start with repo hygiene and authority-file preflight.

Use the smallest useful skill set:

- `codex-repo-hygiene-gate`
- `vercel-plugin:nextjs` or local Next.js docs for Next 16 conventions if code
  changes require framework-specific judgment
- `vercel-plugin:react-best-practices` for the UI component pass if useful
- `playwright` / browser proof for visible UI behavior
- `clerk-testing` only for authenticated E2E proof and only with local Clerk
  test env values
- GitHub / PR workflow skills for closeout

If read-only sub-agents are useful during execution, launch every read-only
sub-agent with model override `gpt-5.4-mini`. The orchestrator owns all writes
and final decisions.

### Scope

Wire the existing mode-aware state and session result into the app UI.

Expected product behavior:

- Add an opt-in AutoNest toggle on the main calculator screen.
- Default remains Manual / AutoNest off.
- When AutoNest is off, the current manual UI, numbers, preview, input behavior,
  and persistence behavior remain unchanged.
- When AutoNest is on, show a clear label:
  `AutoNest: Two groups (0° + 90°)`.
- When AutoNest is on, disable/lock the manual `Rotate Part 90°` and
  `Rotate Rem 90°` controls so they cannot create conflicting manual-rotation
  state while AutoNest is active.
- When AutoNest is on, call the existing `createNestSession()` path and display
  a compact no-preview comparison:
  - best uniform total parts
  - AutoNest two-group total parts and delta when `computed`
  - fallback total parts and fallback reason when `fallback`
- Keep the existing `NestGrid` rendering the current manual preview/baseline
  result. Do not make `NestGrid` draw AutoNest groups or trim lines in this
  goal.
- Unit toggle should use the existing session-aware unit path so dimensioned
  AutoNest settings convert with manual inputs.

Allowed implementation files:

- `src/components/NestCalcApp.tsx`
- `src/hooks/useNestInputs.ts` only for a tiny state-access helper if needed
- `src/lib/nestSession.ts` only for narrow UI-facing selectors/helpers if needed
- `src/lib/types.ts` only for narrow additive type clarity if needed
- `src/lib/nestSession.test.ts`
- `e2e/authenticated.spec.ts`
- `e2e/locators.ts`

Prefer not to touch these files:

- `src/components/NestGrid.tsx`
- `src/lib/autoNestEngine.ts`
- `src/lib/storage.ts`
- `src/lib/nestcalc.ts`
- `e2e/public.spec.ts`

Only touch preferred-avoid files if TypeScript compatibility or targeted proof
requires a tiny adapter. Stop if a larger change to those files appears needed.

### Out Of Scope

Do not implement any of the following in this goal:

- full AutoNest preview rendering
- color-coded 0-degree / 90-degree groups
- trim-line SVG drawing or trim-line labels
- achieved-margin annotations in the preview
- blank-size overlay rendering
- settings gear UI
- editable global clamp margin UI
- editable override-four-margins UI
- storage schema changes
- AutoNest engine algorithm changes
- manual calculator math changes
- broad shell/layout redesign
- Clerk auth, request-access, routes, middleware, `.env*`, Vercel, or PWA changes
- native iOS work
- historical spec rewrites

### Protected Manual Behaviors

Manual calculator behavior must remain exactly intact when AutoNest is off:

- default/manual mode behavior remains unchanged
- manual result numbers remain unchanged for equivalent inputs
- existing preview remains unchanged
- remnant rotation swaps remnant X/Y and gap X/Y
- part rotation swaps part X/Y only
- margins remain fixed on remnant rotation by default
- margins rotate only when `moveMarginsWithRotation` is enabled
- linked Part X/Y and Gap X/Y behavior remains unchanged
- Swap Part and Swap Gap behavior remains unchanged
- unit toggle conversion remains unchanged for manual inputs
- Clear returns the same current manual default state
- existing Clerk-gated app behavior remains unchanged

### UI Guidance

Keep the interface shop-floor simple and compact.

- Do not add a marketing or explanatory section.
- Prefer a small segmented/toggle control near the existing calculator controls.
- Use clear state text only where it helps the operator understand the active
  mode.
- Use existing colors, borders, spacing, and control density.
- Avoid nested cards or a large results panel in this slice.
- The compact AutoNest result line should fit mobile and desktop layouts without
  pushing the calculator into a new page structure.
- Disabled rotation controls must look disabled and expose accessible disabled
  state.

### Verification

Run and report:

- `git diff --check`
- `npm run lint`
- `npm run build`
- `npm run test`
- `npm run test:e2e`
- `npm run test:e2e:auth`

Because this is UI-visible work, browser proof is required before closeout.
If Playwright fails inside the managed sandbox with macOS Chromium permission
errors, rerun the required browser proof outside the sandbox rather than
weakening verification.

If valid Clerk test env values are missing, report the affected public or
authenticated Playwright proof as blocked by missing valid Clerk env, not
passed. Do not commit secrets or `.env.local`.

E2E expectations:

- Add or update authenticated Playwright coverage so a signed-in user can see
  the AutoNest toggle.
- Prove toggling AutoNest on shows the active AutoNest label or compact result.
- Prove AutoNest mode disables the rotate controls.
- Preserve the existing authenticated shell assertion.

Public/offline Playwright coverage should remain unchanged unless the UI change
requires a locator update.

### Acceptance Criteria

This goal is complete when:

- AutoNest can be toggled on/off from the calculator UI.
- Manual mode is still the default.
- Manual mode visual output and behavior remain unchanged when AutoNest is off.
- AutoNest mode visibly announces `AutoNest: Two groups (0° + 90°)`.
- AutoNest mode displays a compact comparison from the existing
  `createNestSession()` / `calculateAutoNest()` path.
- AutoNest mode disables manual part/remnant rotation controls.
- Existing manual session and engine tests still pass.
- Browser proof covers the new visible behavior when Clerk env allows it.
- No full AutoNest preview, settings gear, storage schema, Clerk, PWA, route, or
  manual math changes were introduced.

### Required Execution Closeout

The CLI execution must finish with a ready-for-review GitHub PR, not just a
local commit.

At closeout:

- create or use a `codex/` feature branch
- commit implementation files separately from `GOAL.md`
- push the feature branch
- open a ready-for-review PR to `main`, not a draft
- include verification evidence in the PR body
- mention explicitly that full AutoNest preview, settings gear, Clerk, PWA,
  storage schema, and manual calculator math were not changed
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

- a full AutoNest preview becomes necessary to complete the goal
- settings gear UI becomes necessary to complete the goal
- storage/schema changes become necessary
- the AutoNest engine algorithm needs to change
- current manual calculator math needs to change
- Clerk, PWA, route, env, or deployment changes appear necessary
- the UI work starts expanding into a broad layout redesign
- required browser proof cannot run because both sandbox and authorized
  outside-sandbox execution paths are unavailable

### Expected Closeout Evidence

The implementation closeout should include:

- changed files
- feature branch name
- implementation commit hash
- PR URL
- summary of visible behavior added
- summary of protected surfaces left untouched
- tests added or updated
- verification command results
- browser proof status, including Clerk env blockers if applicable
- residual risks before the full AutoNest preview/settings goal
