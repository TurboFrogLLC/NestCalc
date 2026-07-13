# pr-closeout-breakdown Merge Disposition Contract

**Purpose:** NestCalc contract for section 8 in `pr-closeout-breakdown` output.
Global skill path: `~/.grok/skills/pr-closeout-breakdown/SKILL.md`

## Required section

Every NestCalc Grok Build closeout must include **section 8 — Merge Disposition**
before **Overall Assessment**. Copy-paste from
`docs/governance/closeout-rollback-templates.md`.

## Signal enum

- `merge-ready` — human may merge
- `suspend-merge` — hold merge pending named human action
- `rollback-required` — do not merge; execute rollback steps

## Validation

Validate the markdown comment before posting:

```bash
python3 scripts/nestcalc-governance.py validate-closeout-breakdown --input path/to/closeout.md
```

Validate the companion JSON disposition artifact when one is kept locally:

```bash
python3 scripts/nestcalc-governance.py validate-closeout --input .nestcalc/governance/closeout-disposition.json
```

## Assessment alignment

| Signal | Overall Assessment |
|--------|-------------------|
| merge-ready | Approve or Comment Only |
| suspend-merge | Comment Only only |
| rollback-required | Request Changes only |

## Grok Build role

Grok Build is the review/closeout layer. It posts the breakdown as a PR comment,
previews lesson persistence, and does not merge or expand implementation scope.
Findings return to chat for triage per `L-nestcalc-grok-review-role-separation`.