# GOAL.md - NestCalc

## Active Goal: AutoNest Ranking And Fallback Investigation v1

### Objective

Prove with hand math, pure engine output, and live browser evidence why AutoNest
reports or falls back to best-uniform nesting in a case where an operator can
visually place mixed `0deg` and `90deg` parts on one remnant using one straight
trim.

This is an investigation goal. Produce a precise root-cause classification and
a bounded follow-on fix sketch. Do not implement a product fix, change manual
calculator math, or open a product-fix PR before the RCA is reviewed.

### Required Deliverables

1. A math-backed RCA of the AutoNest ranking and fallback decision.
2. A minimal deterministic reproduction with exact part, remnant, gap, and
   AutoNest margin inputs.
3. A known-good control fixture proving the existing computed path.
4. Pure engine output for both fixtures, including status, fallback reason,
   uniform count, two-group count when present, blank geometry, trim geometry,
   achieved margins, and origin offset.
5. Live AutoNest-on screenshots showing the toggle state, settings used,
   comparison copy, counts, and preview or fallback geometry.
6. A defect classification selecting one or more of:
   - incomplete two-group search undercounts a valid mixed layout;
   - useful-blank or budget policy over-rejects a candidate;
   - ranking or tie-break behavior is wrong;
   - engine output is correct but UI comparison messaging is wrong;
   - full margins on both trim blanks conflict with the operator's expected
     shared/zero trim-edge margin model;
   - the operator-visible layout lies outside the specified two-group model.
7. A follow-on fix goal sketch naming the smallest correct seam, without
   applying the fix.

### Required Reading

- `AGENTS.md`
- `GOAL.md`
- `docs/WORKFLOW.md`
- `LESSONS_LEARNED.md`
- `docs/AutoNest_Spec.md`
- `docs/AutoNest_Integration_Analysis.md`
- `src/lib/autoNestEngine.ts`
- `src/lib/autoNestEngine.test.ts`
- `src/lib/nestSession.ts`
- `src/components/NestCalcApp.tsx`
- `src/components/AutoNestPreview.tsx`
- `e2e/authenticated.spec.ts`
- `e2e/locators.ts`

Apply these lessons:

- `L-nestcalc-autonest-not-ready-result`
- `L-nestcalc-autonest-thin-blank-guard`
- `L-nestcalc-autonest-search-budget-guard`
- `L-nestcalc-autonest-computed-preview`
- `L-nestcalc-goal-grilling-authority-sync`
- `L-nestcalc-readonly-subagent-model`
- `L-nestcalc-goal-required-docs-commit`

### Investigation Questions

Map and prove the following from source:

- the decision path from insufficient inputs through budget fallback,
  two-group-not-useful fallback, and computed result;
- the exact strict acceptance predicate comparing two-group and best-uniform
  counts;
- candidate tie-breakers after total part count;
- `usefulBlankThreshold`, blank usefulness, and achieved-margin validation;
- vertical and horizontal candidate margin allocation at the trim;
- the constrained column/row sweep and geometries it cannot represent;
- realistic candidate-budget behavior;
- the relationship between manual input margins and AutoNest settings margins;
- UI copy and preview selection for computed versus fallback results.

Rank and test these hypotheses from evidence, not intuition:

- H1: constrained search undercounts mixed layouts.
- H2: full margins on both trim blanks consume space the operator expects to
  share or omit at the trim.
- H3: the useful-blank threshold rejects a usable second blank.
- H4: equal part count correctly falls back under current policy even when a
  mixed layout is operationally preferable.
- H5: UI copy misrepresents correct engine output.
- H6: realistic inputs exceed the search budget.
- H7: AutoNest settings margins differ from the manual margins the operator is
  viewing or expecting.

### Required Fixtures

#### Fixture 1: computed-path control

- Part: `6 x 4`
- Remnant: `10 x 10`
- Gaps: `0 x 0`
- Manual margins: all `0`
- AutoNest margins: all `0`
- Expected best uniform: `2`
- Expected two-group result: `3`
- Expected status: `computed`

#### Fixture 2: minimal operator-visible mismatch

Find the smallest clear case where a mixed `0deg` and `90deg` placement is
visually possible under an operator-reasonable one-trim interpretation while
the current engine falls back to uniform or undercounts it. Prefer a fixture
that isolates one hypothesis. If no supplied shop dimensions exist, derive the
fixture deterministically and include a second run using the default global
clamp margin near `0.53`.

For each fixture, show by hand:

- uniform `0deg` rows, columns, and total;
- uniform `90deg` rows, columns, and total;
- selected best uniform;
- vertical and horizontal two-group candidate dimensions;
- margin consumption on each blank and at the trim;
- useful-blank threshold;
- expected candidate count under the current implementation;
- expected count under the operator's proposed interpretation;
- the precise comparison that selects computed or fallback.

### Feedback Loop

Before forming the final root-cause conclusion, establish one fast,
deterministic, agent-runnable command that exercises the actual AutoNest
ranking path and can distinguish the reported mismatch from correct behavior.

Use existing engine tests or a temporary, uncommitted harness. Do not add a
regression test or product source change during this investigation unless the
human later approves the fix goal.

Required baseline command:

- `npx vitest run src/lib/autoNestEngine.test.ts`

Any temporary harness or generated JSON must remain uncommitted and be removed
or clearly identified before closeout.

### Browser Evidence

Run the local app with existing valid local environment values. Never print,
copy, or commit secrets.

Capture Fixture 1, Fixture 2, and any margin-sensitive variant with AutoNest
enabled. Evidence must show, where applicable:

- AutoNest toggle with `aria-pressed=true`;
- AutoNest settings and active margins;
- best-uniform versus two-group or fallback comparison copy;
- visible part count;
- computed `0deg` and `90deg` groups and trim line, or the fallback manual
  preview proving that no mixed geometry is rendered.

Store screenshots under `output/playwright/autonest-rca/` and do not commit
binary artifacts unless explicitly requested.

If Clerk prevents authenticated access, use the existing official Clerk E2E
setup and local test credentials. If proof remains unavailable, report the
exact blocker; do not add an auth bypass or weaken the evidence claim.

### Agent Pattern

The main agent owns all decisions and writes. Use bounded parallel read-only
evidence lanes for engine math, UI/browser wiring, and authority constraints.

The configured `gpt-5.4-mini` model is unavailable in the current runtime. The
human explicitly approved `gpt-5.4` as the substitute for this cycle. Record
that substitution in the RCA; do not imply exact model compliance.

### Protected Surfaces

Do not change:

- `src/lib/nestcalc.ts` or manual calculator math;
- AutoNest engine, tests, session wiring, UI, or copy during the investigation;
- Clerk auth, request-access, routes, middleware, or `.env*` files;
- Vercel configuration or credentials;
- PWA service worker, cache, manifest, or offline behavior;
- governance pipeline implementation;
- native iOS work.

Reading AutoNest product code and running existing tests/browser flows is
allowed. `GOAL.md` is the only tracked file authorized to change in this cycle.

### Verification

Run and report:

- `git diff --check`
- `git status --porcelain=v1`
- `npx vitest run src/lib/autoNestEngine.test.ts`
- the deterministic pure-engine reproduction command
- live browser evidence for both fixtures when authenticated access is
  available

Full lint/build/unit suites are not required unless source code unexpectedly
changes. Any source change is a stop condition requiring renewed approval.

### Hard Stops

- Do not commit `GOAL.md` without explicit human approval.
- Do not implement an engine or UI fix during this investigation.
- Do not open a product-fix PR.
- Do not modify manual calculator math under any circumstance in this goal.
- Stop before a proposed fix that expands beyond AutoNest engine/UI comparison.
- Preserve and report unrelated or governance-branch work rather than mixing it
  into this branch.

### Acceptance Gate

The investigation is complete only when the evidence can explain with math why
AutoNest claims uniform is better or falls back for a case where mixed
orientation is visually possible. Any remaining uncertainty must be narrowed
to a clearly stated product-policy or operator-model decision.

Return the branch and hygiene status, goal summary, flagged decisions, both math
worksheets, engine output, ranked hypothesis results, exact root-cause lines,
screenshot paths and captions, what is not broken, recommended next step, and a
confidence percentage against this gate.
