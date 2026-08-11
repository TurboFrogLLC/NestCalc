# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "HowMany residual polish - keyboard decimal, presets, AutoNest render, G-code Fill bounds, margins hydrate",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": [
      {
        "lane": "republish governance, Flow-ID reuse, and trace binding",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      },
      {
        "lane": "residual ownership, Allowed Files, and proof scope",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      },
      {
        "lane": "main lineage, docs-only publication, and merge ancestry",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      }
    ]
  },
  "branch_intent": "codex/howmany-residual-polish",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260811-6ec4fb02",
  "goal_memory_commit": "0000000000000000000000000000000000000000",
  "goal_sha256": "sha256:56da2ec513e656e7d8a9f0d111f27530e917cd291bf64a9de325af66794b66e1",
  "protected_surfaces": [
    "exact bytes, structure, visual language, motion, product identity, and wordmark of docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html",
    "calculator math, numeric semantics outside bridge-local input drafting, and nest-session calculation, conversion, rotation, link, and persistence behavior",
    "AutoNest packing, ranking, counts, trim-edge policies, fallback guards, search budget, placement truth, and existing preview renderer",
    "G-code parsing, validation, coordinate state, bounds math, rotation, generation, diagnostics, output freshness, Copy, and Download algorithms",
    "preset storage schema, keys, owner isolation, authentication generation, and existing usePresets save/load/delete semantics",
    "Clerk authentication and authorization policy, sign-in and request-access flows, route protection, and secrets",
    "Serwist service worker, offline shell, manifest, runtime cache behavior, PWA policy, deployment, Production, and docs/governance/MODE"
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": [
    "codex-repo-hygiene-gate",
    "nestcalc-goal-grilling",
    "codex-goal-prep",
    "lessons-aware-plan-scanner",
    "vercel-plugin:nextjs",
    "vercel-plugin:react-best-practices",
    "vercel-plugin:verification",
    "clerk-testing",
    "playwright",
    "tdd"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: HowMany residual polish - keyboard decimal, presets, AutoNest render, G-code Fill bounds, margins hydrate

### Objective

Human-approved title: **HowMany residual polish — keyboard decimal, presets,
AutoNest render, G-code Fill bounds, margins hydrate**. The machine-bound title
uses an ASCII hyphen because the current canonical goal-hash validator cannot
process non-ASCII title punctuation; this does not change the human title.

Polish the shipped Option B host-and-bridge product surface by resolving five
known post-ship residuals: physical-keyboard decimal entry, complete real-preset
persistence and carousel synchronization, truthful AutoNest stage rendering,
G-code Fill bounds parity, and `moveMarginsWithRotation` hydration. Keep the
exact accepted shell as the product chrome and confine implementation to the
runtime bridge and its focused proof.

This is the authoritative main-based republish of the same never-executed
residual objective from PR #55. PR #55 merged only into the pre-squash quiet
branch, so its old goal-memory commit is not main ancestry and is superseded for
future handoff purposes. Flow `NC-20260811-6ec4fb02` is reused because product
intent and scope are unchanged; the lifecycle contract permits minting or
reusing a Flow-ID during goal prep.

This freeze authorizes a later Codex CLI implementation pass only. This
goal-freeze publication is documentation-only. It does not create a B3 handoff,
implement product code, merge, deploy, or authorize Production.

### Locked Option B Authority And Walls

Option B remains the only authorized product path. The exact
`docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html` remains the live
product chrome, with canonical SHA-256:

`bed7567d093b73c08e2538f3e5939c32bc8765ae2cfbe9d43e7b2848d3f4475d`

Its bytes, structure, CSS, HowMany wordmark, blue Calculator / orange G-code
chrome, sheet morphs, transitions, and section behavior may not drift. Runtime
bridge code may bind events, state, factual values, real preset chips, and real
stage content into the existing DOM. It may not rewrite, recreate, restyle, or
replace the shell.

- No React recreation of the shell and no parallel visible chrome.
- No `NestCalcApp` restyle or return as the primary product UI.
- No calculator math, AutoNest packing algorithm, or G-code parser/rotation/
  bounds algorithm change.
- No preset schema, ownership, auth-race, or storage-key change.
- No Clerk policy, sign-in flow, route/proxy policy, Serwist/PWA, MODE,
  deployment, secrets, or Production change.
- Bridge/host polish only. If any residual proves a protected engine, hook,
  renderer, store, route, or shell source must change, stop for a new human
  decision and a new goal freeze before editing it.

The authority order is `AGENTS.md`, this active `GOAL.md`, the complete
`docs/nestcalc-ui-redesign-package/`, `docs/WORKFLOW.md` and goal-lifecycle
contracts, then applicable `LESSONS_LEARNED.md` entries. Soft inference across
an authority conflict is forbidden.

### Frozen Residual Decisions And Outcomes

1. **Physical keyboard decimal.** A physical `.` key must enter the focused
   prototype numeric field with the same usable decimal behavior as the
   on-screen keypad. Bridge-local draft/input handling may preserve transient
   decimal text; `src/lib/numericInput.ts`, calculator numeric meaning, and
   engine math remain unchanged.
2. **Real presets and carousel ownership.** Continue calling the existing
   owner-scoped v3 `usePresets` path unchanged. Save persists the complete
   current v3 state, load replaces the complete v3 state, and runtime carousel
   selection, page, classes, ARIA state, and controls remain synchronized by
   real preset ID after save/load/rename/delete and after all deferred shell
   animation frames. The bridge must neutralize or re-own the stale
   name-based `__nestPresetsSync` result without editing the shell source.
3. **Last-preset policy.** Preserve the existing real preset semantics: the
   final persisted preset may be deleted. The hosted carousel then presents a
   truthful empty state, clears selection, and disables edit, delete, and
   navigation until a new preset is saved. This runtime data-state decision
   does not alter shell source bytes or preset storage behavior.
4. **AutoNest stage truth.** When the existing real session reports computed
   AutoNest results, the hosted shell stage visibly renders the existing real
   two-group preview, counts, trim information, and placement geometry. Manual
   or not-ready state returns to the existing manual grid. The bridge may fix
   only portal target lifecycle, sizing, and presentation; wrong engine data or
   a required `AutoNestPreview` edit triggers the stop wall.
5. **G-code Fill bounds parity.** Restore the existing product semantics from
   `GCodeRotation`: the Fill part dimensions come from successful
   `analysis.bounds`, not rotated `generated.bounds`. Generate still uses the
   existing real rotation result for output and freshness. This is a call-site
   source selection only; bounds math and algorithms remain untouched.
6. **Margins hydration.** The prototype `moveMarginsWithRotation` checkbox
   hydrates from the current v3 session state and writes back through the
   existing session path on change. Reload, preset load, and subsequent state
   synchronization reflect the real boolean without changing rotation rules.

### Scope / Allowed Files

This docs-only freeze publication may change only:

- `GOAL.md`; and
- `docs/goals/GOAL-TRACE-INDEX.md`.

The later implementation and proof pass may edit only:

- `src/components/howmany/HowManyBridge.tsx` — runtime event/state binding,
  real carousel ownership, portal target presentation, bounds source selection,
  and checkbox hydration only.
- `src/lib/howmany/bridge.ts` — pure bridge mapping or synchronization helpers
  only; no engine, parser, storage, session, or renderer logic.
- `src/lib/howmany/bridge.test.ts` — focused unit proof for bridge-only helpers.
- `e2e/authenticated.spec.ts` — focused authenticated proof of all five
  residual outcomes and unchanged shell checksum.
- `e2e/locators.ts` — only if a new semantic hosted-shell locator is required.
- `e2e/global.setup.ts` — only if the residual proof requires a minimal setup
  correction; no Clerk policy, credential, or environment-value change.

All other files are read-only. In particular, `REFERENCE-PROTOTYPE-v2.html`,
`NestCalcApp.tsx`, `AutoNestPreview.tsx`, `NestGrid.tsx`, `GCodeRotation.tsx`,
`PresetControls.tsx`, `src/hooks/usePresets.ts`, `src/lib/numericInput.ts`,
`src/lib/nestSession.ts`, `src/lib/autoNestEngine.ts`, all G-code engine files,
preset/storage modules, Clerk/proxy files, Next/Serwist configuration, PWA
files, and `docs/governance/MODE` are not edit surfaces.

If implementation or required proof cannot be completed wholly within this
Allowed Files list, stop before expanding it and request a new human decision.

### Acceptance Criteria

1. The canonical prototype checksum remains exactly
   `bed7567d093b73c08e2538f3e5939c32bc8765ae2cfbe9d43e7b2848d3f4475d`;
   its HowMany identity, blue/orange chrome, motion, morphs, and sections remain
   the product UI with no competing React shell.
2. With a prototype numeric field focused, physical keyboard decimal entry
   supports `.5`, `1.2`, and insertion/replacement behavior without losing the
   decimal during state synchronization. The on-screen keypad remains green,
   and real counts reflect the accepted value.
3. An authenticated owner can save a preset containing a known complete v3
   state, alter every relevant state family, then load and recover the complete
   saved v3 state. Save/load/rename/delete preserve real-ID carousel selection,
   classes, page position, and ARIA truth after deferred animation frames; no
   demo `Default` selection is reasserted.
4. Deleting the final preset succeeds through the existing owner-scoped path
   and leaves a truthful empty carousel with null selection and disabled edit,
   delete, previous, and next controls. Saving again exits the empty state.
5. Computed AutoNest visibly renders the existing real preview inside the
   hosted shell stage with truthful groups, totals, trim summary, and placement
   geometry; switching back to Manual restores the real manual grid.
6. For a non-zero rotation fixture whose analyzed and generated AABBs differ,
   Generate produces the real rotated G-code/output, while Fill uses
   `analysis.bounds`, applies the existing whole-session unit/link semantics,
   and completes the exact shell morph to Calculator.
7. A seeded or preset-loaded `moveMarginsWithRotation` value hydrates the
   checkbox. Toggling it writes the real session boolean, survives state sync,
   and subsequent remnant rotation follows the unchanged existing rule.
8. No protected engine, hook, renderer, store, prototype, Clerk, PWA, MODE, or
   Production surface changes. No `NestCalcApp` restyle and no shell redesign.
9. `npm run lint`, `npm run test:unit`, `npm run build`, focused authenticated
   Playwright, goal/governance checks, checksum proof, and final scope/diff
   checks pass. Missing valid Clerk test values is reported as blocked and is
   never claimed as a pass.
10. Later implementation ends on `codex/howmany-residual-polish` as a separate
    ready-for-review implementation PR only after a human separately authorizes
    B3 handoff/execution. No merge, MODE flip, deployment, or Production action
    is authorized by this freeze.

### Hard Non-Goals

- Shell HTML/CSS/JavaScript redesign, extraction, recreation, or checksum drift.
- Light mode, Settings work, or deep-link `#g-code` work unless strictly needed
  for in-scope residual proof; any product behavior change there remains out of
  scope.
- Calculator math, numeric rules outside bridge-local draft preservation,
  AutoNest packing/ranking/count/trim/search behavior, or G-code parser/rotate/
  bounds/generation algorithm work.
- Preset schema, storage-key, owner-isolation, authentication-generation,
  multi-device sync, Clerk policy, sign-in, request-access, proxy, PWA,
  dependency, environment, secret, Vercel, MODE, deploy, or Production work.
- Product implementation, B3 execution handoff, implementation PR, merge, or
  deployment during this docs-only freeze session.

### Required Proof For Later Execution

Before the first implementation edit, the later CLI B4 preflight must:

1. Read `AGENTS.md`, this active goal, `GOAL-TRACE-INDEX`, the complete Option B
   package, `docs/WORKFLOW.md`, goal lifecycle contracts, and lessons
   `L-nestcalc-playwright-clerk-boot`,
   `L-nestcalc-playwright-auth-setup-order`,
   `L-nestcalc-autonest-computed-preview`,
   `L-nestcalc-fill-unit-session-convert`,
   `L-nestcalc-fill-clear-part-link`, and
   `L-nestcalc-path-a-goal-impl-split`.
2. Validate the active goal, future B3 handoff, branch, goal-memory ancestry,
   exact prototype checksum, and required-proof subset of Allowed Files.
3. Run clean baseline lint, unit, and build checks. An out-of-scope failure
   blocks execution and does not authorize another file.
4. Confirm valid existing Clerk test-mode values for authenticated Playwright.
   If unavailable, stop before editing and report proof blocked. Never create,
   print, edit, or commit credentials or environment values.

After implementation, all must pass:

```bash
python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md
shasum -a 256 docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html
npm run lint
npm run test:unit
npm run build
npx playwright test e2e/authenticated.spec.ts --project=authenticated --grep "HowMany residual polish"
git diff --check
```

Focused authenticated browser proof must exercise the physical keyboard and
on-screen decimals, a complete v3 preset round trip plus rename/final-delete/
empty-state and settled carousel ownership, truthful AutoNest preview and
Manual return, non-zero-rotation Generate plus analysis-bounds Fill/morph, and
checkbox hydration/write-back. Capture review screenshots or a trace for the
Calculator, AutoNest, preset empty state, G-code before Fill, and post-Fill
Calculator states; keep generated evidence uncommitted.

### Grilling Decision Record

The required loop ran as:

```text
evidence → confidence → decision → residual risk / flagged decisions
```

Three bounded read-only lanes used requested and observed `gpt-5.6-terra` at
medium reasoning effort; all model routes matched.

- **Evidence:** PR #53 shipped the host and bridge. All five residual owners
  converge in `HowManyBridge.tsx`. Existing `usePresets` already binds Clerk
  owner/auth generation, saves complete v3 state, and loads by full state
  replacement. The prototype's `__nestPresetsSync` retains demo name state in a
  deferred frame. Legacy `GCodeRotation` Fill explicitly uses
  `analysis.bounds`. The bridge writes the margins checkbox on change but does
  not hydrate it. Existing authenticated proof checks only superficial preset
  and AutoNest visibility behavior. PR #55 preserved this intent but did not
  land on main because it targeted the pre-squash quiet branch.
- **Confidence:** freeze-ready on Path A. The requested bridge/test-only files
  are sufficient if existing hooks, stores, engines, and renderers remain
  call-only. Required proof is contained by the Allowed Files list.
- **Decision:** reuse the unchanged Flow-ID, retain Option B, fix only runtime
  bridge ownership, allow the final real preset to delete into an empty
  carousel, and use `analysis.bounds` for Fill parity. Bind a new main-based
  freeze commit and require merge-commit publication.
- **Residual risk:** authenticated proof depends on valid existing Clerk test
  values. If a reproduction proves `usePresets`, preset storage,
  `AutoNestPreview`, session behavior, or an engine—not the bridge—is defective,
  the executor must stop for a new human decision rather than expand scope.

### Stop Condition For This Freeze

Publish only `GOAL.md` and `docs/goals/GOAL-TRACE-INDEX.md` as a ready-for-review
docs-only PR based directly on current `main`. Human must merge that PR with a
merge commit, not squash, so the new goal-memory commit remains ancestral for a
later B3 handoff. Stop there. Do not create a B3 implementation handoff, edit
product files, open an implementation PR, merge, deploy, change MODE, or touch
Production in this session.
