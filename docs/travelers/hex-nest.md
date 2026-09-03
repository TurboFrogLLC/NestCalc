# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex nest
Description: Hex ticket feeds a square machine array: rows, columns, X gap, Y gap. Two-row lattice, duplicate after that. Do not implement until Owner locks Cut 1.
PR: 135
Branch: docs/hex-nest
Head: 97d26a3dea49998b7433a6d425d6b24f64b68d5f
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

Purpose: numbers for a square laser array. The array has four inputs only:
# rows, # columns, X gap, Y gap.
Machine work-offset is not an array field. hex-x from 0,0 is how pass 2 is started on the table, not typed into the array dialog.

One square array cannot stagger. Two passes:
- Pass A: even rows (1, 3, 5…)
- Pass B: odd rows (2, 4, 6…), started at the row-2 origin from blank 0,0
Both passes use the same columns / X gap / Y gap. Row count per pass is ceil or floor of total rows / 2.

Arm: Lucide hexagon left of hamburger. 24 / 16 / 2 / viewBox 24.
Path: M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z
Armed #16A34A. Off #111111.

Part when armed: circle, diameter, PART SIZE linked. Dotted AABB on diameter.

Packer: h from height, p from width, inset pair at typed GAP.
Origin circle locked. Count = legal centers. Red wash = illegal ghost only.

Array faces (3 dp inches):
- columns
- rows per pass
- X gap = p − D  (same-row part-to-part)
- Y gap = 2h − D  (same-parity row part-to-part, edge)  [pending Q16]

Table start for pass B, from blank 0,0 (not an array field):
- hex-x-off (center vs box-left still open)
- hex-y-inset = h − D (signed; visual overlap of dotted boxes)

No per-tile drag. No NC emission. No two-blank trim.
