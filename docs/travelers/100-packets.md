# PR 100 packets — prompt + return log

Owner expedite. Every management Ops Packet and every Operator return is recorded here.
Do not delete rows. Append only.

Record Head: 9925630
job_id: NGJ-20260822-100

## Index

| Seq | Station | Mode | Operator | Stamp | Outcome |
| --- | --- | --- | --- | --- | --- |
| 1 | Checkout sync | Worker | Grok Build | 493aaa1 | Stamped; advanced to Cut |
| 2 | Cut | Worker | Grok Build | 47629f2 | AGENTS second main exception; Wait pointer; WORKFLOW defers to AGENTS |
| 3 | Send for review | Worker | Grok Build | 63458ae | PR marked ready; @codex review posted; agents-pr-review not runnable on this Surface; advanced to Wait |
| 4 | Wait | Worker | Grok Build | f96b974 | Named review held (Codex clean; agents-pr-review COMMENT); advanced to Inspection |
| 5 | Inspection | Worker | Grok Build | 9925630 | Clean; named reviews held; no open blocking threads; advanced to Merge |
| 6 | Merge | Worker | Grok Build | f260b63 | Squash-merged onto main; P0-F no-runner land override; advanced to Close |

---

## Log

(Sections appended per Station: `### Seq N — <Label>` then **Ops Packet** fence then **Operator return** fence.)

### Seq 1 — Checkout sync

**Ops Packet**

```text
Repo: NestCalc
Station: Checkout sync
Mode: Worker
Operator: Grok Build
Branch: docs/agents-main-exception-agents-pr-review
Head: 493aaa1da9d88ed1a54ac7a8be231d4e5bfa8240
job_id: NGJ-20260822-100
flow_id: —
goal_sha256: —
Trace: NestCalc #100; Owner expedite; AGENTS main exception + agents-pr-review; job traveler docs/travelers/100.md; prompt+return log docs/travelers/100-packets.md
Model: Grok 4.6
Effort: high
Orchestration: Single-agent
Session: Fresh

Instruction:
Confirm branch docs/agents-main-exception-agents-pr-review at the named HEAD (or current tip if already advanced). Create docs/travelers/100-packets.md if missing (append-only prompt+return log for this job). Stamp Seq 1 Checkout sync on docs/travelers/100.md with this HEAD short SHA. Advance Still open / Next to Cut on the same pass. Append this Ops Packet and a facts-only Operator return to docs/travelers/100-packets.md. Commit and push only traveler + packets log. Do not start Cut. Do not merge. Do not edit AGENTS.md or WORKFLOW on this Station.

Reason:
First Station. Model is Grok 4.6 high for the full spine. Full prompt/return record required for later analysis.
```

**Operator return**

```text
Branch confirmed: docs/agents-main-exception-agents-pr-review
HEAD confirmed: 493aaa1da9d88ed1a54ac7a8be231d4e5bfa8240
Created docs/travelers/100-packets.md.
Seq 1 Checkout sync stamped with 493aaa1.
Still open: Cut.
Next: Cut.
AGENTS.md and docs/WORKFLOW.md were not edited. Cut was not started. Merge was not performed.
```

### Seq 2 — Cut

**Ops Packet**

```text
Repo: NestCalc
Station: Cut
Mode: Worker
Operator: Grok Build
Branch: docs/agents-main-exception-agents-pr-review
Head: 77e5ec7
job_id: NGJ-20260822-100
flow_id: —
goal_sha256: —
Trace: NestCalc #100; post-#99 P1 residual; job traveler docs/travelers/100.md; packets docs/travelers/100-packets.md
Model: Grok 4.6
Effort: high
Orchestration: Single-agent
Session: Fresh

Instruction:
Cut only the named outcomes. Allowed Files: AGENTS.md, docs/WORKFLOW.md, docs/GLOSSARY.md, docs/templates/traveler.md, docs/templates/README.md, docs/travelers/100.md, docs/travelers/100-packets.md. Do not edit GOAL.md or product code.

1. AGENTS.md Never: add a second main exception — docs-only traveler and packslip stamps after merge when this traveler names Owner authorization. Keep checkout sync as the first exception. One meaning; no synonym stack.

2. Quality Control / Wait path: when named review is requested, point at agents-pr-review as a companion to the named Codex review. Pointer only; do not paste the skill body into AGENTS or WORKFLOW.

3. docs/WORKFLOW.md: Release/Close docs-only main line must point at the AGENTS exception (resolve dual authority from #99 P1). Do not invent a third main path.

Stamp Seq 2 Cut on docs/travelers/100.md with the Cut commit short SHA. Advance Still open / Next to Send for review on the same pass. Append this Ops Packet and Operator return to docs/travelers/100-packets.md. Push Allowed Files only. Keep PR draft. Do not merge. Do not start Send for review.

Reason:
Owner expedite. Promote the post-merge stamp path into AGENTS; Wait gets agents-pr-review pointer; WORKFLOW defers to AGENTS for one meaning.
```

**Operator return**

```text
AGENTS Never now has two main exceptions: (1) checkout sync; (2) docs-only traveler and packslip stamps after merge when this traveler names Owner authorization.
Quality Control / Wait named review points at @codex review and agents-pr-review (companion). Skill body was not pasted.
WORKFLOW Start calls checkout sync the first main exception and points the second at AGENTS Never. Release/Close docs-only main line points at the AGENTS Never second exception. No third main path.
GLOSSARY Send for review and agents-pr-review carry the same named-review meaning. Templates were not edited.
Seq 2 Cut stamped with 47629f2.
Still open: Send for review.
Next: Send for review.
PR remains draft. Send for review was not started. Merge was not performed. GOAL.md and product code were not edited.
```

### Seq 3 — Send for review

**Ops Packet**

```text
Repo: NestCalc
Station: Send for review
Mode: Worker
Operator: Grok Build
Branch: docs/agents-main-exception-agents-pr-review
Head: 96ef9e9
job_id: NGJ-20260822-100
flow_id: —
goal_sha256: —
Trace: NestCalc #100; Cut 47629f2; job traveler docs/travelers/100.md; packets docs/travelers/100-packets.md
Model: Grok 4.6
Effort: high
Orchestration: Single-agent
Session: Fresh

Instruction:
Mark PR 100 ready for review. Request named Codex review (@codex review). Stamp Seq 3 Send for review on docs/travelers/100.md with this pass short SHA. Advance Still open / Next to Wait on the same pass. Append this Ops Packet and Operator return to docs/travelers/100-packets.md. Push Allowed Files only. Do not merge. Do not start Inspection. If this Operator cannot run agents-pr-review from this Surface, report that fact only — do not invent a substitute review body.

Reason:
Quality Control starts. Named review includes Codex; agents-pr-review is the companion path (management may run that skill if this Surface cannot).
```

**Operator return**

```text
Seq 3 Send for review stamped with 96ef9e9.
Still open: Wait.
Next: Wait.
This Operator cannot run agents-pr-review from this Surface. No substitute review body was posted.
Inspection was not started. Merge was not performed.
```

**Stamp supplement**

```text
PR #100 marked ready for review.
Named Codex review requested by posting “@codex review”.
Comment: https://github.com/TurboFrogLLC/NestCalc/pull/100#issuecomment-5384105386
Pass commit: 63458ae.
Seq 3 Send for review stamped with 63458ae.
Still open: Wait.
Next: Wait.
Inspection was not started. Merge was not performed.
```

### Seq 4 — Wait

**Ops Packet**

```text
Repo: NestCalc
Station: Wait
Mode: Worker
Operator: Grok Build
Branch: docs/agents-main-exception-agents-pr-review
Head: 50b88945e110974caafb06df94575bce84abd776
job_id: NGJ-20260822-100
flow_id: —
goal_sha256: —
Trace: NestCalc #100; Send for review 63458ae; Codex clean; agents-pr-review COMMENT held
Model: Grok 4.6
Effort: high
Orchestration: Single-agent
Session: Fresh

Instruction:
When stamping Wait → docs/WORKFLOW.md → ## Quality Control → step 2.
When traveler → docs/travelers/100.md Seq 4 only.
When log → docs/travelers/100-packets.md append only.

Confirm named review held (Codex and/or agents-pr-review). Stamp Seq 4 Wait with this pass short SHA. Advance Still open / Next to Inspection on the same pass. Append Ops Packet + facts-only return to 100-packets.md. Push Allowed Files only. Do not merge. Do not start Inspection work beyond the stamp.

Reason:
Wait is hold for named review. Both companion paths are held. Pointer-only.
```

**Operator return**

```text
Named review held on both companion paths.
Codex: clean. Comment https://github.com/TurboFrogLLC/NestCalc/pull/100#issuecomment-5384114127 on 63458ae899.
agents-pr-review: COMMENT. Review https://github.com/TurboFrogLLC/NestCalc/pull/100#pullrequestreview-5001621187 on 50b88945e110974caafb06df94575bce84abd776.
Seq 4 Wait stamped with 50b8894.
Still open: Inspection.
Next: Inspection.
Inspection was not started. Merge was not performed. Allowed Files only: docs/travelers/100.md, docs/travelers/100-packets.md.
```

**Stamp supplement**

```text
Named review held on both companion paths.
Pass commit: f96b974.
Seq 4 Wait stamped with f96b974.
Still open: Inspection.
Next: Inspection.
Inspection was not started. Merge was not performed.
```

### Seq 5 — Inspection

**Ops Packet**

```text
Repo: NestCalc
Station: Inspection
Mode: Worker
Operator: Grok Build
Branch: docs/agents-main-exception-agents-pr-review
Head: d7eb32e
job_id: NGJ-20260822-100
flow_id: —
goal_sha256: —
Trace: NestCalc #100; Wait f96b974; Codex clean; agents-pr-review COMMENT
Model: Grok 4.6
Effort: high
Orchestration: Single-agent
Session: Fresh

Instruction:
When Inspection → docs/WORKFLOW.md → ## Quality Control → step 3.
When traveler → docs/travelers/100.md Seq 5 only.
When log → docs/travelers/100-packets.md append only.

Confirm named reviews held and no open blocking threads on this job’s scope. agents-pr-review [should]/[nit] are non-blocking unless Owner names a fix. Stamp Seq 5 Inspection with this pass short SHA. Advance Still open / Next to Merge on the same pass only if Inspection is clean. Append Ops Packet + facts-only return. Push Allowed Files only. If not clean: stop, report, do not advance. Do not merge. Do not Close.

Reason:
Inspection after Wait. Clean → Release. Pointer-only.
```

**Operator return**

```text
Named reviews held. No open review threads. Inspection clean.
Codex: clean. Comment https://github.com/TurboFrogLLC/NestCalc/pull/100#issuecomment-5384114127 on 63458ae899.
agents-pr-review: COMMENT. Review https://github.com/TurboFrogLLC/NestCalc/pull/100#pullrequestreview-5001621187 on 50b88945e110974caafb06df94575bce84abd776.
Findings: [should] agents-pr-review product path; [nit] job_id echo on AGENTS Always. Owner did not name a fix. Non-blocking.
Open review threads: 0.
Seq 5 Inspection stamped with d7eb32e.
Still open: Merge.
Next: Merge.
Merge was not performed. Close was not performed. Allowed Files only: docs/travelers/100.md, docs/travelers/100-packets.md.
```

**Stamp supplement**

```text
Named reviews held. No open review threads. Inspection clean.
Pass commit: 9925630.
Seq 5 Inspection stamped with 9925630.
Still open: Merge.
Next: Merge.
Merge was not performed. Close was not performed.
```

### Seq 6 — Merge

**Ops Packet**

```text
Repo: NestCalc
Station: Merge
Mode: Worker
Operator: Grok Build
Branch: docs/agents-main-exception-agents-pr-review
Head: 53f1480
job_id: NGJ-20260822-100
flow_id: —
goal_sha256: —
Trace: NestCalc #100; Inspection 9925630 clean; Owner land override P0-F no-runner when that is infra only
Model: Grok 4.6
Effort: high
Orchestration: Single-agent
Session: Fresh

Instruction:
When Merge → docs/WORKFLOW.md → ## Release.
When traveler → docs/travelers/100.md Seq 6 only.
When log → docs/travelers/100-packets.md append only.

Squash-merge PR 100 onto main. Stamp Seq 6 Merge with the merge commit short SHA. Advance Still open / Next to Close on the same pass. Append Ops Packet + facts-only return. Do not Close. Do not delete the branch yet. Do not edit AGENTS.md beyond what is already on this branch.

Reason:
Inspection clean. Owner authorizes land despite P0-F UNSTABLE when that is infra no-runner only.
```

**Operator return**

```text
PR 100 squash-merged onto main.
Merge commit: f260b63fa756273018298ec67efd8ed47d6399f6.
Seq 6 Merge stamped with f260b63.
Still open: Close.
Next: Close.
P0-F jobs p0f-build, p0f-lint, p0f-unit, p0f-governance, p0f-evidence: runner_id 0, steps 0.
Owner land override used (gh pr merge --admin --squash).
The source branch docs/agents-main-exception-agents-pr-review was not deleted. Close was not performed. AGENTS.md was not edited on this Station.
```
