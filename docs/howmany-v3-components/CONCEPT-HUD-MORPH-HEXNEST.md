# Concept — HUD morph, presets, HexNest drag

Owner spitball 2026-08-27. Not law. Not a Cut. Draft so Robot can read the picture.

Umbrella name for now: **FLiPIT**. Name not set.

## Place

NestCalc started as a basic calculator. It evolved, before wReckless Robot existed, into a **production R&D sandbox** for a family of shop tools. Treat live V2 that way. It is not leftover junk. It is the live product.

**V3 is the current trajectory.** Not a side sketch that loses to V2 by default.

Idea: user necessity. Not one feature-bloated program. A collection of tools that assemble in any combination the operator needs. Used separately or together, many iterations.

The fully assembled product (name not set; FLiPIT for now) is a sandbox for laser / waterjet machines, operators, and programmers.

FLiPIT is one of **three flagship products** (so far) on the manufacturing / shop-tool side. The other two are not named here. Do not title it "gateway flagship."

**HUD does not ship alone.** It is chrome for this surface.

Standalone module SKUs are a later Robot look, after this product is introduced and Owner names a channel.

## Now vs this picture

| Now | This picture |
| --- | --- |
| Live V2 has the nest engine and count. Shirt still says HowMany. | Engine stays. V3 is where the family assembles. |
| V3 shell chrome: HUD / AutoSize / FLiPIT. Engine not joined there yet. | Nest engine + count visible on the V3 host. |
| Calculator is a calculator. R14 (#116) holds a five-state chrome machine. | Calculator slot becomes **presets**. #116 stays draft chrome residual. |
| HexNest is lab only. | HexNest is a HUD mode. Lab equation ran in SuperBrain. |
| toolPath is separate. | toolPath still pops out. Window is the part only. Collapse HUD pulls it back too. |

Current host: `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html` + SPEC.
R14 hold: NestCalc draft [PR #116](https://github.com/TurboFrogLLC/NestCalc/pull/116).
Hex lab: SuperBrain `lab/laser-nc-fixtures/round-layout.mjs` inset mode (`p = 2R + g`, second center `p/2`, `p√3/2`). Fixture `F5-round-hex-inset-r10-g2.nc` generated and tested. Lab README: generate + unittest in that pack.

## Feel

Mouse-first. Hover, grab, resize, double-click, floating ticker — all sized and slopped for a pointer. Touch still works. Pointer is the design target.

**Settings menu** — will exist. Placement and contents not pinned. Future.

## Widgets

Start from **shadcn/ui** as owned source, not a locked skin. Copy the parts in. Strip them. Stack them. Make new pieces from those parts.

Not locked to shadcn. If another open-source control does a job shadcn does not, Robot (Frame / Anvil as Apex routes) may propose it for the stack. Owner picks. Not an Owner-override ritual.

## Modules (one body)

- **NestCalc engine** — how many parts on the sheet. Live on V2. Not joined to V3 yet.
- **FLiPIT + AutoSize** — chrome modes of the same HUD.
- **HexNest** — hex mode of the same HUD. Rings / disc / washer / round.
- **Presets** — replaces the calculator surface.
- **toolPath** — only component that pops out on its own without Detach. Window shows the part, not a bbox around it.

HUD is the base. Modes morph in place. **Detach** is one module at a time. HUD is not a product SKU.

## HUD

Collapsed HUD is **not** readout-only. It is where blank size, gap, and margin are set. It still collapses and still has a readout.

Expanded HUD is the hub. It turns into:

presets → AutoSize → FLiPIT → HexNest

and back. Same body. Smooth slide like today.

**Detach (per module):** the mode you are in has a Detach control. Example: you are in HexNest → Detach takes HexNest out as its own window and the body returns to expanded HUD. Same if you later Detach FLiPIT. Not detach-all. Shop use will tell if that stays enough.

**Collapse:** HUD collapse reassembles everything that is open, including detached modules and toolPath if it is out. One fold back into the HUD.

## Laser bed (blank)

The dotted bounding box lives on the **blank on the laser bed**, not in the toolPath window.

- Each nest cell keeps that dotted bbox.
- When a toolpath / NC exists, **inject** that profile into the cell so the user sees the real part shape inside the box.
- Bbox stays. Future builds may do more. Toggle later if Owner wants hide-box.
- Basic X/Y part size with no NC / no generated toolpath cannot inject. Need an inject action.
- Inject control lives in the toolPath module, later also on the HUD, and slides onto the floating ticker with the other quick buttons.

## Floating blank ticker

The ticker that sits above the blank when you drag it stays. It is **not** inside the HUD container. Buttons float next to it and ease in/out.

- **Double-click the ticker** — type blank size. Same flip / popover method as the HUD. Enter commits.
- **Left of ticker** — expand control. Expands the strip left. Same height. Not in the HUD box.
- **Right / revealed controls**
  - rotate blank 90° left
  - rotate blank 90° right (repeat as needed)
  - set gap
  - set margin
  - inject toolpath (when NC exists; slides over with the rest)

These are the quick path while dragging. HUD remains the full set.

## HexNest drag

Washer / disc / round. On the bed: dotted bbox still shown; injected profile when a toolpath exists.

- Part at origin (0,0) is locked.
- Parts also lock to blank margins. If a row cannot shift sideways and still fit, the dip does not land.
- User grabs a part from the next row and drags it into an inset. The two parts on the row below shift sideways in real time to open the pocket.
- Gap on X and gap on Y may differ. That is wanted. Do not force equal pitch if the user dips deeper one way.
- Live dimensions stay visible on that HexNest surface.

Lab proof today is two-center inset only (F5). Multi-row shift + unequal X/Y gap + live drag are new. Do not pretend the fixture pack already did that.

## Paid (later)

Basic assembled set = nest engine + count + this HUD. Paid later: NC import + HexNest. Atlas when Owner asks viability. Not the $5 market block. Standalone module SKUs wait until this product is stood up and Owner names a channel.

## Do not

- Merge #116 as this concept
- Treat V2 as junk because Robot formed later
- Treat V3 as optional because V2 is live
- Open a Robot channel from this file
- Call FLiPIT a "gateway flagship"
- Ship HUD as its own product
- Invent Robot seats
- Invent the other two flagship names in this file
- Treat the lab F5 fixture as a finished HexNest product
- Treat shadcn as a locked design system
- Draw the part profile as a bbox inside the toolPath window
- Implement from this document without a named NestCalc Station
