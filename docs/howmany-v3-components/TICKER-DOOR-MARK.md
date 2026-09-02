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

## Lock

**`#hud` does not die. It morphs.** It is no longer the field editor.

Plan (`status/flipit-v3-plan.md`): ticker is a door (field chip + job door + Reset), not a dump. HUD + ticker are two doors, one session. Presets stay HowMany inspector, not ticker chips. FLiPIT strip lives on ticker-expand. Editor is earned from that door, one pane, not a second HUD row. Dummy Detach stays off. Do not morph the job door into FLiPIT.

What the plan did not spell in one line, and this packet does:

- Ticker takes the field inputs the HUD form is doing now (blank / part / gap / margin).
- HUD stays on the glass as the morphing body: presets ↔ FLiPIT / NC ↔ HexNest / job. Calc chip still opens that body.
- `status/flipit-look-ticker.md` standing line “`#hud` stays, ticker does not replace it” still holds. The withdrawn line was “`#hud` dies.” This packet does not revive that. It only moves **editing** off the HUD form and onto the ticker.

**This door is the sliding ghost rail.** Radial speed dial is parked, not the cut.

Persistent cluster:

```
[−90] [+90] [ ticker ] [calc]
```

- `−90` / `+90` always on. Not on the earned rail.
- Ticker default is blank size. Double-click edits blank. No Blank chip.
- Calc chip opens the morphing HUD body. It is not a second form.
- HEXNES is not a fourth HUD form-row. HexNest chrome waits until this door is right.
- Text dump on the left of the ticker is the miss.

---

## The rail (locked)

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

## Parked — radial speed dial

Same persistent cluster. Half-arc of icon ticks off the ticker. Overlay only while open. Cap four. Not this cut. Keep it as a leftover if the rail fails a hand test.

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

## Ask of Robot — production blueprint

Look at the live shell, the plan, `status/flipit-look-ticker.md`, and this file. Do not cut NestCalc. Do not run Grok Build or Codex. Do not open `channels/flipit`. Do not invent a GOAL or a Station.

Output is one blueprint Keeper files under `status/` (sibling, not folded into `status/board.md` unless the product picture moves). Scribe logs the decide.

The blueprint is for later Owner-invoked production (Grok Build / Codex App / Codex CLI). It is not the Cut.

Need:
- How the locked rail lands on the current V3 host (composition HTML first).
- Studio look: chip sizes, ghost track, grow-up ticker, confirm row, ±90 vs undo (open).
- Reed / Anvil coding brief: IDs, motion, no Sheet/Drawer/Sidebar, shadcn compose not a vendor kit.
- Quarry: one nest session, two doors. Field edit on ticker. HUD morphs.
- How AUTO-SIZE / FLiPIT earn a chip after load and still open the HUD morph.
- What not to do (text dump, 360 orbit, packed hex, Detach, kill `#hud`, pour NC into the ticker).
- Herald-shaped package outline so Owner can hand the blueprint to production later. Herald packages. Owner invokes.

If a seat cannot cover a hole: Apex pulls another seat from BOTS.md. Do not tell Owner no. Push back on the work. Do not refuse the job. (`status/deliberation/2026-08-27-ops-owner-job-not-a-no.md`)

If they need a fact: ask Owner through Apex, or leave a note on NestCalc #120 / a Robot status file. Floor will fetch it.

### Docs they may request (permission first)

Ask Apex → Owner before writing vendor manuals into Robot git. If granted, Herald/Miner drop MD copies under a Robot `status/` or `prompts/` path Keeper names. Do not dump manuals into NestCalc.

- Grok Build: https://docs.x.ai/build/overview · https://x.ai/docs/build/cli/reference · https://github.com/xai-org/grok-build (user-guide)
- Codex: https://developers.openai.com/codex/prompting · https://developers.openai.com/codex/learn/best-practices · Codex app notes on the same docs set (append `.md` where the site allows)
- Lucide / shadcn only as finds for this rail, not a new kit.

Studio on look. Quarry on the session. Anvil + Reed on the brief. Gauge stamps the brief. Herald packages. Atlas off. JobShop off. Keeper writes the sibling board. Scribe logs. This PR is not the product.

## Pause

No more Codex / Grok Build cuts on #119 until Owner names the next Station after the blueprint.
