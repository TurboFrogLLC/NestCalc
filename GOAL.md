# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "HowMany UI polish residual - AutoNest stage, G-code, calculator controls, and dialogs",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": [
      {
        "lane": "hosted UI ownership and bridge presentation seams",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      },
      {
        "lane": "G-code bounds ownership and owner-file quarantine",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      },
      {
        "lane": "goal lifecycle, Allowed Files, and proof closure",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      }
    ]
  },
  "branch_intent": "codex/howmany-ui-polish-residual",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260811-59adccab",
  "goal_memory_commit": "c82aa8c8959fb7dbdbd4a52cb9f5778986a59d20",
  "goal_sha256": "sha256:fbfa9d2178afd7e607c03439f7530a5dcdea4aee44d8a0cbf5beb600227bd425",
  "protected_surfaces": [
    "exact bytes, structure, identity, free-standing header wordmark, and locked chrome authority of docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html",
    "docs/ui-shell and the accepted Option B package lineage, except read-only consultation of the canonical prototype",
    "calculator math, numeric meaning, nest-session transforms, persistence behavior, and calculator input semantics outside bridge-local presentation and focus behavior",
    "AutoNest packing, ranking, counts, trim-edge policies, fallback guards, search budget, placement truth, and engine algorithms",
    "G-code parsing, analysis, validation, coordinate state, bounds math, rotation, generation, diagnostics, and NC safety algorithms",
    "Clerk authentication and authorization policy, request-access and sign-in behavior, routes, secrets, and owner isolation",
    "Serwist service worker, offline shell, manifest, runtime cache behavior, PWA policy, dependencies, deployment, Production, and docs/governance/MODE"
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
    "tdd",
    "diagnosing-bugs"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: HowMany UI polish residual - AutoNest stage, G-code, calculator controls, and dialogs

### Objective

Ship the human-approved HowMany UI polish residual as presentation, bridge, and
hosted-shell behavior only. Preserve the shipped Option B architecture: the
exact canonical prototype is locked chrome, React remains a thin host plus
bridge, and existing calculator, AutoNest, G-code, preset, Clerk, and PWA
owners remain authoritative.

The full locked brand line is **HowMany by wReckless Toddler LLC**. The header
remains the left gradient square plus free-standing lowercase `h`, Lucide
`CircleQuestionMark`, and `wMany`, with no pill, box, outline, or grouped text
container.

This freeze authorizes a later Codex CLI implementation pass only. It does not
implement product code, create a B3-style handoff, commit, open a PR, push,
merge, deploy, change MODE, or authorize Production.

### Locked Option B Authority And Implementation Boundary

The exact file below remains the sole locked chrome authority and must retain
SHA-256 `bed7567d093b73c08e2538f3e5939c32bc8765ae2cfbe9d43e7b2848d3f4475d`:

`docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html`

- Prefer bridge-created DOM, portals, injected scoped presentation, event
  capture, and focus management over any shell-byte edit.
- Do not edit, rewrite, extract, recreate, restyle in place, or replace the
  locked prototype.
- No working duplicate is required or allowed by this freeze. If a later
  presentation experiment proves a `v2.1` duplicate is necessary, stop for a
  new human decision and a Path B Allowed Files expansion before creating it.
- Do not edit `HowManyHost.tsx`, the direct-byte shell route, `NestCalcApp.tsx`,
  `AutoNestPreview.tsx`, `NestGrid.tsx`, any engine, hook, store, route, or
  prototype package file under this goal.

### Frozen Polish Outcomes

#### AutoNest stage

1. Present trim dimensions outside the blank: horizontal along the left and
   vertical along the top, with an orthogonal drafting style. Values must come
   from existing truthful result geometry; presentation must not recalculate
   packing or trim policy.
2. Remove the bottom raw/noise line such as `90deg x5 B1 ...` from the visible
   hosted result without discarding underlying truth used by tests or assistive
   labeling.
3. Keep the trim/offset information and fold it into the result card body. Do
   not delete operator-relevant trim truth or leave it as detached noise.
4. Present the result block as one real card with a distinct header and body,
   using bridge/portal markup and scoped styling around the existing real
   result.
5. Render 0-degree parts with blue stroke plus translucent blue fill and
   90-degree parts with orange stroke plus translucent orange fill. Preserve
   part identity, counts, geometry, and accessibility.

#### G-code

6. Diagnose the reported square-bounds mismatch (for example `1.493 x 1.62`
   instead of `1.493 x 1.493`) as bridge/state presentation versus existing
   analysis ownership. Tracked engine evidence currently produces the square
   as approximately `1.493 x 1.493`; no tracked fixture reproduces the mixed
   axes. A bridge-local stale/cross-file state defect may be corrected only in
   Allowed Files. If `analyzeGCode`, bounds math, parsing, rotation, or another
   engine/analysis owner must change, stop for a new human decision without
   editing it.
7. Add an **Open file** action that accepts local `.nc`, `.cnc`, and text files
   and loads their text into the existing SOURCE textarea through browser-local
   File APIs. Do not upload, persist, rewrite, or commit the opened file.
8. Rename visible `SOURCE BOUNDS` copy to `Bounding box` through bridge-owned
   hosted presentation only.
9. Give the bounding-box stage a restrained atmosphere using faint local
   G-code text when source exists and soft decorative static when it does not.
   It must remain non-interactive, low contrast, local-only, and must not alter
   the analysis or generated output.
10. Make expand/collapse use the full available width, remain right-anchored,
    and transition without blink or left-to-right fly-in at every supported
    breakpoint. Preserve the existing mode and restore semantics.

#### Calculator

11. Keep the collapsed MARGINS badge `L / R / B / T` values synchronized with
    the corresponding expanded fields after typing, clear, unit conversion,
    rotation, preset load, and state hydration.
12. Quick-value chips provide a transient blink only, never sticky selection;
    choosing one replaces the focused field value rather than appending.
    Accept at most one decimal separator and at most three fractional digits.
13. A control on the keypad drag bar opens a compact `left arrow / right arrow`
    strip. The arrows move focus to the previous or next calculator numeric
    input without changing values, trapping focus, or disrupting drag/close.
14. Keyboard Left/Right cycles and highlights real preset chips when focus is
    in the preset carousel or on a preset control. It must not hijack arrow keys
    while editing calculator fields or other text.

#### Dialogs

15. Replace browser prompts for quick-value editing with a hosted custom card.
    The card has no browser-origin title chrome, contains the editable value, a
    real Delete button, and distinct radiused Cancel and OK buttons. Validation
    follows the one-decimal-separator / three-fractional-digit rule.
16. Replace the browser prompt for adding a preset with the same custom-card
    pattern and the exact header **Save preset**. Cancel performs no save; OK
    uses the existing owner-scoped preset save path unchanged.

### Scope / Allowed Files

This goal-freeze session may edit only:

- `GOAL.md`

The later implementation and focused proof pass may edit only these exact
files:

- `src/components/howmany/HowManyBridge.tsx`
- `src/lib/howmany/bridge.ts`
- `src/lib/howmany/bridge.test.ts`
- `e2e/authenticated.spec.ts`

All other tracked files are read-only. Generated Playwright screenshots,
traces, and local owner repro inputs remain untracked evidence, not edit
authority and not commit content.

### Owner-File Quarantine

The pre-existing untracked paths below are user-owned evidence/mockup material
and are quarantined from this freeze and later implementation commits:

- `docs/architecture/nestcalc-ui-redesign-package.zip`
- `docs/architecture/nestcalc-ui-redesign-package/**`
- `output/playwright/**`

Do not treat the duplicate architecture package as canonical authority. Any
owner-supplied `.nc`, `.cnc`, text, screenshot, or other repro file for item 6
must remain untracked, must not be copied into a tracked fixture path, and must
not be committed. Use only sanitized inline test strings in the allowed E2E or
unit test file.

### Protected Surfaces And Hard Non-Goals

- No mutation of `REFERENCE-PROTOTYPE-v2.html`, no shell byte drift, and no
  reinterpretation of HowMany identity, the wordmark, `docs/ui-shell`, or the
  accepted Option B package.
- No prototype duplicate under this freeze.
- No calculator math, numeric meaning, nest-session conversion/rotation/link/
  persistence rules, or general calculator input-model change.
- No AutoNest packing, ranking, counts, placement, trim-edge policy, fallback,
  search-budget, renderer algorithm, or NC fixture-generator work.
- No G-code parser, analyzer, coordinate state, bounds, rotation, generation,
  diagnostic, output-freshness, Copy, Download, or NC safety algorithm change.
- No preset schema, IndexedDB/storage key, owner isolation, auth generation,
  load/save/delete semantics, or multi-device work.
- No Clerk, sign-in, request-access, proxy, route, secret, `.env*`, PWA,
  service-worker, runtime-cache, dependency, Vercel, deployment, Production,
  or `docs/governance/MODE` change.
- No edits to governance or workflow files, goal trace files, build specs,
  lessons, product implementation outside Allowed Files, or unrelated owner
  artifacts.
- No implementation, commit, B3-style handoff, CLI prompt, PR, push, merge, or
  deployment during this goal-freeze session.

### Acceptance Criteria

1. All sixteen frozen outcomes above are visible and keyboard-accessible in the
   hosted Option B surface, with the canonical checksum unchanged and no
   competing React shell.
2. AutoNest stage proof shows external orthogonal trim dimensions, no raw
   bottom noise string, trim/offset inside a card body, a distinct card header,
   and blue 0-degree versus orange 90-degree stroke/fill styling while real
   counts and geometry remain unchanged.
3. Local `.nc`, `.cnc`, and `.txt` files load into SOURCE without upload or
   persistence; cancellation and unreadable/unsupported files fail safely and
   do not replace the current source.
4. The G-code stage says `Bounding box`, displays only faint non-interactive
   local-source/static atmosphere, and expands/collapses full-width from the
   right with no blink or left-to-right fly-in on desktop and mobile proof.
5. A sanitized square and a distinct rectangular G-code string are loaded in
   sequence and independently prove their own analysis dimensions, preventing
   mixed X/Y state. Any exact owner repro remains quarantined. The final item-6
   report identifies bridge/state or analysis ownership; analysis ownership is
   a mandatory stop, not an algorithm fix.
6. Collapsed MARGINS values exactly match expanded L/R/B/T values through all
   named state transitions.
7. Quick chips replace values, enforce one decimal separator and no more than
   three fractional digits, and show only transient press/blink feedback with
   no sticky selected class or ARIA state.
8. The drag-bar arrow strip opens and moves focus backward/forward through the
   calculator numeric fields while preserving values and keypad drag/close
   behavior.
9. Focused preset controls support Left/Right cycling and truthful highlight;
   numeric/text fields retain their native arrow behavior.
10. Quick-value edit and preset save use accessible custom dialog cards with
    focus entry/return, Escape/Cancel behavior, OK validation, and the exact
    button/header requirements. No browser `prompt` is invoked for these two
    flows.
11. No protected prototype, host, route, renderer, engine, store, hook, Clerk,
    PWA, MODE, owner-file, or Production surface changes.

### Required Proof - Path A

**Path A is selected.** Required proof is narrowed to commands and browser
scenarios whose corrective edit authority is wholly contained in the four
later-pass Allowed Files. A failure that requires any other file is a blocker
and residual debt for a separately frozen wave; it does not authorize scope
expansion.

Before the first implementation edit, the later CLI B4-style preflight must:

1. Read `AGENTS.md`, this goal, `docs/WORKFLOW.md`, lifecycle contracts,
   `LESSONS_LEARNED.md`, the canonical Option B package, and relevant lessons
   including `L-nestcalc-ios-quickbar-touch`,
   `L-nestcalc-autonest-computed-preview`,
   `L-nestcalc-module-accent-isolation`, and
   `L-nestcalc-expand-collapse-all-breakpoints`.
2. Validate the committed goal and matching B3-style handoff, confirm current
   branch equals `codex/howmany-ui-polish-residual`, verify the prototype
   checksum, and reclassify/quarantine all owner/untracked files.
3. Confirm valid existing Clerk test values. Missing values block the required
   authenticated browser proof and therefore block implementation before edit;
   they are never claimed as a pass.
4. Run clean baseline lint, unit, and build checks. Any baseline failure that
   cannot be fixed inside Allowed Files blocks implementation.

After implementation, every command below must pass:

```bash
python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md
shasum -a 256 docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html
npm run lint
npm run test:unit
npm run build
npx playwright test e2e/authenticated.spec.ts --project=authenticated --grep "HowMany UI polish residual"
git diff --check
```

Focused authenticated browser proof must cover all sixteen outcomes at desktop
and a supported mobile viewport where layout behavior differs. Capture
reviewable Calculator, AutoNest, G-code split/full, quick-value dialog, and Save
preset dialog screenshots or traces under the test runner's untracked output.
Do not commit generated proof.

### Grilling Decision Record

The required loop ran as:

```text
evidence -> confidence -> decision -> residual risk / flagged decisions
```

- **Evidence:** All existing integration seams converge in
  `HowManyBridge.tsx`; pure draft/carousel/display helpers already live in
  `src/lib/howmany/bridge.ts`; authenticated Option B proof already lives in
  `e2e/authenticated.spec.ts`. The locked shell still owns demo quick-value
  prompt/sticky behavior and the visual endpoints, so capture-phase bridge DOM,
  scoped CSS, focus, and dialog ownership can supersede those behaviors without
  changing shell bytes. The current canonical checksum matches authority.
- **Bounds evidence:** tracked G-code analysis tests produce the cited square
  as approximately `1.493 x 1.493` and a separate rectangle with height `1.62`;
  no tracked fixture produces the mixed `1.493 x 1.62` square. Current evidence
  favors cross-file/bridge-state reproduction or owner-input ambiguity, not an
  engine rewrite.
- **Confidence:** freeze-ready on Path A. No blocking freeze question remains;
  every implementation uncertainty has an explicit stop condition. Required
  corrective edits and focused proof are contained by Allowed Files.
- **Decision:** use bridge/portal presentation only, fold trim/offset truth into
  the real result card, scope preset arrow keys to preset focus, and do not
  create a prototype duplicate.

#### Flagged decisions / residual risk

1. **Item 6 exact owner reproduction.** Reason: the reported mixed axes do not
   reproduce from tracked fixtures and no owner source is committed. Decision:
   quarantine owner files, add sanitized sequential square/rectangle proof, and
   diagnose the exact owner input locally only if supplied. CLI consequence:
   fix only demonstrated bridge/state ownership; stop on analysis/engine
   ownership or irreproducible requirements that need a new tracked fixture.
2. **AutoNest card composition.** Reason: external dimensions and a card can be
   composed around the existing portal without renderer edits, but final
   viewport fit is visual. Decision: bridge wrapper/scoped presentation only.
   CLI consequence: stop rather than edit `AutoNestPreview.tsx` if the accepted
   composition cannot be achieved from the bridge.
3. **Prototype duplicate.** Reason: current DOM seams are sufficient for a
   bridge experiment. Decision: no duplicate. CLI consequence: any need for
   `v2.1` requires a new human decision and Path B freeze before file creation.
4. **Locked-shell demo handlers.** Reason: quick values, G-code stage chrome,
   and several transitions originate in locked demo JavaScript, but the
   same-origin bridge can capture their events, add accessible runtime DOM, and
   inject scoped overrides. Decision: the bridge owns these residual behaviors
   without changing source bytes. CLI consequence: if capture/override cannot
   suppress a demo behavior safely and deterministically, stop rather than edit
   the prototype, renderer, host, or route.
5. **Keyboard arrows.** Reason: global Left/Right capture would break numeric
   and text editing. Decision: activate preset cycling only from preset-region
   focus. CLI consequence: preserve native arrows everywhere else.
6. **Authenticated proof.** Reason: UI completion requires browser proof behind
   Clerk. Decision: retain focused authenticated E2E as required Path A proof.
   CLI consequence: missing valid test credentials blocks before implementation.

### Stop Conditions

For this session, stop after editing only `GOAL.md` and completing goal,
governance, diff, checksum, and status validation. Do not commit, create a
B3-style handoff, generate a CLI prompt, create/switch a feature branch, open a
PR, push, merge, deploy, modify MODE, or touch Production.

For later execution, stop before or during implementation if the canonical
checksum drifts; a required edit falls outside Allowed Files; an owner repro
would be committed; item 6 belongs to analysis/engine ownership; a prototype
duplicate or renderer/host/route edit is required; Clerk proof is unavailable;
or any protected surface must change. Return to the human for a newly frozen
decision instead of expanding this goal.
