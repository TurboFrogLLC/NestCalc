# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Named Full-State Presets and G-Code Rotation v1",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": [
      {
        "lane": "preset-storage-and-clerk-ownership",
        "observed_model": null,
        "requested_model": "gpt-5.4-mini",
        "status": "unavailable"
      },
      {
        "lane": "gcode-language-and-numeric-safety",
        "observed_model": null,
        "requested_model": "gpt-5.4-mini",
        "status": "unavailable"
      },
      {
        "lane": "responsive-ui-and-browser-proof",
        "observed_model": null,
        "requested_model": "gpt-5.4-mini",
        "status": "unavailable"
      },
      {
        "lane": "proof-scope-and-protected-surface-audit",
        "observed_model": null,
        "requested_model": "gpt-5.4-mini",
        "status": "unavailable"
      }
    ]
  },
  "branch_intent": "codex/named-presets-gcode-rotation-v1",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260731-c7ced7c2",
  "goal_memory_commit": "606bc1a108d8a6b642cd8d08836c5bd87cbadf0f",
  "goal_sha256": "sha256:b2bd4d92245caac558f822e70cfe14fd891629fcf727ee409323aabe43a951bb",
  "protected_surfaces": [
    "calculator math nestcalc.ts and manual input semantics",
    "AutoNest packing ranking counts trim-edge policies fallback guards search budget and preview geometry",
    "nestcalc-app-state-v3 live scratch schema key migrations and unit conversion",
    "Clerk authentication request-access policy middleware secrets and Vercel settings",
    "PWA service-worker manifest offline shell and runtime cache behavior",
    "repository governance outside this goal-memory and execution handoff"
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": [
    "codex-repo-hygiene-gate",
    "nestcalc-goal-grilling",
    "tdd",
    "vercel-plugin:nextjs",
    "vercel-plugin:react-best-practices",
    "clerk-nextjs-patterns",
    "clerk-testing",
    "playwright",
    "vercel-plugin:verification",
    "codex-pr-closeout"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: Named Full-State Presets and G-Code Rotation v1

### Objective

Ship one ready-for-review NestCalc product PR that adds both closed Wayfinder
modules without changing calculator or AutoNest results:

1. signed-in users can save, load, overwrite, save-as, rename, delete, and
   reorder named snapshots of the complete version-3 NestCalc app state from a
   calculator-local chip rail and management sheet; and
2. signed-in users can switch to a dedicated G-code tab, rotate a bounded
   RS274 G00-G03/I/J program around code origin `(0,0)`, inspect a live
   conservative bounds preview, explicitly Generate validated output, and copy
   or download only fresh output.

The work ends at a reviewed feature PR. It does not merge product `main`,
deploy, alter machine configuration, or claim controller-specific acceptance.

### Prior Goal Disposition

The superseded goal, `AutoNest Per-Part Preview and Active Margin Controls v1`,
completed in PR #30. Its goal-memory commits are `d2f11de` and `739d1ff`, its
implementation commits are `b2eed7a` and `79a6dd4`, its merge commit is
`0bf046e`, and its durable lesson commit is `ddf087a`. The current product
baseline is clean `main` at `a60d313`. NestCalc keeps one active goal in this
file; the prior goal remains durable in Git history and PR #30.

### Closed Wayfinder Authority

- Superbrain map: `TurboFrogLLC/wReckless-Grok-Superbrain#32`.
- Pilot: `WF-20260731-nestcalc-shop-helpers`.
- UoG synthesis:
  `wiki/board/extracts/nestcalc-shop-helpers/presets-gcode-rotation-synthesis.md`.
- Every residual ticket #33-#43 is closed. The map Frontier is empty and the
  map-clear auto-continuation comment is posted.
- This product goal binds those decisions. Implementation does not reopen them
  through soft inference.

### Required Reading And Lessons

Read before the first implementation edit:

- `AGENTS.md`
- `GOAL.md`
- `docs/WORKFLOW.md`
- `docs/governance/goal-lifecycle-contract.md`
- `LESSONS_LEARNED.md`
- `NestCalc_Build_Spec.md`
- `NestCalc_Build_Spec_V2.md`
- `NestCalc_Build_Spec_V3.md`
- the Wayfinder pilot, map resolutions, and UoG synthesis named above
- `src/lib/types.ts`
- `src/lib/storage.ts`
- `src/hooks/useNestInputs.ts`
- `src/components/NestCalcApp.tsx`
- `src/app/globals.css`
- `e2e/authenticated.spec.ts`
- relevant Next.js 16 guides under `node_modules/next/dist/docs/`

Apply at least:

- `L-nestcalc-playwright-clerk-boot`
- `L-nestcalc-playwright-auth-setup-order`
- `L-nestcalc-browser-proof-with-local-env`
- `L-nestcalc-split-layout-browser-proof`
- `L-nestcalc-app-state-wrapper-v3`
- `L-nestcalc-codex-stale-sha-guard`
- `L-nestcalc-role-separation-chat-cli-grok-human`

### Sequential Execution Contract

Execute in order on `codex/named-presets-gcode-rotation-v1`:

1. **P0 - red contracts:** add failing pure tests for G-code parsing,
   transformation, precision, rejection, and preview bounds; add focused preset
   record/normalization tests before implementation.
2. **P1 - preset repository:** implement the isolated IndexedDB owner store,
   transaction-complete success semantics, version-3 snapshot validation, and
   state replacement path.
3. **P2 - preset UI:** implement the calculator-local chip rail, naming dialog,
   and right-side management sheet with complete CRUD and reorder behavior.
4. **P3 - G-code core:** implement fail-closed modal parsing, rotation,
   fixed-point serialization, formatted-stream arc validation, and exact source
   bounds including arc extrema.
5. **P4 - G-code UI and shell:** implement the two-tab shell, latest-only live
   preview scheduling, explicit Generate, stale-output state, Copy, and
   download.
6. **P5 - full proof and review:** run unit/static/build/browser/PWA-shell
   regression proof, inspect protected paths, push the feature branch, open one
   ready PR, and complete review/closeout without merging.

Each phase leaves its targeted proof green. Do not split either module into a
second implementation PR.

### R1 - Preset Record And Ownership Contract

- Preserve `localStorage["nestcalc-app-state-v3"]` as the only live scratch
  state and `localStorage["nestcalc-theme"]` as the global theme. Do not move,
  rename, or migrate either key.
- Add IndexedDB database `nestcalc-presets`, numeric database version `1`,
  object store `presets`, record schema version `1`, compound key path
  `["ownerClerkUserId", "presetId"]`, and non-unique owner/order index
  `by-owner-order` over `["ownerClerkUserId", "sortOrder"]`.
- Store one record per preset with exactly these durable fields:
  `schemaVersion`, `ownerClerkUserId`, `presetId`, `name`, `sortOrder`,
  `snapshot`, `createdAt`, and `updatedAt`.
- `presetId` is a UUID. Timestamps are ISO-8601 strings. `snapshot` is a deep
  copy of a normalized `NestAppState` whose inner version remains `3`.
- Preset names are trimmed, contain 1-64 Unicode code points, and are unique
  case-insensitively for one owner. A duplicate save-as or rename reports an
  explicit error. Overwrite targets the selected preset ID.
- The signed-in Clerk `userId` is the owner partition. Auth loading or a null
  user ID disables reads and writes; there is no anonymous bucket.
- Query, overwrite, rename, delete, and reorder always include the owner key.
  Reorder writes the complete contiguous zero-based order in one transaction.
- Report a successful save, overwrite, rename, delete, or reorder only after
  its IndexedDB transaction completes. Surface open, quota, abort, private-mode,
  and eviction-visible failures; do not silently claim persistence.
- Loading validates and normalizes the stored snapshot through the version-3
  state boundary, then replaces the current state through the existing state
  setter. Theme, transient panel/dialog state, Clerk tokens, G-code text, and
  generated G-code are never preset fields.

### R2 - Preset Scope And Calculator-Local UI

- Preset v1 is local to one browser or installed-PWA storage container. Clerk
  identifies the owner but is not a persistence or synchronization transport.
- The same account in another device, browser, profile, private session, or
  Safari versus installed PWA receives an independent empty collection. Add no
  server copy, Clerk metadata copy, network/background sync, cloud recovery,
  merge rule, or conflict UI.
- Display the exact helper copy `Saved on this device only` and make the
  accessible description clarify `this browser or installed-app storage
  container`.
- Add one horizontally scrollable, single-line named-preset chip rail directly
  below the existing Manual/AutoNest controls and before the Part/Rem/Gap
  fields. One chip click loads that snapshot.
- Keep fixed `Save Preset` and `Manage` affordances adjacent to the rail.
  `Save Preset` opens the naming dialog. `Manage` opens a right-side non-modal
  sheet over the Calculator module; it does not replace global navigation.
- The sheet and rail render one collection. The sheet provides overwrite,
  `Save As New`, rename, delete, and deterministic up/down reorder controls.
  Destructive delete requires explicit confirmation.
- The rail and sheet expose loading, empty, successful, and failed states with
  accessible names and an `aria-live` status. Do not invent favorites, recents,
  folders, sharing, import, or export.
- Preserve current NestCalc color tokens and compact shop-floor density. Use
  NanoTate interaction language only; do not copy its visual skin.

### R3 - Two-Module Navigation Contract

- Add one persistent two-item top tab strip labeled exactly `Calculator` and
  `G-code`, directly below the global header and above the active module's
  content.
- AutoNest remains a Calculator-local toggle and presets remain Calculator
  local. There is no AutoNest top tab and no bottom navigation.
- Keep the single authenticated `/` app route. Encode G-code selection as
  `#g-code`; Calculator uses no hash. Tab activation updates browser history,
  initial hash selects the correct module, and Back/Forward restores the
  previous tab without reloading live calculator state.
- Use tab/current-page semantics with keyboard focus and visible selection.
- The header retains brand, auth, and theme globally. Unit and Clear remain
  Calculator actions and are absent while the G-code module is active.
- Preserve the existing desktop/landscape data-viewfinder split, portrait
  stacking, Quick Values behavior, and no-horizontal-overflow contract.

### R4 - Supported RS274 Input Boundary

- Rotate only RS274 XY-plane `G00`, `G01`, `G02`, and `G03` motion around code
  origin `(0,0)` by the user-entered counterclockwise angle in degrees.
- Distance mode and unit mode must be explicit before the first transformed
  motion. Accept `G90`; executable `G91`, or motion before `G90`, blocks
  Generate with a line-specific error. Accept explicit `G20` or `G21`; motion
  before a unit mode is known blocks Generate.
- Track modal `G00-G03` motion. A coordinate-only block inherits the current
  supported motion mode. Reject a motion block whose mode is unknown.
- Track modal programmed X/Y under G90. A block that specifies both establishes
  both. After both are known, reconstruct an omitted endpoint component and
  emit a complete rotated X/Y pair. If a required component is still unknown,
  block Generate with a line-specific error.
- For `G02/G03`, require the XY plane. `G17` may establish it; executable
  `G18` or `G19`, or an arc before `G17`, blocks Generate. I/J are incremental
  center offsets even under G90. An omitted I or J means zero; rotate the vector
  and emit both I and J.
- Preserve `G02/G03` direction under uniform rotation. Validate input and
  formatted output center-format radius equality against the active unit.
- Any executable `G53`, `G52`, `G68`, `G69`, `G92`, `G28`, `G30`, canned-cycle
  motion, or `G02/G03` R-word arc blocks Generate with a line-specific error.
  Do not rotate or silently pass unsupported coordinate-state motion.
- Multiple X, Y, I, J, R, or conflicting modal G words in one executable block
  are errors. Non-finite numeric words are errors.
- Preserve blank lines, comments, and untouched non-target tokens byte-for-byte.
  Replace transformed numeric lexemes in place where present and insert any
  reconstructed coupled word before the line's trailing semicolon comment.
- Do not implement ACSPL+ `ARC1`/`ARC2`, CONNECT rotation, G91, G53, R arcs,
  other planes, macros, variables, subprogram evaluation, canned cycles, or
  controller profiles. Generated output remains the closed RS274 subset and
  makes no ACS installation compatibility claim.

### R5 - Rotation, Serialization, And Safety Contract

- Rotate endpoints as points:
  `x' = x*cos(theta) - y*sin(theta)` and
  `y' = x*sin(theta) + y*cos(theta)`.
- Rotate I/J center offsets as vectors with the same formula. Never translate
  I/J by the pivot because the pivot is the code origin and I/J remain offsets.
- Retain full floating-point precision through parsing and transformation and
  round once at serialization.
- Emit every transformed X/Y/I/J as fixed-point round-to-nearest with exactly
  five fractional digits under G20 and four under G21. Emit coupled words at
  one precision, normalize negative zero to positive zero, and never emit
  exponent notation.
- Do not use NestCalc's generic three-decimal UI formatter for NC output.
- Reparse the formatted output with its actual modal state before output becomes
  copy-ready. For each center-format arc require
  `abs(hypot(I,J) - hypot(startX + I - endX, startY + J - endY))` to be no more
  than `0.0002` under G20 or `0.002` under G21. A violation blocks output.
- Source and generated diagnostics contain a one-based line number and a hard
  reason. No rejected or stale output can be copied or downloaded.

### R6 - Conservative Live Preview And Explicit Output

- Provide a multiline G-code editor, finite angle input, source diagnostics,
  preview, explicit `Generate`, read-only output, `Copy`, and `.nc` download.
- Source edits use one 50 ms trailing debounce. Each edit replaces the pending
  snapshot; only the newest revision may commit parse state.
- Parsing computes and caches the exact source toolpath axis-aligned bounding
  box once, including every supported circular-arc cardinal extremum that lies
  on the swept arc. Endpoint-only arc bounds are forbidden.
- Angle edits use no time debounce. Keep at most one outstanding one-shot
  `requestAnimationFrame`; latest angle wins. The frame rotates the four cached
  AABB corners around `(0,0)`, computes min/max, and updates one lightweight
  static SVG. Do not rewrite the full program on the live angle path.
- `Generate` flushes the latest pending parse, performs the O(n) rewrite once,
  validates the formatted stream, and then enables output actions.
- Any source or angle change immediately marks prior generated output stale.
  Cancel timers and animation frames on teardown; schedule one newest-state
  frame after visibility returns.
- Use these exact strings:
  - heading: `Conservative bounds preview`
  - helper: `Rotated input bounds; may be larger than the actual toolpath.`
  - pending: `Updating preview…`
  - invalid: `Preview unavailable — fix G-code errors.`
  - stale output: `Output out of date — Generate again.`
- Do not label the preview `exact`, `verified`, `machine simulation`, or an
  equivalent overclaim.
- A practical 300-line supported fixture must remain interactive at the mobile
  viewport. If parse/extent extraction creates a task over 50 ms in the proof
  browser, move it to a worker or chunk it inside this goal; do not weaken the
  scheduling or move rewrite work into angle updates.

### Scope / Allowed Files

Implementation edit authority is exactly:

- `src/components/NestCalcApp.tsx`
- `src/components/PresetControls.tsx` (new)
- `src/components/GCodeRotation.tsx` (new)
- `src/hooks/useNestInputs.ts`
- `src/hooks/usePresets.ts` (new)
- `src/lib/storage.ts`
- `src/lib/storage.test.ts`
- `src/lib/presetStore.ts` (new)
- `src/lib/presetStore.test.ts` (new)
- `src/lib/gcodeRotation.ts` (new)
- `src/lib/gcodeRotation.test.ts` (new)
- `src/app/globals.css`
- `e2e/authenticated.spec.ts`
- `e2e/locators.ts`
- `docs/ShopHelpers_Spec.md` (new)

Goal-memory authority may edit only `GOAL.md` before implementation. B3 may
write its gitignored handoff artifact and local prompt under
`.nestcalc/governance/`. Generated screenshots/traces may live under
`output/playwright/shop-helpers-v1/` and remain uncommitted.

Any need for another source, dependency, config, route, PWA, auth, or test path
stops for a separate GOAL authority update and goal-memory commit before work
continues.

### Protected Surfaces

- No change to `src/lib/nestcalc.ts`, calculator formulas, manual input
  semantics, rotation behavior, visible result semantics, or unit conversion.
- No change to `src/lib/autoNestEngine.ts`, `src/lib/nestSession.ts`,
  `src/components/AutoNestPreview.tsx`, or AutoNest counts, packing, ranking,
  tie-breakers, trim policies, margins, fallback guards, search budget, result
  metadata, preview geometry, or settings behavior.
- The preset snapshot may contain existing AutoNest settings because it is the
  full version-3 state. Loading restores them through the existing state setter;
  it does not change their schema or interpretation.
- No change to the live scratch key, theme key, legacy migrations, version-3
  persisted shape, Clerk production auth/request-access policy, `src/proxy.ts`,
  sign-in/sign-up behavior, secrets, `.env*`, Vercel settings, deployment, PWA
  service worker, manifest, offline route, runtime cache, or Serwist config.
- No package/dependency change, native/iOS work, cloud sync, database service,
  analytics, telemetry, machine connection, NC file upload, or controller
  configuration.
- No governance-file change beyond the active `GOAL.md` and generated B3
  handoff. Do not flip `docs/governance/MODE`.
- Codex CLI does not merge the product PR. Human merge authority remains
  intact even though Superbrain/UoG issue and closeout operations are
  autonomous for this continuum.

### Required Proof

Run and report at final implementation head:

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

Focused pure proof must include:

- version-3 preset snapshot normalization, name validation, owner keying,
  deterministic order, foreign-owner exclusion, and explicit transaction error
  behavior;
- 0°, 90°, -90°, and non-orthogonal endpoint/vector rotations;
- modal G90 motion, omitted X/Y reconstruction, one-component I/J rotation,
  G20/G21 precision, negative-zero normalization, untouched-token preservation,
  exact arc extrema, and post-format radius validation;
- line-specific rejection of indeterminate modes/units/axes, G91, G53, G52,
  G68/G69, G92, G28/G30, other planes, R arcs, canned motion, duplicates,
  conflicting modes, malformed and non-finite numbers; and
- proof that four-decimal inches and three-decimal millimeters are not used as
  the transformed-output precision floor.

Authenticated Playwright proof at `1280x800` and `390x844` must include:

- save a full manual/AutoNest state, mutate it, load the chip, and prove the
  complete snapshot returns while theme is unchanged;
- save-as, overwrite, rename, delete confirmation, reorder, reload persistence,
  owner isolation, exact local-only copy, explicit IndexedDB failure copy, chip
  overflow, sheet sizing/focus, and no horizontal overflow;
- Calculator/G-code tab selection, hash deep link, keyboard semantics,
  Back/Forward restoration, AutoNest remaining calculator-local, and live state
  surviving tab navigation;
- supported line, arc, omitted-axis, and 300-line source fixtures; exact 90°
  output; fixed precision; conservative preview copy; newest-revision
  coalescing; at most one live frame; no Generate rewrite on angle input;
  stale-output blocking; Copy; download; and every fail-closed diagnostic;
- a PerformanceObserver or equivalent trace showing no source parse/extent task
  over 50 ms for the 300-line fixture in the proof browser; and
- screenshots for both modules at both viewports plus protected behavior smoke
  for Manual, AutoNest, Clerk boot, theme, and built PWA shell registration.

Use valid local Clerk values without printing them. Freeze preflight confirmed
the required publishable/secret/user credential variable names are present in
`.env.local`; B4 must recheck names only. If credentials are invalid or a
required browser run cannot authenticate, report the proof blocked and do not
add a bypass or weaken the claim. Rerun a known macOS Chromium Mach-port
sandbox failure outside the sandbox once before declaring blockage.

### Proof-Scope Decision

Path B is selected and frozen: all goal-specific implementation files, pure
test files, locators, and authenticated browser proof are inside Allowed Files.
No required proof depends on permission to edit a protected source surface.
Public/auth harness configuration and PWA runtime remain unchanged baseline
infrastructure; a failure there is an execution blocker, not permission to edit
around the gate. Dedicated offline caching of a second route is not required
because this goal keeps one route and switches modules within the existing PWA
shell. There is no third proof-scope path.

### Grilling Decision Record

The orchestrator applied `evidence → confidence → decision → residual risk` to
the closed map:

- **Preset placement:** high confidence; use both the calculator-local one-tap
  rail and management sheet. Residual risk is responsive/focus proof only.
- **Storage split:** high confidence; preserve live localStorage and add the
  exact owner-keyed IndexedDB store. Residual risk is browser storage failure,
  which must be surfaced.
- **Multi-device:** high confidence; v1 is one storage container with no sync.
  Residual risk is user comprehension, controlled by exact local-only copy.
- **Navigation:** high confidence; two top tabs, with AutoNest nested under
  Calculator. Residual risk is history/responsive proof.
- **G90 and omitted axes:** high confidence; explicit G90 only, with modal XY
  reconstruction after both coordinates are known. Unsupported initial state
  fails closed.
- **G53 and R arcs:** high confidence; reject both rather than partially rewrite
  or pass them through. Valid broader programs remain deliberately unsupported.
- **Precision:** high confidence; five-decimal inches/four-decimal millimeters
  plus formatted-stream validation satisfy the NIST radius bound with a 7.07x
  conservative margin. Controller lexical limits remain outside this goal.
- **ACS:** high confidence; no native ACS dialect and no installation-specific
  compatibility claim.
- **Preview:** high confidence; latest-only 50 ms source parsing and one-rAF
  cached-AABB rotation, explicitly labeled conservative. Mobile timing remains
  required proof, not open product fog.

No product decision remains flagged for human input. The requested
`gpt-5.4-mini` read-only grilling route is unavailable in this runtime, so all
four metadata lanes record `observed_model: null` and `status: unavailable`.
The orchestrator retained write authority and reused the closed Wayfinder
evidence; it did not silently substitute a model or fabricate a match.

### B3-Style Handoff / B4-Style Preflight

- After the separate goal-memory commit, create the durable execution handoff
  with `python3 scripts/nestcalc-governance.py create-handoff`; persist only the
  prompt hash, never prompt plaintext.
- The thin prompt starts with `/goal`, `Run Process_narration=false`, and the
  exact goal title, then directs CLI to read `GOAL.md` first.
- Before the first implementation edit, CLI re-validates the goal and handoff,
  confirms branch and clean hygiene, reads required lessons and Next.js 16
  guides, selects the named minimal skills, checks auth variable names without
  printing values, and confirms proof-scope Path B.
- Any B4 failure stops before implementation. No Flow-ID, branch, goal hash,
  model receipt, or gate pass may be invented mid-cycle.

### PR And Review Contract

- Keep goal-memory commits separate from product implementation commits.
- Push only `codex/named-presets-gcode-rotation-v1` and open one non-draft,
  ready-for-review PR with exact commands, results, screenshots, residual
  risks, and protected-path diff evidence.
- Request one final-head Codex review and run Grok Build
  `pr-review-assistant`. Apply the stale-SHA guard before acting on findings.
- Fix evidence-backed in-scope findings or record a hard disposition. Complete
  the canonical closeout breakdown with the required Flow ID and merge
  disposition.
- Do not merge the NestCalc product PR and do not deploy. The human retains
  merge and production authority.

### Stopping Condition

Complete only when R1-R6 pass together at one final feature-branch head; all
required static, unit, build, public, authenticated, responsive, performance,
PWA-shell, and protected-surface proof passes; output safety rejects every
named unsupported construct; presets survive reload with owner isolation; and
one ready PR has current-head Codex/Grok review and validated closeout evidence.

Stop as blocked rather than claiming partial completion if proof-scope escapes
Allowed Files, required auth is invalid, IndexedDB semantics cannot be proven,
formatted arc output violates the active-unit tolerance, a 300-line preview
creates a task over 50 ms without an in-scope chunking fix, another source path
is required, a required command fails, or any protected surface drifts. Do not
merge.

### Confidence

Confidence is **97%** that the product contract is freeze-ready, all 11 map
residuals are bound, proof is reachable inside the frozen surface, and no human
decision is required before B3/B4. Remaining uncertainty is implementation and
browser proof risk, not requirements fog.
