# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex nest
Description: Hex is an array-offset ticket. Two-row lattice, duplicate after that. Do not implement until Owner locks Cut 1.
PR: 135
Branch: docs/hex-nest
Head: d56456408705649f4cf28deb107f6d2a3767a50c
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

Purpose: laser array offsets. Row 3 copies row 1. Row 4 copies row 2.

Arm: Lucide hexagon left of hamburger. 24 / 16 / 2 / viewBox 24.
Path: M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z
Armed #16A34A. Off #111111. Independent of hamburger.

Part when armed: circle, diameter, PART SIZE linked. Tiles are circles. Blank stays a rectangle.

Packer: h from usable height, p from width so inset pair stays at typed GAP.
h = min((D+g)√3/2, blankH − T − B − D)
p = 2·sqrt((D+g)² − h²)
Origin circle locked at blank 0,0 system: center (L+R, B+R). Not a handle.
Count = legal centers only. Red wash only on an illegal ghost row.

Readouts from blank 0,0:
- hex-x-off: X of the first row-2 part from 0,0 (inches, 3 dp)
- hex-y-inset: h − D (signed; negative when dotted boxes overlap)
- hex-gap-inset: produced inset part-to-part = center-dist − D (inches, 3 dp)
- hex-gap-row: same-row part-to-part = p − D (inches, 3 dp)

Visual: filled circle + dotted unfilled AABB on diameter.
No per-tile drag. No NC emission. No two-blank trim.
