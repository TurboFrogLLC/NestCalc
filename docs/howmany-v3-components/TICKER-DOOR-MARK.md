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
- Ticker expand exists (`d994161`) as a text dump: Part / Blank / Gap / Margin / Part 90° / Reset. Clips off the left on phone. HUD still holds AUTO-SIZE / HEXNES / FLiPIT.

We built plan steps 4 and 5 before the ticker door was a door.

## Lock that applies to every idea

**The HUD inspector goes away.** The ticker *is* the input the HUD is doing now. One nest session. No second form on the left.

Persistent cluster:

```
[−90] [+90] [ ticker ] [calc]
```

- `−90` / `+90` always on. Not on the earned rail.
- Ticker default is blank size. Double-click edits blank. No Blank chip.
- Calc chip stays the right end cap.
- Dummy Detach stays off.
- HEXNES is not a fourth HUD button. HexNest chrome waits until this door is right.
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

Armed field brings swap + link. The pill grows **up**, not into a mile-wide inline row. That grow-up is the feel we want.

Margin default is `0.250 all` plus link (one number writes four sides). Unlink → ticker grows up into a 2×2 (T/R/B/L) at the same input size as today’s HUD chips. If they never unlink, they never see the 2×2.

Gap unlinked is two fields, not four.

AUTO-SIZE / FLiPIT earn a chip on this rail only after a program is loaded. Still between ticker and calc. Cap what fits on a phone.

Compose from shadcn `Button size="icon"` + `Collapsible` for open state. Width clip / slide is ours. Not Sheet. Not Drawer. Not Sidebar.

---

## B — Radial speed dial

Same persistent cluster. Open is a **half-arc of icon ticks** off the ticker, not a 360 clock. Overlay on the bed allowed only while open. Cap four ticks. Icons, not words.

Compose from shadcn `Button size="icon"`. Polar layout is ours. Dice UI Speed Dial / ObsidianUI Circle Menu are references, not dependencies. Magic UI Orbiting Circles is jewelry — do not use it as the door.

---

## Ask of Robot

Look at the live shell and this file. Do not cut NestCalc.

Need an outline that treats the HUD as gone and the ticker as the inspector:
- A vs B (or a tight mix). Push back.
- Confirm-row vs one-button commit.
- Margin 2×2 grow-up vs any other four-value pattern.
- How AUTO-SIZE / FLiPIT earn a chip after load with no HUD row.
- What not to do (text dump, 360 orbit, packed hex, Detach, keep the HUD form).

Studio on look. Quarry on the session (ticker is the only form). Anvil only if a coding brief is useful. Atlas off. Keeper writes a plan board under `status/` only if the picture moves. This PR is not the product.

## Pause

No more Codex / Grok Build cuts on #119 until Owner names the next Station after the outline.
