# Mermaid probe B — NestCalc cycle (Codex CLI)

job_id: `NGJ-20260824-mp-b`
Operator under test: Codex CLI
Model pin: GPT-5.6 Terra / medium
Cycle: Lite
Not product law. Docs-only probe.

## Purpose

Same shape as Probe A (`NGJ-20260824-mp-a`). One mermaid flowchart of the NestCalc lite cycle using **current** law:

- Start-branch (host) at job start
- Cut → Send for review → Wait → Inspection → Merge → Close
- Close retains feature branch unless traveler names prune
- Mid-job main thrash prohibited

## Diagram

```mermaid
flowchart LR
  start[Start-branch\nhost at job start] --> cut[Cut]
  cut --> review[Send for review\nmark PR ready]
  review --> wait[Wait\nhold for Operations Manager / SuperGrok signal]
  wait --> inspection[Inspection]
  inspection --> merge[Merge\nonto main]
  merge --> close[Close\nsync main]
  close --> retain[Retain feature branch\nunless traveler names prune]
```
