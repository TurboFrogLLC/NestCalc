# PR 102 packets — prompt + return log

Employee-manual mermaid probe-5. Every management Ops Packet and every Operator return is recorded here.
Do not delete rows. Append only.

job_id: NGJ-20260823-102
Operator: Grok Build | Model: Grok 4.6 | Effort: low (every Station)

## Index

| Seq | Station | Mode | Operator | Stamp | Outcome |
| --- | --- | --- | --- | --- | --- |
| 1 | Checkout sync | Worker | Grok Build | 25b4cb55 | stamped |
| 2 | Cut | Worker | Grok Build | 682ea47 | chart; stamped |
| 3 | Send for review | Worker | Grok Build | 48a20afa | ready; @codex review |
| 4 | Wait | Worker | Grok Build | 304cc01 | P1=1 P2=3; Next=CA |
| CA | Corrective Action | Specialist | Grok Build | e970090 | P1 transcripts restored; P2 chart edges; Next=Inspection |

---

## Log

### Seq 1 — Checkout sync

**Ops Packet** (management → Grok Build)

```text
Repo: NestCalc
Station: Checkout sync
Mode: Worker
Operator: Grok Build
Branch: docs/employee-manual-mermaid-probe-5
Head: 9b335b7977678bc279e56637f78912443966fa3a
job_id: NGJ-20260823-102
flow_id: —
goal_sha256: —
Trace: NestCalc #102; post-#101; low-effort spine; Checkout sync
Model: Grok 4.6
Effort: low
Session: fresh

Instruction:
Done when: on branch docs/employee-manual-mermaid-probe-5; HEAD matches origin for this branch; Seq 1 Checkout sync stamped with commit SHA on @docs/travelers/102.md; Operator return under Seq 1 in @docs/travelers/102-packets.md; Still open / Next = Cut; Cut not started; pushed Allowed Files only.
When sync → fetch origin; checkout docs/employee-manual-mermaid-probe-5; fast-forward to origin/docs/employee-manual-mermaid-probe-5; confirm HEAD.
When traveler → @docs/travelers/102.md Seq 1 only; Stamp = commit SHA (not a calendar date).
When log → @docs/travelers/102-packets.md Seq 1 only.
This Station only. Mode Worker: do not spawn subagents; do not open plan mode; do not load files outside named paths.
Allowed write: docs/travelers/102.md, docs/travelers/102-packets.md.
No chart. No AGENTS/WORKFLOW/GLOSSARY/GOAL/product edits. No Cut. No merge.

Reason:
Seed traveler is on the branch. Checkout sync binds the worktree before Cut.

Return (this Station only):
Repo:
Station:
Mode:
Operator:
Branch:
Head:
job_id:
flow_id:
goal_sha256:
Stamp:
Facts:
```

**Operator return**

```text
Repo: NestCalc
Station: Checkout sync
Mode: Worker
Operator: Grok Build
Branch: docs/employee-manual-mermaid-probe-5
Head: 25b4cb55ba7b7771a5905eb8e48584b27450eaf1
job_id: NGJ-20260823-102
flow_id: —
goal_sha256: —
Stamp: 25b4cb55ba7b7771a5905eb8e48584b27450eaf1
Facts: fetch origin; already on docs/employee-manual-mermaid-probe-5; ff-only already up to date; HEAD == origin/docs/employee-manual-mermaid-probe-5 == 25b4cb55ba7b7771a5905eb8e48584b27450eaf1; Seq 1 stamped with that SHA; Still open / Next = Cut; Cut not started; only 102.md and 102-packets.md written.
```

### Seq 2 — Cut

**Ops Packet** (management → Grok Build)

```text
Repo: NestCalc
Station: Cut
Mode: Worker
Operator: Grok Build
Branch: docs/employee-manual-mermaid-probe-5
Head: 992a5e8e33b7a84e21e635d9f0f28dcb88b9d0ab
job_id: NGJ-20260823-102
flow_id: —
goal_sha256: —
Trace: NestCalc #102; Checkout 25b4cb55; Cut
Model: Grok 4.6
Effort: low
Session: continued

Instruction:
Done when: docs/audits/employee-manual-mermaid-probe-5.md written with exactly one Mermaid flowchart fence and one short legend outside the fence; Seq 2 Cut stamped with commit SHA on @docs/travelers/102.md; Operator return under Seq 2 in @docs/travelers/102-packets.md; Still open / Next = Send for review; Send for review not started; pushed Allowed Files only.
When chart → read only AGENTS.md, docs/GLOSSARY.md, docs/WORKFLOW.md, and docs/templates/. Reconstruct the employee-manual flow without improving the law. If two files disagree, draw both and label the collision.
When traveler → @docs/travelers/102.md Seq 2 only; Stamp = chart commit SHA (not a calendar date).
When log → @docs/travelers/102-packets.md Seq 2 only.
This Station only. Mode Worker: do not spawn subagents; do not open plan mode; do not load files outside named paths.
Allowed write: docs/audits/employee-manual-mermaid-probe-5.md, docs/travelers/102.md, docs/travelers/102-packets.md.
No AGENTS/WORKFLOW/GLOSSARY/GOAL/product edits. No mark ready. No merge.

Reason:
Checkout bound. Cut is the reconstruct Station for probe-5 (pair to #101 high).

Return (this Station only):
Repo:
Station:
Mode:
Operator:
Branch:
Head:
job_id:
flow_id:
goal_sha256:
Stamp:
Facts:
```

**Operator return**

```text
Repo: NestCalc
Station: Cut
Mode: Worker
Operator: Grok Build
Branch: docs/employee-manual-mermaid-probe-5
Head: 682ea4770a0c4678ae70b3189e031d5b88788ef7
job_id: NGJ-20260823-102
flow_id: —
goal_sha256: —
Stamp: 682ea4770a0c4678ae70b3189e031d5b88788ef7
Facts: Wrote docs/audits/employee-manual-mermaid-probe-5.md with one Mermaid flowchart fence and one legend. Reconstruct from AGENTS.md, GLOSSARY, WORKFLOW, templates only. Collisions A–D labeled (wrong-branch ladder; Authority vs Law; traveler.md vs Ops Packet; packslip Plan/Bind vs stamp table). Seq 2 Cut stamped 682ea4770a0c4678ae70b3189e031d5b88788ef7. Still open / Next = Send for review. Send for review not started. Allowed Files only. No AGENTS/WORKFLOW/GLOSSARY/GOAL/product edits. No mark ready. No merge.
```

### Seq 3 — Send for review

**Ops Packet** (management → Grok Build)

```text
Repo: NestCalc
Station: Send for review
Mode: Worker
Operator: Grok Build
Branch: docs/employee-manual-mermaid-probe-5
Head: bc9e192938056f8949b30ce5bbe75ef4bf0d2dbd
job_id: NGJ-20260823-102
flow_id: —
goal_sha256: —
Trace: NestCalc #102; Cut 682ea47; Send for review
Model: Grok 4.6
Effort: low
Session: continued

Instruction:
Done when: PR 102 is marked ready for review (not draft); named Codex review requested via comment `@codex review`; Seq 3 Send for review stamped with commit SHA on @docs/travelers/102.md; Operator return under Seq 3 in @docs/travelers/102-packets.md; Still open / Next = Wait; Wait not started; pushed Allowed Files only.
When ready → mark PR 102 ready for review.
When named review → post `@codex review` on PR 102.
When traveler → @docs/travelers/102.md Seq 3 only; Stamp = commit SHA.
When log → @docs/travelers/102-packets.md Seq 3 only.
This Station only. Mode Worker: do not spawn subagents; do not open plan mode.
This Surface cannot run agents-pr-review; management posts the companion review if used.
Allowed write: docs/travelers/102.md, docs/travelers/102-packets.md.
No chart rewrite. No AGENTS/WORKFLOW/GLOSSARY/GOAL/product edits. No Inspection. No merge.

Reason:
Cut chart is on the branch. Send for review opens named QC.

Return (this Station only):
Repo:
Station:
Mode:
Operator:
Branch:
Head:
job_id:
flow_id:
goal_sha256:
Stamp:
Facts:
```

**Operator return**

```text
Repo: NestCalc
Station: Send for review
Mode: Worker
Operator: Grok Build
Branch: docs/employee-manual-mermaid-probe-5
Head: 48a20afae9eb0565e3147ed1f46ab94ec2905868
job_id: NGJ-20260823-102
flow_id: —
goal_sha256: —
Stamp: 48a20afae9eb0565e3147ed1f46ab94ec2905868
Facts:
- PR 102 marked ready for review (not draft).
- Named review requested: comment `@codex review` on PR 102 (https://github.com/TurboFrogLLC/NestCalc/pull/102#issuecomment-5386439117).
- Companion `agents-pr-review` not posted from this Surface.
- Seq 3 stamped; Still open / Next = Wait; Wait not started.
- Allowed Files only. No chart rewrite. No Inspection. No merge.
```

### Seq 4 — Wait

**Ops Packet** (management → Grok Build)

```text
Repo: NestCalc
Station: Wait
Mode: Worker
Operator: Grok Build
Branch: docs/employee-manual-mermaid-probe-5
Head: ab2424a799e1b7637373341f121cbc4263c196a8
job_id: NGJ-20260823-102
flow_id: —
goal_sha256: —
Trace: NestCalc #102; Send for review ab2424a; Wait
Model: Grok 4.6
Effort: low
Session: continued

Instruction:
Done when: named Codex review receipt recorded; Seq 4 Wait stamped with commit SHA on @docs/travelers/102.md; Operator return under Seq 4 in @docs/travelers/102-packets.md; Still open / Next named from findings; pushed Allowed Files only.
When hold → confirm Codex review on PR 102 (COMMENTED on 48a20afae9). Record open thread counts by severity.
When findings require work → Still open / Next = Corrective Action.
When clean → Still open / Next = Inspection.
When traveler → @docs/travelers/102.md Seq 4 only; Stamp = commit SHA.
When log → @docs/travelers/102-packets.md Seq 4 only.
This Station only. Mode Worker: do not spawn subagents; do not open plan mode.
Do not fix chart or resolve threads on this Station. Allowed write: docs/travelers/102.md, docs/travelers/102-packets.md.
No AGENTS/WORKFLOW/GLOSSARY/GOAL/product edits. No merge.

Reason:
Named review is in. Wait records the hold and routes on findings.

Return (this Station only):
Repo:
Station:
Mode:
Operator:
Branch:
Head:
job_id:
flow_id:
goal_sha256:
Stamp:
Facts:
```

**Operator return**

```text
Repo: NestCalc
Station: Wait
Mode: Worker
Operator: Grok Build
Branch: docs/employee-manual-mermaid-probe-5
Head: 304cc0186ff29db8477f5a06051038e39bd992a2
job_id: NGJ-20260823-102
flow_id: —
goal_sha256: —
Stamp: 304cc0186ff29db8477f5a06051038e39bd992a2
Facts:
- Named Codex review receipt: COMMENTED on 48a20afae9eb0565e3147ed1f46ab94ec2905868 (review https://github.com/TurboFrogLLC/NestCalc/pull/102#pullrequestreview-5002578835).
- Open threads by severity: P0=0, P1=1 (unresolved, outdated), P2=3 (unresolved), P3=0; total open=4. None resolved.
- Findings require work. Still open / Next = Corrective Action. Inspection not started.
- Did not fix chart or resolve threads. Allowed Files only. No merge.
```

### Corrective Action

**Ops Packet** (management → Grok Build)

```text
Repo: NestCalc
Station: Corrective Action
Mode: Specialist
Operator: Grok Build
Branch: docs/employee-manual-mermaid-probe-5
Head: 67ffb341a9c7a495f7c0c39e34374bd404a09d54
job_id: NGJ-20260823-102
flow_id: —
goal_sha256: —
Trace: NestCalc #102; Wait 304cc01; CA for Codex P1+P2
Model: Grok 4.6
Effort: low
Session: continued

Instruction:
Done when: all four open Codex threads addressed; Closed Corrective Action lists the CA commit SHA on @docs/travelers/102.md; Operator return under CA in @docs/travelers/102-packets.md; Still open / Next = Inspection; facts-only replies on each thread; threads resolved on tip; pushed Allowed Files only; Inspection and merge not started.
When P1 (packets transcripts) → restore full Ops Packet + Operator return text for Seq 1 and Seq 2 in @docs/travelers/102-packets.md (no placeholder summary). Optional: add docs/audits/pr102-checkout-session.md and docs/audits/pr102-cut-session.md if session bodies are available; otherwise full packet/return text in the log is enough for this Station.
When P2 chart (wrong-branch) → on @docs/audits/employee-manual-mermaid-probe-5.md add host-fix success path back to BRANCH check; Escalate only when host cannot fix (WORKFLOW wrong-branch ladder).
When P2 chart (failed gates) → separate pass vs failure edges so failed Worker/Specialist/NCMR paths do not advance through STAMP to the next Station.
When P2 chart (EMIT dispatch) → dispatch emitted packet by named next Station; unknown-next terminates at Owner (not restart Freeze).
When chart → keep exactly one Mermaid fence + one legend; reconstruct only; no law improvement.
When traveler → @docs/travelers/102.md; Closed Corrective Action = CA commit SHA; Still open / Next = Inspection.
When log → @docs/travelers/102-packets.md CA row only.
When threads → facts-only reply on each of the four threads; resolve on tip.
This Station only. Mode Specialist: do not spawn subagents; do not open plan mode.
Allowed write: docs/audits/employee-manual-mermaid-probe-5.md, docs/audits/pr102-*-session.md (optional), docs/travelers/102.md, docs/travelers/102-packets.md.
No AGENTS/WORKFLOW/GLOSSARY/GOAL/product edits. No merge.

Reason:
Wait held review with open findings. CA closes P1+P2 before Inspection.

Return (this Station only):
Repo:
Station:
Mode:
Operator:
Branch:
Head:
job_id:
flow_id:
goal_sha256:
Stamp:
Facts:
```

**Operator return**

```text
Repo: NestCalc
Station: Corrective Action
Mode: Specialist
Operator: Grok Build
Branch: docs/employee-manual-mermaid-probe-5
Head: e97009073f6d6fe08763f5d811f9ee0cc60b7faa
job_id: NGJ-20260823-102
flow_id: —
goal_sha256: —
Stamp: e97009073f6d6fe08763f5d811f9ee0cc60b7faa
Facts:
- P1: Seq 1 and Seq 2 full Ops Packet + Operator return restored in docs/travelers/102-packets.md from git history (992a5e8 / bc9e192). Optional session files not added.
- P2 wrong-branch: host-fix success returns to BRANCH; Escalate/CA only when host cannot fix; COLLISION A still labeled.
- P2 failed gates: Worker fail → Escalate; Specialist fail → CA stay; law broke → NCMR stop; those paths do not enter STAMP.
- P2 EMIT: named next Station dispatch; unknown-next → Owner; EMIT no longer feeds SPINE/Freeze.
- One Mermaid fence + one legend. Closed Corrective Action e97009073f6d6fe08763f5d811f9ee0cc60b7faa. Still open / Next = Inspection. Inspection and merge not started.
```
