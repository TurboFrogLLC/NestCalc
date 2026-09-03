# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex nest
Description: Hex arm + circle tiles + auto inset packer + array ticket faces.
PR: 135
Branch: docs/hex-nest
Head: f3eb6e904a39af623abaaa928e7de80ba1cb3022
Session: fresh
job_id: NGJ-20260903-hex-nest
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               Hex spitball + lab pointer
2    Start-branch       Owner remote / Codex App
3    Cut                1 hex arm, circles, packer, array faces              d6bf0d0010203f0d256d90b3a4702e5ab0aeb2da
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

Shop: Codex App, GPT-5.6 Terra, High
Start-branch shop: Codex App, GPT-5.6 Luna, Low
Proof: Owner remote. Do not restore picker, calculator, chevron, old popover, or bed.
Do not copy NC emission. Do not replace the AutoNest hamburger. Do not split rounds into two blanks.

## Cut lock

### Cut 1 — hex arm, circles, packer, array faces
Lucide hexagon control immediately left of the AutoNest hamburger.
Hit 24 / glyph 16 / stroke 2 / viewBox 24.
Path only: M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z
Off #111111. Armed #16A34A via aria-pressed. Independent of the hamburger.
Re-measure and lock #blank-ticker-pin after the hex seat is added. Digit count and open/close must not resize the pin.

Hex armed: part is a circle. Diameter only. PART SIZE linked (X drives, Y follows). Tiles draw as circles with a dotted unfilled AABB on the diameter. Blank stays a rectangle. Same blank-drag / Fit / origin as now.

Packer when hex is armed:
D = part diameter. g = typed GAP chip (inset circle clearance).
h = min((D+g)·√3/2, blankH − T − B − D)
p = 2·sqrt((D+g)² − h²)
Origin circle center = (L+R, B+R) in blank space. Not a handle.
Odd rows offset p/2. Row 3 copies row 1. Row 4 copies row 2.
Count = legal centers only. Red wash only on a row that still fails after max squeeze.

Array ticket faces, 3 dp inches, not pinned to machine origin:
- columns
- rows
- X gap = p − D (same-row box edge-to-edge)
- Y gap = h − D (top of row-1 box = 0; bottom of row-2 box minus that top; signed; negative legal)

Do not add per-tile drag. Do not add row-handle squeeze override. Do not change AutoNest math. Do not emit NC.
Done when: hex arm paints, circles pack from the equation, four ticket faces match the pack, HUD pin does not move on digit change, hamburger still rectangles-only.
