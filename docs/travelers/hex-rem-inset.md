# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex rem inset
Description: One red void row from 0,0. New circles inset into those pockets.
PR: 136
Branch: docs/hex-rem-inset
Head: 7b66aef0440e2cc6ec45cc024a34a31908e5c536
Session: fresh
job_id: NGJ-20260903-hex-rem
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               Rem-pocket spitball
2    Start-branch       Owner local / Grok Build
3    Cut                1 red void row + pocket inset  2bb43c4
4    Look               Owner. No Codex.
7    Send for review
8    Inspection
9    Merge
10   Close

When a term → docs/GLOSSARY.md
When this visit → docs/templates/packet.md
When the job sheet → docs/travelers/hex-rem-inset.md
When this packets log → docs/travelers/hex-rem-inset-packets.md
When the host → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html
When the living contract → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.SPEC.md
When last hex nest → docs/travelers/hex-nest.md
When PR → https://github.com/TurboFrogLLC/NestCalc/pull/136

Shop: Grok Build, Grok 4.6, high
Grok Build worktree is not Owner Look.
Owner Look clone: /Users/computer/wrecklesstoddler/vibe/projects/nestcalc
Worker must push origin/docs/hex-rem-inset after the Cut. Unpushed GB commits are not Look. Do not edit the nestcalc clone.

## Cut lock

### Cut 1 — red void row + pocket inset
Hex armed. One existing hole row auto-fills from blank 0,0.
Inputs: live blank size, rem hole diameter, rem X-row edge-to-edge gap. Those rem faces sit next to the hex ticket. Do not steal PART SIZE or GAP.
Red disks are voids. Not parts. Not in the blue count.
First void center = (L + R_h, B + R_h). Equal g_exist across that row. As many red holes as fit blankW − L − R.

New PART SIZE circles drop into the cusps of that row, then stack with Cut 2 squeeze. Live GAP is new-to-new and new-to-red-wall: dist(centers) ≥ R_h + R_p + g.
Pocket center may slide off the existing-gap midpoint. Row counts may differ.
No extra ticker margin above the void AABB. L/R/T/B still bound the rem outline.
Do not add a second red row. Do not emit NC. Do not change virgin hex (no rem faces → current packer).
Done when one red skeleton row is visible from 0,0 and blue parts sit in its pockets. Done only after origin/docs/hex-rem-inset has the implement commit.
