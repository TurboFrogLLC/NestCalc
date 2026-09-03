# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex nest
Description: Hex ticket feeds a square machine array: rows, columns, X gap, Y gap. Do not implement until Owner locks Cut 1.
PR: 135
Branch: docs/hex-nest
Head: 99532b22c6f34ac1a43e11bfec10a180edd3bb36
Session: fresh
job_id: NGJ-20260903-hex-nest
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               Hex spitball + lab pointer
2    Start-branch       Owner remote / Codex App
3    Cut                1 reserved
4    Look               Owner. No Codex.
7    Send for review
8    Inspection
9    Merge
10   Close

When a term → docs/GLOSSARY.md
When this visit → docs/templates/packet.md
When the job sheet → docs/travelers/hex-nest.md
When this packets log → docs/travelers/hex-nest-packets.md
When the host → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html
When the living contract → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.SPEC.md
When lab hex layout → SuperBrain lab/laser-nc-fixtures/round-layout.mjs mode inset
When lab hex fixture → SuperBrain lab/laser-nc-fixtures/F5-round-hex-inset-r10-g2.nc
When PR → https://github.com/TurboFrogLLC/NestCalc/pull/135

Shop: Codex App, Terra, Medium
Proof: Owner remote. Do not restore picker, calculator, chevron, old popover, or bed.
Do not copy NC emission. Do not replace the AutoNest hamburger. Do not split rounds into two blanks.

## Pin (not Cut 1 lock)

Array inputs only: # rows, # columns, X gap, Y gap.
Gaps are real edge-to-edge distances on the dotted bounding boxes. Not center-to-center. Not p/2.
Machine work-offset is not an array field.

X gap = p − D
Same-row, left edge of part N+1 minus right edge of part N. Actual clearance. 3 dp inches.

Y gap = h − D
Top of row-1 dotted box is 0 for this face. Bottom of row-2 dotted box minus that top.
Signed. Negative when the boxes overlap. Array accepts negative. Not pinned to blank 0,0.

Packer still uses typed GAP as the inset *circle* clearance, then produces these box gaps.
Row 3 copies row 1. Row 4 copies row 2.

Arm: Lucide hexagon left of hamburger. 24 / 16 / 2 / viewBox 24.
Path: M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z
Armed #16A34A. Off #111111.

Part when armed: circle, diameter, PART SIZE linked. Dotted unfilled AABB on diameter.
Origin circle locked. Count = legal centers. Red wash = illegal ghost only.
No per-tile drag. No NC emission. No two-blank trim.
