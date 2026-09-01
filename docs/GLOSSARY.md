# Glossary

NestCalc terms. Read with `AGENTS.md`.
One living name. Floor uses full words.

Only wReckless is Owner. No other role may act as Owner.
Owner may sit any other seat. Those labels bound everyone else.

| Term | Is | Avoid |
| --- | --- | --- |
| Owner | wReckless only. May sit any other seat. Hard gates. | Human. Surface. Operator. |
| Operations Manager | SuperGrok. Orchestrator. | Operator. Owner. Surface. |
| Operator | Codex App, Codex CLI, or Grok Build. Parent AI on the packet. | Surface. Owner. SuperGrok. a tool. |
| Operation | The Seq Label. May appear more than once. | Operator. Surface. Department. Station. |
| Mode | Worker or Specialist. Toolbox size for this packet. | Role. Operator. |
| Worker | A→B only. Named Instruction. No specialist toolbox. | Specialist. |
| Specialist | Outcomes + named always-available tools. Still stamps. | Worker. |
| Escalate | This visit cannot finish the named Instruction. Hand up. | Non-conformance. Corrective Action. |
| Stamp | Retrieve handle (commit SHA, `NCMR-`). | A person. A verdict sentence. |
| Tool | A skill the Operator calls. the-Feeler. `/goal`. Has a parent. | Operator. Machine. |
| agents-pr-review | Named-review companion on Send for review, with `@codex review`. | Wait. |
| Machine | A repo script that stamps or checks. | Tool. Operator. |
| Part | What this job produces. | Branch. Description. |
| Description | Short planning English. Not the Branch name. | Trace. Cycle. |
| Notes | Short callout on this Seq row. | Instruction. |
| Session | `fresh` or `continuous` on the packet. Owner names it. Job sheet Session is the job default. | A CLI flag. |
| job_id | `NGJ-` handle for a non-goal job. | flow_id. |
| Ops Packet | Current visit only. Blueprint. Issued to the Operator. | Traveler. Packslip. |
| Traveler | The job. Header + routing. Plan creates it. Lives on the draft PR. | Ops Packet. Packslip. |
| Packslip | That traveler after Close. Job-end receipt. | Traveler. Non-conformance Report. |
| Spot Check | Specialist tool. Named when Mode is Specialist. | Quality Control. Seq Label. |
| Corrective Action | Find a way with known tools. Stay on this visit. Specialist ladder. | Next Plan. Worker. Escalate. |
| Plan | Open the job, and midstream spitball before the next Cut. Management. Repeats. | Corrective Action. |
| Non-conformance | Break in the law. Write the Non-conformance Report. | Escalate. Insufficient blueprint. |
| Non-conformance Report | Facts only. Disposition blank. | Packslip. |
| Quality Control | Send for review, then Inspection when that visit is planned. Draft until this band. | Release. |
| Send for review | Mark the PR ready. Named review: `@codex review` and `agents-pr-review` (companion). Listen on that thread. | Wait. |
| Inspection | Read what came back. Disposition only. | Send for review. |
| Release | Merge, then Close. | Quality Control. |
| Merge | Onto `main`. Default unless this traveler forbids it. | |
| Close | Cleanup after Merge. | |
| Start-branch | Host visit: limited fetch of origin/main + create or switch to the named feature Branch. Do not leave the worktree on main. Mid-job main thrash prohibited. | Checkout-sync. |
| Law | `AGENTS.md` + `docs/WORKFLOW.md` | |
| Sidecar | `create-handoff` JSON only. | Traveler. |
| Product | FLiPIT | HowMany as the product name. |
| Primary clone | `/Users/computer/wrecklesstoddler/vibe/projects/nestcalc` | |

Isolation is Mode + one packet + Session.
A finished visit that is not the desired Part is next Plan + new Cut. The blueprint was short. Not operator error.

`NCMR-` is the Non-conformance Report stamp.

Do not invent the next operation. Do not rewrite the traveler.
Do not emit a packslip because an operation finished.
