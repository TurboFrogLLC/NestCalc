# Glossary

NestCalc terms. Read with `AGENTS.md`.
One living name. Floor uses full words.

Only wReckless is Owner. No other role may act as Owner.
Owner may sit any other seat. Those labels bound everyone else.

| Term | Is | Avoid |
| --- | --- | --- |
| Owner | wReckless only. May sit any other seat. Hard gates. | Human. Surface. Operator. |
| Operations Manager | SuperGrok. Orchestrator. | Operator. Owner. Surface. |
| Operator | Codex App, Codex CLI, or Grok Build. Parent AI on the traveler. | Surface. Station. Owner. SuperGrok. a tool. |
| Operation | Any action on the traveler. May appear more than once. | Operator. Surface. Station. |
| Station | Isolation unit. Bound by this Ops Packet. Operator sits it. Fresh thread + one Mode + one tool envelope. | Role. Operator. Surface. Owner. |
| Mode | Worker or Specialist. Bound to this Station. | Role. Operator. |
| Worker | A→B only. Named Instruction. No specialist toolbox. | Specialist. |
| Specialist | Outcomes + named always-available tools. Still stamps. | Worker. |
| Escalate | This Station cannot finish the named Instruction. Hand up. | Non-conformance. Corrective Action. |
| Stamp | Label and retrieve handle (commit SHA, `NCMR-`). | A person. An Operator. A command to run. |
| Tool | A skill the Operator calls. the-Feeler. `/goal`. Has a parent. | Operator. Machine. |
| Machine | A repo script that stamps or checks. | Tool. Operator. |
| Ops Packet | Current Station only. Binds this Station. Issued to the Operator. | Traveler. Master. |
| Traveler | The job. One per PR. Lives on the draft PR. | Ops Packet. Packet. Packslip. |
| Packslip | Job-end receipt. That is when the job is done. | Traveler. Non-conformance Report. |
| Spot Check | Specialist tool. Named when Mode is Specialist. | Quality Control. Band. |
| Corrective Action | Find a way with known tools. Stay on this operation. Specialist ladder. | A rewrite of the traveler. Worker. Escalate. |
| Non-conformance | Break in the law. Write the Non-conformance Report. | Escalate. Stuck. |
| Non-conformance Report | Facts only. Disposition blank. | Packslip. |
| Quality Control | Send for review, Wait, Inspection. Draft until this band. | Release. |
| Send for review | Mark the PR ready. Named review. | |
| Wait | Hold for that review. | |
| Inspection | Look at what came back. | |
| Release | Merge, then Close. | Quality Control. |
| Merge | Onto `main`. Default unless this traveler forbids it. | |
| Close | Cleanup after Merge. | |
| Law | `AGENTS.md` + `docs/WORKFLOW.md` | |
| Sidecar | `create-handoff` JSON only. | Traveler. |
| Product | FLiPIT | HowMany as the product name. |
| Primary clone | `/Users/computer/wrecklesstoddler/vibe/projects/nestcalc` | |

`NCMR-` is the Non-conformance Report stamp.

Do not invent the next operation. Do not rewrite the traveler.
Do not emit a packslip because an operation finished.
