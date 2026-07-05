# GOAL.md - NestCalc

## Active Goal: AutoNest Preview Visualization Slice

### Objective

Add the first AutoNest-specific preview visualization for computed two-group
results.

This goal should let an operator see the practical AutoNest output: two
orientation groups, one straight trim split, compact blank/group labels, and
the already-computed geometry from the pure AutoNest engine.

Keep this as a visualization slice only. Do not change the AutoNest engine,
storage schema, Clerk, PWA, routes, or manual calculator math.

### Why This Is Next

PR #23 added the pure AutoNest engine. PR #24 exposed AutoNest mode in the UI.
PR #25 added the performance guard. PR #26 added the settings gear and polished
result copy. The next highest-leverage step is to make successful AutoNest
results inspectable without expanding the algorithm or changing operator input
behavior.

The current manual `NestGrid` is a single-result uniform preview. AutoNest has
different geometry: two blank regions, two group orientations, and one trim
line. Use a separate AutoNest preview path so the manual preview contract stays
stable.

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
- `src/components/NestGrid.tsx`
- `src/app/globals.css`
- `src/lib/types.ts`
- `src/lib/nestSession.ts`
- `src/lib/autoNestEngine.ts`
- `src/lib/autoNestEngine.test.ts`
- `e2e/authenticated.spec.ts`
- `e2e/locators.ts`
- `e2e/public.spec.ts`

Relevant lessons to account for:

- `L-nestcalc-split-layout-css`
- `L-nestcalc-autonest-app-state-v3`
- `L-nestcalc-autonest-minimal-ui-activation`
- `L-nestcalc-autonest-search-budget-guard`
- `L-nestcalc-autonest-settings-gear-ui`
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
- `vercel-plugin:react-best-practices` or local React judgment for component
  structure
- `playwright` / browser proof for visible UI behavior
- `clerk-testing` only for authenticated E2E proof and only with local Clerk
  test env values
- GitHub / PR workflow skills for closeout

If read-only sub-agents are useful during execution, launch every read-only
sub-agent with model override `gpt-5.4-mini`. The orchestrator owns all writes
and final decisions.

### Scope

Add a separate AutoNest preview visualization for computed AutoNest results.

Expected behavior:

- Keep manual mode rendering through the existing `NestGrid` path.
- Keep fallback and not-ready AutoNest states on the existing manual baseline
  preview; do not draw fake two-group geometry for fallback results.
- When AutoNest mode has `autoNest.status === "computed"`, render an
  AutoNest-specific preview using `autoNest.twoGroup`.
- Show the remnant/available preview frame in the same general preview area
  where the manual grid currently appears.
- Show two distinct blank/group regions from `twoGroup.blanks`.
- Show the straight trim line from `twoGroup.trimLine`.
- Label each group with orientation (`0deg` / `90deg`) and part count.
- Show each blank size compactly.
- Show achieved margins per blank compactly, using the existing active unit.
- Show suggested origin offset compactly.
- Keep labels short and positioned so they do not overlap at mobile or desktop
  sizes.
- Keep the existing compact result summary from PR #26 intact unless a tiny
  wording or spacing adjustment is needed for fit.

Implementation guidance:

- Prefer a new component such as `src/components/AutoNestPreview.tsx`.
- Reuse existing preview-shell CSS where practical, but add focused AutoNest
  classes if needed.
- Use deterministic SVG/div rendering; no canvas, pan/zoom, drag handles, or
  animation in this slice.
- Use the already-computed `AutoNestResult` data. Add only tiny presentational
  helpers if needed for formatting or scaling.
- If very dense geometry would make labels unreadable, keep the visual labels
  compact and put detailed margin/offset text in a small adjacent summary row.

Allowed implementation files:

- `src/components/NestCalcApp.tsx`
- `src/components/AutoNestPreview.tsx`
- `src/app/globals.css`
- `e2e/authenticated.spec.ts`
- `e2e/locators.ts`

Allowed only if necessary for targeted tests or types:

- `src/lib/types.ts`
- `src/lib/nestSession.ts`
- `src/lib/autoNestEngine.ts`
- `src/lib/autoNestEngine.test.ts`

Do not touch `src/components/NestGrid.tsx` unless a tiny non-behavioral export or
shared formatting adapter is clearly necessary. Stop if making `NestGrid`
mode-aware seems required.

### Out Of Scope

Do not implement any of the following in this goal:

- AutoNest engine algorithm changes
- search-budget changes
- storage schema or migration changes
- settings model changes
- calculator input behavior changes
- manual calculator math changes
- manual preview behavior changes
- fallback geometry synthesis
- export, print, clipboard, or cut-list features
- pan/zoom, drag, measuring tools, or interactive preview editing
- route, Clerk, request-access, middleware, `.env*`, Vercel, or PWA changes
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
- AutoNest settings behavior remains unchanged.
- Manual rotate controls remain locked while AutoNest is active.
- Existing engine output, result totals, trim-line data, and fallback reasons
  remain unchanged.
- Existing storage loading/saving semantics remain unchanged.

### UI Guidance

Keep the preview shop-floor simple and compact.

- The operator should immediately understand which group is `0deg`, which group
  is `90deg`, and where the straight trim split is.
- Use restrained color coding for the two groups.
- Use short labels and compact numeric formatting.
- Avoid nested cards and avoid a large secondary results panel.
- Do not add visible instructional text about how to use the app.
- Ensure preview text and controls do not overlap at phone and desktop widths.
- Keep the visual style aligned with the existing calculator surface.

### Verification

Run and report:

- `git diff --check`
- `npm run lint`
- `npm run build`
- `npm run test`
- `npm run test:e2e`
- `npm run test:e2e:auth`

Because this is visual UI work, browser proof is required before closeout:

- desktop screenshot/proof of a computed AutoNest preview
- mobile viewport screenshot/proof of the same preview without overlap
- assertion that the two group labels and trim-line preview are visible
- assertion that manual mode still shows the existing manual preview path

If Playwright fails inside the managed sandbox with macOS Chromium permission
errors, rerun the required browser proof outside the sandbox rather than
weakening verification.

If valid Clerk test env values are missing, report the affected public or
authenticated Playwright proof as blocked by missing valid Clerk env, not
passed. Do not commit secrets or `.env.local`.

E2E expectations:

- Extend authenticated Playwright coverage for the computed AutoNest preview.
- Use deterministic inputs or seeded local storage to reach a computed
  two-group result.
- Prove the AutoNest preview renders two groups, a trim split, and compact
  geometry text.
- Prove toggling back to manual mode returns to the manual preview.

### Git And PR Closeout

Implementation must happen off `main` on a feature branch.

The implementation closeout must:

- commit `GOAL.md` separately before implementation
- commit implementation files separately from `GOAL.md`
- push the feature branch outside the sandbox when GitHub auth requires it
- open a ready-for-review GitHub PR, not a draft
- include the exact verification evidence in the PR body
- trigger `@codex review`
- stop if GitHub auth, push, or PR creation is blocked rather than silently
  leaving only a local branch

### Stopping Conditions

Stop and report before broadening scope if:

- computed AutoNest preview requires engine shape changes
- manual preview behavior would need to change
- `NestGrid` would need to become mode-aware
- storage or migration changes appear necessary
- browser proof cannot be produced because valid Clerk env is missing or
  Playwright cannot run even outside the sandbox
- the UI requires a broad layout redesign to fit

### Done Means

- A separate AutoNest preview path renders computed two-group AutoNest results.
- Manual preview remains unchanged in manual mode and AutoNest fallback states.
- Unit/build/lint checks pass.
- Browser proof covers desktop and mobile computed preview behavior.
- A ready-for-review PR is open on GitHub with verification evidence.
