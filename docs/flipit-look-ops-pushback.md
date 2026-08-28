# FLiPIT look — Owner / Ops pushback

updated: 2026-08-27 PT
land: moved from TurboFrogLLC/wReckless-Robot draft PR #26.
kind: wReckless Ops + Owner report. Sibling. Do not restamp Robot look files.
Robot still owns those files. This file is our pushback so they can answer without us editing their map.
floor: NestCalc SuperGrok
lock: Owner
Atlas: off
Robot looks and proposes only. Robot does not run production.
Not a Robot channel. Do not open `channels/flipit` on Robot.
Do not fold into Robot `status/board.md`.
No spend. No product-code commit. No Build from this file.

Bar: HowMany is the calculator. FLiPIT flips the part and writes the NC that can run that flip. AUTO-SIZE is the comms that puts part size from a loaded program onto the bed. The bed is the shared canvas. FLiPIT does not nest. NC editor is an earned morph inside FLiPIT, not the name of FLiPIT. A pane earns its spot.

## Picture now (for Robot)

You can start on any door. Nothing is a wizard.

- Open the canvas → type blank / part / gap / margin → HowMany count. Stop.
- Open a named rem pack from the presets popover → same HowMany. Stop.
- Ticker expand → AUTO-SIZE → file dialog → part size hits the bed → count updates. FLiPIT strip earns. Flip + export. Stop.
- Open FLiPIT with a program and never touch the bed. Flip or open the one-pane editor. Stop.
- Mix them. HowMany does not require NC. FLiPIT does not require the nest.

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

Primary job: rotate / flip the part **and generate the NC** so the machine can run the program with the part flipped. Code: `src/lib/gcodeRotation.ts`.

**Strip (default).** Flip buttons only. Code is in the session. Operator does not see it. Export writes the program that runs that flip.

**Editor (earned morph, same body).** One pane. Not Source + Output. Edit, Apply. Flip still works here because flip has to rewrite the program. Do not make the operator click a second angle button at 0° just to commit.

FLiPIT does **not** nest.

You do **not** have to put FLiPIT on the bed to flip a part.

### AUTO-SIZE — comms, not a third nest

AUTO-SIZE sits on the ticker expand. No new card. OS file dialog only.

It is not HowMany. It is not `calculateAutoNest`. It does not flip. It moves size.

Empty session: click AUTO-SIZE → file dialog → cancel does nothing → pick a file reads bbox, writes HowMany part X/Y, bed + count update. That is hydrate. No second button.

File already in session: same ticker slot becomes **Open new file** (different icon). Confirm first: clear this job and open another? Cancel keeps the nest. OK → dialog → replace program and part size. Blank / gap / margin stay.

Do not morph the AUTO-SIZE slot into FLiPIT. FLiPIT strip earns itself once a program exists. Click-again on AUTO-SIZE is load-another, not flip.

HowMany with a typed part and HowMany with an NC-sized part are the same calculator. AUTO-SIZE replaces part size. Count changes because the part changed. No shadow typed size.

## Ticker vs HUD vs presets

Ticker is a handle on the blank. Expand a field (gap, margin, blank, part). The strip becomes that field. Same type / swap / link as the HUD, but it stays a thin chip. Double-click blank X or Y to type that side; that is when swap/link show. Do not call this hydrate.

HUD is the other door to the same four numbers when you are not dragging. Same session. Two doors, not two stores.

**Presets** are HowMany canvas gear. Earned at boot. Not a FLiPIT morph. Not the ticker library.

- Library = popover on the HowMany inspector. Named packs + field recipes.
- Cap: **7** named packs. Not a materials tree. Not a breadcrumb. Name carries the material (`125 SS rem`).
- Pack = blank + gap + margin. Part size stays out.
- Offload = export / import the list as one text/JSON file. Not one file per preset in the picker.
- Store: `src/lib/presetStore.ts`. Frontend only this pass.

If a program is loaded and they type a new part size on ticker or HUD: do not rewrite the NC. Alert: part no longer matches the program. Nest uses the typed box. Export still uses the program until they Apply in the editor.

If they change the code and Apply, and bbox differs from the bed: ask to update the bed.

## Flow (happy path, not the only path)

1. Bed is the canvas. HowMany with typed or preset blank / part / gap / margin. Count by the arc. Rotate parts, rotate blank, or both. Can stop here.
2. Ticker expand → AUTO-SIZE. File dialog. Load hydrates part size. HowMany recounts.
3. Program exists → FLiPIT strip. Flip + export. No code on the glass.
4. Same body → NC editor. One pane. Apply commits. Bbox prompt if needed.

## Parked — later modules, not this pass

**Cut sheet.** Real shop pain: checklist of tonight’s jobs next to the ACS HMI. One live row, check it, load next, bed updates. Separate module. Do not build it on this look pass. Do not merge with presets (presets = rem recipes; cut list = jobs). When it earns a pane: program name, part size after that row is picked, blank if typed, check. No material tree. No pre-parse of fifteen files.

**Save nest / part file.** Reload a nest you already made, not only a single flipped part. Not this pass.

**HexNest.** Inset stagger. V1 same-diameter. How-many is the gate. Interior-row rotate (three slabs) is Owner override. Not a flag on `calculateNest`. F5 stays SuperBrain lab.

**Bed → FLiPIT NC.** Nest picture back into the program. Hard. First controller **ACS**. Do not invent a universal post. Nest *sequence* into NC is later still, not promised.

**ToolPath card.** In the family. Park. Do not invent.

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
- Not “FLiPIT = the NC editor.” Strip is default. Editor is earned. One pane, not Source + Output.
- Not ticker-swallows-everything.
- Not leftover `#116` five-state. Not `#117` kit this pass.
- Not HowMany emitting NC. Not FLiPIT doing how-many.
- Not a second hydrate button. Not live parse while typing.
- Not AUTO-SIZE morphing into the FLiPIT icon.
- Not offset / step as HowMany output.
- Not a materials breadcrumb. Not an unlimited preset file cabinet.
- Not a cut sheet this pass.

## Ask of Robot

Leave the look files as Robot wrote them.
Answer *this* file.
If the look map changes, Robot edits their map.
Do not treat tab-only HowMany as locked.
Do not treat FLiPIT as “just NC.”
File `status/flipit-job.md` from the decide log if it is still missing.
Do not open a channel. Do not invoke Build from this file.
