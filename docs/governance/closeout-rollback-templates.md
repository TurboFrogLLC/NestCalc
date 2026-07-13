# Closeout Rollback & Suspension Templates

**Purpose:** Copy-paste templates for merge disposition signals in Grok Build PR
closeout breakdowns. Pairs with the global `pr-closeout-breakdown` skill and
`docs/governance/schemas/closeout-disposition.schema.json`.

**Skill:** `pr-closeout-breakdown` at `~/.grok/skills/pr-closeout-breakdown/SKILL.md`

## Required closeout section

Add **section 8** before **Overall Assessment** in every closeout breakdown:

```markdown
### 8. Merge Disposition

**Signal:** merge-ready | suspend-merge | rollback-required
**Rationale:** <why this signal applies>
**Human action:** <explicit next step for the human>

<!-- rollback-required only -->
**Rollback steps:**
1. <git revert or branch reset step>
2. <re-scope or goal-prep step>
```

## Signal definitions

| Signal | When to use | Human merge gate |
|--------|-------------|------------------|
| `merge-ready` | Verification complete; no blockers; goal stopping condition met | Proceed to merge |
| `suspend-merge` | Directionally correct but Codex review, manual proof, or human decision pending | Hold merge; complete listed action first |
| `rollback-required` | Protected-surface regression, scope breach, or unsafe to land | Do not merge; execute rollback steps |

## Template: merge-ready

```markdown
### 8. Merge Disposition

**Signal:** merge-ready
**Rationale:** All automated verification passed; prior review findings addressed; goal stopping condition satisfied.
**Human action:** Approve and merge on GitHub when ready.
```

## Template: suspend-merge

```markdown
### 8. Merge Disposition

**Signal:** suspend-merge
**Rationale:** <pending Codex review / manual proof / policy sign-off>
**Human action:** Complete <named proof or decision>, then request re-closeout with merge-ready or request changes.
```

## Template: rollback-required

```markdown
### 8. Merge Disposition

**Signal:** rollback-required
**Rationale:** <protected-surface regression / scope expansion / failed verification>
**Human action:** Do not merge. Execute rollback steps below before next cycle.

**Rollback steps:**
1. `git revert <commit>` or reset PR branch to last known-good SHA
2. Update `GOAL.md` scope or open new goal-prep cycle with corrected boundaries
```

## Alignment with Overall Assessment

| Merge disposition signal | Overall Assessment |
|--------------------------|-------------------|
| `merge-ready` | **Approve** or **Comment Only** (cannot-self-approve) |
| `suspend-merge` | **Comment Only** — merge held pending human action |
| `rollback-required` | **Request Changes** — merge blocked until rollback complete |

Closeout must not declare **Approve** when signal is `suspend-merge` or
`rollback-required`.