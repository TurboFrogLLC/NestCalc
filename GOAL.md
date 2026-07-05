# GOAL.md - NestCalc

## Active Goal: AutoNest Settings Gear And Result Copy Polish

### Objective

Add the hidden AutoNest settings gear UI and polish the existing compact
AutoNest result wording in one scoped PR.

This goal should expose the already-existing `AutoNestSettings` state to the
operator without changing storage schema, engine behavior, preview rendering,
Clerk, PWA, routes, or manual calculator behavior.

Here, "result copy" means the displayed wording in the compact AutoNest result
summary. It does not mean clipboard copy/export.

### Why This Is Next

PR #22 added the versioned app-state wrapper and AutoNest settings model:
global clamp margin, override toggle, and four margin overrides. PR #24 made
AutoNest visible in the calculator UI. PR #25 added a search-budget fallback
reason. The next practical UI step is to let operators adjust the clamp/margin
model and make the compact comparison language clearer before investing in the
larger preview visualization slice.

Settings and result wording share the same small UI surface in
`NestCalcApp.tsx`, so they can land together. Full preview work is a separate
goal because it will touch visual geometry, trim-line rendering, and broader
browser proof.

### Required Reading

Read these before editing code:

- `AGENTS.md`
- `GOAL.md`
- `docs/WORKFLOW.md`
- `LESSONS_LEARNED.md`
- `docs/AutoNest_Spec.md`
- `docs/roadmap.md`
- `docs/AutoNest_Integration_Analysis.md`
- `src/components/NestCalcApp.tsx`
- `src/components/NumberInput.tsx`
- `src/hooks/useNestInputs.ts`
- `src/lib/types.ts`
- `src/lib/storage.ts`
- `src/lib/nestSession.ts`
- `src/lib/nestSession.test.ts`
- `src/lib/autoNestEngine.ts`
- `src/lib/autoNestEngine.test.ts`
- `e2e/authenticated.spec.ts`
- `e2e/locators.ts`
- `e2e/public.spec.ts`

Relevant lessons to account for:

- `L-nestcalc-autonest-app-state-v3`
- `L-nestcalc-autonest-minimal-ui-activation`
- `L-nestcalc-autonest-search-budget-guard`
- `L-nestcalc-rotate-aria-label-e2e`
- `L-nestcalc-session-boundary-test-surface`
- `L-nestcalc-playwright-clerk-boot`
- `L-nestcalc-playwright-auth-setup-order`
- `L-nestcalc-e2e-split-layout-locator`
- `L-nestcalc-grok-review-role-separation`
- `L-nestcalc-codex-stale-sha-guard`
- `L-nestcalc-pr-branch-main-sync`

### Required Skills And Agent Model

Start with repo hygiene and authority-file preflight.

Use the smallest useful skill set:

- `codex-repo-hygiene-gate`
- `vercel-plugin:react-best-practices` or local React judgment for the compact
  settings UI
- `playwright` / browser proof for visible UI behavior
- `clerk-testing` only for authenticated E2E proof and only with local Clerk
  test env values
- GitHub / PR workflow skills for closeout

If read-only sub-agents are useful during execution, launch every read-only
sub-agent with model override `gpt-5.4-mini`. The orchestrator owns all writes
and final decisions.

### Scope

Add a small AutoNest settings gear and improve compact result wording.

Expected settings behavior:

- Add a small gear icon/button near the existing AutoNest toggle or compact
  AutoNest control area.
- The settings surface is hidden by default and opens only when the operator
  taps the gear.
- The surface includes a primary `Global Clamp Margin` numeric input using the
  existing active unit.
- The surface includes an `Override global margins` checkbox/toggle.
- When override is disabled, keep four-margin override inputs hidden.
- When override is enabled, show four numeric inputs for Left, Right, Top, and
  Bottom margin overrides.
- Editing these controls updates `state.autoNestSettings` through the existing
  `useNestAppState().setState` path.
- Existing `toggleNestSessionUnit()` behavior continues converting
  `autoNestSettings` with manual inputs.
- Settings persist through the existing `nestcalc-app-state-v3` state model.

Expected result wording behavior:

- Keep the existing compact AutoNest result surface; do not create a large
  results panel.
- Make computed results read clearly as a comparison:
  `Best uniform: X | AutoNest two-group: Y (+Z)`.
- Make fallback results read clearly as a fallback:
  `Best uniform: X | Using uniform: Y (reason)`, or equivalent concise wording.
- Include clear wording for `search-budget-exceeded` from PR #25.
- Keep the existing status label `AutoNest: Two groups (0° + 90°)` unless a
  tiny wording tweak is necessary for fit or clarity.

Allowed implementation files:

- `src/components/NestCalcApp.tsx`
- `src/lib/nestSession.ts` only for tiny reusable AutoNest settings update
  helpers if inline `setState` would become messy
- `src/lib/nestSession.test.ts` only if helper coverage is added
- `e2e/authenticated.spec.ts`
- `e2e/locators.ts`

Prefer not to touch:

- `src/components/NestGrid.tsx`
- `src/components/NumberInput.tsx`
- `src/hooks/useNestInputs.ts`
- `src/lib/storage.ts`
- `src/lib/types.ts`
- `src/lib/autoNestEngine.ts`
- `src/lib/autoNestEngine.test.ts`
- `e2e/public.spec.ts`

Only touch preferred-avoid files if TypeScript compatibility or targeted proof
requires a tiny adapter. Stop if larger changes to those files appear necessary.

### Out Of Scope

Do not implement any of the following in this goal:

- copy-to-clipboard/export functionality
- full AutoNest preview rendering
- color-coded 0-degree / 90-degree groups
- trim-line SVG drawing or trim-line labels
- achieved-margin annotations in the preview
- blank-size overlay rendering
- origin-offset display
- storage schema changes or migration changes
- AutoNest engine algorithm changes
- search-budget changes
- manual calculator math changes
- Clerk auth, request-access, routes, middleware, `.env*`, Vercel, or PWA changes
- native iOS work
- broad shell/layout redesign

### Protected Behaviors

Manual calculator behavior must remain exactly intact:

- manual mode remains default
- manual result numbers remain unchanged
- manual preview remains unchanged
- manual rotations, link/swap, clear, margins, and unit conversion remain
  unchanged
- existing Clerk-gated app behavior remains unchanged

AutoNest behavior must remain stable:

- AutoNest toggle behavior remains unchanged.
- Manual rotate controls remain locked while AutoNest is active.
- The existing engine output and fallback reasons remain unchanged.
- Settings edits affect AutoNest engine inputs only through the existing
  `autoNestSettings` model.
- Existing storage loading/saving semantics remain unchanged.

### UI Guidance

Keep the interface shop-floor simple and compact.

- Use a gear icon for settings; prefer `lucide-react` `Settings` if available.
- Do not expose all four margin override fields by default.
- Avoid nested cards and avoid a large settings drawer.
- Prefer an inline collapsible settings strip/panel near the AutoNest toggle
  unless a smaller local popover is simpler and robust.
- Keep labels short and unambiguous.
- Ensure the longest labels and result wording fit mobile and desktop layouts.
- Disabled/hidden controls should be accessible and predictable.

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

- Update authenticated Playwright coverage so a signed-in user can open the
  AutoNest settings gear.
- Prove `Global Clamp Margin` is visible/editable.
- Prove `Override global margins` reveals Left/Right/Top/Bottom override inputs.
- Prove AutoNest result wording still appears after toggling AutoNest on.
- Preserve existing assertions for the AutoNest toggle and disabled rotate
  controls.

Public/offline Playwright coverage should remain unchanged unless a locator
update is genuinely required.

### Acceptance Criteria

This goal is complete when:

- A hidden-by-default AutoNest settings gear exists.
- The gear opens a compact settings surface.
- Global clamp margin can be edited through existing app state.
- Override mode reveals four margin override inputs.
- Settings persist through the existing v3 app-state path without schema
  changes.
- Compact AutoNest result wording is clearer for computed, not-useful fallback,
  insufficient-input fallback, and search-budget fallback cases.
- AutoNest toggle and rotation lock behavior remain intact.
- No preview, engine, storage schema, Clerk, PWA, route, or manual math changes
  were introduced.
- lint, build, unit tests, and required browser proof pass or are clearly
  blocked only by missing valid Clerk env.

### Required Execution Closeout

The CLI execution must finish with a ready-for-review GitHub PR, not just a
local commit.

At closeout:

- create or use a `codex/` feature branch
- commit implementation files separately from `GOAL.md`
- push the feature branch
- open a ready-for-review PR to `main`, not a draft
- include verification evidence in the PR body
- mention explicitly that full AutoNest preview, engine behavior, Clerk, PWA,
  storage schema, routes, and manual calculator math were not changed
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

- adding settings appears to require storage schema or migration changes
- result wording requires changing AutoNest result types or engine behavior
- full preview, trim-line visualization, or achieved-margin display becomes
  necessary
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
- settings UI behavior summary
- result wording summary
- summary of protected surfaces left untouched
- tests added or updated
- verification command results
- browser proof status, including Clerk env blockers if applicable
- residual risks before the full AutoNest preview goal
