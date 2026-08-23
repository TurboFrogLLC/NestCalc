# PR 100 packets — prompt + return log

Owner expedite. Every management Ops Packet and every Operator return is recorded here.
Do not delete rows. Append only.

Record Head: 96ef9e9
job_id: NGJ-20260822-100

## Index

| Seq | Station | Mode | Operator | Stamp | Outcome |
| --- | --- | --- | --- | --- | --- |
| 1 | Checkout sync | Worker | Grok Build | 493aaa1 | Stamped; advanced to Cut |
| 2 | Cut | Worker | Grok Build | 47629f2 | AGENTS second main exception; Wait pointer; WORKFLOW defers to AGENTS |
| 3 | Send for review | Worker | Grok Build | 96ef9e9 | Stamped; agents-pr-review not runnable on this Surface; advanced to Wait |

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
