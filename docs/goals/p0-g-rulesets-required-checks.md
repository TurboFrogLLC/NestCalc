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
- Owner-only approval is a green-gate path only. It cannot override a failed,
  cancelled, or missing required gate.

## Distinct mechanisms

### Interim owner-only approval path (green gate only)

This is the temporary operational path for a PR authored by the designated
owner when no independent approver is available. It is valid only when
`p0f-lint`, `p0f-unit`, `p0f-build`, `p0f-governance`, `p0f-evidence`, and
`p0f-required-gate` all report success. Approval authority and bypass authority
are deliberately separate concepts; an owner approval does not make a failed
gate mergeable.

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
| Five P0-F jobs still run on `pull_request` | Pending implementation validation | `.github/workflows/p0-f-minimum-ci.yml` |
| `p0f-required-gate` always resolves after all five jobs | Pending PR run | This file + Actions run URL |
| Deliberate passing PR into `p0g-ruleset-eval` | Pending | PR URL, head SHA, run URL, artifact URL |
| Deliberate failing PR into `p0g-ruleset-eval` | Pending | PR URL, head SHA, failed gate URL |
| Owner-only positive path | Pending enforcement-capability check | PR URL and review record |
| Owner-only negative path | Pending enforcement-capability check | PR URL and failed gate record |
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
