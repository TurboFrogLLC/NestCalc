# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT refine — Fit top + preset card
Description: Fit parks blank top at the HUD stop. Preset card restore from 78391d0, then surgical adds. No picker. No calc. No bed. Q2 HUD-to-blank X is out.
PR: 134
Branch: docs/flipit-refine
Head: d7cd7be775d50dd8d083a114113a8b9650461bd1
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
5d   Cut                2d reserved — overlay off
5e   Cut                2e reserved — card-header adds
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

### Cut 2d — reserved
Overlay off so slots stay live. Card stays the 2c geometry. Not this visit.

### Cut 2e — reserved
Card-header adds only. Not this visit.
