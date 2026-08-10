# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Wave A Governance - Terra Medium Read-Only Grilling Pin",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": [
      {
        "lane": "routing inventory",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      },
      {
        "lane": "goal archive and lifecycle contract",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      },
      {
        "lane": "proof scope and governance fixtures",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      }
    ]
  },
  "branch_intent": "codex/governance-terra-grilling-pin",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260809-7d18f1a2",
  "goal_memory_commit": "232111a022b026d0cebc047b4a71e4b3aa910e5e",
  "goal_sha256": "sha256:37bcb365d340f384f8354ee5e058e1d9cce06c75978f7e5421928166d9617769",
  "protected_surfaces": [
    "calculator math and calculator UI layout or input behavior",
    "AutoNest packing ranking counts trim-edge policies fallback guards and search budget",
    "G-code Path B parsing rewriting safety and serialization behavior",
    "Clerk auth request-access policy routes sign-up behavior secrets and deployment settings",
    "PWA and Serwist service-worker runtime cache behavior",
    "package.json dependencies scripts and product configuration",
    "LESSONS_LEARNED.md historical provenance",
    "docs/governance/MODE and NestCalc B6-B9 closeout ladder"
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": [
    "codex-repo-hygiene-gate",
    "nestcalc-goal-grilling",
    "codex-goal-prep"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: Wave A Governance - Terra Medium Read-Only Grilling Pin

### Objective

Align NestCalc autonomous goal-grilling read-only evidence lanes with the
NanoTate-style research and routine route: replace every current hard pin of
`gpt-5.4-mini` for NestCalc read-only grilling or research sub-agents with
`gpt-5.6-terra` at medium reasoning effort. The orchestrator and implementer
remain the session parent model; this wave does not pin a separate Sol/high
research lane.

When Terra cannot bind, record the lane as `unavailable` with
`observed_model: null`. When another model binds, record `mismatch` honestly.
Never claim substitute-lane evidence as matched.

### Scope / Allowed Files

- `GOAL.md` — this goal freeze and metadata binding only.
- `docs/goals/**` — the completed PR #40 archive already recorded before this
  freeze; no further history edits are expected.
- `AGENTS.md` — update only the read-only goal-grilling model and effort pin.
- `.agents/skills/nestcalc-goal-grilling/SKILL.md` — update only the same model
  and effort route plus its evidence-report wording.
- `docs/WORKFLOW.md` — update all autonomous goal-grilling 5.4-mini pins.
- `docs/SKILL_AND_PLUGIN_RECOMMENDATIONS.md` — synchronize the current routing
  recommendation and consistency reminder.
- `docs/governance/goal-template-v1.md` — make Terra the default requested model
  for read-only agents and state medium effort in prose.
- `docs/governance/goal-lifecycle-contract.md` — update the enforce-grade lane
  model/effort contract.
- `docs/governance/README.md` — update the model receipt explanation.
- `docs/governance/GAP-AND-HARDENING.md` — factual current-inventory and residual
  updates only; keep enterprise long-tail as non-goals.
- `docs/governance/schemas/goal-metadata.schema.json` — replace the transitional
  model enum with the final Terra-only const.
- `scripts/nestcalc-governance.py` — replace the transitional accepted-model set
  with the final Terra-only assertion; command behavior otherwise unchanged.
- `test/governance/**` and `docs/governance/fixtures/**` — update only expected
  model strings and receipts required by the contract change.

No other file is authorized.

### Protected Surfaces

- Calculator math, `NestResult` formulas, calculator layout, and input behavior.
- AutoNest engine, session, packing, ranking, counts, trim-edge policies,
  fallback guards, search budget, and preview geometry.
- G-code Path B parsing, rewriting, G53 safety, modal-axis behavior, scientific
  notation, arc handling, and serialization.
- Clerk auth, request access, routes, sign-up behavior, secrets, `.env*`,
  deployment credentials, and Vercel settings.
- PWA/Serwist service-worker, offline-shell, and runtime-cache behavior.
- `package.json`, product configuration, product source, and all iOS work.
- `LESSONS_LEARNED.md`; its historical 5.4-mini row remains provenance.
- `docs/governance/MODE`, which remains `advisory`.
- NestCalc B6-B9 closeout stages and the non-goal status of golden pipeline,
  SBOM, env-proxy, signed-approval gates, and UI-tier enterprise process.

### Required Proof

- `python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md`
- `npm run governance:check`
- `npm run test:governance`
- `git diff --check`
- `rg` proof that no hard requirement of `gpt-5.4-mini` remains in Allowed
  Files; historical `LESSONS_LEARNED.md` provenance is reported, not edited.
- `git diff --name-only origin/main...HEAD` contains Allowed Files only.

Required proof is a subset of the human-approved Path B edit authority. Any
failure is a blocker; do not expand into product or MODE changes to fix it.

### Grilling Decision Record

```text
evidence -> confidence -> decision -> residual risk / flagged decisions
```

- Evidence: NanoTate routes research/routine lanes to `gpt-5.6-terra` medium;
  NestCalc authority, schema, validator, template, and fixtures still encode
  5.4-mini; PR #40 recorded those former lanes unavailable. Three bounded
  read-only evidence lanes successfully bound to `gpt-5.6-terra` at medium
  effort for routing inventory, lifecycle/archive, and proof-scope review.
- Confidence: high and freeze-ready after human-approved Path B. No blocking
  question remains, every required proof is fixable within Allowed Files, and
  all product and MODE surfaces are explicitly protected.
- Decision: perform only the model-pin swap and exact supporting fixture/schema
  updates. Preserve the parent orchestrator model and all non-routing behavior.
- Flagged decision — migration bootstrap: the old schema and validator could not
  validate a Terra-rostered goal. A narrow pre-freeze compatibility commit
  temporarily accepts both old and new model strings; consequence: the final
  implementation must remove legacy acceptance and prove Terra-only enforcement.
- Flagged decision — effort representation: `nestcalc-goal-v1` has no reasoning
  effort field. Keep medium effort enforce-grade in authority prose and launch
  configuration without expanding metadata shape; consequence: model identity
  is machine-validated while effort is review-validated in this wave.
- Residual risk: a future runtime may report Terra unavailable. Record
  `unavailable` honestly with no substitute evidence. Full NanoTate golden
  pipeline parity remains deferred and `MODE` remains advisory.

### B3-Style Handoff / B4-Style Preflight

- Commit this goal freeze alone, bind `goal_memory_commit` in a second
  goal-memory-only commit, validate, then create the prompt-hash-only handoff.
- Before authority implementation edits, revalidate the active goal, durable
  handoff, exact branch, relevant lessons, and proof-scope containment.
- Use host-first execution for git/GitHub network operations.

### Stopping Condition

Complete only after separate goal-memory and implementation commits, every
required proof passes, the branch is pushed, and a ready-for-review PR records
Flow `NC-20260809-7d18f1a2`, Allowed Files, proof, and explicit non-goals.
Stop blocked on validation, scope drift, MODE touch, product file edits, or any
required proof failure. Do not merge, deploy, force-push, flip MODE, import
enterprise gates, or post B6/B7 closeout unless separately requested.
