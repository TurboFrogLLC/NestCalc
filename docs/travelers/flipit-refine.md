# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT refine — Fit top + preset card
Description: Fit parks blank top at the HUD stop. Preset card restore from 78391d0, then surgical adds. No picker. No calc. No bed. Q2 HUD-to-blank X is out.
PR: 134
Branch: docs/flipit-refine
Head: d412b6ddbaf69a9b768ce0ff3115c47174eb884a
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
5e   Cut                2e card header, blur, selected minus
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
for `.margin-presets`, `.margin-presets-head`, `.margin-presets-grid`,
`#margin-preset-card-layer`, `.margin-preset-card`, and the JS that opens and closes that card only.

Sheet row: PRESETS | pencil | plus | minus.
Pencil paths only:
`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`
`m15 5 4 4`
Hits 22 / glyphs 16 / stroke 2 / viewBox 24.

Slots: 154px row, two frost-blue chips, 31.46 high, 7.26 radius, 1.1px stroke, 13.31px / 650 / mono.

Card layer: `position: fixed; inset: 0; z-index: 201; place-items: center`.
Card: 252.4px wide, `#E8E8E8`, 7.26px radius, 15px pad, shadow `0 0.5px 1px rgba(0,0,0,.25)`.
Inner width 222.4. Name field 222.4 × 31.46. Sections Blank, Gap, Margin only.
Axis fields 106.8 × 31.46, 8.8px gap. Check/X 22 / 14 / 2 in the footer.
No Copy live. No Part row. No paint-bucket. No accessibility.

Do not change Fit park, count well, AutoNest math, PART SIZE, GAP, or MARGIN chips.

### Cut 2d — modal pair
Pencil opens a modal. Backdrop is `backdrop-filter: blur(8px)` plus `rgba(17,17,17,0.28)`. Header, HUD, blank, PART SIZE, GAP, and MARGIN stay in that blur. They are not clickable.

One focused row, vertically centered:
`.margin-presets` (154px) + 15px gap + `.margin-preset-card` (252.4px).
Group width 421.4px. Group is centered in the viewport, so the card sits 84.5px right of center.

Move the live `.margin-presets` node into that row while open. Do not clone the slots. Hide the sheet hole with visibility so PART SIZE / GAP / MARGIN do not jump. On close, put `.margin-presets` back on the sheet.

Card geometry stays Cut 2c. Slots, pencil, plus, minus stay live on the left block. No paint-bucket. No Part. No accessibility. No header rewrite.

### Cut 2e — card header, blur, selected minus
Backdrop blur becomes `blur(4px)`. Dim stays `rgba(17,17,17,0.28)`. Pair geometry stays Cut 2d.

Card header row, 31.46px high: label `Presets` at left, unboxed Lucide Check and X at right, 22 / 14 / 2. Remove the footer Check/X and the footer rule. One rule under the header. Name field stays 222.4 × 31.46 under that rule. No paint-bucket.

Every card number input and the name field use `border-radius: 6px`. Card shell stays 7.26px.

Minus deletes the armed gold slot only. No arm → minus does nothing. Minus does not remove the last slot by index.

First delete: a second `#E8E8E8` card, 7.26px radius, 8.8px from the editor, text `Are you sure you want to delete this?`, Check confirms, X cancels. Under the text, a checkbox labeled `Don't show this again`. Checked + Check writes that skip to `localStorage` key `howmany.flipit.v3.presetDeleteSkip`. Later minus on an armed slot deletes immediately when that key is set. No Part. No accessibility.
