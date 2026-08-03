# NestCalc P0-G Phase A Required Checks Pilot

This is the NestCalc-local sequencing and acceptance artifact for the
SuperBrain P0-G execution. It records target-repository authority, the Phase A
implementation contract, validation evidence, and the explicit Phase B
boundary. It does not authorize SuperBrain changes.

## Authority and child-goal names

- Parent SuperBrain execution GOAL: `Execute P0-G — validate and activate GitHub rulesets and required checks`.
- Parent SuperBrain execution record: `P0-G execution GOAL — validate and activate GitHub rulesets and required checks`.
- NestCalc child goal: `NestCalc P0-G Phase A pilot — required checks and temporary ruleset validation`.
- Target repository: `TurboFrogLLC/NestCalc`.
- Parent execution status: authorized and `in_progress`; this artifact records
  NestCalc Phase A only and does not mark P0-G complete.

## Designated actors and approval rules

- Designated owner and emergency actor for this pilot: GitHub account
  `TurboFrogLLC`, acting with repository-admin/org-admin authority.
- Independent approver rule: the owner-only path is permitted only when no
  non-author approver is available for the PR. If an independent approver is
  available, the owner-only path is not a substitute for that review.
- The designated owner is not an independent approver and cannot submit an
  approving review on an owner-authored PR. Prefer a second approver account
  for the long-term path.

## Distinct mechanisms

### Interim owner-only admin merge path (green gate only)

This is the temporary operational path for a PR authored by the designated
owner when no independent non-author approver is available and the required
gate is green. When ruleset enforcement exists, the designated owner may use
an audited admin merge / approval-bypass path. Positive-path evidence must
include the green gate and an attributable record containing the actor, PR,
head SHA, and timestamp. This is distinct from the emergency failing-gate
bypass and cannot merge a PR with a failed, cancelled, or missing required
gate.

### Emergency failing-gate bypass

This is a separate, attributable emergency action available only while the
temporary validation branch is enforcing the required-check rule. It requires
the designated emergency actor, a written reason, the affected PR and head
SHA, the failed gate, and a post-event review. It must never be represented as
an owner-only approval or as a green-gate result.

## Locked identifiers

- Required aggregate check: `p0f-required-gate`.
- Temporary validation branch: `p0g-ruleset-eval`.
- Temporary ruleset name: `NestCalc P0-G required checks`.
- The five upstream jobs remain `p0f-lint`, `p0f-unit`, `p0f-build`,
  `p0f-governance`, and `p0f-evidence`.

## Audit and evidence destinations

Every validation event must retain:

1. the PR URL and head SHA;
2. the Actions run URL, job results, and `p0f-evidence` artifact link;
3. the temporary branch and ruleset identifiers;
4. the GitHub repository/organization audit-log record for any bypass; and
5. a post-event review note linked from this artifact or the corresponding PR.

The durable NestCalc record is this file in the implementation PR. GitHub
Actions, PR, and audit-log links are authoritative for the corresponding event.

## Phase A acceptance ledger

| Evidence | Result | Durable record |
| --- | --- | --- |
| Five P0-F jobs still run on `pull_request` | PASS | `.github/workflows/p0-f-minimum-ci.yml`; [run 30862396766](https://github.com/TurboFrogLLC/NestCalc/actions/runs/30862396766) |
| `p0f-required-gate` always resolves after all five jobs | PASS; all five dependencies passed and the aggregate completed after `p0f-evidence` | [gate job](https://github.com/TurboFrogLLC/NestCalc/actions/runs/30862396766/job/91847135322) |
| Deliberate passing PR into `p0g-ruleset-eval` | PASS; head `4e7d810996288d6d58109e3f7506711a82c8a801` | [PR #35](https://github.com/TurboFrogLLC/NestCalc/pull/35), [run](https://github.com/TurboFrogLLC/NestCalc/actions/runs/30862396766), [manifest artifact](https://api.github.com/repos/TurboFrogLLC/NestCalc/actions/artifacts/8874829621/zip) |
| Deliberate failing PR into `p0g-ruleset-eval` | PASS; `p0f-unit` failed, `p0f-evidence` still passed, and `p0f-required-gate` failed terminally; head `079d79eb45ae990adf3806a8b57100f2c4576a81` | [PR #36](https://github.com/TurboFrogLLC/NestCalc/pull/36), [run](https://github.com/TurboFrogLLC/NestCalc/actions/runs/30862700882), [failed unit job](https://github.com/TurboFrogLLC/NestCalc/actions/runs/30862700882/job/91847912314), [failed gate job](https://github.com/TurboFrogLLC/NestCalc/actions/runs/30862700882/job/91848087788), [manifest artifact](https://api.github.com/repos/TurboFrogLLC/NestCalc/actions/artifacts/8874942997/zip) |
| Ruleset `NestCalc P0-G required checks` on `p0g-ruleset-eval` | BLOCKED by GitHub plan capability | [rulesets API response](https://docs.github.com/rest/repos/rules#get-all-repository-rulesets); repository is private and GitHub returned HTTP 403 requiring Pro/public visibility |
| Owner-only positive path | BLOCKED; no enforceable ruleset/branch-protection surface is available | When enforcement exists, evidence must be green gate plus an attributable admin merge/approval-bypass record (actor, PR, head SHA, timestamp); PR #35 is currently a green-gate demonstration only |
| Owner-only negative path | BLOCKED; no enforceable ruleset/branch-protection surface is available | A failing gate must not be mergeable through the green-gate admin path; PR #36 proves the gate fails but not GitHub merge blocking |
| Emergency bypass with enforcement | Blocked until ruleset enforcement is available | Actor, time, reason, audit record, review note |

## Phase boundary

Phase B live default-branch ruleset activation is deferred and explicitly out
of scope. No ruleset or required-check rule may be activated on `main` by this
wave. The temporary branch is the only permitted validation target.

## Capability note

At the start of this pilot, GitHub returned HTTP 403 with “Upgrade to GitHub Pro
or make this repository public to enable this feature” for both the repository
rulesets endpoint and the legacy branch-protection endpoint. Until that target
capability is enabled, ruleset creation, insight-only evaluation, enforcing
branch tests, owner-path tests, and emergency bypass tests are blocked rather
than inferred or marked as passes.
