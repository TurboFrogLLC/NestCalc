# 124 packets

job_id: NGJ-20260831-ticker-picker-words
Branch: feat/v3-ticker-picker-words
Base: feat/v3-ticker-door (#121)
Operator: Codex App
Owner: remote

## 2026-08-31 open

Draft PR #124. One traveler. Three grouped Cuts. No Merge until C.

## Cuts pinned

A Chrome — words, right-align, pad 6, gap 2, radius 8 shell+hit+input.
B Camera — blank-fit, air to grow, static bed, no live re-fit.
C Preset door — HUD shell stays, pad gone, two-way slots, Send-to-bed.

## Send / Wait (official)

Every Send comments `@codex review` on #124.
GitHub review is comment-driven: https://developers.openai.com/codex/integrations/github
App review pane can read PR comments when `gh` is authenticated: https://developers.openai.com/codex/app/review
No official App poll-until-review API. Wait short-reads via `gh` when present; otherwise stamp and stop for OM SIGNAL / +1 / posted review.

### Seq 1 — Start-branch

**Ops Packet**

```text
Repo: NestCalc
Station: Start-branch
Mode: Worker
Operator: Codex App
Branch: feat/v3-ticker-picker-words
Head: 67bbd0fbc1787b672253f2ce3d5edd32a9ee92d2
flow_id: —
goal_sha256: —
Trace: docs/howmany-v3-components/TICKER-TWO-BOX-JOB.md
Model: GPT-5.6 Luna
Effort: low
job_id: NGJ-20260831-ticker-picker-words

Instruction: Fetch origin, check out the named feature branch, fast-forward only from origin/feat/v3-ticker-picker-words, confirm the branch is not main, and confirm HEAD equals origin/feat/v3-ticker-picker-words. Do not pull main or reset. Leave AGENTS.md unstaged if dirty. Stamp Seq 1 on docs/travelers/124.md and append this packet. Do not start Cut A.

Reason: Owner is remote. Origin already has the feature.
```

**Operator return**

```text
Branch confirmed: feat/v3-ticker-picker-words
HEAD confirmed: 67bbd0fbc1787b672253f2ce3d5edd32a9ee92d2
HEAD matches origin/feat/v3-ticker-picker-words.
Branch is not main.
Seq 1 Start-branch stamped with 67bbd0f.
Still open: Cut A.
Next: Cut A.
No main pull, reset, or product edits performed. AGENTS.md remains unstaged and dirty as found.
```

### Seq 2 — Cut A Chrome

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Branch: feat/v3-ticker-picker-words
Host commit: 69df97e2f9a16283c1beb41c945a3b5534f953d8
Origin host SHA: 69df97e2f9a16283c1beb41c945a3b5534f953d8
Cut A complete: picker chips are words only; travel and picker right edges are flush; pad T/B is 6; item gap is 2; hit, input, and shell radius are 8; outer boxes are 42.2.
Updated host and living spec only. Camera and preset door were not changed.
Validation: git diff --check passed before commit.
Pushed: origin/feat/v3-ticker-picker-words at 69df97e.
Seq 2 stamped against the origin host SHA.
Still open: Send A.
Next: Send A.
```

### Seq 3 — Send A

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Posted @codex review on PR #124: https://github.com/TurboFrogLLC/NestCalc/pull/124#issuecomment-5480171380
PR remains draft. No HTML host edit was made during Send A.
Seq 3 stamped.
Still open: Wait A.
Next: Wait A.
```

### Seq 4 — Wait A

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
gh authenticated as TurboFrogLLC.
Short-read PR #124 at 2026-08-31T14:58Z: Codex Review Summary is Running for commit 5c9da83; GitHub reviews list is empty and there is no conclusion, OM SIGNAL, or +1.
Wait fact: no-review-yet (review running). No poll loop started.
Seq 4 stamped.
Still open: Inspection A.
Next: Inspection A after a posted review conclusion or Owner direction.
```

### Seq 5 — Inspection A (Dirty)

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Codex review conclusion: COMMENTED on reviewed commit 5c9da83b20.
P3 thread PRRT_kwDOTJAVIM6dxMK_ is unresolved: the host header still advertises the obsolete look-fit tokens (pad 3/8, radius 10, outer 36.2, picker icons) despite the Cut A runtime and living SPEC contract.
Inspection A: Dirty. Seq 5 stamped against the COMMENTED conclusion.
Owner-named corrective action: CA A, P3 embedded look-fit contract.
Still open: CA A.
Next: CA A.
```
