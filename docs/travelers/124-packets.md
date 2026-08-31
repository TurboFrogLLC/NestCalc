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

### CA A — P3 embedded look-fit contract

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Corrective-action commit: 6ae088983e11e53a87ae5b8f5917716bb10748e0 (pushed to origin/feat/v3-ticker-picker-words).
Updated the COMPOSITION-FLIPIT-v3.html embedded contract and the living SPEC verification contract to match the Cut A runtime: hits/inputs 28; pad T/B 6 and L/R 8; item gap 2; hit/input/shell radius 8; outer 42.2; picker words only; right edges flush.
Validation: git diff --check passed before commit; post-push contract readback matched the named tokens.
Resolved P3 review thread PRRT_kwDOTJAVIM6dxMK_ (review 5067991802).
Seq 5 re-stamped Clean against CA A.
Still open: Cut B.
Next: Cut B in a fresh session; not started here.
```

### Seq 6 — Cut B Camera

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Branch: feat/v3-ticker-picker-words
Host commit: 376161fee67ea3350eb0688660399ce7b4b8a7f4
Origin host SHA: 376161fee67ea3350eb0688660399ce7b4b8a7f4
Cut B complete: default view and Fit now center the blank with 2in air on every side. Canvas drags no longer pan the bed; blank resize preserves the current camera; wheel zoom remains available.
Updated the HTML host and living SPEC only. The picker, HUD, and preset door were not changed.
Validation: git diff --check passed before commit. Pushed: origin/feat/v3-ticker-picker-words at 376161f.
Seq 6 stamped against the origin host SHA.
Still open: Send B.
Next: Send B.
```

### Seq 7 — Send B

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Posted @codex review on PR #124: https://github.com/TurboFrogLLC/NestCalc/pull/124#issuecomment-5480809592
PR remains draft. No HTML host edit was made during Send B.
Seq 7 stamped.
Still open: Wait B.
Next: Wait B.
```

### Seq 8 — Wait B

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
gh authenticated as TurboFrogLLC.
Short-read PR #124: the Cut B @codex review request is present. Codex Review Summary is Running for commit 9199f9f; the reviews list has only the earlier COMMENTED Cut A review on 5c9da83. There is no Cut B conclusion, OM SIGNAL, or +1.
Wait fact: no-review-yet (review running). No poll loop started.
Seq 8 stamped.
Still open: Inspection B.
Next: Inspection B after a posted Cut B review conclusion or Owner direction.
```

### Seq 9 — Inspection B (Dirty)

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Inspection evidence after Cut B: the short-read found no Owner note, SuperGrok note, or Codex review conclusion for the Cut B request. The only concluded Codex review is the earlier COMMENTED Cut A review on 5c9da83; the Cut B review is still running.
Inspection B: Dirty — no Cut B review conclusion is available for clearance.
Escalated in Worker Mode. No corrective action was invented; Cut C was not started; no merge, ready mark, packslip, or main change was made.
Seq 9 stamped against the review-wait SHA 5b0954a.
```

### CA B — P3 SPEC verify step 2

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Corrective-action commit: d80c1de7131beb50724d35b78abd8837a648b6cb (pushed to origin/feat/v3-ticker-picker-words).
Updated SPEC verification step 2 to require the centered 12×8 blank with 2in air, not the stale 48×48 bed-fit. The host runtime was read back first and already implements that contract, so no camera runtime change was made.
Resolved P3 review thread PRRT_kwDOTJAVIM6dyRnd.
Seq 9 re-stamped Clean against CA B.
Still open: Cut C.
Next: Cut C in a fresh session; not started here.
```

### Seq 10 — Cut C Preset door

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Branch: feat/v3-ticker-picker-words
Host commit: 31a2baeb4a5596ccbfa68fb34d02387c9e15ecb3
Origin host SHA: 31a2baeb4a5596ccbfa68fb34d02387c9e15ecb3
Cut C complete: the existing HUD shell now swaps to a Bed Presets face with Blank, Gap, and Margin rows; each has slots 1–5 and +. The numeric pad is absent on that face; there is no Part row or material tree. Selecting a slot opens its in-panel fields, and typing saves that slot without changing the bed. Send to bed hydrates the lit Blank, Gap, or Margin slot onto the live ticker and bed whether the picker is open or shut. A ticker Presets send saves its draft into the first empty or already lit slot and opens that face; the travel calc opens Blank presets when no field is being edited.
Updated the HTML host and living SPEC only. Cut A and Cut B were not reopened.
Validation: git diff --check passed; all 5 inline scripts compiled with Node; browser smoke test passed calculator → Blank presets, Gap slot 1 → type X 0.625 → Send to bed, with the live Gap ticker reading 0.625 × 0.125. Local static-server console misses for /howmany-shell and favicon were expected and unrelated.
Pushed: origin/feat/v3-ticker-picker-words at 31a2bae.
Seq 10 stamped against the origin host SHA.
Still open: Send C.
Next: Send C.
```

### Seq 11 — Send C

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Posted @codex review on PR #124: https://github.com/TurboFrogLLC/NestCalc/pull/124#issuecomment-5481137641
No PR readiness state was changed. No HTML host edit was made during Send C.
Seq 11 stamped.
Still open: Wait C.
Next: Wait C.
```

### Seq 12 — Wait C

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
gh authenticated as TurboFrogLLC.
Short-read PR #124 after the Cut C request: the request is present at issuecomment-5481137641 and has an eyes reaction. Codex Review Summary is Running for commit 5e2d76a; reviews list contains only the earlier COMMENTED Cut A and Cut B conclusions. There is no Cut C conclusion, OM SIGNAL, or +1.
Wait fact: no-review-yet (review running). No poll loop started.
Seq 12 stamped.
Still open: Inspection C.
Next: Inspection C after a posted Cut C review conclusion or Owner direction.
```

### Seq 13 — Inspection C (Dirty)

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Inspection evidence after Cut C: the post-request short-read found no Owner note, SuperGrok note, Codex review conclusion, OM SIGNAL, or +1 for Cut C. The only concluded Codex reviews remain the earlier COMMENTED Cut A and Cut B reviews; the Cut C request is still running.
Inspection C: Dirty — no Cut C review conclusion is available for clearance.
Escalated in Worker Mode. No corrective action was invented; no merge, ready mark, packslip, main change, or production deployment was made.
Seq 13 stamped against the review-wait SHA 08479c7.
Still open: Inspection C (escalated).
Next: Owner direction or a posted Cut C review conclusion, then Inspection C again.
```

### CA C — P2 preset corrective action

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Corrective-action commit: 5df6bde9656ff41302d24f73034798e4a3bfd3d3 (pushed to origin/feat/v3-ticker-picker-words).
CA-1: opening Bed Presets from a ticker draft immediately writes the seed to the selected slots 1–5 slot, so Close retains it.
CA-2: a ticker seed selects the first empty row slot unless the user explicitly lit a slot during that open Bed Presets visit.
CA-3: Send to bed hydrates the live ticker and exits a matching open ticker draft, preventing stale OK from restoring old values.
CA-4: removed the visible legacy A/B chips and their separate write state; howmany.flipit.v3.presets now uses only the Blank/Gap/Margin slots 1–5 schema.
Validation: git diff --check passed; all 5 inline scripts compiled with Node; browser proof seeded Gap X 0.777, then Send to bed hydrated the live ticker to 0.777 × 0.125 and exited ticker edit. Static-server /howmany-shell and favicon console misses were expected and unrelated.
Resolved P2 review threads: PRRT_kwDOTJAVIM6dy2Nu, PRRT_kwDOTJAVIM6dy2Ny, PRRT_kwDOTJAVIM6dy2N2, PRRT_kwDOTJAVIM6dy2N5.
Seq 13 re-stamped Clean against CA C.
Still open: Merge.
Next: Merge (Owner-named after look).
```

### Seq 14 — Cut D Decimals

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Branch: feat/v3-ticker-picker-words
Host commit: 92a5e9403b266d109cc49fb239145d2564334452
Origin host SHA: 92a5e9403b266d109cc49fb239145d2564334452
Cut D complete: bed ticker and Bed Presets face inputs now reuse the existing HUD edit-popover sanitizer, capping typed fractional values at 3 decimal places without a second formatter.
Validation: git diff --check passed; all 5 inline scripts compiled with Node; browser proof entered 12.34567 in both the bed ticker and Bed Presets face, each rendering 12.345. Local static-server console misses for /howmany-shell and favicon were expected and unrelated.
Pushed: origin/feat/v3-ticker-picker-words at 92a5e94.
Seq 14 stamped against the origin host SHA.
Still open: Send D.
Next: Send D.
```

### Seq 15 — Send D

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Posted @codex review on PR #124: https://github.com/TurboFrogLLC/NestCalc/pull/124#issuecomment-5481561062
No PR readiness state was changed. No HTML host edit was made during Send D.
Seq 15 stamped.
Still open: Wait D.
Next: Wait D.
```

### Seq 16 — Wait D

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
gh authenticated as TurboFrogLLC.
Short-read PR #124 after the Cut D request: the request is present at issuecomment-5481561062 and has an eyes reaction. Codex Review Summary is Running for commit 62b108f; reviews list contains only the earlier COMMENTED Cut A, Cut B, and Cut C conclusions. There is no Cut D conclusion, OM SIGNAL, or +1.
Wait fact: no-review-yet (review running). No poll loop started.
Seq 16 stamped.
Still open: Inspection D.
Next: Inspection D.
```

### Seq 17 — Inspection D (Dirty)

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Inspection evidence after Cut D: the post-request short-read found no Owner note, SuperGrok note, Codex review conclusion, OM SIGNAL, or +1 for Cut D. The Codex Review Summary remains Running for commit 62b108f; the only submitted Codex reviews and inline threads are from the earlier Cut A, Cut B, and Cut C requests.
Inspection D: Dirty — no Cut D review conclusion is available for clearance.
Escalated in Worker Mode. No corrective action was invented; no merge, ready mark, packslip, main change, or production deployment was made.
Seq 17 stamped against the inspection-read SHA d59faef.
Still open: Inspection D (escalated).
Next: Owner direction or a posted Cut D review conclusion, then Inspection D again.
```

### CA D — P2 ticker / door corrective action

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Corrective-action commit: 0436708f9d96618373c64be956bd15eea8a8ba47 (pushed to origin/feat/v3-ticker-picker-words).
CA-1: clearing a Bed ticker or Bed Presets face field visibly blocks its Send action, focuses the cleared field, and prevents a hidden prior draft from being applied. The existing HUD sanitizeNumericLive path remains the 3-decimal cap.
CA-2: selecting a Bed Presets row schedules the existing sizePresetDoor() after render, keeping Margin L/R/B/T and Send to bed accessible.
Validation: git diff --check passed; all 5 inline scripts compiled with Node; browser proof confirmed each cleared-field Send leaves its field focused and invalid, and switching to Margin shows L/R/B/T plus Send to bed. Static-server /howmany-shell and favicon console misses were expected and unrelated.
Resolved P2 review threads: PRRT_kwDOTJAVIM6dzd_a, PRRT_kwDOTJAVIM6dzd_f.
Seq 17 re-stamped Clean against CA D.
Still open: Merge.
Next: Merge (Owner-named after look).
```

### Seq 18 — Cut E HUD clamp

**Operator return**

```text
job_id: NGJ-20260831-ticker-picker-words
Branch: feat/v3-ticker-picker-words
Host commit: 5a2fa2ce801f968cd6b21f8c9915f45cd8755285
Origin host SHA: 5a2fa2ce801f968cd6b21f8c9915f45cd8755285
Cut E complete: opening calculator or Bed Presets now clamps #hud into the visible webview. On phone with FLiPIT closed, HUD remains unscaled, moves away from the leftover 25,25 placement, and layers above the ticker. The 75% HUD scale applies only while FLiPIT is open.
Validation: git diff --check passed; all 5 inline scripts compiled with Node; 390 × 844 browser proof opened Bed Presets and measured HUD left 0, top 16, right 390, bottom 337.484, visible true, unscaled true, and aboveTickerLayer true. Existing local /howmany-shell console miss remained unrelated.
Pushed: origin/feat/v3-ticker-picker-words at 5a2fa2c.
Seq 18 stamped against the origin host SHA.
Still open: Send E.
Next: Send E.
```
