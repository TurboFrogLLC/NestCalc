# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT refine — Fit top + preset card
Description: Fit parks blank top at the HUD stop. Preset card restore from 78391d0, then surgical adds. No picker. No calc. No bed. Q2 HUD-to-blank X is out.
PR: 134
Branch: docs/flipit-refine
Head: 3b7971426d96377b790742bb622c4ed3e7e5f918
Session: fresh
job_id: NGJ-20260902-flipit-refine
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               Fit top-align; preset card lock
2    Start-branch       Owner remote / Codex App
3    Cut                1 Fit blank top at HUD stop            768b7381e24ee68ba05ab0370ec32c1df6cdb1e0
3b   Cut                1b Fit shares clamp stage stop         eece6b896849b92cff6b29d1698c7578e11fb0e0
3c   Cut                1c Re-park after blank size changes    41b6a91b4b0f7f74fcd290c0cc514f76f91a3b27
4    Look               Owner. No Codex.
5    Cut                2 VOID rewrite                         cbf37f0d7524adfb5ac317b9160b8cfd9067ff44
5b   Cut                2b VOID patch on rewrite               99b5a8d993230387a827b5e46ea4d4b1aa306ada
5c   Cut                2c restore card from 78391d0          16f7c066d7bf1eb560fac778d38978a559a1dd6c
6    Look               Owner. No Codex.
5d   Cut                2d modal pair — presets left, card right         2224b4af8a28310edcfdae9418e995f19c61d813
5e   Cut                2e card header, blur, selected minus  a7e1c120787f7fa1dbaa76316a703dda8d14948b
5f   Cut                2f header type, placeholder, alert-dialog 9b91cb0f07fa72f4b2243e3bf44232fe1633043e
5g   Cut                2g card hits, dirty alert, arc clear  e23750382c475c70bfe8958b99a5dacceec43935
5h   Cut                2h HUD seats, Part row, disable, gaps 89789e1f31c213e114c0e57c320e5fdaeee49fa5
7    Send for review
8    Inspection
9    Merge
10   Close

When a term → docs/GLOSSARY.md
When this visit → docs/templates/packet.md
When the job sheet → docs/travelers/flipit-refine.md
When this packets log → docs/travelers/flipit-refine-packets.md
When the host → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html
When the living contract → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.SPEC.md
When the blueprint → docs/howmany-v3-components/TICKER-PICKER-BLUEPRINT.md
When the shop table → SuperBrain nerveCenter/control-surface/OPERATOR-PIN.md
When restore source → host at 78391d095a416cfe156dc79d8533e042e182a603
When delete alert look → https://ui.shadcn.com/docs/components/base/alert-dialog

Shop: Codex App, Terra, Medium
Proof: Owner local host. Do not restore picker, calculator, chevron, old popover, or bed.
Do not change AutoNest math. Do not center the HUD on the blank.

## Cut lock

### Cut 1 — Fit top-align
`#lb-fit` / `fitBed()` parks the blank top at HEADER 64 + 15 + HUD 31.46 + 15.
Blank origin stays bottom-left of the blank. Extra height hangs below.
Pan and zoom stay. 15px bottom and 25px side insets stay.
Window is not a bed. Do not pin Fit to window bottom.

### Cut 2 — void
Do not implement. `cbf37f0` rewrote the sheet and card. Dead.

### Cut 2b — void
Do not implement. `99b5a8d` patched that rewrite. Dead.

### Cut 2c — restore card from 78391d0
Source of truth: host at `78391d095a416cfe156dc79d8533e042e182a603`

### Cut 2d — modal pair
Pencil opens a modal. Live `.margin-presets` + 15px + card. Group 421.4px centered.

### Cut 2e — card header, blur, selected minus
Blur 4px. Header Presets + Check/X. Minus deletes armed slot only.

### Cut 2f — header type, placeholder, alert-dialog
Delete confirm is z-index 220 alert-dialog. Look: https://ui.shadcn.com/docs/components/base/alert-dialog

### Cut 2g — card hits, dirty alert, arc clear
Select-all on card fields. Accessibility 28 / 18 / 2. Delete alert 280px / 12px. HUD-bottom → blank-top +8px.

### Cut 2h — HUD seats, Part row, disable, gaps
Closed HUD size pair is two tabular 6ch seats from boot, measured as `00.000 × 00.000` in 13.31px / 650 / mono. Count well stays the measured 999 face + 5px inset per side. Lock `#blank-ticker-pin` width after that measure, once. Digit count cannot change pin width. Open and close reuse that grid. Pointerdown on a size number opens the editor and select-alls that field in the same click.

Card sections top to bottom: PART SIZE, BLANK, GAP, MARGIN.
PART SIZE uses the same 106.8 × 31.46 pair, 6px radius, 8.8px field gap, 11px / 650 / 0.04em / uppercase label.
Default Part `2.500 × 3.500`.

Label-to-fields gap is 4px. Section-to-section gap is 6px.

Accessibility off disables that row: inputs `disabled`, opacity 0.45, no write, no hydrate. Live canvas keeps those values. On `#111111`. Off `#538BEC`.

Empty name placeholder is `Name preset`. Do not write the word Preset into an empty field.
No paint-bucket. Do not change AutoNest math.
