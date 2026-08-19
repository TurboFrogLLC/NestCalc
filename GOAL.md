# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Align NestCalc governance machine to post-#69 law",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": []
  },
  "branch_intent": "scripts/machine-retune",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260818-589a9463",
  "goal_memory_commit": "0000000000000000000000000000000000000000",
  "goal_sha256": "sha256:a11691d2f9b0c7680f70b2cedee91a76715a817c60a581af7f300ee18065ce02",
  "protected_surfaces": [
    "UI and chrome, calculator math, engine behavior, nest-session transforms, AutoNest, G-code, presets, Clerk, PWA, routes, service workers, secrets, deployment, and Production",
    "FLiPIT identity, V3 HTML and SPEC authority, docs/governance/MODE, main, and SuperBrain"
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

## Active Goal: Align NestCalc governance machine to post-#69 law

### Objective

Retune the repository-local governance checker and its machine contracts to the
written Surface, traveler, and land law established by NestCalc PR #69 at
`2d7506f388e7d1017053cbcf39aff0a270cba10f`, without weakening the remaining
fail-closed controls or changing `docs/governance/MODE` from `advisory`.

This goal freeze is authored on Surface **Codex App**, model **GPT-5.6 Sol**,
effort **medium**. Implementation routes next to Surface **Codex CLI**. The
traveler is the required packet; the `create-handoff` JSON sidecar is optional.

### Scope / Allowed Files

Only these files may change during implementation:

- `scripts/nestcalc-governance.py`
- `docs/governance/schemas/*`
- matching fixtures under `docs/governance/fixtures/*`
- `docs/governance/goal-template-v1.md`, and only where a changed check requires
  matching template text

Required outcomes:

- Preserve fail-closed enforcement for the v1 fence, valid `flow_id`, canonical
  `goal_sha256` hash match, exactly one Active Goal, and secret rejection.
- Preserve the one historical-title exception exactly: while MODE is
  `advisory`, only `NestCalc Governed Goal Pipeline v1` may warn for missing v1
  metadata. Do not broaden the exception and do not flip MODE.
- Stop requiring `branch_intent` to begin with `codex/`; accept an honest safe
  feature-branch intent such as `scripts/machine-retune`.
- Stop requiring `execution_route` or `agent_roster.orchestrator` to equal
  `codex-cli`; validate honest named Surface and route values without turning
  old Codex-only pins into law.
- Stop requiring every read-only lane's `requested_model` to equal
  `gpt-5.6-terra`; retain honest requested-versus-observed model recording and
  fail a false `matched` claim.
- Keep the traveler as the required handoff packet. Keep `create-handoff` as an
  optional prompt-hash sidecar rather than a required continue-gate.
- Stop requiring `human_action_required` as a standing Human-merge instruction
  in closeout artifacts. Permit it only when a real human action is actually
  required, without weakening closeout disposition, PR-state, commit-separation,
  or assessment-alignment checks.
- Add or adjust matching valid and invalid fixtures so each retained hard gate
  and each relaxed stale pin is explicit and deterministic.

### Protected Surfaces

Do not touch UI or chrome, calculator math, engine behavior, nest-session
transforms, AutoNest, G-code, presets, Clerk, PWA, routes, service workers,
secrets, deployment, Production, FLiPIT identity, V3 HTML or SPEC authority,
`docs/governance/MODE`, `main`, or SuperBrain. Do not add a NestCalc
`the-Feeler` wrapper.

### Required Proof

Run host-first after implementation:

```text
python3 scripts/nestcalc-governance.py check
python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md
npm run governance:check
npm run test:governance
git diff --check
git status --porcelain=v1
```

Proof must demonstrate both sides of the retune: the newly honest branch,
Surface/route, model, traveler/optional-sidecar, and conditional-human-action
cases pass; malformed fence, flow ID, hash, Active Goal count, secret, false
model-match, and existing closeout integrity cases still fail closed.

### Grilling Decision Record

```text
evidence → confidence → decision → residual risk / flagged decisions
```

- Evidence: PR #69 and current written authority define Surface as the station,
  traveler as the packet, sidecar as optional machinery, and stale Codex-only
  route or branch pins as a Corrective Action waypoint rather than Broken.
- Evidence: the current checker and schemas still hard-code `codex/`,
  `codex-cli`, and `gpt-5.6-terra`, and closeout schemas still require
  `human_action_required`.
- Confidence: freeze-ready. The required proof is reachable inside the Allowed
  Files; protected surfaces are explicit; exactly one Active Goal is present;
  no blocking question remains.
- Decision: Path B. The allowed governance schemas and matching fixtures are
  broad enough to repair every required proof title. The existing governance
  unit-test source remains outside scope because its positive legacy cases can
  remain valid under broadened honest-value acceptance.
- Flagged decision — reason: this goal must truthfully name
  `scripts/machine-retune`, but the pre-retune validator rejects that branch
  prefix. Decision: preserve the honest value and its canonical hash rather than
  write a false `codex/` intent. Consequence: the freeze-time validator is
  expected to report only the stale branch-prefix pin until Codex CLI implements
  this goal; that known waypoint is not evidence that the hash or v1 fence is
  invalid.
- Residual risk: machine vocabulary for arbitrary future Surface, route, and
  model values must remain bounded to non-empty safe strings and honest roster
  status relationships. The implementation may not convert relaxed stale pins
  into unvalidated free-form artifacts.
- Evidence lanes: no delegated read-only agents were used. All evidence was
  gathered locally by the Codex App planning seat, so the roster records no
  invented agent or model observation.

### Traveler / Sidecar / Preflight

- The parent emits the traveler from `docs/templates/handoff.md` after this
  freeze; no sidecar is required for the next waypoint.
- Codex CLI must start-check branch and freeze commit, re-read authority, echo
  `flow_id` and `goal_sha256`, and make no implementation edit outside Allowed
  Files.
- If a real try has no movement, load SuperBrain `skills/the-feeler` with the
  traveler packet, evidence, and known set `wReckless`, `SuperGrok`,
  `Codex App`, `Codex CLI`, and `Grok Build`. The parent writes the traveler.
  Feeler output is `moved|no-move`, Corrective Action if clear, next or refuse,
  and one Reason.

### Stopping Condition

This Codex App hop stops immediately after the goal-only freeze commits are
created on `scripts/machine-retune` and the final `flow_id` and canonical
`goal_sha256` are reported. Do not implement, create a sidecar, push, open a PR,
merge, touch `main`, or choose a later Surface in this hop.

The Codex CLI implementation is complete only when every required outcome is
covered by deterministic fixtures and all Required Proof commands pass. Stop as
Broken if implementation would require a protected surface, MODE change,
secret, Production action, or edit outside Allowed Files.
