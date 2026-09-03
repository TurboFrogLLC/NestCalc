# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT refine — Fit top + preset card
Description: Fit parks blank top at the HUD stop. Preset card restore from 78391d0, then surgical adds. No picker. No calc. No bed. Q2 HUD-to-blank X is out.
PR: 134
Branch: docs/flipit-refine
Head: 3abd1e78a61fdb5c4e9e2a8874f05d285c2dc782
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
5d   Cut                2d modal pair
5e   Cut                2e card header, blur, selected minus
5f   Cut                2f alert-dialog
5g   Cut                2g card hits, dirty alert, arc clear
5h   Cut                2h HUD seats, Part row, disable, gaps
5i   Cut                2i tighten card, label-row actions, sheet delete  a176c69317b9f6c2f47e17d8422ba802d8cb6a33
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
When the shop table → SuperBrain nerveCenter/control-surface/OPERATOR-PIN.md
When delete alert look → https://ui.shadcn.com/docs/components/base/alert-dialog

Shop: Codex App, Terra, Medium
Proof: Owner local host. Do not restore picker, calculator, chevron, old popover, or bed.
Do not change AutoNest math. Do not center the HUD on the blank.

## Cut lock

### Cut 2h — HUD seats, Part row, disable, gaps
Closed HUD size pair is two tabular 6ch seats from boot. Card sections PART SIZE, BLANK, GAP, MARGIN. Accessibility off disables the row.

### Cut 2i — tighten card, label-row actions, sheet delete
Card pad becomes 12px. Label-to-fields gap is 2px. Section-to-section gap is 4px. Field pair gap stays 8.8px. Card width stays 252.4.

PART SIZE, BLANK, and GAP label rows, left to right: label, Link, then Check and X only while that section is focused or dirty. Accessibility stays at the far right. Link is the existing GAP Lucide link at 22 / 14 / 2. MARGIN has no Link. Check/X on a section commit or cancel that section only. Header Check/X still commit or cancel the whole card.

Minus on the sheet while the modal is closed uses the same z-220 delete alert as 2f. Armed slot required. No arm → minus does nothing.

No paint-bucket. Do not change HUD pin lock, Fit park, or AutoNest math.
