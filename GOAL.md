# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "HowMany authority lock - product name, header wordmark, and UI shell",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": []
  },
  "branch_intent": "codex/howmany-authority-lock",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260810-6c4a91d8",
  "goal_memory_commit": "5cd03c7052ed377f76e1ff93a947e234c0ef59bd",
  "goal_sha256": "sha256:2417e82a83a6935668391f8a8943dcffafa41a09b496963d1b8d98798b419a2a",
  "protected_surfaces": [
    "HowMany product name, full brand line, and locked header wordmark",
    "docs/ui-shell lineage and its accepted reference prototype",
    "calculator math and nesting behavior",
    "AutoNest engine behavior and calculator UI wiring",
    "Clerk auth, routes, request-access policy, PWA/runtime cache, secrets, deployment credentials, Production, merge, and docs/governance/MODE"
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": [
    "codex-repo-hygiene-gate",
    "nestcalc-goal-grilling",
    "codex-goal-prep",
    "github:yeet"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: HowMany authority lock - product name, header wordmark, and UI shell

### Objective

Protect the human-accepted HowMany identity and the accepted UI shell before
any future product wiring. This authority-only wave supersedes the prior active
goal's `Nest` / `Calc` wordmark requirement. It neither implements nor
authorizes product features, a redesign, a repository rename, merge, or
Production activity.

### Locked Authority

The product name is **HowMany**. The repository name remains **NestCalc**. The
full brand line is **HowMany by wReckless Toddler LLC**. These are locked
product-identity authority. Future product work must use HowMany as the product
name; changing any of these statements requires a new human decision.

The locked header wordmark is exactly:

- the left gradient square with its icon; and
- free-standing lowercase `h`, Lucide `CircleQuestionMark`, and `wMany` text,
  with no surrounding pill, box, outline, or grouped text container.

This exact icon, letter case, spacing, and structure are the authority
wordmark. Future work must not change them without a new human decision.

The accepted shell lineage is `docs/ui-shell`, represented at this lock by
commit `ff8b7d61d74673f4404456cf69b8f0c63f49cdfb` and its canonical source
`docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html`. It is the
visual and structural authority for future product wiring. Treat that shell as
protected: no casual overwrite, replacement, or reinterpretation is allowed
without a new human decision.

The UI shell is not being redesigned. The old V1 shell is deprecated and must
not be touched. This accepted shell exists only as the frozen visual and
structural authority to plug future product wiring into; its appearance is not
open for change in this wave.

### Scope / Allowed Files

This authority-only wave may change only:

- `GOAL.md`;
- `AGENTS.md`; and
- `docs/goals/GOAL-TRACE-INDEX.md`.

The accepted prototype is a read-only authority input in this wave. No files
under `src/`, `e2e/`, `public/`, routes, packages/configuration, deployment,
or PWA surfaces may change.

### Required Proof

1. `python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md` passes.
2. `npm run governance:check` and `npm run test:governance` pass.
3. `git diff --check` passes and the changed-file list is limited to Allowed
   Files.
4. The trace index records that the prior `Nest` / `Calc` wordmark goal is
   superseded and this is the sole active goal.

### Grilling Decision Record

Evidence: the accepted `docs/ui-shell` tip identifies the free-standing
`h[CircleQuestionMark]wMany` treatment and no text box; the previous active
goal explicitly required `Nest` / `Calc`; the human has authorized replacing
that conflict.

Confidence: freeze-ready. There are no open scope questions; required proof is
reachable inside Allowed Files.

Decision: replace the active goal rather than retaining competing wordmark
authority; record the historical goal by immutable flow ID and commit in the
trace index.

Residual risk / flagged decision: this wave locks authority only. Future
product wiring needs a separately human-approved goal and must use this lock as
an input; it may not infer permission to change the name, wordmark, or shell.

### Stopping Condition

Stop after the authority docs are committed and published in a ready-for-review
feature PR. Do not merge, deploy, or touch Production. Do not create a B3-style
implementation handoff because this wave authorizes no implementation.
