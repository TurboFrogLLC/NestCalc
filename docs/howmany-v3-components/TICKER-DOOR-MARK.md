# Ticker door — hit the mark

Docs only. Not a cut. Production on NestCalc #119 is paused.

Product is FLiPIT. This file is evidence for a Robot look. Floor stays the NestCalc SuperGrok chat.

## Pointers

- Live preview: https://nest-calc-git-feat-v3-c1-count-r1-join-wreckless-toddler.vercel.app/howmany-shell
- Engine insert job: NestCalc #119 (`feat/v3-c1-count-r1-join`)
- Robot plan: https://github.com/TurboFrogLLC/wReckless-Robot/blob/main/status/flipit-v3-plan.md
- Look files: `status/flipit-look.md`, `status/flipit-look-glass.md`, `status/flipit-look-ticker.md`
- Host: `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`
- This PR: NestCalc #120

## Where we are

Engine is in the V3 shell.

- HowMany count + rect tiles join `calculateNest`.
- AUTO-SIZE loads NC and does not open FLiPIT.
- FLiPIT shirt-off + one-pane editor exist as a separate card.
- Detect uses real `analyzeGCode` bounds.
- HexNest V1 exists (two-row drag). Packed-sheet and HUD HEXNES chip are wrong.
- Ticker expand exists (`d994161`) as a text dump: Part / Blank / Gap / Margin / Part 90° / Reset. Clips off the left on phone. HUD still holds AUTO-SIZE / HEXNES / FLiPIT.

We built plan steps 4 and 5 before the ticker door was a door.

## The mark

Ticker is the door. Name of the chrome: **radial speed dial** (not pie slices, not a persistent halo, not a left text rail).

Collapsed: blank readout only (`12.000 × 8.000`). Calc chip stays on the right.

Open: a **half-arc of icon ticks** fans off the ticker. Overlay on the bed is allowed because the ring is not persistent. Close on outside tap, readout tap, or finished edit. No parked halo.

Ticks earn a place. Hard cap four.
- Field edit → that field tick
- Part 90° / Reset as ticks when needed
- Program loaded → AUTO-SIZE and FLiPIT ticks on this ring, not also on the HUD

Icons, not words. Hits as large as the calc chip. Mouse first.

HUD stays the inspector for the same session. Not a second job row.
HEXNES is not a fourth HUD button. HexNest chrome refine waits until this door is right.
Dummy Detach stays off.

Left-slide text dump is the miss. Full 360 clock face is jewelry. Do not use it.

## Build language (when we cut)

Compose from shadcn, do not vendor a kit.

- `Button` `size="icon"` for ticks
- `Popover` on a field tick for the number edit (same edit as HUD fields)
- Open state on the ticker itself
- Polar layout is ours: rotate(θ) translate(r) rotate(-θ)

References only (not dependencies): Dice UI Speed Dial, ObsidianUI Circle Menu. Official shadcn has no radial menu. Magic UI Orbiting Circles is decorative — do not use it as the door.

V3 host is still composition HTML. Same contract in CSS until the React tree owns the ticker.

## Ask of Robot

Look at the live shell and this mark. Do not cut NestCalc.

Need an outline to hit the radial speed dial:
- Half-arc geometry vs the calc chip, count, and arc handle
- Which ticks earn a slot and in what order
- How a loaded program adds AUTO-SIZE / FLiPIT without a HUD second row
- Motion (short fan, close, no overlay dim)
- What not to do (text dump, 360 orbit, packed hex, Detach, Magic UI jewelry orbit)

Studio on look. Quarry on the session (one nest session, two doors). Anvil only if a coding brief is useful. Atlas off. Keeper writes a plan board under `status/` only if the picture moves. This PR is not the product.

## Pause

No more Codex / Grok Build cuts on #119 until Owner names the next Station after the outline.
