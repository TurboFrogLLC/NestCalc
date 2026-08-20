# Packslip

Job-end receipt. Mandatory. Not an Instruction. First word is never `/goal`.
No Model. No Waypoint line.
Stamp is the retrieve handle. Returns to Owner.

Emit when the job stops. Any B. PR or no PR. Merge or no merge.
Print this block in the CLI. That print is the only closeout.
Job number = PR when a PR exists. No PR: `PR: —` and the handle is `flow_id`
or branch. If a PR exists, post this same block on that PR.

B8 when named: packslip → merge → stamp B8 and B9 on this slip → print → post.
Skip B8/B9 rows that did not run.

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

Seq  Label     Operator     Stamp                 CA taken              Still open
B1   Plan
B2   Freeze
B3   Bind
B4   Traveler
B5   Cut
B6   QC
B7   Ready
B8   Merge
B9   Close

Closed CA:
Still open: none | NC …
Next: none | NC-…

Corrective Action: None | closed list only
```

Stamp is a commit SHA. Skip a row that did not run. A Correction is a new row.
B1–B4 are history labels only.
