# Ticker door — hit the mark

Docs only. Not a cut. Production on NestCalc #119 is paused.

Product is FLiPIT. This file is evidence for a Robot look. Floor stays the NestCalc SuperGrok chat.

## Pointers

- Live preview: https://nest-calc-git-feat-v3-c1-count-r1-join-wreckless-toddler.vercel.app/howmany-shell
- Local: `http://localhost:3000/howmany-shell` on `feat/v3-c1-count-r1-join`
- Engine insert job: NestCalc #119
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
- Ticker expand exists (`d994161`) as a text dump: Part / Blank / Gap / Margin / Part 90° / Reset. Clips off the left on phone. HUD still holds the field form plus AUTO-SIZE / HEXNES / FLiPIT.

We built plan steps 4 and 5 before the ticker door was a door.

## Lock that applies to every idea

**`#hud` does not die. It morphs.** It is no longer the field editor.

Plan (`status/flipit-v3-plan.md`): ticker is a door (field chip + job door + Reset), not a dump. HUD + ticker are two doors, one session. Presets stay HowMany inspector, not ticker chips. FLiPIT strip lives on ticker-expand. Editor is earned from that door, one pane, not a second HUD row. Dummy Detach stays off. Do not morph the job door into FLiPIT.

What the plan did not spell in one line, and this packet does:

- Ticker takes the field inputs the HUD form is doing now (blank / part / gap / margin).
- HUD stays on the glass as the morphing body: presets ↔ FLiPIT / NC ↔ HexNest / job. Calc chip still opens that body.
- `status/flipit-look-ticker.md` standing line “`#hud` stays, ticker does not replace it” still holds. The withdrawn line was “`#hud` dies.” This packet does not revive that. It only moves **editing** off the HUD form and onto the ticker.

Persistent cluster:

```
[−90] [+90] [ ticker ] [calc]
```

- `−90` / `+90` always on. Not on the earned rail.
- Ticker default is blank size. Double-click edits blank. No Blank chip.
- Calc chip opens the morphing HUD body. It is not a second form.
- HEXNES is not a fourth HUD form-row. HexNest chrome waits until this door is right.
- Text dump on the left of the ticker is the miss.

Two proposals below. Robot looks at both. Owner is leaning A for shop use. B stays in play.

---

## A — Sliding chip rail (ghost track)

Closed:

```
[−90] [+90] [ 12.000 × 8.000 ] [›] [calc]
```

Open:

```
[−90] [+90] [ 12.000 × 8.000 ] [Part] [Gap] [Margin] [Reset] [calc]
```

Door tick: Lucide `chevron-last` opens, `chevron-first` closes. Icon only. No box.

Ghost rail lives in the gap between ticker and calc. Calc rides right as it opens. Track has no fill and no border. Chips float. Overlay on the blank is allowed because the rail is not persistent.

Rail chips: Part, Gap, Margin, Reset. Not Blank. Not Part 90°.

### Field armed — confirm row (earned)

Tap Margin. Other chips leave. Confirm row earns the slot:

```
[−90] [+90] [ ticker: margin ] [✓] [X] [calc]
```

Check commits and returns Part / Gap / Margin / Reset. X cancels and returns the same. Do not use a trash icon (that reads as Reset). Do not make Margin itself the OK. Do not blur. Selected field can stay visible so you know what you are saving.

States: closed → rail open → field armed → rail open → closed.

### Ticker grows up

Armed field brings swap + link. The pill grows **up**, not into a mile-wide inline row.

Margin default is `0.250 all` plus link (one number writes four sides). Unlink → ticker grows up into a 2×2 (T/R/B/L) at the same input size as today’s HUD field chips. If they never unlink, they never see the 2×2.

Gap unlinked is two fields, not four.

AUTO-SIZE / FLiPIT earn a chip on this rail only after a program is loaded. That chip opens the morphing HUD body. It does not pour FLiPIT into the ticker. Cap what fits on a phone.

Compose from shadcn `Button size="icon"` + `Collapsible` for open state. Width clip / slide is ours. Not Sheet. Not Drawer. Not Sidebar.

---

## B — Radial speed dial

Same persistent cluster. Same HUD-morph / ticker-edits split. Open is a **half-arc of icon ticks** off the ticker, not a 360 clock. Overlay on the bed allowed only while open. Cap four ticks. Icons, not words.

Compose from shadcn `Button size="icon"`. Polar layout is ours. Dice UI Speed Dial / ObsidianUI Circle Menu are references, not dependencies. Magic UI Orbiting Circles is jewelry — do not use it as the door.

---

## Icons (Lucide first)

No `−90` / `+90` text. Icons, boxed like calc.

`rotate-ccw-square` / `rotate-cw-square` are out. Owner does not like them.

| Control | Lucide | Box? |
| --- | --- | --- |
| Part −90 / +90 | `rotate-ccw` / `rotate-cw` | boxed |
| Canvas undo / redo | `undo-2` / `redo-2` | boxed |
| Rail Part | `square` or `rectangle-vertical` | boxed |
| Rail Gap | `between-horizontal-end` | boxed |
| Rail Margin | `align-start-vertical` | boxed |
| Rail Reset | `eraser` | boxed |
| Door | `chevron-last` / `chevron-first` | no box |

### Deliberation — ±90 vs undo/redo (open)

Not solved. Write this down so Robot does not treat the table as closed.

Owner wants icon-only ±90, same tightness as calc. The glyphs that look like rotate are `rotate-ccw` / `rotate-cw`. Those are also the common-standard picture for undo/redo. Moving canvas history to `undo-2` / `redo-2` only fixes the *pair on the same corner of the canvas*. It does not fix the *meaning*. A new operator can still tap ticker rotate and think they undid the last action.

Tried and refused: `rotate-ccw-square` / `rotate-cw-square` (dead square, no feel). Text `−90` / `+90` (not tight).

Still open for Studio: a rotate pair that cannot be read as history, including a custom 16px SVG in Lucide stroke if Lucide has no honest glyph. Do not pretend the swap to `undo-2` closed this.

---

## Ask of Robot

Look at the live shell, the plan, `status/flipit-look-ticker.md`, and this file. Do not cut NestCalc.

Need an outline that keeps `#hud` alive as the morphing body and moves field edit onto the ticker:
- A vs B (or a tight mix). Push back.
- Confirm-row vs one-button commit.
- Margin 2×2 grow-up vs any other four-value pattern.
- How AUTO-SIZE / FLiPIT earn a chip after load and still open the HUD morph (plan: do not morph the job door into FLiPIT; strip on ticker-expand).
- ±90 icon vs undo/redo — deliberation above is open. Square-rotate is refused. `undo-2` swap is not a close.
- What not to do (text dump, 360 orbit, packed hex, Detach, kill `#hud`, pour NC into the ticker).

Studio on look. Quarry on the session (two doors, one session). Anvil only if a coding brief is useful. Atlas off. Keeper writes a plan board under `status/` only if the picture moves. This PR is not the product.

## Pause

No more Codex / Grok Build cuts on #119 until Owner names the next Station after the outline.
