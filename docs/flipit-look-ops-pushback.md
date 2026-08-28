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

## Start and finish anywhere

This is not a wizard. Start and finish on the same door, or start on one door and finish on another.

Every piece works alone and can be isolated.

- HowMany alone: four fields, count, rotate part / blank. No program.
- AUTO-SIZE alone: load a program, get part size. No calculator required.
- FLiPIT strip alone: flip + export. No bed required.
- NC editor alone: one pane, Apply. No nest required.
- Presets alone: load a rem pack onto the canvas numbers.

When they sit together they share the bed. They do not own each other.

**Toolbox, not a suite.** Pick the tool you need. That is also how pricing gets figured later — by module, not by one bloated SKU. Do not invent prices in this file. Atlas stays off until Owner asks.

That is the wReckless Toddler manufacturing pattern (same idea as ShopQuote ↔ NanoTate: a print can land in a quote without swallowing either product). Dial the wires later. Do not design this package as one locked pipeline.

## Picture now (for Robot)

- Open the canvas → type blank / part / gap / margin → HowMany count. Stop.
- Open a named rem pack from the presets popover → same HowMany. Stop.
- Ticker expand → AUTO-SIZE → file dialog → part size. Stop, or let HowMany recount if the bed is up.
- Open FLiPIT with a program and never touch the bed. Flip or open the one-pane editor. Stop.
- Mix them.

## What we keep from the look files

- Shirt-off the charcoal + gold-yellow HowMany *paint*. Frost bed stays. Restyle, not a rename of the calculator.
- Ticker is a door, not the HUD. `#hud` stays.
- Dummy Detach off until it is a real one-module pull.
- ToolPath parked as its own card. Do not invent that card. Profile on the **bed cell** is not that card.
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

### AUTO-SIZE, Open new, Reset

Ticker expand has two controls. Always. That is the cohesive bit.

1. **Job door** — AUTO-SIZE when no program. Open new file when a program is in.
2. **Reset** — always there. HowMany-only people can clear the scratch pad without pretending they have a file.

Reset keeps blank / gap / margin (the rem is still on the table). Clears part size, program, FLiPIT strip, HexNest dip. Count follows. New rem = drag the blank or load a preset. Not a second reset.

**No program + AUTO-SIZE:** file dialog. Cancel = nothing. Pick = hydrate part onto the bed.

**No program + Reset:** alert — *Clear the part and recount? Blank stays.* Cancel / Reset.

**Program in + Open new file:** alert — *A program is loaded.*
- Cancel — keep this job
- Reset — drop program + part, blank stays, no dialog
- Load new — dialog, replace program + part size

**Program in + Reset:** same Reset alert. Do not hide Reset inside Load only.

Do not morph the job door into FLiPIT. FLiPIT strip earns itself once a program exists.

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

## Blank snap (canvas settings, not HexNest)

Grid increment for **blank resize** is 0.125. That is the minimum. Do not go finer. Settings menu later can expose it. Not a HexNest problem.

Why 0.125: a rem at 12.120 vs 12.250 can be the difference of one more part. Stepping the blank by 0.125 is how you feel that.

- Drag resize is smooth by default.
- Hold Shift while dragging the blank = hard snap to 0.125. Deliberate.
- Click the arc handle, then arrows grow X or Y. Origin stays locked at 0,0.

## Flow (one path, not the only path)

1. Bed is the canvas. HowMany with typed or preset blank / part / gap / margin. Count by the arc. Rotate parts, rotate blank, or both. Can stop here.
2. Ticker expand → AUTO-SIZE. File dialog. Load hydrates part size. HowMany recounts.
3. Program exists → FLiPIT strip. Flip + export. No code on the glass.
4. Same body → NC editor. One pane. Apply commits. Bbox prompt if needed.

## HexNest — HowMany for same-size rounds

Next chrome after count is live on the bed. One part type at a time. V1 = rounds only (disc / washer / ring). Not a flag on `calculateNest`. F5 stays lab.

**Cell on the bed (V1)**

The nest cell is still a bounding box. Keep the box. Corner margins are unreadable from a circle alone.

HexNest needs an outside diameter.

- Manual: OD field. Draw a circle tangent to the box (no extra pad inside the cell). Box stays drawn around it.
- Program loaded (HowMany *or* HexNest): put the toolpath / profile inside that same box so the part is visible. No program = no profile. HexNest without a file still has the OD circle.

The ToolPath *card* stays parked. This is the bed cell, not that card.

**Locked interaction (V1)**

- First part at blank origin (0,0) is locked to the margin. It does not move.
- Rows exist. User grabs a part from the next row and slides it toward the row below (mouse first).
- The two parts on that lower row shift sideways in real time, only as far as the blank bounds allow, to open the inset pocket.
- Inset depth is not required to stay equal 0.125 all around. Deeper dip is allowed so more fit when blank height is short. Unequal X / Y is wanted.
- If the row cannot shift and still fit, the dipped part does not land. No ghost that lies.
- Arrow keys nudge the dipped part after the mouse has it. Mouse-first, keys are fine.
- Count stays by the arc. Recount when the inset lands or fails.
- Glass shows inset offset from origin (X, and Y down-negative) plus row1→row2 and col1→col2. Operator types those on the HMI. No G54 writer this pass.

**Pending**

- After an inset unit exists (two on the bottom, one dipped), drag the unit bbox like a resize to duplicate that unit at the same inset. If the next copy cannot fit, it does not appear.
- Select that unit and drag a box to tile it — only after the single-unit dip + duplicate works.

**Parked**

- Multi-part nest NC out with those offsets. Cool. Later. First controller ACS.
- Arbitrary profile inject beyond OD-circle / loaded toolpath.
- HexNest inside FLiPIT morph or the ticker library.
- F5 as product chrome.
- Full #117 drag kit as a pile.

## Parked — later, not this pass

**Cut sheet.** Checklist of tonight’s jobs next to the ACS HMI. Separate module. Do not merge with presets.

**Save nest / part file.** Reload a nest you already made. Not this pass.

**Bed → FLiPIT NC.** First controller **ACS**. Do not invent a universal post.

**ToolPath card.** In the family. Park. Do not invent.

## Pointers (do not make Robot hunt)

- HowMany math: `src/lib/nestcalc.ts`, session: `src/lib/nestSession.ts`
- AutoNest leftover / trim-off (HowMany upgrade, not AUTO-SIZE): `src/lib/autoNestEngine.ts` + `src/lib/autoNestEngine.test.ts`
- Flip / rewrite NC: `src/lib/gcodeRotation.ts` + `src/lib/gcodeRotation.test.ts`
- Presets: `src/lib/presetStore.ts`
- Units: `src/lib/units.ts`
- V3 shell (chrome only): `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`
- Hex lab: SuperBrain `lab/laser-nc-fixtures/`
- Concept spitball (parked kit): NestCalc PR #117
- Leftover five-state chrome: NestCalc PR #116
- This split: NestCalc PR #118

V2 is live heritage. V3 is the composition host on purpose. Do not clone V2 FLiPIT chrome onto V3. Do not score the V3 host as a failed product because the engine is not in it yet.

## What this is not

- Not a design suite. Not LightBurn. Not bloated software.
- Not a locked start-to-finish pipeline.
- Not “HowMany = tab chrome, FLiPIT = the whole product.”
- Not “FLiPIT = the NC editor.” Strip is default. Editor is earned. One pane, not Source + Output.
- Not ticker-swallows-everything.
- Not leftover `#116` five-state. Not `#117` kit this pass.
- Not HowMany emitting NC. Not FLiPIT doing how-many.
- Not a second hydrate button. Not live parse while typing.
- Not AUTO-SIZE morphing into the FLiPIT icon.
- Not offset / step as HowMany output. HexNest *does* show inset offsets for the HMI.
- Not a materials breadcrumb. Not an unlimited preset file cabinet.
- Not a cut sheet this pass.
- Not prices in this file.
- Not writing G54/G55/G56 this pass. Show the numbers.
- Not a snap finer than 0.125.
- Not dropping the bounding box because a circle is on the cell.
- Not hiding Reset inside Load so HowMany-only cannot clear.

## Ask of Robot

Leave the look files as Robot wrote them.
Answer *this* file.
If the look map changes, Robot edits their map.
Do not treat tab-only HowMany as locked.
Do not treat FLiPIT as “just NC.”
Do not treat the package as one required pipeline or one bloated SKU.
File `status/flipit-job.md` from the decide log if it is still missing.
Do not open a channel. Do not invoke Build from this file.
