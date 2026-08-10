# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "NestCalc UI dark visual residual - prototype parity chrome",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": [
      {
        "lane": "package visual authority and conflict resolution",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      },
      {
        "lane": "package integrity and canonical seven-file scope",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      },
      {
        "lane": "goal lifecycle and authority rebind governance",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      }
    ]
  },
  "branch_intent": "codex/ui-dark-prototype-parity-freeze",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260810-472606a4",
  "goal_memory_commit": "638b899d51f3f31eaedb46ed1c10bda794c955ef",
  "goal_sha256": "sha256:3f5b4e2537716db1397ef16362397e621d0e4c34bb426f23f26467c342edc5ad",
  "protected_surfaces": [
    "calculator math, nest-session transforms, persistence, and numeric input semantics",
    "AutoNest engine, ranking, counts, trim policies, placement geometry, and factual output",
    "G-code parsing, validation, bounds, rotation, generation, scheduling, output freshness, Copy, and Download behavior",
    "PR #43 structural shell contracts: 300px/420px sheets, G-code expand, equal-height cards, Generate emphasis, and Fill-to-Calculator morph",
    "Clerk authentication, authorization, request-access policy, route shape, and preset owner isolation",
    "Serwist service worker, offline shell, runtime cache, and PWA policy",
    "secrets, .env files, dependencies, deployment credentials, Vercel settings, Production, merge, and docs/governance/MODE"
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
    "playwright"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: NestCalc UI dark visual residual - prototype parity chrome

### Objective

Apply the locked dark visual system and accessible collapsible Calculator
chrome on top of the structural shell merged in PR #43. Correct the primary
product appearance from the rejected light shop theme to the approved dark
prototype language without changing calculator results, AutoNest behavior,
G-code transformation behavior, authentication, or PWA runtime behavior.

This freeze authorizes a later Codex CLI implementation pass only. The goal-
freeze PR is documentation-only and contains no product implementation.

### Visual Authority

For this goal, the hard visual authority is:

- non-negotiable visual source of truth:
  `docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html`;
- non-negotiable token source of truth:
  `docs/nestcalc-ui-redesign-package/DESIGN-TOKENS.md`;
- supporting component, state-bridge, and protection authority:
  `COMPONENT-MAP.md`, `WIRING.md`, and `DO-NOT-TOUCH.md` in that same package
  directory; and
- the human-frozen acceptance text in this goal.

`README.md` in that directory establishes package provenance and intent.
`CODEX-READY-PROMPT.md` is a non-executable historical draft and does not
override this goal, authorize files, or serve as the later CLI handoff. The
human's explicit adoption of the package in this freeze supersedes the
package's original exploratory-only / not-a-NestCalc-commit disposition for
these seven tracked authority files only. It does not adopt sandbox code,
dependencies, routes, policies, or product behavior.

Implementation must match the prototype's visual intent and the exact token
source. Translating its sandbox markup into the existing Next.js components
does not authorize redesigning from memory, substituting another visual
language, or weakening its requirements. Only the two package collisions
explicitly resolved in the Grilling Decision Record are settled. Any other
internal conflict, protected-contract conflict, broader-file need, behavior
change, or protected-surface relaxation stops implementation for a new goal
freeze; the CLI must not silently infer or expand scope.

Locked tokens and module accents:

- dark page background `#08060D`;
- panel `#0E0C14`;
- surface `#16121F`;
- raised surface `#1E1A2A`;
- Calculator primary/accent `#538BEC`;
- G-code primary/accent `#EE8C3C`;
- G-code section header fill `#D97830`;
- section-header, input, primary-action, and angle-chip height `36px`; and
- the existing shared `0.72s` spring-style motion contract.

### Scope / Allowed Files

This documentation-only authority-intake freeze may change only:

- `GOAL.md`;
- `docs/goals/GOAL-TRACE-INDEX.md`; and
- the canonical seven-file package subtree
  `docs/nestcalc-ui-redesign-package/**`.

The transport archive
`docs/architecture/nestcalc-ui-redesign-package.zip`, the byte-identical outer
`docs/architecture/nestcalc-ui-redesign-package/nestcalc-ui-prototype-v2.html`,
the extracted source copy under
`docs/architecture/nestcalc-ui-redesign-package/docs/**`, and generated
`output/**` evidence are explicitly excluded from the freeze commit. The seven
authority files become read-only inputs after this intake; the later
implementation pass may not edit them.

Only these later implementation and proof files may change:

- `src/app/globals.css` — locked dark tokens, module-scoped colors, typography,
  card/input/preview chrome, responsive accordion presentation, and existing
  reduced-motion/spring tokens.
- `src/components/NestCalcApp.tsx` — wordmark presentation and local,
  presentation-only disclosure state/wrappers for Presets, Part, Rem, Gap, and
  Margins. Preserve all existing state-library calls and input callbacks.
- `src/components/GCodeRotation.tsx` — class/semantic chrome only when needed
  for prototype parity; preserve every G-code handler and algorithm boundary.
- `src/components/PresetControls.tsx` — visual/accordion integration only;
  preserve storage, owner isolation, focus return, dialog semantics, and all
  `usePresets` calls.
- `src/components/NumberInput.tsx` — visual chrome only; preserve draft parsing,
  sanitization, labels, blur behavior, input mode, and Quick Values focus
  registration.
- `src/components/QuickValuesBar.tsx` — visual chrome only; preserve visual-
  viewport positioning and mouse/touch focus behavior.
- `src/components/AuthControls.tsx` — style only; preserve Clerk `<Show>`
  gating, `UserButton`, and shared appearance behavior.
- `src/components/NestGrid.tsx` — chrome-only SVG classes; preserve every
  coordinate, margin, placement, count, label, cap, and test hook.
- `src/components/AutoNestPreview.tsx` — chrome-only SVG classes; preserve
  geometry, grouping, order, counts, trim truth, summaries, and test hooks.
- `e2e/authenticated.spec.ts` — authenticated dark-shell, disclosure, module-
  accent, structural preservation, Fill, and visual-evidence proof.
- `e2e/locators.ts` — semantic locators only when new approved disclosure
  controls require reusable selectors.

All other files are outside implementation scope, including `src/hooks/**`,
`src/lib/**`, routes, middleware/proxy, storage, packages/configuration,
service-worker/PWA files, public assets, and governance files. If implementation
needs another file, stop and request a new Path B goal freeze before editing it.

### Acceptance Criteria

#### Locked dark visual system

1. The primary/default Calculator and G-code shell is unmistakably dark, using
   `#08060D` for the page, `#0E0C14` for panels, `#16121F` for surfaces, and
   `#1E1A2A` for raised surfaces. A light gray shop theme as the primary product
   appearance or acceptance-evidence state is a failure.
2. In Calculator mode, the selected Calculator tab and primary Calculator
   chrome use `#538BEC`. No orange accent appears on Calculator tab, controls,
   disclosure chrome, wordmark, or focus treatment. Factual result/status colors
   remain isolated from module accents. An orange Calculator selected tab or
   primary chrome is a failure.
3. In G-code mode, the selected G-code tab and primary G-code chrome use
   `#EE8C3C`. Calculator blue does not recolor G-code primary actions, and G-code
   orange does not leak back into Calculator chrome.
4. The wordmark renders `Nest` in white/light foreground and `Calc` in italic
   Calculator blue, matching the source-of-truth prototype treatment. It
   remains responsive enough to prevent clipping or unreachable controls.
5. Cards, inputs, dividers, button hierarchy, radii, spacing, and shadows form a
   coherent dark matte hierarchy using the locked panel/surface/raised family.
   The dark acceptance screenshots must not resemble the rejected light gray
   shop theme. Calculator and G-code section headers, inputs, primary actions,
   and angle chips use the package's locked `36px` geometry.

#### Collapsible Calculator chrome

6. Calculator inputs are organized into five independently collapsible,
   keyboard-operable sections named Presets, Part, Rem, Gap, and Margins. Each
   disclosure exposes correct `aria-expanded` and `aria-controls` state, retains
   visible focus, and keeps its values/state intact through collapse and reopen.
   Leaving the flat pre-prototype field stack as the final Calculator form is a
   failure.
7. On a fresh Calculator view, Part starts open while Presets, Rem, Gap, and
   Margins start collapsed, matching the reference prototype. Sections remain
   independently controllable; collapse state is local presentation state only,
   is not persisted, does not alter tab/history state, and does not change input
   values, links, focus registration, calculations, or AutoNest settings.
8. Collapsed Part, Rem, Gap, and Margins headers show compact current-value and
   unit badges. Presets exposes Save/Manage in its header while open; do not
   invent a second editable value or product state for its closed treatment.
   Badges are presentation only and never become alternate editable state.
9. Disclosure motion may use the existing `0.72s` spring timing/easing tokens,
   must use deterministic numeric/animatable endpoints, and honors
   `prefers-reduced-motion` without changing final open/closed state.

#### Preview and structural preservation

10. Manual and AutoNest preview chrome prefers a white/light `1px` bounding
    treatment over amber industrial part chrome where this can be achieved with
    styling/classes only. Do not change SVG geometry, coordinates, placement
    order, counts, cap behavior, trim truth, labels, or test hooks; semantic
    status colors remain factual and module-independent.
11. Preserve PR #43's explicit `300px` Calculator sheet, explicit `420px`
    collapsed G-code sheet, full-expand/collapse behavior at every viewport,
    equal-height expanded Rotation/Part size row, Generate as the only filled
    G-code primary action, secondary Fill, successful Fill-to-Calculator morph,
    retained G-code local state, and shared `0.72s` reduced-motion-aware spring.
    Sheet width/edges and stage padding use the same duration and curve, with
    explicit animatable widths; never use `width: auto` for full expansion.
12. Preserve module tab roles, arrow/Home/End navigation, deep links/history,
    safe areas, touch targets, compact landscape usability, and no-horizontal-
    overflow behavior. Collapsing a section must not strand focus or make an
    input permanently unreachable.

#### Browser proof and publication

13. Authenticated Playwright proves the dark acceptance state on desktop and
    mobile: locked computed surface tokens, white/blue wordmark, Calculator
    selected-tab blue with no orange Calculator primary chrome, and G-code
    selected-tab/primary orange.
14. Authenticated Playwright exercises all five disclosures with keyboard and
    pointer input, verifies ARIA state and collapsed badges, and proves input
    values plus Calculator results survive collapse/reopen.
15. Existing PR #43 browser contracts remain green: exact sheet endpoints,
    G-code expand/collapse and equal-height cards, Generate-only primary, Fill
    success/blocked morph behavior, state retention, AutoNest/G-code truth, and
    desktop/mobile no-overflow.
16. Visual evidence includes dark Calculator desktop/mobile, dark G-code
    desktop/mobile, expanded G-code, and representative collapsed Calculator
    sections. Generated screenshots remain uncommitted.
17. Human visual review confirms the implementation matches the tracked
    source-of-truth prototype's intent; redesigning from memory or substituting
    a different chrome language is a failure.
18. The later implementation wave ends on a separate implementation branch or
    continuation explicitly authorized by the accepted freeze, with goal-memory
    and implementation commits separate and a ready-for-review feature PR. No
    merge, deploy, Production action, or branch deletion is authorized.

### Protected Surfaces / Non-Goals

- No calculator math, nest-session conversion/state semantics, persisted data
  schema, numeric parsing, or input-value behavior changes.
- No AutoNest engine, ranking, counts, trim-edge policies, fallback guards,
  search budget, placement geometry, or factual preview change.
- No G-code parser, validation, coordinate state, bounds, rotation, generation,
  scheduling, output freshness, Copy, Download, or Fill bridge change.
- No regression or redesign of PR #43's structural shell contracts.
- No Clerk auth, sign-in, request access, owner isolation, route, environment,
  or policy change.
- No Serwist/service-worker, offline shell, manifest, runtime cache, or PWA
  policy change.
- No light theme as the primary product or acceptance target. Existing theme
  persistence and secondary compatibility behavior are outside scope; do not
  edit `src/hooks/useTheme.ts` or storage to remove or redefine them.
- No dependency, package/config, route, asset import, later design-package
  modification, native/iOS work, secret, `.env*`, deployment setting,
  Production action, merge, force-push, branch deletion, or
  `docs/governance/MODE` edit.

### Required Proof

Path B is selected: the authenticated E2E spec and locator file are inside
Allowed Files, so every required dark-shell, disclosure, and structural browser
assertion is fixable within this freeze.

Before the first implementation edit, B4-style preflight must:

1. Read the authority order, this goal, all seven tracked package authority
   files, relevant Next.js 16 guides under `node_modules/next/dist/docs/`,
   and lessons `L-nestcalc-module-accent-isolation`,
   `L-nestcalc-expand-collapse-all-breakpoints`,
   `L-nestcalc-landscape-overflow-qa`, `L-nestcalc-split-layout-css`,
   `L-nestcalc-playwright-clerk-boot`,
   `L-nestcalc-e2e-split-layout-locator`,
   `L-nestcalc-fill-unit-session-convert`, and
   `L-nestcalc-fill-clear-part-link`.
2. Validate the goal, B3-style handoff, Flow-ID, branch, Allowed Files, and
   preservation baseline. Classify and exclude pre-existing generated
   `output/playwright/**` evidence.
3. Confirm valid existing local Clerk test-mode values for authenticated
   Playwright without printing or editing them. Missing values stop execution
   before edits; required browser proof is blocked, never waived.

After implementation, all must pass:

```bash
python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md
npm run lint
npm run test
npm run build
npm run test:e2e:auth
git diff --check
```

Also audit the final diff against the exact later-implementation Allowed Files
and confirm no generated screenshot, visual-authority package modification,
secret, governance, auth/PWA policy, algorithm, dependency, route, or other
out-of-scope file entered an implementation commit.

### Grilling Decision Record

The required `evidence -> confidence -> decision -> residual risk / flagged
decisions` loop ran with three bounded read-only lanes. Every lane requested and
observed `gpt-5.6-terra` at medium reasoning effort; all routes matched.

- **Evidence:** The seven-file package is now present and content-addressed in
  the canonical package subtree. Its prototype and written tokens establish
  the dark palette, strict blue/orange mode split, five disclosure surfaces,
  `300px`/`420px` sheets, explicit full width, and shared spring. PR #44
  deferred this visual wave; current ownership places implementation in the
  bounded chrome files and proof in authenticated Playwright.
- **Confidence:** freeze-ready. No blocking scope question remains, every known
  ambiguity has a decision below, protected surfaces are explicit, and Path B
  makes required proof repairable inside Allowed Files.
- **Decision:** commit and adopt exactly the seven canonical package files,
  with the prototype and token file as hard visual sources and map/wiring/
  do-not-touch as supporting authority; preserve only the named PR #43
  structural contracts and require authenticated desktop/mobile proof before
  completion.

Flagged decisions and residual risks:

1. **Package provenance said exploratory / not a product commit.** Reason: the
   package predates its human adoption into this goal. Decision: the human's
   explicit intake instruction makes exactly these seven tracked files hard
   visual/supporting authority under the higher active GOAL. CLI consequence:
   do not treat the package as self-executing or allow it to broaden scope.
2. **Light compatibility remains present.** Reason: theme persistence lives in
   excluded hook/storage files. Decision: dark is the primary/default visual
   target and sole acceptance-evidence state; secondary light compatibility is
   not redesigned. CLI consequence: do not touch theme persistence or claim
   light parity.
3. **Disclosure defaults are now specified.** Reason: the prototype initializes
   only Part open. Decision: Part starts open; Presets, Rem, Gap, and Margins
   start collapsed and remain independently controllable. CLI consequence: do
   not introduce all-open, exclusive-accordion, or persisted disclosure state.
4. **Preview treatment is chrome-only.** Reason: SVG geometry and colors can
   carry factual meaning. Decision: prefer light 1px bounds through tokens and
   classes while preserving all geometry/truth. CLI consequence: any required
   coordinate, count, grouping, or algorithm edit stops the wave.
5. **Package sandbox overflow conflicts with product responsiveness.** Reason:
   `DESIGN-TOKENS.md` names a `900px` shell minimum/page scroll, while PR #43
   and this goal require compact landscape/mobile no-overflow. Decision: retain
   the product responsive/no-overflow contract; the sandbox minimum-width rule
   is not adopted. CLI consequence: do not add page-level horizontal scrolling.
6. **Prototype contains a full-width self-conflict.** Reason: it first uses
   `calc(100% - 1.5rem)` and later overrides with `width: auto !important`, while
   tokens/wiring expressly forbid `width: auto`. Decision: written tokens,
   wiring, PR #43, and this goal win. CLI consequence: preserve explicit
   animatable full width and the shared `0.72s` curve.
7. **Redundant transport artifacts exist.** Reason: the outer prototype is
   byte-identical to the canonical reference and the ZIP contains the same
   payload. Decision: commit only the seven canonical files; exclude the ZIP,
   duplicate HTML, and generated screenshots. CLI consequence: only the tracked
   canonical paths are authority.

Residual risk remains that subjective visual fidelity cannot be fully reduced
to computed-style assertions even with the prototype. Completion therefore
requires deterministic browser assertions plus human review of generated visual
evidence; neither can override protected behavior boundaries.

### B3-Style Handoff / B4-Style Preflight

- After the goal-memory bind commit, create a sanitized B3-style execution
  handoff containing the prompt hash only and the bound goal-memory commit.
- Codex CLI must revalidate goal hash, handoff identity, branch, lessons,
  credentials, and required proof inside Allowed Files before its first edit.
- Use host-first execution for Playwright, `npm ci`, git/gh network,
  credentials, and `.git` locks. Any mismatch stops execution.

### Stopping Condition

Complete only when every acceptance criterion and required proof passes, human
review accepts the dark screenshots against the tracked sources of truth, the
diff is confined to Allowed Files, goal-memory and implementation commits
remain separate, and a ready-for-review implementation PR is open.

Stop blocked before or during implementation when the visual authority
conflicts with this frozen scope, required authenticated proof is unavailable,
a protected surface or excluded file would need to change, a required proof
cannot be repaired inside Allowed Files, or any scope/authority mismatch
appears. Do not merge or deploy.
