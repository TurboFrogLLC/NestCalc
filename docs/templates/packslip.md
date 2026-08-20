# Packslip

Job-end receipt. That is when the job is done.
Not an Instruction. Not a Non-conformance Report.
First word is never `/goal`. No Model. No Waypoint line.
Stamp is the retrieve handle. Returns to Owner.

Emit when this traveler's job ends. Merge or no merge.
Print this block in the CLI. That print is the only closeout.
Job number = PR when a PR exists. No PR: `PR: —` and the handle is `flow_id`
or branch. If a PR exists, post this same block on that PR.

Do not emit this form because an operation finished.
Do not emit this form for a Non-conformance.

Release when named: Merge, then Close on this slip, then print, then post.
Skip rows that did not run.

```text
Repo: NestCalc
Owner: wReckless
PR:
Branch:
Head:
flow_id:
goal_sha256:
Trace:
Cycle: Full | Lite
Date:

Seq  Label              Operator     Stamp                 Spot Check           Still open
     Plan
     Freeze
     Bind
     Cut
     Send for review
     Wait
     Inspection
     Merge
     Close

Closed Corrective Action:
Still open: none | Non-conformance …
Next: none

Spot Check: None | closed list only
```

Stamp is a commit SHA. Skip a row that did not run. A Corrective Action is a new row.
The same operation may appear more than once.
