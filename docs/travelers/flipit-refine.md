# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT refine — Fit top + preset card
Description: Fit parks blank top at the HUD stop. Preset editor is the restored centered card for Blank, Gap, and Margin only. No picker. No calc. No bed. Q2 HUD-to-blank X is out.
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
5    Cut                2 preset card + Part + accessibility disable cbf37f0d7524adfb5ac317b9160b8cfd9067ff44
5b   Cut                2b preset card chrome restoration     99b5a8d993230387a827b5e46ea4d4b1aa306ada
5c   Cut                2c restore 78391d0 card               16f7c066d7bf1eb560fac778d38978a559a1dd6c
6    Look               Owner. No Codex.
7    Send for review
8    Inspection
9    Merge
10   Close

When a term → docs/GLOSSARY.md
When this visit → docs/templates/packet.md
When the job sheet → docs/travelers/flipit-refine.md
When this packets log → docs/travelers/flipit-refine-packets.md
When the host → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html
When the living SPEC → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.SPEC.md
When the blueprint → docs/howmany-v3-components/TICKER-PICKER-BLUEPRINT.md
When the shop table → SuperBrain nerveCenter/control-surface/OPERATOR-PIN.md

Shop: Codex App, Terra, Medium
Proof: Owner local host. Do not restore picker, calculator, chevron, old popover, or bed.
Do not change AutoNest math. Do not center the HUD on the blank.

## Cut lock

### Cut 1 — Fit top-align
`#lb-fit` / `fitBed()` parks the blank top at HEADER 64 + 15 + HUD 31.46 + 15.
Blank origin stays bottom-left of the blank. Extra height hangs below.
Pan and zoom stay. 15px bottom and 25px side insets stay.
Window is not a bed. Do not pin Fit to window bottom.

### Cut 2 — preset card
Restore only `.margin-presets`, `.margin-presets__head`, `.margin-presets__grid`, the centered preset-card layer, `.margin-preset-card`, and their card open/close JavaScript from `78391d095a416cfe156dc79d8533e042e182a603`.

The 154px sheet row is `PRESETS | pencil | plus | minus`, with the source pencil paths and 22 / 16 / 2 controls. The centered 252.4px card layer is z-index 201. Its name field is 222.4 × 31.46; the card contains Blank, Gap, and Margin only. Axis fields are 106.8 × 31.46. Check/X remain 22 / 14 / 2.

Do not add Part, paint-bucket, accessibility controls, enabled-section storage, target colors, or overwrite confirmation. Do not restyle PART SIZE, GAP, or MARGIN chips. Do not change Fit park, count well, or AutoNest math.
