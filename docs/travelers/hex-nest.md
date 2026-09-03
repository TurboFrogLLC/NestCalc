# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex nest
Description: Hex arm + circle tiles + auto inset packer + array ticket faces.
PR: 135
Branch: docs/hex-nest
Head: 5a4db803efe59e03830d0b139f8516d961875631
Session: continuous
job_id: NGJ-20260903-hex-nest
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               Hex spitball + lab pointer
2    Start-branch       Owner remote / Codex App
3    Cut                1 hex arm, circles, packer, array faces  61c7157
3b   Cut                1b ticket off NE arc                    5a4db80
3c   Cut                1c ticket in left stack between MARGIN and PRESETS
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
When PR → https://github.com/TurboFrogLLC/NestCalc/pull/135

Shop: Codex App, GPT-5.6 Terra, Medium
Proof: Owner remote.

## Cut lock

### Cut 1 / 1b
Landed. Do not reopen packer, arm, circles, AABB, or HUD pin.

### Cut 1c — ticket in the left stack
When hex is armed, the array ticket (COLUMNS / ROWS / X GAP / Y GAP) lives in the left floating stack, between MARGIN and PRESETS.
Same stack width as MARGIN (154px). Same chip radius / shadow family. Not a free overlay on the blank or HUD.
When hex is off, the ticket is gone. PRESETS stay under it.
Do not change packer math, arm, circles, AABB, HUD pin, AutoNest, or ticket numbers.
Done when the stack order is PART SIZE, GAP, MARGIN, ticket, PRESETS and the resize arc stays clear.
