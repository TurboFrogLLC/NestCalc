# Concept — HUD morph, presets, HexNest drag

Owner spitball 2026-08-27. Not law. Not a Cut. Draft so Robot can read the picture.

Umbrella name for now: **FLiPIT**. Owner may rename.

## Now vs this picture

| Now | This picture |
| --- | --- |
| V3 shell chrome: HUD / AutoSize / FLiPIT. No nest engine. No part count. | NestCalc engine back in the shell. Count is visible. |
| Calculator is a calculator. R14 (#116) holds a five-state chrome machine. | Calculator slot becomes **presets**. #116 stays draft chrome residual. Do not merge it as this concept. |
| HexNest is lab only. | HexNest is a HUD mode. Equation already ran in SuperBrain lab. |
| toolPath is separate. | toolPath still pops out. Only separate chrome. Collapse HUD pulls it back too. |

Current host: `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html` + SPEC.
R14 hold: NestCalc draft [PR #116](https://github.com/TurboFrogLLC/NestCalc/pull/116).
Hex lab: SuperBrain `lab/laser-nc-fixtures/round-layout.mjs` inset mode (`p = 2R + g`, second center `p/2`, `p√3/2`). Fixture `F5-round-hex-inset-r10-g2.nc` generated and tested. Lab README: generate + unittest in that pack.

## Modules (one body)

- **NestCalc engine** — how many parts on the sheet. Missing from the shell today.
- **FLiPIT + AutoSize** — chrome modes of the same HUD.
- **HexNest** — hex mode of the same HUD. Rings / disc / washer / round.
- **Presets** — replaces the calculator surface.
- **toolPath** — only component that pops out on its own without explode. Still FLiPIT-family. Show the part profile inside the bounding box.

HUD is the base. Modes morph in place. Explode is one module at a time.

## HUD

Collapsed HUD is **not** readout-only. It is where blank size, gap, and margin are set. It still collapses and still has a readout.

Expanded HUD is the hub. It turns into:

presets → AutoSize → FLiPIT → HexNest

and back. Same body. Smooth slide like today.

**Explode (per module):** the mode you are in has an explode control. Example: you are in HexNest → explode takes HexNest out as its own window and the body returns to expanded HUD. Same if you later explode FLiPIT. Not explode-all. Shop use will tell if that stays enough.

**Collapse:** HUD collapse reassembles everything that is open, including exploded modules and toolPath if it is out. One fold back into the HUD.

Base widgets: shadcn. Extra open-source only when shadcn has no part.

## Floating blank ticker

The ticker that sits above the blank when you drag it stays. It is **not** inside the HUD container. Buttons float next to it and ease in/out.

- **Double-click the ticker** — type blank size. Same flip / popover method as the HUD. Enter commits.
- **Left of ticker** — expand control. Expands the strip left. Same height. Not in the HUD box.
- **Right / revealed controls**
  - rotate blank 90° left
  - rotate blank 90° right (repeat as needed)
  - set gap
  - set margin

These are the quick path while dragging. HUD remains the full set.

## HexNest drag

Washer / disc / round. toolPath shows the profile in the bounding box, not an empty box.

- Part at origin (0,0) is locked.
- Parts also lock to blank margins. If a row cannot shift sideways and still fit, the dip does not land.
- User grabs a part from the next row and drags it into an inset. The two parts on the row below shift sideways in real time to open the pocket.
- Gap on X and gap on Y may differ. That is wanted. Do not force equal pitch if the user dips deeper one way.
- Live dimensions stay visible on that HexNest surface.

Lab proof today is two-center inset only (F5). Multi-row shift + unequal X/Y gap + live drag are new. Do not pretend the fixture pack already did that.

## Paid (later)

Basic FLiPIT = nest engine + count + this HUD. Paid later: NC import + HexNest. Atlas when Owner asks viability. Not the $5 market block.

## Do not

- Merge #116 as this concept
- Open a Robot channel from this file
- Invent Robot seats
- Treat the lab F5 fixture as a finished HexNest product
- Implement from this document without a named NestCalc Station
