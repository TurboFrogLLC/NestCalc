# FLiPIT look — Owner / Ops pushback

updated: 2026-08-27 PT
land: moved from TurboFrogLLC/wReckless-Robot draft PR #26. Same text. This repo has no `status/` board; file lives at `docs/flipit-look-ops-pushback.md`.
kind: wReckless Ops + Owner report. Sibling. Do not restamp Robot `status/flipit-look.md`, `status/flipit-look-review.md`, `status/flipit-look-glass.md`, or `status/flipit-look-ticker.md`.
Robot still owns those files. This file is our pushback so they can answer without us editing their map.
floor: NestCalc SuperGrok
lock: Owner
Atlas: off
Robot looks and proposes only. Robot does not run production.
Not a Robot channel. Do not open `channels/flipit` on Robot.
Do not fold into Robot `status/board.md`.
No spend. No product-code commit. No Build from this file.

Bar: HowMany is the calculator. FLiPIT flips the part and writes the NC that can run that flip. AUTO-SIZE is the comms that puts FLiPIT part size onto the bed. The bed is the shared canvas. FLiPIT does not nest.

## What we keep from the look files

- Shirt-off the charcoal + gold-yellow HowMany *paint*. Frost bed stays. Restyle, not a rename of the calculator.
- Ticker is a door, not the HUD. `#hud` stays.
- Dummy Detach off until it is a real one-module pull.
- ToolPath parked. Do not invent.
- `#117` leftover parked. F5 stays SuperBrain lab.
- Steal designer *feel*. Do not buy or import the kit.

## Two different tools

HowMany and FLiPIT are not two skins of one job.

### HowMany — the calculator

This is original NestCalc.

Operator enters:
- blank size from the shop
- margin
- gap
- part size (typed, if they are on HowMany alone)

HowMany does bounding-box math on that rectangle (the part in a bounty box). It answers how many of that boxed part fit on that blank. It reports the simple shop numbers the machine already knows how to use: count, gap, offset / step. It does **not** output NC. Not now.

An operator who only wants this can stop here. Their laser or waterjet already has a basic array nest in the machine UI. They take the count and the steps and they set that array on the controller. That is enough for a lot of shops.

**Auto-nest rotate is the same module, an upgrade inside HowMany.** It rotates parts in line in a row to see if more fit. Still bounding-box math. Still no NC.

Count is first-class on the glass, with HowMany. Outside the blank, between the right corner and the floating arc handle. Just the number. Not on the parts. Not in the ticker stack.

Tab title may still say HowMany. That does not exile the calculator from the glass. “HowMany lives in the tab only” is the line we are pushing back.

### FLiPIT — flip the part, write the NC that runs that flip

Primary job is **not** “be an NC editor.”

Primary job: rotate / flip the part **and generate the NC** so the machine can run the program with the part flipped. The controller has to see that rotation in the code or the part does not come off the machine flipped.

Manual NC edit is available inside FLiPIT if the user wants it. That is a part of the module, not the name of the module.

FLiPIT does **not** nest. No how-many. No array. No bounding-box pack.

You do **not** have to put FLiPIT on the bed to flip a part. Flip can run in FLiPIT alone, then the user takes the NC (save, paste, send) if they can and want to.

Not every user will save a file and put it back in the machine. Not every user will cut-paste from the FLiPIT editor. Some people only want the calculator. FLiPIT is the added module for people who want the part to go onto the machine from this package. Call that a later paid lane if we productize it. It does not replace HowMany.

### AUTO-SIZE — comms, not a third nest

AUTO-SIZE sits with FLiPIT.

It is the comms door between FLiPIT and the bed. Do not brand it “hydrator.”

What it does: take the part size from the FLiPIT NC panel and put that size onto the bed blank. Now the blank has a real part size without the operator typing HowMany part fields by hand.

HowMany manual entry still works. If someone never opens FLiPIT, they type blank / part / gap / margin themselves. AUTO-SIZE is how FLiPIT part size becomes the bed part size.

AUTO-SIZE is not HowMany. It is not `calculateAutoNest`. It does not flip. It moves size.

## The bed is the shared canvas

The mouse, the blank, the living drag — that canvas is what the package uses. HowMany draws the boxed parts and the count there. When we *do* bring FLiPIT onto the bed, the flipped part (or the NC that represents it) lands on that same blank so HowMany can nest **that** part. FLiPIT still did not nest. HowMany did.

Flow we want:

1. FLiPIT flips and writes NC. Can stop here.
2. AUTO-SIZE puts FLiPIT part size onto the bed blank.
3. HowMany nests that boxed part on the blank (count + steps). Still no NC from HowMany.
4. Later: send the nest picture back into FLiPIT’s NC editor so FLiPIT can write a program that includes what is on the blank.
5. Later still, maybe: FLiPIT writes a nest *sequence* into the NC. That is harder. Not promised. We will see.

Reverse (bed → FLiPIT) is the hard direction. Controllers differ. First controller is **ACS** — what Owner runs. Owner will feed real ACS programs. Other controls wait. Do not invent a universal post.

## HexNest (later, not this look pass)

Inset stagger. V1 same-diameter. How-many is the gate. Interior-row rotate (three slabs) is Owner override for that later module. Not a flag on `calculateNest`. F5 stays lab.

## Presets

Load known blank / gap / margin (later part). Same body family as FLiPIT is fine. Keep the name until a better one earns it. Not a 10-key. Not ticker chips.

## What this is not

- Not a design suite. Not LightBurn.
- Not “HowMany = tab chrome, FLiPIT = the whole product.”
- Not “FLiPIT = the NC editor, flip is a side button.” Flip + generated NC is the job. Editor is the extra.
- Not ticker-swallows-everything (already withdrawn).
- Not leftover `#116` five-state. Not `#117` kit this pass.
- Not HowMany emitting NC.
- Not FLiPIT doing bounding-box how-many.

## Ask of Robot

Leave the look files as Robot wrote them.
Answer *this* file.
If the look map changes, Robot edits their map.
Do not treat tab-only HowMany as locked.
Do not treat FLiPIT as “just NC.”
Do not open a channel. Do not invoke Build from this file.
