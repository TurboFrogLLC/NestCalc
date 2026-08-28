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

Bar: HowMany is the calculator. FLiPIT flips the part and writes the NC that can run that flip. AUTO-SIZE is the comms that puts part size from a loaded program onto the bed. The bed is the shared canvas. FLiPIT does not nest. NC editor is an earned morph inside FLiPIT, not the name of FLiPIT.

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

This is original NestCalc. Scratch pad on the bed.

Operator enters four things:
- blank size
- part size (typed, if they are on HowMany alone)
- gap
- margin

HowMany does bounding-box math on that rectangle. It answers **how many** of that boxed part fit on that blank. That is the report: the quantity. It does **not** output NC. It does not report offset or step. Gap and margin are inputs the operator already typed.

On that same surface the operator can:
- rotate **all parts** 90° and recount (maybe more fit)
- rotate the **blank / sheet** and leave the part (positioning — operators often rotate the part and never try the sheet)
- do both (part and sheet), including when other blanks are staged on the bed

An operator who only wants this can stop here. Their laser or waterjet already has a basic array nest in the machine UI. They take the count and set that array on the controller.

**AutoNest is the same module, an upgrade inside HowMany.** Not AUTO-SIZE. Code: `src/lib/autoNestEngine.ts`.

AutoNest can split one blank into two leftover groups and rotate parts in a row to squeeze more. Even if they never trim the sheet, the glass still shows the trim-off so they can see it. The trim-off offset lives here, not on basic HowMany. Still bounding-box math. Still no NC.

Count is first-class on the glass, with HowMany. Outside the blank, between the right corner and the floating arc handle. Just the number. Not on the parts. Not in the ticker stack.

Tab title may still say HowMany. That does not exile the calculator from the glass. “HowMany lives in the tab only” is the line we are pushing back.

### FLiPIT — flip strip, then earned editor

Primary job is **not** “be an NC editor.”

Primary job: rotate / flip the part **and generate the NC** so the machine can run the program with the part flipped. The controller has to see that rotation in the code or the part does not come off the machine flipped. Code: `src/lib/gcodeRotation.ts`.

**Strip (default).** Flip buttons only (90 / −90 / 180 / whatever the host already has). Code is in the session. Operator does not see it. Export writes the program that runs that flip.

**Editor (earned morph, same body).** One pane. Not Source + Output. Edit, Apply. Flip still works here because flip has to rewrite the program. Do not make the operator click a second angle button at 0° just to commit.

FLiPIT does **not** nest. No how-many. No array. No bounding-box pack.

You do **not** have to put FLiPIT on the bed to flip a part. Flip can run in FLiPIT alone, then the user takes the NC (save, paste, send) if they can and want to.

Not every user will save a file and put it back in the machine. Some people only want the calculator. FLiPIT is the added module for people who want the part to go onto the machine from this package. It does not replace HowMany.

### AUTO-SIZE — comms, not a third nest

AUTO-SIZE sits on the ticker expand. No new card. OS file dialog only.

It is not HowMany. It is not `calculateAutoNest`. It does not flip. It moves size.

Empty session: click AUTO-SIZE → file dialog → cancel does nothing → pick a file reads bbox, writes HowMany part X/Y, bed + count update. That is hydrate. No second button.

File already in session: same ticker slot becomes **Open new file** (different icon). Confirm first: clear this job and open another? Cancel keeps the nest. OK → dialog → replace program and part size. Blank / gap / margin stay.

Do not morph the AUTO-SIZE slot into FLiPIT. FLiPIT strip earns itself once a program exists. Click-again on AUTO-SIZE is load-another, not flip.

HowMany with a typed part and HowMany with an NC-sized part are the same calculator. AUTO-SIZE replaces part size. Count changes because the part changed. No shadow typed size.

## Flow

Light and tight. Canvas first. A pane earns its spot.

1. Bed blank is the canvas. HowMany runs with typed blank / part / gap / margin. Count sits outside the blank by the arc handle. Rotate parts, rotate blank, or both. Can stop here.
2. Ticker expand → AUTO-SIZE. File dialog. Load hydrates part size onto the bed. HowMany recounts. No staging card. No extra hydrate.
3. Program now exists → FLiPIT strip earns itself. Flip + export. No code on the glass.
4. One more click on that same body → NC editor. One pane. Apply commits. If bbox changed vs the bed part, prompt: update the bed? Yes writes HowMany part size + count. No keeps the nest. Not live-while-typing. Flip buttons do not rehydrate.
5. Later: bed → FLiPIT NC (nest picture back into the program). Hard. First controller **ACS**. Do not invent a universal post.
6. Later still, maybe: FLiPIT writes a nest sequence into the NC. Not promised.

## HexNest (later, not this look pass)

Inset stagger. V1 same-diameter. How-many is the gate. Interior-row rotate (three slabs) is Owner override for that later module. Not a flag on `calculateNest`. F5 stays lab.

## Presets

Load known blank / gap / margin (later part). Same body family as FLiPIT is fine. Keep the name until a better one earns it. Not a 10-key. Not ticker chips. Store: `src/lib/presetStore.ts`.

## Pointers (do not make Robot hunt)

- HowMany math: `src/lib/nestcalc.ts`, session: `src/lib/nestSession.ts`
- AutoNest leftover / trim-off (HowMany upgrade, not AUTO-SIZE): `src/lib/autoNestEngine.ts` + `src/lib/autoNestEngine.test.ts`
- Flip / rewrite NC: `src/lib/gcodeRotation.ts` + `src/lib/gcodeRotation.test.ts`
- Presets: `src/lib/presetStore.ts`
- Units: `src/lib/units.ts`
- V3 shell (chrome only): `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`
- Concept spitball (parked kit): NestCalc PR #117
- Leftover five-state chrome: NestCalc PR #116
- This split: NestCalc PR #118

V2 is live heritage. V3 is the composition host on purpose. Do not clone V2 FLiPIT chrome onto V3. Do not score the V3 host as a failed product because the engine is not in it yet.

## What this is not

- Not a design suite. Not LightBurn.
- Not “HowMany = tab chrome, FLiPIT = the whole product.”
- Not “FLiPIT = the NC editor, flip is a side button.” Strip is default. Editor is earned. One pane, not Source + Output.
- Not ticker-swallows-everything (already withdrawn).
- Not leftover `#116` five-state. Not `#117` kit this pass.
- Not HowMany emitting NC.
- Not FLiPIT doing bounding-box how-many.
- Not a second hydrate button. Not live parse while typing.
- Not AUTO-SIZE morphing into the FLiPIT icon.
- Not offset / step as HowMany output. Quantity is the report. Trim-off offset is AutoNest.

## Ask of Robot

Leave the look files as Robot wrote them.
Answer *this* file.
If the look map changes, Robot edits their map.
Do not treat tab-only HowMany as locked.
Do not treat FLiPIT as “just NC.”
File `status/flipit-job.md` from the decide log if it is still missing. This PR is the product pointer; that file is their board sibling.
Do not open a channel. Do not invoke Build from this file.
