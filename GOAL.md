# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "AutoNest Per-Part Preview and Active Margin Controls v1",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": [
      {
        "lane": "geometry-and-preview-ownership",
        "observed_model": null,
        "requested_model": "gpt-5.4-mini",
        "status": "unavailable"
      },
      {
        "lane": "margin-state-and-coordinate-semantics",
        "observed_model": null,
        "requested_model": "gpt-5.4-mini",
        "status": "unavailable"
      }
    ]
  },
  "branch_intent": "codex/autonest-per-part-preview-margin-controls-v1",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260713-a87a5bab",
  "goal_memory_commit": "0000000000000000000000000000000000000000",
  "goal_sha256": "sha256:f1f8acac5506d81ef7c8accfef99ed83edd4a3dfd858f598a3967b1abdea4d89",
  "protected_surfaces": [
    "manual calculator math state preview and nestcalc.ts behavior",
    "AutoNest packing ranking counts trim-edge policies fallback guards and search budget",
    "nestcalc-app-state-v3 schema storage migrations and unit conversion",
    "Clerk auth request-access routes secrets and Vercel settings",
    "PWA service-worker manifest offline shell and runtime cache behavior",
    "repository governance outside this goal-memory update"
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": [
    "codex-repo-hygiene-gate",
    "diagnosing-bugs",
    "tdd",
    "vercel-plugin:react-best-practices",
    "playwright",
    "clerk-testing",
    "codex-pr-closeout"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: AutoNest Per-Part Preview and Active Margin Controls v1

### Objective

Make the computed AutoNest preview honest and directly adjustable from the main
calculator surface in one product PR:

- replace the oversized trim band with one stable literal three-point trim line;
- replace each solid `90deg xN` / `0deg xN` group block with the actual
  individual part rectangles and their configured X/Y gaps;
- make the four always-visible margin fields control the active AutoNest margin
  model while AutoNest is on, without overwriting Manual margins; and
- prove that Left/Right/Top/Bottom map to their named visible edges and update
  the preview immediately.

Keep the existing two-group algorithm, counts, ranking, trim-edge policies,
manual calculator, persistence schema, auth, PWA, and deployment behavior
unchanged. This is an additive result-metadata and UI-truthfulness wave, not a
new nesting algorithm.

### Prior Goal Disposition

The superseded goal, `AutoNest Internal Trim-Edge Margin Policy v1`, completed
in PR #29 and is retained in Git history at goal commits `d82b2c7` and
`1348b5d`, implementation `96d05f2`, merge `1e45302`, and lessons `2a4e6f4`.
NestCalc does not require a separate goal-history archive; this file remains one
active objective.

### Operator-Reported Reference State

The supplied light-mode captures show the exact defects this goal owns:

- part `2 x 6`, remnant `12 x 11`, gaps `0.125 x 0.125`;
- a computed result labeled `90deg x4 | 0deg x2`, total `6`;
- two large filled group rectangles obscure the six physical parts and all
  within-group gap spacing;
- the red vertical trim renders as a broad band rather than a cut line; and
- visible margins such as Left `0.5`, Right/Bottom/Top `0.25` do not affect the
  AutoNest result because the preview continues reporting the hidden global
  AutoNest value near `0.530`.

Do not depend on the temporary chat-attachment paths. The contracts and fixture
above are the durable implementation authority.

### Confirmed Root Causes

1. `AutoNestPreview` draws the trim as a filled SVG rectangle while
   `.autonest-preview-trim-line` also adds a stroke with no explicit width. The
   SVG default one-user-unit stroke scales into the roughly 40px band seen in
   the capture.
2. `AutoNestGroupResult` exposes only orientation, count, and a bounding box.
   The engine knows grid columns, rows, oriented part dimensions, and gaps but
   discards them before the preview, so truthful individual cells cannot be
   reconstructed.
3. The always-visible margin fields read/write `manualInputs.margins` in both
   modes. AutoNest deliberately reads only `autoNestSettings`, so those edits
   are ignored until the user finds and enables the separate gear-panel
   override.
4. AutoNest's Top/Bottom values are not swapped in the engine. The apparent
   failure is primarily inactive-state wiring plus different Manual/AutoNest
   rendering conventions. This goal must prove named screen edges without
   silently changing engine coordinate or origin-offset semantics.

### Required Reading And Lessons

Read before editing:

- `AGENTS.md`
- `GOAL.md`
- `docs/WORKFLOW.md`
- `LESSONS_LEARNED.md`
- `docs/AutoNest_Spec.md`
- `src/lib/types.ts`
- `src/lib/autoNestEngine.ts`
- `src/lib/autoNestEngine.test.ts`
- `src/lib/nestSession.ts`
- `src/lib/nestSession.test.ts`
- `src/components/NestCalcApp.tsx`
- `src/components/AutoNestPreview.tsx`
- `src/components/NestGrid.tsx` as read-only Manual-preview authority
- `src/app/globals.css`
- `e2e/authenticated.spec.ts`
- `e2e/locators.ts`

Apply at least:

- `L-nestcalc-autonest-pure-engine-module`
- `L-nestcalc-autonest-settings-gear-ui`
- `L-nestcalc-autonest-computed-preview`
- `L-nestcalc-autonest-trim-edge-policy`
- `L-nestcalc-autonest-shared-trim-one-blank`
- `L-nestcalc-autonest-search-budget-guard`
- `L-nestcalc-playwright-clerk-boot`
- `L-nestcalc-playwright-auth-setup-order`
- `L-nestcalc-codex-stale-sha-guard`

### Sequential Execution Contract

Execute these phases in order on one feature branch and one ready PR:

1. **P0 - Red tests and metadata:** add failing pure/browser proof for grid
   metadata, trim thickness, mode-aware margins, and the reference fixture.
2. **P1 - Truthful result contract:** add only the grid metadata needed to
   reproduce the already-selected packed groups; prove no count/ranking change.
3. **P2 - Per-part preview:** render individual cells, true gaps, restrained
   group bounds, and the fixed trim line.
4. **P3 - Active margin controls:** bind the main four fields to AutoNest's
   effective settings while AutoNest is active and keep the gear synchronized.
5. **P4 - Edge semantics and regression:** prove Left/Right/Top/Bottom,
   desktop/mobile rendering, persistence, mode switching, and protected-surface
   parity at final head.

Each phase leaves targeted tests green before the next begins. Do not cut one
of the four product outcomes into a separate PR merely to shorten the cycle.

### R1 - Stable Literal Three-Point Trim Line

- Render the physical trim as one line with a literal CSS thickness of exactly
  `3pt` at both desktop and mobile viewports. Under the CSS absolute-unit
  conversion, this computes to `4 CSS px` (`1pt = 1/72in`, `1in = 96px`).
- Thickness must not scale with remnant dimensions, SVG viewBox, browser width,
  or device pixel ratio. Prefer a non-scaling SVG stroke or an equivalently
  deterministic single primitive.
- Remove the fill-plus-default-stroke combination. There must be no second
  outline, hidden one-user-unit stroke, or broad band under the line.
- Preserve trim orientation, position, label, color token, summary text, and
  suggested origin-offset values.
- Keep the line visually above parts without obscuring a meaningful amount of
  either adjacent part or gap.

### R2 - Individual Parts With Truthful Grid Gaps

- Extend each computed group result with additive grid metadata sufficient to
  reproduce the selected orthogonal layout. The preferred shape records:
  `columns`, `rows`, oriented `partWidth`, oriented `partHeight`, `gapX`, and
  `gapY`.
- Preserve `count === columns * rows` and prove:
  - bounding width = `columns * partWidth + (columns - 1) * gapX`;
  - bounding height = `rows * partHeight + (rows - 1) * gapY`.
- Do not add a free-form placement array or a second packing algorithm. The
  current grid metadata is deterministic and sufficient.
- Replace each filled aggregate group block and centered `orientation xN`
  label with one visible rectangle per physical part. Keep 0-degree and
  90-degree color identities.
- Preserve a subtle group/blank outline if useful, but it must not obscure
  individual parts, gaps, margins, or the trim. Group counts remain in the
  existing header/summary rather than over the parts.
- Position adjacent part rectangles using the exact configured X/Y gaps. Do not
  invent a minimum visual gap that differs from calculation geometry.
- For the operator fixture, render exactly four distinct 90-degree parts and
  two distinct 0-degree parts with `0.125` empty space between adjacent cells.
- Apply the same `500`-part preview guard used by Manual preview. Above the cap,
  render an honest capped-state message; never create an unbounded SVG/DOM tree
  or pretend the omitted cells were displayed.

### R3 - Mode-Aware Main Margin Controls

- In Manual mode, the existing four fields continue to show and edit only
  `manualInputs.margins`. Manual values and behavior must remain unchanged.
- In AutoNest mode, those same four visible fields show the effective AutoNest
  Left/Right/Bottom/Top margins:
  - when override is off, all four show `globalClampMargin`;
  - when override is on, each shows its effective side value, with null falling
    back to the global value and explicit zero remaining zero.
- Change the visible section label to `AutoNest Margins` while AutoNest is
  active, and retain `Margins` in Manual mode.
- On the first main-field edit while override is off, atomically:
  1. seed all four overrides from the current effective global margin;
  2. enable `overrideGlobalMargins`; and
  3. replace only the edited side.
- Later edits replace only the selected side. Do not copy AutoNest values into
  Manual state.
- Turning the gear-panel override off returns all four visible fields to the
  global value. Existing stored overrides may be retained for later restoration
  and must not leak into active calculations while override is off.
- The main fields and gear panel are two views of the same AutoNest settings;
  every edit is immediately synchronized, persisted through the existing v3
  state path, and reflected by the computed preview without reload.
- Switching back to Manual restores the untouched Manual margin values.
- Do not change storage key/version, migrations, or unit-conversion behavior.

### R4 - Visible Margin And Edge Truthfulness

- Individual parts must be positioned from the computed blank placement and
  `achievedMargins`, not from duplicated UI math.
- Left is the visible left edge, Right the visible right edge, Top the visible
  upper edge, and Bottom the visible lower edge. Add asymmetric fixtures and
  browser geometry assertions so Top and Bottom cannot regress into each other.
- A leading Left or Top edit that changes the active envelope must visibly move
  the corresponding group and/or trim geometry on the next render.
- Right and Bottom are trailing required clearances. When an already-selected
  left/top-anchored candidate has residual clearance larger than the requested
  value, the parts need not translate merely to make the requested margin exact;
  the preview and summary must continue reporting truthful achieved clearance.
- Choose test fixtures where each side can be observed independently. Prove
  immediate recalculation, named-edge correctness, and truthful residuals
  instead of asserting that every numeric edit always translates every group.
- Do not change the engine's existing first/top blank convention, horizontal
  trim semantics, achieved-margin formulas, `trimLine.position`, or
  `suggestedOriginOffset` meaning in this wave.

### R5 - Existing AutoNest And Manual Behavior Remains Intact

- Preserve Open/Shared/Full policy behavior and all PR #29 fixtures.
- Preserve exact two-group counts, candidate ranking/tie-breakers, strict
  equal-count fallback, useful-blank guard, `20,000` search budget, and best
  uniform comparison.
- Preserve manual rotation locks while AutoNest is active, Manual rotation and
  margin behavior when inactive, unit conversion, settings persistence,
  fallback/not-ready use of `NestGrid`, comparison copy, summary values, and
  desktop/mobile layout.
- Do not modify `src/lib/nestcalc.ts` or use Manual preview calculations to
  fabricate AutoNest cells.

### Allowed Files

Implementation may edit only:

- `src/lib/types.ts`
- `src/lib/autoNestEngine.ts`
- `src/lib/autoNestEngine.test.ts`
- `src/lib/nestSession.ts`
- `src/lib/nestSession.test.ts`
- `src/components/NestCalcApp.tsx`
- `src/components/AutoNestPreview.tsx`
- `src/app/globals.css`
- `e2e/authenticated.spec.ts`
- `e2e/locators.ts`
- `docs/AutoNest_Spec.md`

Generated screenshots may live under `output/playwright/autonest-preview-v1/`
but remain uncommitted. Existing untracked `output/playwright/autonest-rca/`
evidence is user-owned/generated state and must be preserved, not staged.

Any need for another source path stops for a separate GOAL authority update and
goal-memory commit before implementation continues.

### Protected And Out Of Scope

- No change to `src/lib/nestcalc.ts`, Manual math, Manual state semantics, or
  `NestGrid` behavior.
- No AutoNest count/ranking/search/fallback/usefulness/trim-policy algorithm
  change; additive grid result metadata only.
- No storage source, key/version, migration, settings schema, or unit-conversion
  change.
- No new nesting mode, free packing, interleaving, multi-trim, kerf engine,
  rotated blank, or origin-offset policy.
- No broad shell/settings redesign, theme redesign, or unrelated copy change.
- No Clerk, request access, routes, middleware, secrets, `.env*`, Vercel,
  deployment, PWA, Serwist, manifest, offline cache, or governance changes.
- No merge from Codex CLI. Human approval remains required.

### Verification And Evidence

Run and report at final head:

```bash
git diff --check
npm run governance:check
npm run lint
npm run test
npm run build
npm run test:e2e
npm run test:e2e:auth
git status --porcelain=v1
```

Focused proof must include:

- pure engine assertions for complete grid metadata, count/product invariants,
  exact bounding-box formulas, and unchanged existing result values;
- session/UI-state proof that first AutoNest main-margin edit seeds/enables
  overrides atomically, later edits are side-specific, gear/main values agree,
  storage persists, and Manual margins remain untouched;
- authenticated Playwright at `1280x800` and `390x844` showing six distinct
  parts for the operator fixture, exact SVG cell positions/gaps, restrained
  group bounds, and no overlap or horizontal overflow;
- computed-style/SVG proof that the trim is exactly `3pt`, computed as four
  non-scaling CSS pixels, at both viewports;
- asymmetric margin proof for all four named screen edges, including a
  Top-versus-Bottom non-swap assertion and honest trailing residual behavior;
- Open/Shared/Full policy regression, Manual/AutoNest mode round trip, desktop/
  mobile screenshots, and protected-path diff review.

Use valid local Clerk test credentials without printing them. If required Clerk
values are unavailable, report authenticated browser proof as blocked; do not
add a bypass or weaken the verification claim. Rerun a known macOS Chromium
Mach-port sandbox failure outside the sandbox once before declaring blockage.

### PR And Review Contract

- Start from synchronized `main`, create
  `codex/autonest-per-part-preview-margin-controls-v1`, and keep implementation
  off local `main`.
- Keep goal-memory commits separate from product implementation commits.
- Push only the named feature branch and open a non-draft, ready-for-review PR
  with exact verification and screenshot evidence.
- Request one `@codex review` at final PR head and triage comments using the
  stale-SHA guard.
- Hand the ready PR to Grok Build for independent review and validated closeout.
  Do not merge; the human owns merge and production decisions.

### Stopping Condition

Complete only when R1-R5 pass together at the final PR head; the operator
fixture visibly contains four individual 90-degree parts and two individual
0-degree parts with real `0.125` gaps; the trim remains exactly `3pt`/four CSS
pixels at desktop and mobile; active AutoNest margin fields and the gear are synchronized;
all four named edges are proven; Manual values and every protected algorithm
remain unchanged; required unit/browser/governance verification passes; and a
ready PR with independent review evidence exists.

Stop as blocked rather than claiming partial completion if auth credentials are
missing, a required test fails, margin semantics would require changing engine
origin policy, another implementation path is required, or protected-surface
drift is discovered. Do not merge.

### Flagged Decisions

- **Literal three-point contract:** Freeze the requested line as typographic
  `3pt`, which CSS resolves to four CSS pixels. Reason: the human explicitly
  selected the literal point unit. Consequence: CLI must assert the authored
  `3pt` contract and computed 4px thickness at both viewports rather than rely
  on a screenshot impression.
- **First margin edit enables override:** Editing one main AutoNest margin while
  global mode is active seeds all sides and enables per-side override. Reason:
  the operator explicitly expects the visible side fields to control AutoNest.
  Consequence: the mode transition is automatic but fully synchronized with the
  existing gear checkbox.
- **No engine coordinate rewrite:** Source evidence shows Top/Bottom are not
  swapped in AutoNest; inactive main-field wiring is the primary defect. Reason:
  changing first/top blank or origin-offset semantics risks changing packing
  behavior outside the request. Consequence: this goal proves named screen edges
  and stops if a deeper origin-policy change is actually required.
- **Subtle bounds, no center label:** Keep restrained blank/group outlines and
  summary counts, but remove the large filled aggregate block and centered count
  from the drawing. Reason: parts, gaps, and margins must be visually primary.
- **Additive grid metadata:** Store grid dimensions rather than a placement
  array. Reason: current packing is an orthogonal grid and already has those
  values. Consequence: result values become self-describing without a second
  layout engine.
- **Render cap:** Match Manual's 500-cell cap with honest disclosure. Reason:
  individual SVG elements must not turn a valid high-count calculation into a
  browser performance failure.

### Confidence

Confidence is **98%** that no blocking questions remain and every residual
choice is explicitly flagged. Two read-only lanes independently confirmed the
trim-stroke cause, discarded grid metadata, inactive visible-margin state, and
safe file/test surface. Their requested `gpt-5.4-mini` route could not be
observed in the runtime, so both are recorded as `unavailable`, not fabricated
matches.
