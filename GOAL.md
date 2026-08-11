# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "HowMany product wire - host exact prototype shell + bridge existing engines (Option B)",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": [
      {
        "lane": "prototype shell and DOM authority",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      },
      {
        "lane": "engine ownership and bridge seams",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      },
      {
        "lane": "governance, tests, Clerk, and PWA proof",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      }
    ]
  },
  "branch_intent": "codex/howmany-option-b-host-bridge",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260810-d2781f90",
  "goal_memory_commit": "d5edc5591a3b697490d96eddad77a16acf2339cc",
  "goal_sha256": "sha256:baf0c2a84ea67e09b6e6e3e5935b644aa36511931d680ad021174b33557b60e5",
  "protected_surfaces": [
    "exact bytes, structure, visual language, motion, product identity, and wordmark of docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html",
    "calculator math and nest-session calculation, conversion, rotation, link, persistence, and numeric semantics beyond call-site wiring",
    "AutoNest packing, ranking, counts, trim-edge policies, fallback guards, search budget, and placement truth",
    "G-code parsing, validation, coordinate state, bounds, rotation, generation, diagnostics, output freshness, Copy, and Download algorithms",
    "Clerk authentication and authorization policy, sign-in and request-access flows, route protection, and preset owner isolation",
    "Serwist service worker, offline shell, manifest, runtime cache behavior, and PWA policy",
    "secrets, .env files, dependencies, deployment credentials, Vercel settings, Production, merge, docs/governance/MODE, and unrelated governance contracts"
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
    "clerk",
    "clerk-nextjs-patterns",
    "clerk-testing",
    "playwright",
    "tdd"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: HowMany product wire - host exact prototype shell + bridge existing engines (Option B)

### Objective

Human-approved title: **HowMany product wire — host exact prototype shell +
bridge existing engines (Option B)**. The machine-bound heading uses an ASCII
hyphen only because the current canonical goal-hash validator crashes on
non-ASCII title punctuation; this does not change the human title or scope.

Ship the accepted HowMany prototype as the live product surface with the real
NestCalc engines behind it. The visible product must retain the exact accepted
prototype look, feel, motion, section behavior, and click-through continuum
while Calculator, AutoNest, G-code, presets, units, and Clerk use real product
state and results.

This freeze authorizes a later Codex CLI implementation pass only. The current
goal-freeze publication is documentation-only and contains no product
implementation.

### Locked Product Decision And Authority

**Option B only.** The exact
`docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html` file is the
product UI chrome. Its frozen SHA-256 on `main` at PR #51 is
`bed7567d093b73c08e2538f3e5939c32bc8765ae2cfbe9d43e7b2848d3f4475d`.
Implementation must host that literal same-origin HTML document unchanged and
bridge existing product engines and state into its DOM at runtime.

The shell source bytes, DOM structure, CSS, shell-owned JavaScript motion, and
visible chrome remain read-only. Runtime bridge code may bind or supersede demo
handlers, update values and factual result targets, and portal real stage/auth
content into existing targets; it may not extract, template, regenerate, or
recreate the shell. React may provide only the thin host, state ownership,
bridge lifecycle, and portals into the existing document. It must not create a
parallel visible chrome tree.

The authority order for this goal is:

1. `AGENTS.md` — product name **HowMany**; full brand line **HowMany by
   wReckless Toddler LLC**; free-standing lowercase `h` + Lucide
   `CircleQuestionMark` + `wMany`; NestCalc is the repository name only; the
   accepted `docs/ui-shell` lineage is protected.
2. This `GOAL.md` — active execution scope and the Option B decision.
3. The complete `docs/nestcalc-ui-redesign-package/` on `main` after PR #51:
   `REFERENCE-PROTOTYPE-v2.html`, `README.md`, `COMPONENT-MAP.md`,
   `DESIGN-TOKENS.md`, `WIRING.md`, `DO-NOT-TOUCH.md`, and
   `CODEX-READY-PROMPT.md`.
4. `docs/WORKFLOW.md`, goal lifecycle contracts, and relevant
   `LESSONS_LEARNED.md` entries.

Do not recreate the shell in React. Do not restyle `NestCalcApp` to "match
intent" or use it as the primary UI. Changing Option B, the shell bytes, the
HowMany identity, or the hosting-versus-recreation decision requires a new
human decision and a new goal freeze.

### Scope / Allowed Files

Goal-freeze publication may change only:

- `GOAL.md`; and
- `docs/goals/GOAL-TRACE-INDEX.md`.

The later implementation and proof pass may edit only:

- `src/app/page.tsx` — replace the current `NestCalcApp` entry with the thin
  exact-shell host; no alternative product chrome.
- `src/app/howmany-shell/route.ts` — new same-origin route that returns the
  canonical prototype file bytes unchanged with the correct HTML content type.
- `src/app/layout.tsx` — host compatibility and HowMany metadata only; preserve
  `ClerkProvider`, sign-in URL, `SerwistRegistration`, viewport behavior, and
  platform policy.
- `src/components/howmany/**` — new thin host, imperative DOM/event/state bridge,
  shell-target portals, and stage/auth adapters only.
- `src/lib/howmany/**` — new bridge-only mapping and synchronization helpers plus
  focused unit tests; these may call existing engines but may not reimplement
  their algorithms or persistence.
- `src/components/AuthControls.tsx` — only a minimal mount/appearance adapter if
  required to place the existing Clerk path in the prototype auth target;
  preserve `<Show>`, `UserButton`, appearance authority, and policy.
- `next.config.ts` — only if deterministic build packaging of the canonical HTML
  requires an output-tracing include; preserve `withSerwist` and all PWA/runtime
  behavior.
- `e2e/authenticated.spec.ts` — focused real-Clerk browser proof for the hosted
  shell and bridges.
- `e2e/locators.ts` — semantic prototype-shell locators only when required by
  the focused proof.

All existing `src/lib/**` engine, session, unit, storage, preset-store, and type
files outside `src/lib/howmany/**` are call-only read authority and may not be
edited. Existing `src/hooks/useNestInputs.ts`, `src/hooks/usePresets.ts`,
`NestGrid.tsx`, and `AutoNestPreview.tsx` may be imported and reused unchanged.
`NestCalcApp.tsx`, `GCodeRotation.tsx`, and `PresetControls.tsx` are legacy seam
references only and are not restyle or edit surfaces for this goal.

If implementation requires any other file, dependency, route-policy change,
prototype edit/copy, or protected behavior change, stop for a new human
decision and Path B goal freeze before editing.

### Acceptance Criteria

1. The product chrome is the literal canonical prototype document, with its
   exact HowMany wordmark, Calculator-blue / G-code-orange modes, left/right
   sheet morphs, widths, resizers, transitions, collapsible sections, full
   G-code panel, and Fill-to-Calculator motion intact. The canonical source
   checksum remains exactly
   `bed7567d093b73c08e2538f3e5939c32bc8765ae2cfbe9d43e7b2848d3f4475d`.
2. The visible product contains no competing React shell, no React recreation,
   and no restyled `NestCalcApp` approximation. Runtime portals render only
   factual engine/auth output into targets owned by the exact shell.
3. Calculator inputs, swap/link/rotate/clear controls, units, margins, axis
   counts, total parts, and stage output use the existing nest-session and
   `calculateNest` paths with real persisted state and unchanged semantics.
4. Manual / AutoNest selects the existing real session path. AutoNest counts,
   ranking, fallback, trim policy, placement geometry, and search guards remain
   engine-owned and appear truthfully in the prototype stage.
5. G-code **Generate** uses the real `analyzeGCode` and
   `generateRotatedGCode` paths, hydrates real bounds and output, opens Output,
   and preserves current diagnostics, stale-output, Copy, and Download
   semantics.
6. G-code **Fill** uses the existing `applyPartSizeToNestSession` semantics,
   including whole-session unit conversion and unequal-span link clearing, then
   performs the accepted prototype morph to Calculator with the real dimensions
   visible. Invalid, pending, or zero-span input never fills or morphs.
7. The prototype presets carousel and add/edit/delete actions use the existing
   Clerk-owner-scoped IndexedDB preset path. Preset load replaces the complete
   existing v3 app state; storage keys, schema, owner isolation, and auth-race
   guards do not change.
8. The global Calculator unit, G-code program unit, and G-code part-display unit
   remain distinct where the prototype specifies them, and all conversions use
   existing session/unit helpers rather than relabeling values.
9. The prototype auth target carries the real existing Clerk `AuthControls`
   path. Clerk policy, routes, sign-in flow, request-access flow, and preset
   ownership remain unchanged.
10. Prototype shell interactions not replaced by real engine/state operations
    retain the exact click-through behavior and motion of the canonical HTML.
    Theme/light-mode redesign and new Settings behavior are not introduced.
11. `npm run lint`, `npm run build`, `npm run test:unit`, and the focused
    authenticated Playwright proof are green. Goal/governance validation and
    final diff/scope checks are green.
12. The implementation ends as a ready-for-review feature PR on
    `codex/howmany-option-b-host-bridge`, with goal-memory and implementation
    commits separate. No merge, Production deploy, Production promote, or
    Vercel project mutation is authorized.

### Protected Surfaces / Hard Non-Goals

- No edit, rewrite, copy, extraction, templating, redesign, restyle, or checksum
  drift of `REFERENCE-PROTOTYPE-v2.html` or its chrome. No React lookalike or
  parallel `NestCalcApp` shell as the primary product UI.
- No calculator math, nest-session behavior, unit conversion, persisted-state
  schema, numeric-input semantics, or AutoNest algorithm/ranking/count/trim/
  fallback/search-budget change.
- No G-code parser, accepted language, coordinate-state, safety validation,
  bounds, rotation, generation, diagnostics, output freshness, Copy, or
  Download algorithm change.
- No Clerk authentication/authorization policy, sign-in or request-access flow,
  proxy/route policy, preset owner isolation, or secret/env change.
- No Serwist/service-worker, offline route, manifest, runtime cache, or PWA
  behavior change.
- No light-mode work, native/iOS work, new dependency, MODE flip, governance
  redesign, merge, branch deletion, Production deploy, or Production action.

### Required Proof

Required proof is made fixable by the Path B Allowed Files above: the exact host,
bridge, host packaging seam, auth adapter, and focused authenticated Playwright
surface are all explicit edit authority. Existing engines and policies remain
read-only contract inputs.

Before the first implementation edit, B4-style preflight must:

1. Read the authority order, the complete Option B package, relevant Next.js 16
   guides under `node_modules/next/dist/docs/`, and lessons
   `L-nestcalc-fill-unit-session-convert`, `L-nestcalc-fill-clear-part-link`,
   `L-nestcalc-path-a-goal-impl-split`, `L-nestcalc-module-accent-isolation`,
   and `L-nestcalc-expand-collapse-all-breakpoints`.
2. Run `python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md` and
   validate the B3-style handoff, current branch, goal-memory commit, roster,
   exact prototype checksum, and required proof ⊆ Allowed Files.
3. Run a clean baseline `npm run lint`, `npm run test:unit`, and `npm run build`.
   Any out-of-scope baseline failure stops execution; it does not authorize a
   repair outside Allowed Files.
4. Confirm valid local Clerk test-mode values already exist for authenticated
   Playwright. If unavailable, stop before editing and report browser/auth proof
   blocked. Do not create, edit, expose, or commit secrets.

After implementation, all must pass:

```bash
python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md
shasum -a 256 docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html
npm run lint
npm run test:unit
npm run build
npx playwright test e2e/authenticated.spec.ts --project=authenticated --grep "HowMany Option B"
git diff --check
```

Focused browser evidence must exercise real authenticated data through:

- Calculator manual inputs, unit change, counts, rotations, and stage;
- AutoNest selection and truthful real result/preview;
- preset save/load/rename/delete through the existing owner-scoped path;
- G-code source → Generate → real bounds/output → Fill → Calculator morph;
- G-code split/full/restore, section collapse/expand, sheet resize, and mode
  transitions; and
- the real Clerk auth chrome path in the exact prototype header.

Capture Calculator, G-code split, G-code full, and post-Fill Calculator browser
screenshots or traces as review evidence. Keep generated evidence uncommitted.

### Grilling Decision Record

The required loop ran as:

```text
evidence → confidence → decision → residual risk / flagged decisions
```

Three bounded read-only evidence lanes used requested and observed
`gpt-5.6-terra` at medium reasoning effort; all routes matched.

- **Evidence:** PR #51 places the complete Option B package and canonical HTML
  on `main`; the prototype owns shell geometry/motion and exposes stable DOM
  targets. Existing product ownership is isolated behind `useNestAppState`,
  `createNestSession`, `calculateNest`, AutoNest, G-code, `usePresets`, unit
  helpers, and `AuthControls`. Existing authenticated Playwright already owns
  the cross-surface product proof seam.
- **Confidence:** freeze-ready. No blocking scope question remains; protected
  surfaces are explicit, the exact-shell mechanism is decided, and required
  proof is within Path B edit authority.
- **Decision:** serve the literal canonical HTML unchanged from a same-origin
  route and bind it at runtime. Keep React behind the shell as host/state/portal
  machinery only. Retire `NestCalcApp` from the primary entry without restyling
  or deleting it.

Flagged decisions and residual risks:

1. **Exact bytes versus live data.** Reason: the prototype contains visual demo
   handlers and hard-coded values. Decision: preserve its file bytes and
   shell-owned motion, while runtime bridge code supersedes demo data actions
   and updates existing DOM targets. CLI consequence: any required source HTML
   edit, copied derivative, or second animation system stops implementation.
2. **Host packaging.** Reason: a server route must include a tracked docs HTML
   file in the production build. Decision: allow `next.config.ts` only for a
   deterministic output-tracing include if the default build does not package
   it. CLI consequence: any Serwist/runtime behavior change is forbidden and
   stops the wave.
3. **Legacy React surfaces.** Reason: existing components own useful seams but
   their chrome conflicts with Option B. Decision: import stable hooks,
   helpers, and unchanged factual renderers where useful; do not edit or mount
   `NestCalcApp` as product chrome. CLI consequence: a need to restyle legacy
   shell components triggers a new human decision.
4. **Authenticated proof.** Reason: the public and authenticated Playwright
   servers require valid Clerk test values, and the real presets/auth path
   cannot be honestly proven without them. Decision: authenticated credentials
   are a pre-edit gate, not a skippable check. CLI consequence: missing values
   block implementation before edits; they never count as pass evidence or
   authorize env/auth changes.
5. **Prototype stubs.** Reason: Theme, Settings, and some demo-only actions do
   not have authorized product contracts in this wave. Decision: bridge only
   the named Calculator, AutoNest, G-code, preset, unit, clear/rotate/link, and
   Clerk paths; retain other shell interactions as-is and do not add light mode
   or settings features. CLI consequence: new behavior requires a separate
   goal.
6. **Pre-existing untracked files.** Reason: the canonical worktree contains
   unrelated user-owned `docs/architecture/nestcalc-ui-redesign-package*` and
   `output/` paths. Decision: leave them untouched and exclude them from every
   goal-memory, implementation, and evidence commit. CLI consequence: any
   overlap, mutation, or staging is a hygiene hard stop.
7. **Machine title punctuation.** Reason: the current governance canonicalizer
   crashes on a Unicode em dash in `active_goal_title`. Decision: preserve the
   human-approved em-dash title above and use an ASCII hyphen only in the
   metadata-bound heading. CLI consequence: use the exact metadata heading for
   validation and handoff; do not change governance code in this product wave.

### B3-Style Handoff / B4-Style Preflight

- After the goal-memory bind commit, create a sanitized B3-style execution
  handoff with prompt hash only and the bound goal-memory commit.
- Codex CLI must revalidate the goal hash, handoff, branch, lessons, canonical
  prototype checksum, Clerk proof availability, and proof scope before the
  first implementation edit.
- Host-first for `npm ci`, Playwright, git/gh network, credentials, and `.git`
  locks. Any mismatch or unavailable required proof stops execution.

### Stopping Condition

Implementation is complete only when every acceptance criterion and required
proof passes, the canonical prototype checksum is unchanged, the final diff is
confined to Allowed Files, goal-memory and implementation commits remain
separate, and a ready-for-review implementation PR is open.

Stop blocked before or during implementation when Clerk test values are
unavailable, the exact shell cannot be hosted unchanged, a required proof
cannot be repaired inside Allowed Files, a protected surface would need to
change, or any scope/authority mismatch appears. Do not merge or deploy.

For this freeze step, stop after `GOAL.md`, the Active trace-index row, and this
Flow-ID are committed and published in a documentation-only goal-freeze PR. Do
not create the B3-style implementation handoff, generate a CLI `/goal` prompt,
edit product files, or open an implementation PR in this step.
