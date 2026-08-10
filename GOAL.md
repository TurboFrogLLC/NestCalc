# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "NestCalc UI redesign - Calculator + G-code shell (visual/UX)",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": [
      {
        "lane": "UI source ownership and browser-proof surface",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      },
      {
        "lane": "goal lifecycle, metadata, and traceability",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      },
      {
        "lane": "PR #40 Fill part size lessons and invariants",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      }
    ]
  },
  "branch_intent": "codex/ui-redesign-calc-gcode-shell",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260810-5e79a800",
  "goal_memory_commit": "0000000000000000000000000000000000000000",
  "goal_sha256": "sha256:eaa5c21251b80da1ae319b5ca3f1ae183ab179206253f2deec61c7eb22e8ff35",
  "protected_surfaces": [
    "calculator math, nest-session transforms, and persisted value semantics",
    "AutoNest engine packing, ranking, counts, trim-edge policies, fallback guards, and search budget",
    "G-code parsing, validation, rotation, bounds, generation, output-staleness, copy, and download algorithms",
    "Clerk authentication, authorization, request-access policy, route shape, and preset owner isolation",
    "Serwist service worker, offline shell, runtime cache, and PWA policy",
    "secrets, .env files, deployment credentials, Vercel settings, and Production",
    "docs/governance/MODE and repository governance contracts outside this goal freeze"
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
    "vercel-plugin:next-best-practices",
    "vercel-plugin:react-best-practices",
    "vercel-plugin:verification",
    "playwright"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: NestCalc UI redesign - Calculator + G-code shell (visual/UX)

### Objective

Deliver a dark, shop-floor-focused visual and interaction redesign of the
Calculator and G-code shell without changing calculation results, packing
behavior, G-code transformation behavior, authentication policy, or PWA
runtime behavior.

This goal is frozen for later Codex CLI execution. The goal-freeze PR is
documentation-only and does not authorize implementation in the chat planning
session.

### Design Scope Authority

The exploratory SuperGrok package at
`artifacts/docs/nestcalc-ui-redesign-package/` was not present in this clone at
freeze time. A human-provided package copy may be used only to interpret the
visual/UX scope enumerated in this goal. It is not product authority, cannot
broaden Allowed Files, and cannot override `AGENTS.md`, this goal, workflow
contracts, protected behavior, or the PR #40 lessons.

The reference prototype is a visual reference, not code to copy wholesale and
not permission to add dependencies, routes, policies, or product behavior.

### Scope / Allowed Files

Only these implementation and proof files may change:

- `src/app/globals.css` — module-scoped tokens, explicit panel/stage dimensions,
  responsive chrome, and the shared transition contract.
- `src/components/NestCalcApp.tsx` — Calculator/G-code shell composition,
  panel/viewer presentation state, module navigation, and successful Fill-to-
  Calculator morph wiring. Existing nest-session helper calls and state
  semantics must remain intact.
- `src/components/GCodeRotation.tsx` — visual hierarchy, full-expand affordance,
  equal-height Rotation/Part size chrome, and button emphasis. Parsing,
  scheduling, bounds, generation, output freshness, Copy, and Download behavior
  are protected.
- `src/components/PresetControls.tsx` — visual chrome only; preserve storage,
  owner isolation, focus return, dialog semantics, and all `usePresets` calls.
- `src/components/NumberInput.tsx` — visual chrome only; preserve draft parsing,
  sanitization, blur, labels, input mode, and Quick Values focus registration.
- `src/components/QuickValuesBar.tsx` — visual chrome only; preserve visual-
  viewport positioning and mouse/touch focus behavior.
- `src/components/AuthControls.tsx` — style-only if needed; preserve Clerk
  `<Show>` gating, `UserButton`, and shared appearance behavior.
- `src/components/NestGrid.tsx` — chrome-only classes around the existing SVG;
  preserve coordinates, margins, placement order, part counts, cap behavior,
  factual labels, and test hooks.
- `src/components/AutoNestPreview.tsx` — chrome-only classes around the existing
  computed preview; preserve geometry, grouping, placement order, counts, trim
  truth, factual summaries, and test hooks.
- `e2e/authenticated.spec.ts` — authenticated desktop/mobile browser proof for
  the redesigned shell, G-code full expand, Fill morph, and non-regressions.
- `e2e/locators.ts` — semantic locators only when the approved accessible UI
  surface requires them.

`src/app/layout.tsx`, `src/app/page.tsx`, all `src/lib/**`, hooks, storage,
middleware/proxy, route, PWA/service-worker, configuration, package, public,
and governance files are outside implementation scope. If another file becomes
necessary, stop and request a new Path B goal freeze before editing it.

### Acceptance Criteria

#### Shell and visual language

1. Calculator primary/accent chrome uses `#538BEC`; G-code primary/accent chrome
   uses `#EE8C3C`. Module-scoped tokens prevent one module's accent from leaking
   into the other module or changing factual AutoNest/status colors.
2. At the redesigned desktop/stage breakpoint, the Calculator sheet has an
   explicit `300px` width on the left and the G-code sheet has an explicit
   `420px` width on the right. Smaller viewports use an intentional responsive
   layout with no horizontal overflow, clipped controls, or unreachable focus.
3. G-code full-expand mode hides the non-sheet stage viewer and expands the
   G-code panel into the released space. Collapse restores the viewer and the
   explicit `420px` sheet state without losing source, analysis, angle, output,
   or module navigation state.
4. In the expanded G-code panel, Rotation and Part size render as a single
   equal-height row. `Generate` is the only filled primary action. `Fill part
   size`, Copy, Download, expand/collapse, and other actions use secondary or
   tertiary styling without weakening enabled, disabled, or focus states.
5. A successful `Fill part size` applies the existing PR #40 bridge and then
   morphs the shell to Calculator with the canonical Calculator tab/hash state.
   Invalid, pending, or zero-span source never applies values and never morphs.
   Returning to G-code preserves its local source/analysis/output state.
6. Panel width and stage padding animate with one shared `0.72s` spring timing
   and easing contract. Both properties use explicit numeric endpoints; do not
   animate to or from `width: auto`. Honor reduced-motion preferences without
   changing the final layout state, and do not add an animation dependency.
7. Preserve current tab roles, arrow/Home/End keyboard behavior, deep-link and
   history behavior, visible focus, touch targets, safe-area behavior, and
   portrait/landscape usability.

#### PR #40 Fill part size invariants

8. Fill dimensions remain the analyzed, unrotated source-toolpath AABB spans
   (`maxX - minX`, `maxY - minY`), never the rotated preview AABB. Both spans
   must be finite and strictly positive before Fill enables.
9. Program unit selection remains explicit (`IN`/`MM`). A cross-unit Fill first
   converts the entire existing nest session through
   `applyPartSizeToNestSession`/session helpers, including remnant, gaps,
   margins, clamp/shared-clearance settings, and nullable overrides, then
   overwrites only part width/height. It must never merely relabel the unit.
10. Importing unequal width/height clears `partLinked`; equal spans preserve the
    existing link state. Same-unit Fill preserves every unrelated calculator
    and AutoNest value.
11. Source or program-unit changes clear stale Fill status. Preserve the Fill
    accessible name/status hooks and preserve G-code analysis, preview,
    diagnostics, Generate, output-staleness, Copy, and Download behavior.
12. `NestCalcApp` continues to apply Fill through
    `applyPartSizeToNestSession(current, partSize, declaredUnit)`; UI code must
    not reimplement or bypass the bridge.

#### Proof and publication

13. Authenticated Playwright covers the desktop and mobile Calculator/G-code
    states, exact sheet endpoints, no horizontal overflow, full expand/collapse,
    equal-height Rotation/Part size row, Generate-only primary emphasis, and
    successful/blocked Fill morph behavior. Existing G-code output and AutoNest
    truth assertions remain green.
14. Visual evidence includes Calculator and G-code desktop/mobile states plus
    the expanded G-code state. Generated screenshots stay uncommitted unless a
    later explicit goal expands publication scope.
15. The implementation wave ends on `codex/ui-redesign-calc-gcode-shell` with
    implementation commits separate from goal-memory commits and a ready-for-
    review feature PR. No merge, branch deletion, Production action, or deploy
    is authorized.

### Protected Surfaces / Non-Goals

- No calculator math, nest-session conversion semantics, persisted data schema,
  or AutoNest engine/ranking/count/trim/fallback/search-budget change.
- No G-code parser, validator, coordinate state, bounds, rotation, generation,
  scheduling, output-freshness, Copy, or Download algorithm change.
- No Clerk auth, sign-in/sign-up, request-access, route, preset ownership,
  environment, or policy change.
- No Serwist/service-worker, offline shell, manifest, runtime cache, or PWA
  policy change.
- No secrets, `.env*`, deployment credentials, Vercel project settings,
  Production action, merge, force-push, or branch deletion.
- No light-theme redesign. Preserve the existing light theme; mechanically
  reusing scoped tokens is allowed only when trivial and already covered by the
  same files and proof.
- No new dependency, route, native/iOS work, design-package import, or edits to
  `docs/governance/MODE`.

### Required Proof

Required proof is deliberately fixable inside Allowed Files (Path B): the
existing authenticated Playwright spec and locator files are included because
current browser coverage does not prove the Fill morph or redesigned shell.

Before the first implementation edit, B4-style preflight must:

1. Read the authority order, relevant Next.js 16 guides under
   `node_modules/next/dist/docs/`, and lessons
   `L-nestcalc-landscape-overflow-qa`, `L-nestcalc-split-layout-css`,
   `L-nestcalc-playwright-clerk-boot`,
   `L-nestcalc-e2e-split-layout-locator`,
   `L-nestcalc-fill-unit-session-convert`,
   `L-nestcalc-fill-clear-part-link`, and
   `L-nestcalc-path-a-goal-impl-split`.
2. Validate `GOAL.md`, the B3-style handoff, current branch, and proof scope.
3. Confirm valid local Clerk test-mode values already exist for authenticated
   Playwright. If unavailable, stop before editing and report browser proof
   blocked. Do not create, edit, expose, or request permission to commit secrets.

After implementation, all must pass:

```bash
python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md
npm run lint
npm run test
npm run build
npm run test:e2e:auth
git diff --check
```

Also inspect the final diff against Allowed Files and confirm that no generated
`output/` evidence, design-package copy, secret, PWA, Clerk policy, algorithm,
or governance file entered an implementation commit.

### Grilling Decision Record

The required loop was run as
`evidence → confidence → decision → residual risk / flagged decisions`.
Three bounded read-only lanes used requested and observed
`gpt-5.6-terra` at medium reasoning effort; all routes matched.

- **Evidence:** current component ownership places shell/state wiring in
  `NestCalcApp`, G-code presentation and protected algorithms in
  `GCodeRotation`, responsive chrome in `globals.css`, and browser proof in the
  authenticated Playwright suite. PR #40 lessons and merged helpers define the
  Fill invariants above.
- **Confidence:** freeze-ready. No blocking scope question remains; proof files
  are inside edit authority, protected surfaces are explicit, and each known
  ambiguity has a decision and CLI consequence below.
- **Decision:** use the exact Allowed Files list, module-scoped accents, explicit
  `300px`/`420px` sheet endpoints, and Path B test authority. Keep all domain
  helpers and policies read-only.

Flagged decisions and residual risks:

1. **Design package unavailable.** Decision: freeze only the human-supplied
   scope text above; a later package copy is interpretive evidence only.
   Consequence: if it asks for a new file, dependency, route, policy, or behavior
   not stated here, the CLI stops for a new goal freeze.
2. **Viewer terminology.** Decision: "viewer" means the non-sheet visual stage;
   the G-code conservative-bounds content remains truthful and available within
   the G-code experience. Consequence: full expand may hide/reflow chrome but
   cannot remove proof or change bounds semantics.
3. **Animation mechanism.** Decision: implement one CSS/shared-token 720ms
   spring contract with explicit width and padding endpoints and reduced-motion
   handling. Consequence: if exact motion would require a dependency or
   `width:auto`, stop rather than expand scope.
4. **Authenticated browser environment.** Decision: make valid existing Clerk
   test values a pre-edit gate. Consequence: missing values block execution; they
   do not relax proof or authorize auth/env changes.
5. **Layout authority.** Decision: `src/app/layout.tsx` is not required and is
   excluded. Consequence: any discovered need to edit it triggers a new Path B
   freeze before implementation.
6. **Trace index adoption.** Decision: bind this Flow-ID to a minimal active row
   in `docs/goals/GOAL-TRACE-INDEX.md`, modeled on the product-agnostic baseline,
   while leaving governance validators unchanged. Consequence: the index is
   informational goal memory and never broadens implementation authority.

### B3-Style Handoff / B4-Style Preflight

- After the goal-memory bind commit, create a sanitized B3-style execution
  handoff with prompt hash only and the bound goal-memory commit.
- Codex CLI must revalidate goal hash, handoff, branch, lessons, Clerk proof
  availability, and required proof ⊆ Allowed Files before the first edit.
- Host-first for `npm ci`, Playwright, git/gh network, credentials, and `.git`
  locks. Any preflight mismatch stops execution.

### Stopping Condition

Complete only when every acceptance criterion and required proof passes, the
diff is confined to Allowed Files, goal-memory and implementation commits remain
separate, and a ready-for-review feature PR is open.

Stop blocked before or during implementation when required browser credentials
are unavailable, a protected surface would need to change, a required proof
cannot be repaired inside Allowed Files, the design package conflicts with this
goal, or any scope/authority mismatch appears. Do not merge or deploy.
