# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex nest
Description: Hex arm + circle tiles + auto inset packer + array ticket faces.
PR: 135
Branch: docs/hex-nest
Head: 61c7157594e91b33bbadb04fc19bf979c4cb1f0d
Session: continuous
job_id: NGJ-20260903-hex-nest
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               Hex spitball + lab pointer
2    Start-branch       Owner remote / Codex App
3    Cut                1 hex arm, circles, packer, array faces  61c7157
3b   Cut                1b move array ticket off the resize arc  d3c8160
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
When PR → https://github.com/TurboFrogLLC/NestCalc/pull/135

Shop: Codex App, GPT-5.6 Terra, Medium
Proof: Owner remote. Do not restore picker, calculator, chevron, old popover, or bed.

## Cut lock

### Cut 1 — hex arm, circles, packer, array faces
Landed 61c7157. Do not reopen except ticket placement.

### Cut 1b — ticket off the resize arc
The array ticket (COLUMNS / ROWS / X GAP / Y GAP) must not cover the blank resize arc.
Keep the ticket on screen when hex is armed. Do not pin it to the blank NE corner.
Park it off the blank: 15px gap from the blank stroke, and 25px clear of the arc hit.
Do not change packer math, arm, circles, dotted AABB, HUD pin, AutoNest, or ticket numbers.
Done when the arc is fully clickable with the ticket open.
