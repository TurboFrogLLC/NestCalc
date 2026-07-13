# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "AutoNest Internal Trim-Edge Margin Policy v1",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": [
      {
        "lane": "engine-geometry",
        "observed_model": "gpt-5.4",
        "requested_model": "gpt-5.4-mini",
        "status": "mismatch"
      },
      {
        "lane": "state-and-migration",
        "observed_model": "gpt-5.4",
        "requested_model": "gpt-5.4-mini",
        "status": "mismatch"
      },
      {
        "lane": "governance-ui-verification",
        "observed_model": "gpt-5.4",
        "requested_model": "gpt-5.4-mini",
        "status": "mismatch"
      }
    ]
  },
  "branch_intent": "codex/autonest-trim-edge-margin-policy-v1",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260712-4d2e7a91",
  "goal_memory_commit": "d82b2c73c5afba3a7a9e4c9db04eba0fd8bc5729",
  "goal_sha256": "sha256:112de75e95bf67591d3bd172b9f3c31da7ace0448f74588f0244ba111a8696b8",
  "protected_surfaces": [
    "manual calculator math and nestcalc.ts nesting behavior",
    "calculator UI layout beyond AutoNest settings and comparison honesty",
    "Clerk auth request-access and routes",
    "secrets env files and Vercel project settings",
    "PWA service-worker and runtime cache behavior",
    "governance pipeline unrelated to this goal"
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": [
    "codex-repo-hygiene-gate",
    "codebase-design",
    "tdd",
    "vercel-plugin:react-best-practices",
    "playwright",
    "clerk-testing",
    "codex-pr-closeout"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: AutoNest Internal Trim-Edge Margin Policy v1

### Objective

Implement an explicit, persisted AutoNest internal trim-edge margin policy with
three selectable models:

- `full`: preserve today's full clamp margin on every edge of both blanks;
- `open`: apply no clamp margin to either internal trim-facing edge and make
  this the default;
- `shared`: apply one configurable shared trim clearance entirely to the
  second, non-origin blank.

Update the pure AutoNest engine, additive settings persistence, compact settings
gear UI, specification, and focused tests as one bounded product wave. Preserve
manual calculator behavior and every unrelated protected surface.

### Why This Is Next

The completed AutoNest ranking RCA proved that the engine is internally correct
under the existing full-per-blank margin model, but that model conflicts with
the operator-visible layout where the internal trim edge is open or shares one
clearance.

The decisive fixture is:

- part `6 x 4`;
- remnant `11.1 x 10`;
- gaps `0`;
- AutoNest global clamp margin `0.53`.

Under `full`, two blanks require approximately `12.12` width and AutoNest falls
back to uniform `2`. Under `open`, the same groups require `11.06` width and
must compute a mixed total of `3`.

This goal turns that product decision into an explicit operator-controlled
policy instead of silently changing the existing interpretation.

### Required Reading

- `AGENTS.md`
- `GOAL.md`
- `LESSONS_LEARNED.md`
- `docs/WORKFLOW.md`
- `docs/governance/README.md`
- `docs/governance/goal-template-v1.md`
- `docs/AutoNest_Spec.md`
- `docs/AutoNest_Integration_Analysis.md`
- `src/lib/autoNestEngine.ts`
- `src/lib/autoNestEngine.test.ts`
- `src/lib/types.ts`
- `src/lib/storage.ts`
- `src/lib/storage.test.ts`
- `src/lib/nestSession.ts`
- `src/lib/nestSession.test.ts`
- `src/components/NestCalcApp.tsx`
- `e2e/authenticated.spec.ts`
- `e2e/locators.ts`

Apply at least these lessons:

- `L-nestcalc-autonest-app-state-v3`
- `L-nestcalc-autonest-pure-engine-module`
- `L-nestcalc-autonest-thin-blank-guard`
- `L-nestcalc-autonest-search-budget-guard`
- `L-nestcalc-autonest-settings-gear-ui`
- `L-nestcalc-autonest-computed-preview`
- `L-nestcalc-playwright-clerk-boot`
- `L-nestcalc-playwright-auth-setup-order`
- `L-nestcalc-goal-required-docs-commit`
- `L-nestcalc-readonly-subagent-model`

### Scope

Implement only the following:

- Add a trim-edge policy type with values `full`, `open`, and `shared`.
- Extend `AutoNestSettings` with the selected policy and a dimensioned shared
  trim clearance.
- Keep storage key/version `nestcalc-app-state-v3`; normalize missing or invalid
  policy values to `open` without rewriting storage during load.
- Default new settings to `open` with shared trim clearance initialized from
  the normalized global clamp margin (currently `0.53` for the default inch
  state).
- Convert shared trim clearance during unit changes.
- Refactor AutoNest candidate construction to use distinct required-margin
  envelopes for each physical blank.
- Add a compact `Open | Shared | Full` segmented policy control inside the
  existing hidden AutoNest settings panel.
- Show the shared-clearance numeric input only while `shared` is selected.
- Update `docs/AutoNest_Spec.md` in the same implementation wave so product
  authority exactly describes all three models and the new default.
- Add focused engine, storage, session, and authenticated browser tests.

Expected primary implementation files:

- `src/lib/types.ts`
- `src/lib/storage.ts`
- `src/lib/storage.test.ts`
- `src/lib/nestSession.ts`
- `src/lib/nestSession.test.ts`
- `src/lib/autoNestEngine.ts`
- `src/lib/autoNestEngine.test.ts`
- `src/components/NestCalcApp.tsx`
- `e2e/authenticated.spec.ts`
- `e2e/locators.ts`
- `docs/AutoNest_Spec.md`

Small focused CSS edits are allowed only if the segmented control cannot fit
using existing utility classes. Do not redesign the settings panel or shell.

### Geometry Rules

Use the configured four outer margins as `L`, `R`, `T`, and `B`. Use `C` as the
non-negative shared trim clearance. The first blank is the origin-side blank at
the remnant's left/top. The second blank begins at the trim offset and is the
non-origin blank.

For a vertical split:

- Both blanks retain `T` and `B` because each spans the remnant height.
- First/left blank retains outer `L`; second/right blank retains outer `R`.
- `full`: first internal right requirement is `R`; second internal left
  requirement is `L`, preserving current behavior.
- `open`: first internal right and second internal left requirements are `0`.
- `shared`: first internal right requirement is `0`; second internal left
  requirement is `C`.

For a horizontal split:

- Both blanks retain `L` and `R` because each spans the remnant width.
- First/top blank retains outer `T`; second/bottom blank retains outer `B`.
- `full`: first internal bottom requirement is `B`; second internal top
  requirement is `T`, preserving current behavior.
- `open`: first internal bottom and second internal top requirements are `0`.
- `shared`: first internal bottom requirement is `0`; second internal top
  requirement is `C`.

Candidate available-dimension calculations, blank construction, and
margin-validity checks must use those per-blank required-margin envelopes.

`achievedMargins` must report actual geometric clearance on every blank side:
`0` on open internal edges, `C` on the second blank's shared internal edge, and
actual residual clearance on outer/trailing edges. Do not label a required
margin as achieved when geometry does not provide it.

The trim line remains the physical division between blanks. The suggested
origin offset remains the second blank's physical origin at that trim; shared
clearance is then visible as the second group's leading achieved margin.

Preserve the useful-blank guard formula and include `C` when it is the largest
active required clearance. Preserve the `20,000` search budget and current
candidate tie-breakers.

Best-uniform calculation continues to use the configured outer AutoNest margins
around the whole remnant. The trim-edge policy affects only two-group candidate
geometry.

### Required Behavior And Tests

Engine tests must prove:

- Fixture 2 under `full` remains fallback `2`.
- Fixture 2 under `open` computes `3`, with truthful zero internal achieved
  margins.
- Fixture 2 under `shared` with `C = 0.03` computes `3` and assigns all `0.03`
  to the second blank's leading edge.
- Fixture 2 under `shared` with `C = 0.05` falls back to `2`.
- Existing full-margin computed fixture remains unchanged when `full` is
  selected.
- Horizontal candidates apply the same first-open/second-shared rule on
  bottom/top internal edges.
- Negative or invalid shared clearance yields safe insufficient-input fallback
  or normalization consistent with existing invalid-margin handling.
- Strict equal-count fallback, tie-breakers, useful-blank guard, and search
  budget remain unchanged.

Storage/session tests must prove:

- Missing stored policy migrates lazily to `open`.
- Missing shared clearance initializes from the normalized global clamp margin,
  including in existing non-inch state.
- Explicit `full`, `open`, and `shared` settings persist unchanged.
- Invalid runtime policy normalizes to `open`.
- Existing v1/v2/v3 migration behavior remains intact.
- Unit toggling converts shared clearance with other dimensioned AutoNest
  settings.

Browser proof with AutoNest on must prove:

- The policy selector is available only in the existing settings panel.
- `open` is selected for default/migrated state.
- Shared-clearance input is hidden for `open` and `full`, visible for `shared`.
- Fixture 2 visibly changes from `full` fallback `2` to `open` computed `3`.
- Shared low/high clearance cases produce the expected computed/fallback copy.
- Manual rotation locking, settings persistence, and the existing computed
  preview remain intact.
- Desktop and mobile layouts do not overlap.

### Out Of Scope

- Fallback preview or count rewiring to AutoNest best-uniform geometry.
- Changing strict equal-count fallback (`twoGroup.totalParts <= bestUniform`).
- New ranking or tie-break rules.
- Changes to manual margins, manual rotation, or manual calculator math.
- Multi-trim, interleaving, L-shaped partitions, free packing, or rotated
  physical blanks.
- Broad result-copy, preview, settings-panel, or shell redesign.
- Clerk, request-access, middleware, routes, sign-up behavior, secrets,
  `.env*`, Vercel project settings, or deployment changes.
- PWA service-worker, manifest, offline shell, or runtime cache changes.
- Governance implementation changes unrelated to filling this goal's metadata.
- Native iOS work.

### Protected Surfaces

- Do not edit `src/lib/nestcalc.ts` or alter manual nesting behavior.
- Do not change calculator layout outside the existing AutoNest settings panel
  and minimal comparison honesty needed for the selected model.
- Do not change Clerk auth, request-access policy, routes, or local credential
  handling.
- Do not commit or expose `.env.local`, Clerk values, screenshots containing
  private data, or deployment credentials.
- Do not change Serwist/PWA runtime behavior.
- Do not change the repository governance pipeline as part of product work.

### Skills And Agent Model

Start with repo hygiene and relevant lessons. Use the smallest useful set:

- `codex-repo-hygiene-gate`
- `codebase-design`
- `tdd`
- `vercel-plugin:react-best-practices`
- `playwright`
- `clerk-testing`
- `codex-pr-closeout`

Use bounded read-only evidence agents only for distinct lanes. Request
`gpt-5.4-mini` for each. If the runtime cannot honor that model, record the
observed model and mismatch honestly; do not fabricate matched evidence. The
orchestrator owns all writes and final decisions.

### Verification

Run and report:

- `git diff --check`
- `npm run governance:check`
- `npm run lint`
- `npm run build`
- `npm run test`
- `npm run test:e2e`
- `npm run test:e2e:auth`

Because this changes visible AutoNest settings and results, authenticated
Playwright browser proof is required at desktop and mobile viewports. Use valid
local Clerk test credentials and run Chromium outside the sandbox when the
known macOS Mach-port restriction requires it.

If valid Clerk test values are unavailable, report authenticated proof as
blocked. Do not add an auth bypass, weaken assertions, or claim a pass.

PR evidence must include:

- separate goal-memory and implementation commit SHAs;
- migration/default evidence;
- Fixture 2 results for all three policies;
- exact verification results;
- desktop/mobile browser proof;
- protected-surface diff review;
- known limitations and flagged model-routing evidence.

### Stopping Condition

Complete only when:

- all three policies are implemented exactly as specified;
- `open` is the default for new and missing stored policy state;
- engine, migration, unit conversion, UI, and browser tests pass;
- `docs/AutoNest_Spec.md` matches implemented behavior;
- required verification passes or an external credential blocker is reported
  precisely;
- goal memory and implementation remain separate commits;
- the feature branch is pushed outside the sandbox;
- an open, non-draft, ready-for-review PR exists with verification evidence;
- `@codex review` is requested;
- no protected surface changed.

Do not merge the PR. Human approval remains required.

### Flagged Decisions

- **Shared-clearance ownership:** Assign all shared clearance to the second,
  non-origin blank's leading edge. This keeps the first group anchored to the
  remnant origin and makes the second program's trim-relative clearance
  explicit. CLI must preserve this asymmetry in geometry and achieved margins.
- **Shared-clearance default:** On missing/new state, initialize the separate
  `sharedTrimClearance` from the normalized global clamp margin. Persist it
  independently after initialization and convert it with units. This preserves
  unit correctness without coupling later global-margin edits. CLI must expose
  it only in `shared` mode.
- **Storage version:** Keep additive `nestcalc-app-state-v3`; do not create v4
  solely for two normalized optional settings. CLI must add lazy migration and
  preserve existing stored state.
- **Ranking policy:** Keep strict improvement and all current tie-breakers.
  Equal-count policy remains a separate future decision.
- **Fallback preview:** Preserve current fallback preview behavior even though
  the RCA identified possible margin-geometry confusion. Handle that in a
  separate goal.
- **Agent model:** Planning requested `gpt-5.4-mini`; the runtime exposed
  `gpt-5.4`, used under prior human approval. Metadata records the mismatch.
