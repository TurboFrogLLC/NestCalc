# FlipIt — blank-in-space composition host — Living SPEC

**Status:** Living — Cut 29 pencil hydrate and blank grow
**Product:** **FlipIt**  
**Repo:** `TurboFrogLLC/NestCalc` (do not rename)  
**HTML:** `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`  
**Branch:** `docs/side-stack-sheet`
**Trace:** `NGJ-20260901-blankspace`
**Host tip blob:** `55a1688ec9720fdb34409435fa56b46f3a5783ec` (Seq 3 composition commit)
**Class:** Exploratory composition host only · not product GOAL · not a shared import  

**Host rule**  
This file is the **host only**. The four individual HTML tips stay standalone lock files. Do not overwrite them from this assembly. Do not add `flipit-v3-align.js` or `@import` into the tips.

Prior composition/lock archives (`COMPOSITION-HUD-DECODER-v3.*`, `DE-CODER-v3-LOCKED.*`) stay on disk. They are not this host.

---

## Seq 7 — side-stack sheet + ticker lock

This section supersedes the ticker-door R1 / R2 / R3 contracts below. Seq 3's blank-in-space stage remains in force.

- The left field stack occupies an invisible, transparent sheet lane. It has no border and starts at the hard stop `--app-header-h: 64px` + `--canvas-pad: 48px`; its single measured inset is 48px.
- The stack is left-side, top-to-bottom **PART SIZE**, **BLANK**, **GAP**, **MARGIN**. Labels sit above their chips, share the same left edge, and use 11px / 650 / 0.04em / uppercase. Rows use an 8.8px gap.
- Chips are 28.6px high, 6.6px radius, narrower than the previous 21ch pills. MARGIN retains a 40px minimum when its value becomes two lines; its chip owns its radius and shadow.
- The sheet reserves its lane during Fit. Fit and camera frame the blank, its ticker, and the sheet as one subject. The blank is clamped within browser width and cannot collide with the sheet; it may sit lower in Y. The ticker paints in front and never clips through the chips.
- The ticker is 28.6px high, wider rather than taller, and shows live `W.WWW × H.HHH` plus the count number only. FLiPIT remains the product name.
- There is no picker bar, calculator button, chevron door, reset action, or numeric calculator surface. The Lucide rotate pair rotates the part; the blank arc remains the only stage-grab affordance. The hidden bed, grid, nest, and part surfaces remain absent from this host.

---

## Cut 6 — corrective sheet stops

- The sheet is fixed at `right: 48px` and `top: calc(64px + 48px)`. It has no runtime left-pin placement or drag placement.
- Fit, pan, and zoom clamp the blank clear of the reserved sheet lane; the blank also retains a visible 48px stage gap below the header. The ticker remains below the header and in front of the blank.

- MARGIN is a complete 6.6px-radius chip with its own shadow, including in two-line mode.
- The ticker reads live blank size plus the count number only. The 28px travel row restores Lucide `rotate-ccw` and `rotate-cw` hits with 18px glyphs. It does not restore a picker, calculator, or chevron.

## Cut 7 — left sheet

This supersedes Cut 6's sheet side only. The transparent, borderless sheet is fixed at `left: 48px` and `top: calc(64px + 48px)`. PART SIZE, BLANK, GAP, and MARGIN remain left-aligned above their chips with shared left edges. Fit, pan, and zoom reserve the left lane and keep the blank out of it; the right lane remains open. Ticker chrome and closed editor chips are unchanged.

## Cut 8 — blank ticker corrective

This supersedes the earlier ticker details. The outer ticker is one 28.6px `#E8E8E8` row with a 6.6px radius and `0 0.5px 1px rgba(0,0,0,.25)` shadow; its inner travel and size elements do not set a 28px height. The pair uses the stock host Lucide `rotate-ccw` / `rotate-cw` paths in 28px hits with 18px, 24px-viewBox, round, 2px strokes. Inset vertical rules divide the pair, size, and count without reaching the row's top or bottom stroke.

The size and count both use 12.1px / 650 / mono; the live count is `#538BEC` and derives from blank, part, gap, margin, and rotation state. The buttons rotate −90/+90. MARGIN remains a complete 6.6px chip with a full 1.1px stroke and own shadow, and all sheet ancestors leave its overflow visible. Picker, calculator, chevron, and popover remain absent.

## Cut 10 — in-chip editors

Clicking a side chip turns that same chip into the editor: the first field receives focus and select-all. PART SIZE, BLANK, and GAP keep one chip row with X/Y fields and Check/X controls. Check commits the live values; X restores the values from open. There are no link or swap controls.

MARGIN expands downward inside its own complete 6.6px, 1.1px-stroked, shadowed chip into L, R, B, and T fields plus Check/X. Its bottom corners stay visible through the sheet stack. The retained popover is never opened; no picker, calculator, chevron, dark secondary panel, or bed is restored.

## Cut 11 — editor + gutter tweak

Editors use the closed-chip readout type (12.1px / 650 / mono) directly on white fill: no inner field border or padding. An active input grows right to retain every character. GAP alone carries a link control between Y and Check; PART SIZE, BLANK, and MARGIN have neither link nor swap. The ticker's live blank-size field opens that same BLANK editor with the same Check/X contract.

MARGIN's closed readout has no plus signs. Its open L/R then B/T layout is an even two-column grid with shared column edges, more internal height, and the parent chip's complete 6.6px corners, 1.1px stroke, and shadow.

The single 48px measure serves both gutters: header-bottom to ticker-top and sheet-right to blank-left. Sheet width glides right while any chip is open; the blank follows that width delta and returns on close. Fit, pan, and zoom still clamp the blank inside browser width. No picker, calculator, chevron, popover, or bed is restored.

---

## Cut 12 — centered ticker + side stack

The blank ticker is a fixed viewport HUD: horizontally centered, 48px below the 64px header, and independent of blank placement, blank resize, pan, zoom, and Fit. Its entire locked bar is scaled 10% to 31.46px high with a 7.26px radius, 30.8px rotate hits, 19.8px Lucide glyphs, and 13.31px / 650 / mono size and count type. It remains `#E8E8E8` with the existing `0 0.5px 1px rgba(0,0,0,.25)` shadow, inset rules, live blue `#538BEC` count, and −90/+90 rotate pair.

BLANK leaves the left sheet. The centered ticker itself is its blank-size editor: select-all on open, type, Check, and X, with two padded white cells separated only by `×` (no X/Y labels). Its pill grows right from a stable left edge; it has no hanging controls.

The left sheet is moved to the smaller 24px inset and contains only **PART SIZE**, **GAP**, and **MARGIN**. Side chips grow right only; their width delta moves the blank right and closing moves it back. The fixed centered ticker does not move. Fit, pan, and zoom reserve this remaining left lane. GAP alone retains Link between Y and Check. MARGIN remains its taller, complete 6.6px L/R then B/T grid with no plus or axis labels. No picker, calculator, chevron, popover, or bed is restored.

## Cut 13 — HUD seats + editor chrome

Header-bottom to centered-HUD-top is **15px**, not 48. HUD-bottom to blank-top is a **15px hard stop**; Fit, pan, and zoom cannot move the blank across that line. The centered HUD stays fixed and does not pan, zoom, or Fit.

Side-stack chips take the same +10% as the closed bar: **31.46px** high, **7.26px** radius, **13.31px / 650 / mono**. Closed bar chrome is unchanged. The live blue count on the centered bar is one step larger: **14.64px / 650 / mono**.

Check and X are unboxed Lucide `check` and `x` only — 30.8px hits, 19.8px glyphs, 2px round stroke — matching the rotate pair and header + / − / Fit. Those three header hits are Lucide `plus`, `minus`, and `maximize` at the same size and stroke; they are not circled or boxed. Every editor field select-alls on click, not only the first field on open. PART SIZE and GAP use `×` with no X/Y labels. GAP keeps Link between Y and Check.

MARGIN is an even L R / B T grid inside a tight pill: padded white cells, no empty slab, no plus signs. The pill grows right only. No picker, calculator, chevron, popover, or bed is restored.

## Cut 14 — editor math + 15px stops

Closed and open chips sit on one **31.46px** row: radius **7.26px**, readout and inputs **13.31px / 650 / mono**, `line-height: 31.46`, `align-items: center`. Inputs do not drop. White cells pad left/right only. Every numeric value is three decimals in a **6ch** tabular field with no wrap. Select-all remains on every field click.

MARGIN open is an even **2×2**: L R on row 1, B T on row 2, one number per cell, equal column and row gap, shared column left edges. Check and X sit on the right of that grid and are vertically centered to it. There is no empty slab and no second popover.

Action hits: Check, X, and Link are **22px** with **14px** Lucide glyphs, stroke 2. The rotate pair is **24px** with **16px** glyphs, stroke 2. Header + / − / Fit stay as Cut 13.

Stops are one token, **15px**: header-bottom → HUD-top, HUD-bottom → blank-top, stack-right → blank-left, and viewport-bottom → blank-bottom. The HUD stays fixed. Pills grow right only; the blank slides by that width delta and returns. No picker, calculator, chevron, popover, or bed is restored.

## Cut 15 — ghost A

PART SIZE, GAP, and the centered bar keep the same closed chip while editing: same size, fill, radius, and stroke. Numbers edit in place at three decimals in **6ch** tabular fields. Select-all on every field click. No X/Y labels. `×` stays between the pair. The pointer stays over the whole chip until a number is clicked; then the I-beam is in that field only.

Check and X sit **outside** the pill, to the right, vertically centered to that chip. They are not inside the stroke. The pill does not grow right to make room for them. GAP's Link sits outside right, between the chip and Check.

MARGIN closed is `0.250 all` when all four sides are equal; otherwise two even lines `L 0.250  R 0.250` / `B 0.250  T 0.250`. It never smashes into `0 R 0.250B 0.250 T`. Open stays that two-line grid in the same chip width. Height grows down only enough for two rows. Check/X stay outside right. GAP is not shoved sideways.

Fit clamp and the 15px stops are unchanged. No picker, calculator, chevron, popover, or bed is restored.

## Cut 16 — ghost highlight + margin center

The selected number has **3px** air above and below the blue field to the inner stroke. Same math on PART SIZE, GAP, and MARGIN fields, and on the centered HUD size slot.

While a side chip is open, its fill is the center HUD color **`#E8E8E8`** so the blue select shows. Closed chips stay frost-blue. The center bar stays **`#E8E8E8`** closed and open.

MARGIN's two-line L R / B T grid is vertically centered in the chip: equal padding top and bottom, column gap = row gap, width unchanged. Check and X stay outside right.

Ghost A stays. Actions stay outside. The pill does not grow right. No picker, calculator, chevron, popover, or bed is restored.

---

## Cut 17 — margin vertical inset

The closed GAP readout measures **7px** from its text box to each inner stroke (the rendered bottom resolves at 7.45px from sub-pixel layout). That measured 7px token is the vertical pad for MARGIN's two-line closed L/R then B/T grid and its open L/R then B/T editor. Column gap equals row gap; width is unchanged; Check and X remain outside right. Open MARGIN fill stays `#E8E8E8`.

Ghost editors stay. No picker, calculator, chevron, popover, or bed is restored.

---

## Cut 18 — center-bar lock

The centered travel box takes its left pin and width from the closed box only. Opening the BLANK editor, clicking either field, and committing or cancelling retain that same box width and left coordinate. The editor uses the closed 13.31px / 650 / mono type and does not grow the box. Check and X remain outside its right edge and do not cause a second centering pass. First field click select-alls.

## Cut 19 — parts on blank

Only the live part tiles are visible inside the blank. Columns and rows use the same blank, part, gap, margin, and quarter-turn count calculation that drives the blue bar count; the rendered tile count therefore matches the bar through size edits and −90/+90 rotation. Laser-bed fill, grid, rim, rulers, nest-box chrome, picker, calculator, chevron, and other bed surfaces remain hidden.

## Cut 20 — presets block under margin

PRESETS sits directly below MARGIN in the left sheet. Its label uses the same type as PART SIZE, GAP, and MARGIN; Lucide plus and minus controls at the label's right add one slot or remove the last slot. Four slots are present at load. The slots form a two-column grid: each 154px row has exactly two frost-blue buttons and one shared gap, so both rows have the same measured length as the chips above. Each button uses the side-chip token — 31.46px height, 7.26px radius, 1.1px stroke, the established shadow, and 13.31px / 650 / mono type — and applies only its stored margin snapshot. Ghost editors, external Check/X actions, the centered ticker lock, live parts on the blank, Fit, hard stops, and the absence of picker, calculator, chevron, popover, and bed remain unchanged.

## Cut 24 — preset modal wire

PRESETS reads left-to-right as label, Lucide pencil paths `M21.174 6.812…` and `m15 5 4 4`, plus, and minus; no slot has an ordinal in its visible name. An idle slot tap immediately hydrates live Blank, Gap, and Margin. With the pencil on, every slot tap—including a currently armed slot—calls `openMarginPresetCard(index)`, keeps the pencil visibly pressed, arms that slot with `rgba(255,206,27,0.55)` fill and `rgba(201,140,0,0.85)` stroke, and displays the blocking card through its explicit open class. The layer uses flex layout above the chips, HUD, and blank; it no longer relies on the native `hidden` attribute. The 240px `#E8E8E8` card has 8.8px padding, a 222.4 × 31.46 named input, and only the section labels Blank, Gap, and Margin above their 72.6 × 31.46 paired boxes (8.8px gap). Its one-row footer is Copy live at left and unboxed 22px Lucide Check/X at right. Empty values hydrate from the live tickers; Check saves and X cancels; an empty name is `Preset`. Any live chip edit clears the arm without writing the slot. Preset buttons show their name only and retain GAP-chip tokens. No picker, calculator, chevron, old popover, or bed is restored; ghost editors, center-bar lock, parts on blank, Fit, hard stops, and boot sizes remain locked.

## Cut 25 — preset card stack and footer

The blocking card layer is a body-level fixed sibling at z-index 201, above the 100-level header and the HUD pin, and its open overlay consumes pointer input before HUD, chip, or blank controls can receive it. The card remains 240px wide with `#E8E8E8`, 7.26px radius, and 8.8px padding. Its 222.4px inner width contains the 222.4 × 31.46 name field, then Blank, Gap, Margin, and footer with an even 8.8px between each block. Every inner axis box is 106.8 × 31.46 with 7.26px radius and an 8.8px paired gap. Copy live is a 31.46px-high, 7.26px-radius button using the side-chip type, held at footer left of the unchanged unboxed Check/X pair. Hydration, pencil paths, gold arm, plus/minus, center-bar lock, ghost editors, parts on blank, Fit, and stops remain locked.

## Cut 26 — preset arm, card pad, HUD lock

An idle preset tap hydrates live Blank, Gap, and Margin and arms that selected live slot with `rgba(255,206,27,0.55)` fill and `rgba(201,140,0,0.85)` stroke. Closing its card retains the arm; opening a live chip editor still clears it without writing the slot. The `#E8E8E8` card is **252.4px** wide with **15px** padding on every edge, preserving its 222.4px inner width: the name stays 222.4 × 31.46 and each paired axis field stays 106.8 × 31.46 with an 8.8px gap. A 1.1px rule, inset by the card padding, separates Margin from the one-row Copy live / Check / X footer. Opening, hydrating, or closing the card does not change the centered ticker pin's closed left coordinate or width.

## Cut 27 — pencil-on-selected and inline actions

With a live preset already armed, pressing the pencil opens that selected slot’s card immediately; a pencil press with no armed slot enters edit mode but opens no card. Idle slot hydration still keeps the gold arm, and a live chip edit still clears it without writing. The retained 252.4px card adds a second 1.1px inset rule between its name field and the Blank section; its 15px pad, 222.4px content width, fields, footer rule, and Copy live row stay unchanged. PART SIZE, GAP, MARGIN, and the centered blank-size editor keep their 22 × 22 Lucide Check/X hits inline immediately after the readout; GAP Link stays between its numbers and Check, and MARGIN’s actions align to its first numeric row rather than the middle of its two-row grid.

## Cut 28 — Check X on label row

When PART SIZE, GAP, or MARGIN is open, its 22 × 22 Lucide Check and X hits sit on the 11px label row immediately after the label, vertically centered to that row rather than beside the number chip. GAP keeps Link between its label and Check. Closed chips expose no label-row actions. The centered blank-size slot has no separate label and keeps Check/X on its number row. Pencil-on-selected, gold arm, card pad, footer, parts-on-blank, Fit, and stops stay unchanged.

## Cut 29 — pencil hydrate and blank grow

Pencil with an armed slot still opens that slot's card. With no armed slot, pencil opens the same card populated from the live Blank, Gap, and Margin tickers, without arming or writing a slot. The footer contains only unboxed Check and X: Check writes the first empty slot, or appends a slot when all are filled; X closes without a write; an empty name becomes `Preset`. Copy live is removed. During blank-handle resize, camera scale may shrink below the ordinary zoom floor so the 15px viewport stops retain the drawn blank while `blankW` and `blankH` continue to grow; the numeric blank size is never capped by the visible box. Label-row Check/X, gold arm, card pad, parts on blank, Fit, and stops-as-pan remain locked.

---

## Seq 3 — blank-in-space canvas

This section supersedes older R1–R13 statements where they name LaserBed or the Numeric HUD as a mounted composition surface.

- The blank is the canvas subject, surrounded by empty space. There is no drawn laser bed, grid, machine rim, ruler, nest box, or part rendering.
- The app header spans the top; the canvas well begins at a fixed hard pad below its lower edge. General window controls remain in that header band.
- Fit frames the blank plus open gutter only. The open gutter is interaction space, not a machine envelope or drawn plate; blank-edge drags retain their starting Fit scale until the next Fit.
- The blank retains current bottom-left growth. The owner notes do not confirm a bottom-right flip, so Seq 3 does not change origin behavior.
- The blank ticker is the only always-visible HUD. Its attached menu-bar picker opens above the ticker and contains Part, Gap, Margin, and Reset words.
- The travel row contains the −90/+90 pair, blank-size field, calculator, and chevron. The picker-owned field surface is hidden at load and appears only after a picker field is selected.
- That surface retains Blank, Gap, Margin, and selected-Part field chips plus their presets. It contains no numeric keypad, AUTO-SIZE / FLiPIT chips, or legacy Numeric HUD card chrome. This operation does not add an AutoNest trigger or alter calculator / AutoNest math.
- `LASER-BED-v3.*` and `NUMERIC-HUD-v3.*` remain individual lock files on disk; this host does not present their bed or parameter-card surfaces.

Host validation: initial browser snapshot shows header + blank ticker/picker with no numeric card; selecting a picker field reveals only that field’s retained controls.

---

## Surfaces

| Surface | Selector / id | Authority | z-index |
|---------|---------------|-----------|--------:|
| Canvas well | `.bed-stage` · `#laser-bed-host` | host — begins below the fixed header | 0 |
| Blank body | `#lb-blank` (in `#lb-camera`) | host — sole drawn canvas subject | **0** |
| Header controls (zoom / Fit / FLiPIT) | `.app-header` · `.app-header__chrome` · `#btn-header-flipit` | host — mounted in the header stacking context | **101** |
| Blank hits + arc overlay | `#lb-blank-layer` | grab targets only | **10** |
| toolPath | `#backplot.toolpath` | `TOOLPATH-v3.SPEC.md` · tip `2e9e2ace` | 20 |
| FLiPIT | `#gcode` · class `.gcode` | `FLIPIT-v3.SPEC.md` · tip `37d628e9` | 30 |
| FLiPIT toast | `#gcode-toast` | host override of standalone 40 | **35** |
| Picker field surface | `#hud.canvas-calculator` | host — hidden at load; picker toggles retained field chips below header, without keypad or HUD card chrome | **90** |
| Blank ticker + picker | `#blank-ticker-cluster` | host — pinned to blank in viewport coordinates | **90** |
| Field preset popover | `.param-popover` | Blank / Gap / Margin controls on the picker field surface | 50 |

The fixed header occupies its own front band. Fixed overlays convert stage-local canvas coordinates to viewport coordinates before pinning.

The blank remains below overlays. The ticker/picker and revealed calculator sit above the canvas; the picker remains available to dismiss the calculator.

Wordmarks stay as locked: **FLiP** white 700 + **IT** amber 800 · **tool** white 700 + **Path** amber 800.

---

## Bridges wired

| ID | Behavior | Primitive |
|----|----------|-----------|
| **R17** | FLiPIT Source + Output waypoints (`#btn-toolpath-src` · `#btn-toolpath-out`) toggle toolPath | class `is-hidden` on `#backplot` · `aria-pressed` sync · `__setToolpathOpen` |
| **R27** | toolPath boots hidden | HTML `is-hidden` + `setToolpathOpen(false)` |
| **R29** | Blank-in-space primary canvas | canvas well begins below header; no grid, rim, rulers, nest box, or part rendering; BL origin retained; Fit frames blank + gutter only |
| **R30** | Header-aware overlay placement | zoom/Fit are mounted in the header stacking context; calculator and opened cards begin below header; ticker converts stage-local blank coordinates to viewport coordinates |
| **R1** | Boot blank HUD / FLiPIT closed | ticker travel row visible; picker and calculator, FLiPIT, and toolPath hidden; header FLiPIT control opens the closed FLiPIT surface |
| **R2** | Ticker-door picker | chevron reveals the attached picker above the travel row; Part, Gap, and Margin select the retained calculator controls and keep their presets on that surface |
| **R3** | Calculator gate | calculator remains hidden until a picker field is selected; source Clear + name X fully unload |
| **R32** | Part picker + live ticker height | Part selection exposes the retained Part row; ticker placement reads the live travel-row cluster height so its bottom retains the 10px blank gap. |
| **R4** | AUTO-SIZE 2nd click **closes** collapsed FlipIt · Output tab gated until Flip IT · READY/DONE inset status | `__flipitAutoSize` closes when already open+collapsed (no re-detect) · `#tab-output.is-gated` until `hasOutput()` · stage-status inset + 1.7px glow · READY type `--ink-30` |
| **R5** | Blank ticker remains live | blank drag updates retained Blank fields; ticker is pinned using the canvas-stage viewport offset and floats beside picker |
| **R6** | HUD param↔calc stacked opacity crossfade · header radius eases with 0fr · calc→collapse does not flash params | `#hud-stage` height 240ms · no `display` swap · header `border-radius` + `border-bottom-color` 240ms · defer `calc-mode` clear until collapse end |
| **R7** | Collapsed HUD part ticker fade · FlipIt GC0DE↔tabs fade · square `#bt-calc` · outside-arc corner grab | `.is-settled` + 240ms fade · `.surface-lead` opacity · `#bt-calc` square / 3px gap · `#lb-corner-arc` 2px |
| **R8** | Bigger arc · fade as collapse ends · toolPath open-space + multi-card arrange · blank body behind cards · resize glow · lock + HUD-sized calc · unit align · Blank/Gap/Margin presets | arc ~18px · ticker fade delay 160ms · `__hostArrange` · `#lb-blank` in world · `#bt-calc` 28.6² · `localStorage` presets |
| **R9** | Remove blank lock · calc = ticker height · glow −60% bed-clipped · top-band equal cards · zoom front · preset chips + toast · two-line margin · frost-blue rails | no `#bt-lock` · `#bt-calc` 34² · bed `clipPath` · `__hostArrange` top 25 · `.lb-chrome` z **80** |
| **R10** | Calc hover stays visible · glow −50% again · rails past grid + Y outside numbers · preset Confirm/Cancel · 3-card layout re-applies on every complete set | hover fill opaque · glow 0.6px/0.14 · `__hostArrange` forces TP·FlipIt·HUD |
| **R11** | Preset everyday load vs explicit edit/write · rails butted to origin, filled full length + far overhang | `[data-pre-edit]` · Confirm/Cancel only in edit · rails from 0,0 |
| **R12** | Compact single-row HUD height · 4-side frost frame · FlipIt-center / HUD-right glide · token-aware highlight · default part 1.250×3.375 + Flip visual + nest box | remasure `offsetHeight` · 420ms glide · `G`+digits only · `#lb-part` / `#lb-nest-box` |
| **R13** | Preset write-mode visible · Confirm stores armed slot only · main OK applies live fields to HUD + bed · single frost rail · XYZR 4dp black · front surface | `commitLiveFields` · `__bedSetBlank` · no lip/double-line · `.tok-axis` |

Hide primitives stay surface-owned (`ALIGNMENT-v3` §4). Host does not invent a shared hide API.

### R1 chrome contract

| Control | Host behavior |
|---------|----------------|
| Load | Header + blank canvas visible. Ticker/picker is the HUD. Calculator, FLiPIT, and toolPath hidden. |
| Header **FLiPIT** (`#btn-header-flipit`) | Closed → open **expanded**. Open + collapsed (e.g. after AUTO-SIZE) → **expand** (do not close). Open + expanded → **close**. X closes from any state. |
| HUD **AUTO-SIZE** (`#btn-auto-size`) | First click opens FLiPIT **collapsed** (never expanded). No source → toast `LOAD A PROGRAM TO AUTO-SIZE`. If FLiPIT is already open **and** collapsed, a second click **closes** it (does not re-run detect). In-panel `#btn-detect` still sizes. Footer chips stay mounted in HUD calculator mode. Label stays **AUTO-SIZE**. |
| FLiPIT Auto-Size (`#btn-detect`) | Existing in-panel detect. Expand/collapse chrome unchanged. Arms after a real file load. |
| FLiPIT close (`#btn-close`) | `closeGcode()` + R11 `lastGcodePos`. |
| Ticker door (`#bt-door`) | Reveals or closes the attached menu-bar picker above the travel row. The row is −90, +90, blank size, calculator, chevron; picker words are Part, Gap, Margin, Reset. |
| Ticker picker field | Reveals the picker field surface and its retained parameter/preset controls. The calculator button does not reveal that surface until the picker door is open. The surface has no numeric pad. |
| FLiPIT Open (`#btn-open`) | Native local file picker. Accept `.txt`, `.nc`, `.cnc`, and `text/plain`. Load into Source. **No sample / BRACKET_PLATE fallback.** |
| Source **Clear** (`#btn-clear`) and program-name **X** (`#prog-clear`) | Full unload: empty source + output, no bounds, status none, detect unarmed, process idle, program name cleared. Not name-only. |
| Output tab (`#tab-output`) | Gated (`is-gated`, `aria-disabled`) until Output has content after Flip IT. No hover, click does nothing, lighter gray than Source. Live after process. |
| Stage status (`#stage-status`) | READY / DONE are inset indicators, not raised buttons. READY lettering `--ink-30`. Glow 1.7px (was 2.2px). Not clickable. FLIP IT / START OVER unchanged. |
| HUD popovers | Keep ALIGNMENT z 50. Placement/clamp only: prefer right → left → bottom → top, then shift so the popover does not cover an open FLiPIT card or the active `#lb-blank`. Viewport inset **16px** (not flush to the edge). |
| HUD motion | Collapse uses FlipIt `240ms` `grid-template-rows` 0fr/1fr. Param↔calc: stacked `#hud-stage` height + opacity (no `display` swap). Header radius and bottom-border-color ease with the close. Calc→collapse keeps calc visible until 0fr ends. |
| Blank → calculator | Blank drag updates ticker and revealed calculator Blank fields via `__hudSyncBlank` (`fmt3`). Its Fit scale is snapshotted at pointer-down and remains fixed through pointer-up; explicit Fit recomputes framing. Host-only; no product backend. |
| Collapsed HUD part ticker | Hidden mid-close. Fade starts as 0fr finishes (`is-settled` immediate + **160ms** delay, then 240ms fade). Instant hide on expand (no mid-open flash). |
| FlipIt surface lead | GC0DE ↔ chevron+Source/Output opacity fade (`var(--dur)`). R3/R4 open/close contracts unchanged. |
| Blank z-order | `#lb-blank` lives in the world (behind cards). Ticker cluster **82** shares the front surface with zoom **82** and HUD **80**. Overlay `#lb-blank-layer` **10** is arc + hits only. |
| Free-corner grab | Outside quarter-arc (~18px, 2px stroke). `#lb-hit-corner` is a circle on the arc midpoint (XY resize). Green stroke on arc while `lb-dragging-xy`. Blank outline glow is **−50% of R9** (0.6px / 0.14) and clipped to the bed (`#lb-bed-clip`) so rulers stay unlit. |
| Card layout | Opened cards start 20px below canvas well viewport top, clearing the fixed header. FlipIt centers; calculator uses right slot; user drag wins until next rearrange. |
| Header controls | `#lb-zoom-in` / `#lb-zoom-out` / `#lb-fit` and `#btn-header-flipit` are mounted in the fixed header above canvas and cards, so the stage cannot intercept them. |
| FlipIt unit switch | IN/MM labels flex-centered to the track background. |
| HUD presets | Blank, Gap, Margin only (not Part). Everyday filled-chip click **loads only** (no arm, no save prompt). Pencil **Edit** enters a visible write mode (confirm bar + chip ring; not a dead lit pencil). Only then can a slot be armed; Confirm stores the armed slot from **live fields**, toasts `Preset saved`, and exits edit; Cancel exits without writing. Main Save/OK **always** commits current live field values to the HUD ticker **and** the bed blank via `__bedSetBlank` and never writes a preset. Enter in a numeric field settles/formats that field and does not close the popover. `localStorage` key `howmany.flipit.v3.presets`. |
| Margin ticker | Two-line summary grows the ticker (`:has(.m-line)` min-height 40px) and remasures `#hud-stage` so the row is not clipped. Collapse timing unchanged. |
| Ruler rails | One equal-width frost-blue **rail on all four sides**. No outer lip / no double-line. Ticks/numbers remain only on bottom X and left Y, fully inside the blue. |
| HUD height | Single-row Margin (`0.250 all`) uses the compact 28.6 ticker. Stage height is remasured from in-flow `offsetHeight` (not popover `scrollHeight`). Opening/closing a popover returns HUD to the current ticker-row height. Two-row margin still grows live. |
| Source highlight | Token-aware: letter + digits, not in-word matches. `Go to part` / `PAR` stay uncolored. Magenta G + green comments stay the palette bases. X/Y/Z/R letters **and** values render black and format to **4 decimal places** in the highlighted view only. |
| Bed part | Default **1.250 × 3.375**. `#lb-part` follows HUD part size. Flip IT rotates it on the bed. Dotted `#lb-nest-box` is the margin-inset reference nest. |

---

## Not wired

- FLiPIT **Post → HUD/bed** part-size hydrate
- Real toolpath geometry (demo fixture only)
- Drag-clamp unification (ALIGNMENT §6 still deferred)
- Runtime shared module / `window.FlipItV3` (host uses thin `__flipit*` / `__hud*` hooks only)

### Sandbox tools — omitted

Sandbox **isolator** (z 90) and **child-spec** panel are **not** in this host. They remain optional non-product tools on the historical composition archive.

---

## How to open

From the NestCalc clone (any non-colliding port; **8091** used here):

```bash
cd /Users/computer/wrecklesstoddler/vibe/projects/NestCalc
python3 -m http.server 8091
```

Then: [http://127.0.0.1:8091/docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html](http://127.0.0.1:8091/docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html)

Do not require `file://`.

---

## How to use

1. Open the composition URL above.
2. Verify header hard-stops blank canvas well; only blank is drawn (no grid, rim, rulers, nest box, or part). Fit frames blank + gutter without changing BL origin or size.
3. Verify ticker + picker are visible at blank, while the picker field surface, FLiPIT, and toolPath are hidden.
4. Click picker, then Part, Gap, or Margin: only the selected field chip and retained preset controls appear below the header. No numeric keypad or legacy HUD-card chrome appears. Click again: the surface and popovers dismiss, leaving ticker + picker.
5. Resize or Fit blank and verify ticker remains 10px above blank in viewport coordinates, below header.
6. FLiPIT Open still picks real local `.txt` / `.nc` / `.cnc` file and loads Source. No sample program.
7. Blank, Gap, and Margin chips on the revealed picker field surface open preset popovers and clamp off open cards and active blank.
8. FLiPIT waypoints still toggle toolPath (R17 / R27). Opened cards clear fixed header; user drag wins until next rearrange.
9. Any residual that changes a **surface** belongs in that surface’s individual package first; then re-assemble.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-08-17 | First FlipIt composition host. Inline four locked individuals. R17 waypoints↔toolPath · R27 toolPath hidden · R29 LaserBed canvas · R30 HUD hold from tip. Toast z 35. Isolator/child-spec omitted. |
| 2026-08-17 | **R1** `NC-FLIPIT-20260817-R1`. Boot HUD-only. HUD ↔ FLiPIT chrome. AUTO-SIZE from HUD + calculator paths. Real local file open (no sample). Popover clamp avoids FLiPIT + bed blank. Calc chip → HUD calculator. |
| 2026-08-17 | **R2** `NC-FLIPIT-20260817-R2`. AUTO-SIZE opens FLiPIT collapsed only; 2nd click detects. `#bt-calc` expands collapsed HUD to params (toggle calc only when already expanded). `#hud-body` height follows param/calc. Popover inset 16px. |
| 2026-08-17 | **R3** `NC-FLIPIT-20260817-R3`. `#bt-calc` from collapsed shows params only (no stale calc body). FLiPIT chip: closed→expand · collapsed-open→expand · expanded→close. Source Clear + name X fully unload. |
| 2026-08-17 | **R4** `NC-FLIPIT-20260817-R4`. AUTO-SIZE 2nd click closes collapsed FlipIt. Output tab gated until Flip IT. READY/DONE inset status, READY type lighter gray, glow 1.7px. |
| 2026-08-17 | **R5** `NC-FLIPIT-20260817-R5`. HUD felt rushed because `applyBodyHeight()` snapped `minHeight` and calc swapped `display` with no transition, so the 600ms grid ease never carried the shell; FlipIt only eases `grid-template-rows` at 240ms. Align HUD to 240ms + ease `min-height`. Bed blank live-syncs HUD Blank. `#bt-calc` floats outside the ticker pill. |
| 2026-08-17 | **R6** `NC-FLIPIT-20260817-R6`. Snap/flash came from `display` toggles plus instant `calc-mode` teardown, and header radius flipped on class before 0fr finished. Stack modes and ease `#hud-stage` height; sync header radius; defer calc clear until collapse ends. |
| 2026-08-17 | **R7** `NC-FLIPIT-20260817-R7`. Collapsed part ticker fades after settle. FlipIt surface chrome fades. Blank overlay + ticker above HUD. Square 34px `#bt-calc` at 3px. Inner free-corner square replaced by outside arc grab with drag glow. |
| 2026-08-17 | **R8** `NC-FLIPIT-20260817-R8`. Larger outside arc. Ticker fade starts as collapse ends (160ms delay). toolPath open-space spawn + FlipIt-center / toolPath-left / HUD-right profile. Blank body back on the bed; ticker stays above HUD. Resize glow on blank outline. Lock button + HUD-sized calc. Unit switch labels centered to the track. Blank/Gap/Margin A/B presets. |
| 2026-08-17 | **R9** `NC-FLIPIT-20260817-R9`. Removed blank lock. Calc button matches ticker height (34²) with HUD header chrome. Resize glow −60% and clipped to the bed. Cards top-aligned at 25px and equally spaced; FlipIt stays the focus slot. Zoom chrome z 80. Preset chips black + reverse shadow; armed Save toasts “Preset saved” inside the popover. Two-line margin ticker remasures HUD height. Frost-blue ruler rails under the ticks. |
| 2026-08-17 | **R10** `NC-FLIPIT-20260817-R10`. `#bt-calc` hover keeps icon/chrome (lighten fill only). Glow cut another 50%. Rails extend past the grid and sit outside the numbers. Preset Confirm/Cancel is separate from main Save. Three-card top layout re-applies whenever TP+FlipIt+HUD become complete; drag wins until the next rearrange. |
| 2026-08-17 | **R11** `NC-FLIPIT-20260817-R11`. Filled preset chips load only. Pencil Edit is required to write a slot via Confirm/Cancel. Rails start on the origin, fill the band, and overhang the far end only. |
| 2026-08-17 | **R12** `NC-FLIPIT-20260817-R12`. Compact HUD height after popover close. Four-side frost frame; numbers inside the blue. FlipIt centers and HUD rights with a 420ms glide. Token-aware G-code highlight. Default part 1.250×3.375, Flip visual rotate, dotted nest box. |
| 2026-08-17 | **R13** `NC-FLIPIT-20260817-R13`. Blank/Gap/Margin: Edit is a visible write mode; Confirm stores the armed slot from live fields; Cancel exits without writing; main OK applies live values to HUD + bed and never writes a preset (Blank 12×12 no longer reverts). Enter settles a numeric field without closing the popover. Single equal-width frost-blue rail (no outer lip). Highlighted X/Y/Z/R are black at 4 decimal places. Ticker + calc, HUD, and zoom share the front surface; `#bt-calc` hover stays visible. |
| 2026-09-01 | **R31** ticker-door chrome port: retained the 127 blank-in-space stage and moved only the ticker-door menu bar onto it. The picker opens above the −90/+90, blank-size, calculator, chevron travel row; no bed, grid, ruler, nest box, or Numeric HUD card is restored. |
| 2026-09-01 | **R32** review remediation: selecting Part exposes its retained calculator controls; ticker placement uses the live cluster height rather than the former 34px constant. |
