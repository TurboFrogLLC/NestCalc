# FlipIt — Composition host — Living SPEC

**Status:** Living (two-box ticker — Cut D: three-decimal ticker inputs)
**Product:** **FlipIt**  
**Repo:** `TurboFrogLLC/NestCalc` (do not rename)  
**HTML:** `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`  
**Branch:** `docs/flipit-v3-refinements`  
**Trace:** `NC-FLIPIT-20260817-R13`  
**Host tip blob:** `a5171b91ba3841bdcd85da60bc8625e0db9b11ea`  
**Class:** Exploratory composition host only · not product GOAL · not a shared import  

**Host rule**  
This file is the **host only**. The four individual HTML tips stay standalone lock files. Do not overwrite them from this assembly. Do not add `flipit-v3-align.js` or `@import` into the tips.

Prior composition/lock archives (`COMPOSITION-HUD-DECODER-v3.*`, `DE-CODER-v3-LOCKED.*`) stay on disk. They are not this host.

---

## Surfaces

| Surface | Selector / id | Authority | z-index |
|---------|---------------|-----------|--------:|
| LaserBed world | `.bed-stage` · `#laser-bed-host` | `LASER-BED-v3.SPEC.md` · tip `40224e68` | 0 |
| Blank body | `#lb-blank` (in `#lb-camera`) | host — sits on the bed, behind cards | **0** |
| LaserBed chrome (zoom) | `.lb-chrome` | host front surface with ticker + HUD | **82** |
| Blank hits + arc overlay | `#lb-blank-layer` | grab targets only | **10** |
| HowMany count | `#lb-count` (in `#lb-blank-layer`, past `#lb-hit-corner` on the 45° ray) | host — live `calculateNest` total | **10** |
| toolPath | `#backplot.toolpath` | `TOOLPATH-v3.SPEC.md` · tip `2e9e2ace` | 20 |
| FLiPIT | `#gcode` · class `.gcode` | `FLIPIT-v3.SPEC.md` · tip `37d628e9` | 30 |
| FLiPIT toast | `#gcode-toast` | host override of standalone 40 | **35** |
| Numeric HUD | `#hud` | `NUMERIC-HUD-v3.SPEC.md` · tip `bec93ffa` | **80** |
| Blank ticker cluster | `#blank-ticker-cluster` | host raise; shares front surface with HUD + zoom | **82** |
| HUD popover | `.param-popover` | same (inside HUD stacking context) | 50 |

Z-index scale is from `ALIGNMENT-v3.SPEC.md`. Overlay cards sit **inside** `.bed-stage` so those bands share one stacking context.

R8 z-order: blank **body** is back on the world (behind cards). R13: blank ticker + calc, Numeric HUD, and zoom share the front interactive surface (80/82) ahead of other bed chrome. `#bt-calc` hover keeps icon/chrome (no hover-disappear).

Wordmarks stay as locked: **FLiP** white 700 + **IT** amber 800 · **tool** white 700 + **Path** amber 800.

---

## Bridges wired

| ID | Behavior | Primitive |
|----|----------|-----------|
| **R17** | FLiPIT Source + Output waypoints (`#btn-toolpath-src` · `#btn-toolpath-out`) toggle toolPath | class `is-hidden` on `#backplot` · `aria-pressed` sync · `__setToolpathOpen` |
| **R27** | toolPath boots hidden | HTML `is-hidden` + `setToolpathOpen(false)` |
| **R29** | Full-viewport primary canvas = LaserBed | authority `LASER-BED-v3.html` under `.bed-stage` · origin BL · default and Fit = blank-fit with 2in air; blank size unchanged |
| **R30** | HUD position hold | from Numeric HUD tip (collapse/expand never writes left/top) · never set `display` on `#hud-body` |
| **R1** | Boot HUD open / FLiPIT closed · HUD ↔ FLiPIT chrome · HowMany `#lb-count` · AUTO-SIZE does **not** open FLiPIT · real local file open · popover clamp | hide primitive `display:none` + `is-open` on `#gcode` · `#btn-gcode` toggles · `#btn-auto-size` does not open FLiPIT · `#btn-detect` still sizes · `#bt-calc` toggles HUD calculator · `#flipit-file-input` accepts `.txt` / `.nc` / `.cnc` / `text/plain` · `#lb-count` from `calculateNest` |
| **R2** | AUTO-SIZE opens FLiPIT **collapsed only** · 2nd click detects · `#bt-calc` expand-to-params when HUD collapsed · HUD body height matches active mode · tighter popover inset | `openGcode(false)` from `#btn-auto-size` · detect only when already open+collapsed · `__hudFromBedCalc` · `applyBodyHeight()` · popover edge **16px** / FlipIt avoid **12px** |
| **R3** | `#bt-calc` from collapsed expands to **params only** (clear stale calc display) · HUD FLiPIT 3-step cycle · source Clear + name X fully unload | `applyModeVisibility` never leaves classic-calc `display:flex` while collapsed · `toggleGcode` closed→expand / open-collapsed→expand / expanded→close · `unloadProgram()` |
| **R4** | AUTO-SIZE 2nd click **closes** collapsed FlipIt · Output tab gated until Flip IT · READY/DONE inset status | `__flipitAutoSize` closes when already open+collapsed (no re-detect) · `#tab-output.is-gated` until `hasOutput()` · stage-status inset + 1.7px glow · READY type `--ink-30` |
| **R5** | HUD motion matches FlipIt · bed blank → HUD Blank live · `#bt-calc` floats outside ticker | `--motion-collapse/expand/mode` **240ms** + `min-height` eased · `__hudSyncBlank(w,h)` from LaserBed `render()` · `#blank-ticker-cluster` |
| **R6** | HUD param↔calc stacked opacity crossfade · header radius eases with 0fr · calc→collapse does not flash params | `#hud-stage` height 240ms · no `display` swap · header `border-radius` + `border-bottom-color` 240ms · defer `calc-mode` clear until collapse end |
| **R7** | Collapsed HUD part ticker fade · FlipIt GC0DE↔tabs fade · square `#bt-calc` · outside-arc corner grab | `.is-settled` + 240ms fade · `.surface-lead` opacity · `#bt-calc` square / 3px gap · `#lb-corner-arc` 2px |
| **R8** | Bigger arc · fade as collapse ends · toolPath open-space + multi-card arrange · blank body behind cards · resize glow · lock + HUD-sized calc · unit align · Blank/Gap/Margin presets | arc ~18px · ticker fade delay 160ms · `__hostArrange` · `#lb-blank` in world · `#bt-calc` 28.6² · `localStorage` presets |
| **R9** | Remove blank lock · calc = ticker height · glow −60% bed-clipped · top-band equal cards · zoom front · preset chips + toast · two-line margin · frost-blue rails | no `#bt-lock` · `#bt-calc` 34² · bed `clipPath` · `__hostArrange` top 25 · `.lb-chrome` z **80** |
| **R10** | Calc hover stays visible · glow −50% again · rails past grid + Y outside numbers · preset Confirm/Cancel · 3-card layout re-applies on every complete set | hover fill opaque · glow 0.6px/0.14 · `__hostArrange` forces TP·FlipIt·HUD |
| **R11** | Preset everyday load vs explicit edit/write · rails butted to origin, filled full length + far overhang | `[data-pre-edit]` · Confirm/Cancel only in edit · rails from 0,0 |
| **R12** | Compact single-row HUD height · 4-side frost frame · FlipIt-center / HUD-right glide · token-aware highlight · default part 1.250×3.375 + Flip visual + nest box | remasure `offsetHeight` · 420ms glide · `G`+digits only · `#lb-nest-box` |
| **R13** | Preset write-mode visible · Confirm stores armed slot only · main OK applies live fields to HUD + bed · single frost rail · XYZR 4dp black · front surface | `commitLiveFields` · `__bedSetBlank` · no lip/double-line · `.tok-axis` |
| **R14** | Temporary HUD HexNest entry lays out one same-diameter round type on the blank | `#btn-hex-nest` + `#hex-diameter` → `/howmany-shell` `hex-nest-layout` / `hex-nest-inset` → `src/lib/hexNest.ts` |
| **Two-box ticker** | Travel box + picker box with **8px air** and flush right edges. Cut A: hits/inputs **28**, pad **6 T/B · 8 L/R**, item gap **2**, hit/input/shell radius **8**, outer **42.2**, travel icon **18**. Calc lives in travel. Door chevron last. Edit replaces travel. Picker chips are words only (Part / Gap / Margin / Reset). Bed ticker and Bed Presets face inputs cap at **3 decimal places** through the same HUD popover sanitizer. A cleared ticker or preset-face field is visibly rejected and focused on either Send action; no hidden prior draft may be sent. Send (`square-arrow-out-up-right`) writes the ticker draft to the HUD Bed Presets row for Blank/Gap/Margin: first empty unless a slot was explicitly lit during this visit. Not `.param-popover` WRITE. Gap/XY first paint: X ≠ Y → link off. Ticker/picker do not call `__howManyOpenField`. | `#bt-travel-box` · `#bt-picker` · `#bt-edit` · `#preset-door` |

Hide primitives stay surface-owned (`ALIGNMENT-v3` §4). Host does not invent a shared hide API.

### R1 chrome contract

| Control | Host behavior |
|---------|----------------|
| Load | Numeric HUD open at (25,25). FLiPIT closed (`display: none`, no `is-open`). toolPath hidden (R27). |
| HUD **FLiPIT** (`#btn-gcode`) | Closed → open as the **flip-angle strip**. The resting panel has only 0°, 90°, −90°, and 180° choices; no code is on stage. At phone width, the card stays inside the viewport, rises above the HUD, and the strip divides its inner width into four equal shares minus the three gaps, so every label fits. Choosing an angle earns the editor. X closes from any state. |
| Mobile-fit | On a phone portrait viewport, the open FLiPIT/editor and HUD scale into a centered **75% width** card stack, preserving equal left/right bed gutters. On phone landscape, the editor scales to **75% height** with equal top/bottom bed gutters and the HUD sits alongside it. Rotation changes re-arrange the open cards. The angle strip remains four equal shares and all 0°, 90°, −90°, and 180° labels stay visible while the earned one-pane editor is open. |
| HUD **AUTO-SIZE** (`#btn-auto-size`) | Opens the native `.txt` / `.nc` / `.cnc` picker while FLiPIT stays closed. The first loaded NC hydrates manual part bounds, sizes the blank to the part plus current margins, and refreshes the existing HowMany join, count, and tiles. A loaded job asks before replacement. Does not call `openGcode` / `__flipitAutoSize`. In-panel `#btn-detect` still sizes. Footer chips stay mounted in HUD calculator mode. Label stays **AUTO-SIZE**. |
| Blank ticker two-box (`#blank-ticker-cluster`) | Travel box: `[ −90 ][ +90 ]  readout  [calc] [▾]`. Outer **42.2** (28 + 6 + 6 + 1.1 + 1.1). Hits and edit inputs **28**. Pad **6 T/B · 8 L/R**. Item gap **2**. Hit, input, and shell radius **8**. Picker open slides travel up by picker height + **8px air**, with its right edge flush to travel. Picker chips are words only (Part / Gap / Margin / Reset). Click a field chip (or the readout) turns the travel box into the field — axis letters on the bar (Part/Gap **X Y**, Margin **L R B T**); lit picker chip is the label. Focus select-all on edit inputs. The bed ticker and the Bed Presets face both cap input at **3 decimal places** via the HUD popover sanitizer. OK commits, Cancel drops the draft. Send (`square-arrow-out-up-right`) saves the current ticker draft into the first empty slot, unless the user explicitly lit a slot during that open Bed Presets visit, then opens that face; closing the face keeps the seeded slot. It does not apply the draft to the bed or open the floating WRITE card. Gap link first paint: X ≠ Y → link off. Reset runs on the picker. Ticker `dblclick` does not open HUD. No `__howManyOpenField` from ticker or picker. |
| HowMany count (`#lb-count`) | Live quantity past `#lb-hit-corner` on the same 45° ray as the corner handle. **24px screen-space count mark**. `pointer-events: none`. `#lb-hit-corner` is unmoved. Written from `calculateNest` via FIELD_BINDINGS → `createNestSession` (manual) → `session.result.manual.totalParts`. `convertValue` runs on this join. Just the number. Not on the parts. Not in the ticker stack. |
| Nest tiles (`#lb-nest-tiles`) | The same `/howmany-shell` POST response that writes `#lb-count` returns the manual `NestResult`. The blank paints one rect per `partsAcross × partsDown`, at the margin origin with the current part size and X/Y gaps. The host does layout only; it does not inline a second calculator or call AutoNest. |
| HexNest (`#btn-hex-nest`) | Temporary HUD entry until table 7 morph. `#hex-diameter` is the one round-part input. The engine returns equal-diameter bounding boxes with centered tangent circles in exactly two alternating offset rows; the HUD shows the X offset and tighter Y row gap. The `0:0` row-1 margin-origin part is gold and locked. Dragging a row-2 circle asks the engine to inset it, then shifts the movable row-1 parts within the blank. `#lb-count` is the HexNest total and manual HowMany rect tiles are hidden in this mode. No HexNest geometry is calculated in the host document. |
| FLiPIT Auto-Size (`#btn-detect`) | Existing in-panel detect. After a real NC load or **Apply**, it reads `analyzeGCode` bounds through `/howmany-shell`; the chip displays the analyzed X/Y spans and retains the raw origin bounds in its title. Expand/collapse chrome unchanged. Editing re-arms detect. |
| FLiPIT close (`#btn-close`) | `closeGcode()` + R11 `lastGcodePos`. |
| LaserBed calc chip (`#bt-calc`) | HUD collapsed → expand to **param** mode only (do not enter calculator; clear leftover classic-calc `display`). HUD already expanded → toggle calculator. After exit / collapse / expand, `#hud-body` height matches the active mode. Hit square **28** inside the **42.2** travel box. Travel icon **18**. 2px gap. Hover **lightens the dark fill only** — icon and chrome stay visible (no transparent wash). |
| FLiPIT editor | One earned pane only. It is not a Source + Output pair. Editing is local until **Apply**; Apply writes the editor state, then invokes the existing manual HowMany join. No live-while-typing join. |
| FLiPIT Open (`#btn-open`) | Native local file picker. Accept `.txt`, `.nc`, `.cnc`, and `text/plain`. Load into the earned editor. **No sample / BRACKET_PLATE fallback.** |
| Editor **Clear** (`#btn-clear`) and program-name **X** (`#prog-clear`) | Full unload: empty editor, no bounds, status none, detect unarmed, process idle, program name cleared. Not name-only. |
| Stage status (`#stage-status`) | READY / DONE are inset indicators, not raised buttons. READY lettering `--ink-30`. Glow 1.7px (was 2.2px). Not clickable. **Apply** commits the earned editor, then joins HowMany. |
| HUD popovers | Keep ALIGNMENT z 50. Placement/clamp only: prefer right → left → bottom → top, then shift so the popover does not cover an open FLiPIT card or the active `#lb-blank`. Viewport inset **16px** (not flush to the edge). |
| HUD motion | Collapse uses FlipIt `240ms` `grid-template-rows` 0fr/1fr. Param↔calc: stacked `#hud-stage` height + opacity (no `display` swap). Header radius and bottom-border-color ease with the close. Calc→collapse keeps calc visible until 0fr ends. |
| Bed blank → HUD | LaserBed drag updates HUD Blank ticker + popover via `__hudSyncBlank` (`fmt3`). Host-only; no product backend. |
| Collapsed HUD part ticker | Hidden mid-close. Fade starts as 0fr finishes (`is-settled` immediate + **160ms** delay, then 240ms fade). Instant hide on expand (no mid-open flash). |
| FlipIt surface lead | GC0DE ↔ chevron+Source/Output opacity fade (`var(--dur)`). R3/R4 open/close contracts unchanged. |
| Blank z-order | `#lb-blank` lives in the world (behind cards). Ticker cluster **82** shares the front surface with zoom **82** and HUD **80**. Overlay `#lb-blank-layer` **10** is arc + hits only. |
| Free-corner grab | Outside quarter-arc (~18px, 2px stroke). `#lb-hit-corner` is a circle on the arc midpoint (XY resize). Green stroke on arc while `lb-dragging-xy`. Blank outline glow is **−50% of R9** (0.6px / 0.14) and clipped to the bed (`#lb-bed-clip`) so rulers stay unlit. |
| Card layout | FlipIt **always glides to viewport center** when opened through FLiPIT. HUD **always glides to the right slot** on that rearrange, even if toolPath is closed. All three: TP left · FlipIt center · HUD right, 25px top band. Travel is a 420ms ease glide (not a teleport). User drag still wins until the next open/rearrange. |
| Zoom chrome | `#lb-zoom-in` / `#lb-zoom-out` / `#lb-fit` z **82** — shares the front surface with blank ticker + calc and Numeric HUD. Default, Fit, viewport resize, and phone rotation center the blank with 2in air on every side through the same blank-fit path. Wheel zoom remains available. The bed is static: canvas drags do not pan it, and resizing the blank does not live re-fit the camera. |
| FlipIt unit switch | IN/MM labels flex-centered to the track background. |
| HUD presets (`#preset-door`) | HUD shell, expand behavior, and card size stay. The numeric pad is replaced by a Bed Presets face: **Blank**, **Gap**, and **Margin** rows only; each has slots **1–5** and **+**. No Part row, material tree, or legacy A/B preset chips. Selecting a slot lights it, reloads the door height after the new row renders, and loads it into the in-panel ticker; collapse then expand re-runs `sizePresetDoor` so the active face remains unclipped. Typing updates that slot only and does not affect the laser bed. `+` selects the first empty slot (or 5 if full). A cleared in-panel value visibly blocks **Send to bed** rather than sending its hidden previous draft. **Send to bed** saves the lit slot then hydrates Blank, Gap, or all four Margin values onto the laser ticker and bed, whether the picker is open or shut, and exits a matching ticker edit so stale OK cannot overwrite the send. Travel calc opens this face on Blank when no ticker field is in edit. Storage remains the single slots 1–5 schema at `howmany.flipit.v3.presets`. |
| HUD viewport clamp | Opening calculator or Bed Presets keeps `#hud` inside the visible webview. On a phone with FLiPIT closed, it is unscaled, clamps above the ticker when space permits, and layers above the ticker instead of retaining the initial `25,25` placement. The 75% HUD scale is reserved for the open FLiPIT composition. |
| Margin ticker | Two-line summary grows the ticker (`:has(.m-line)` min-height 40px) and remasures `#hud-stage` so the row is not clipped. Collapse timing unchanged. |
| Ruler rails | One equal-width frost-blue **rail on all four sides**. No outer lip / no double-line. Ticks/numbers remain only on bottom X and left Y, fully inside the blue. |
| HUD height | Single-row Margin (`0.250 all`) uses the compact 28.6 ticker. Stage height is remasured from in-flow `offsetHeight` (not popover `scrollHeight`). Opening/closing a popover returns HUD to the current ticker-row height. Two-row margin still grows live. |
| Source highlight | Token-aware: letter + digits, not in-word matches. `Go to part` / `PAR` stay uncolored. Magenta G + green comments stay the palette bases. X/Y/Z/R letters **and** values render black and format to **4 decimal places** in the highlighted view only. |
| Bed part | The manual HowMany join paints `#lb-nest-tiles` from the returned `NestResult`, part size, margins, and gaps. Dotted `#lb-nest-box` is the margin-inset reference nest. |

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
2. Verify LaserBed opens blank-fit: the 12×8 blank is centered with 2in air around it (not a 48×48 bed-fit), the right-pin ticker follows it, and Fit returns to that blank-fit without changing the blank.
3. Verify Numeric HUD (16,16) is the only card open. FLiPIT and toolPath are absent.
4. HUD **FLiPIT** opens FLiPIT expanded. If FlipIt is already open and collapsed, FLiPIT expands it. If expanded, FLiPIT closes it. X closes from any state.
5. Blank ticker is two boxes. Travel holds ±90, readout, calc, chevron-last. Outer 42.2, hits/inputs 28, pad 6/8, item gap 2, and hit/input/shell radius 8. Picker (Part / Gap / Margin / Reset words only) sits 8px under travel with its right edge flush to travel and may stay while editing. Field chips edit in the travel box; they do not pour HUD. Send morphs `#hud` calculator presets, not the WRITE popover. Gap X ≠ Y paints link off. AUTO-SIZE does **not** open FLiPIT. `#btn-detect` still sizes. HUD FLiPIT cycle from R3 is unchanged. HowMany `#lb-count` shows the live `calculateNest` total past `#lb-hit-corner` on the 45° ray.
6. Enter a positive **Ø** and choose **HexNest**. Same-diameter circles appear in exactly two offset rows inside the margin box; each has a bounding box, `0:0` stays locked to the margin, and the HUD prints the X/Y row offsets. `#lb-count` shows the HexNest total, not the HowMany total, and manual rect tiles are absent. Drag a row-2 circle: it insets and the movable row-1 parts shift without leaving the blank.
7. FLiPIT Open picks a real local `.txt` / `.nc` / `.cnc` file and loads Source. No sample program.
8. HUD tickers open popovers; placement stays outside the HUD and clamps off open FLiPIT and the bed blank. Collapse/expand holds left/top (R30).
9. FLiPIT waypoints still toggle toolPath (R17 / R27). When toolPath + FlipIt + HUD are all open, they re-pack in a 25px top band (toolPath · FlipIt · HUD) every time that set becomes complete. User drag wins until the next three-open rearrange.
10. Any residual that changes a **surface** belongs in that surface’s individual package first; then re-assemble.

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
| 2026-08-28 | **C1** HowMany `#lb-count` in the gap by `#lb-corner-arc`. R1 kill: `#btn-auto-size` does not open FLiPIT. Join: FIELD_BINDINGS → `createNestSession` → `calculateNest` → `convertValue`. |
| 2026-08-28 | **C1** residual: `#lb-count` past `#lb-hit-corner` on the same 45° ray. `pointer-events: none`. Handle unmoved. Join unchanged. |
| 2026-08-28 | **C1** Phone-count-mark: `#lb-count` is a 24px screen-space count mark; placement remains past `#lb-hit-corner`, with pointer events disabled and the HowMany join unchanged. |
| 2026-08-28 | **C1** Mobile-fit: phone portrait centers the scaled FLiPIT/editor + HUD stack inside a 75% width box; short landscape viewport scales the editor to 75% height with the HUD alongside. Rotation re-applies the fit. One-pane Apply and the four-label angle strip remain intact. |
| 2026-08-28 | **C1 R14** HexNest: one temporary HUD diameter entry requests engine-owned offset round layout and inset. `0:0` remains locked to the margin; every returned part paints a bounding box plus tangent circle, and an upper drag shifts the movable lower row. |
| 2026-08-28 | **C1 Hex-two-row** HexNest is deliberately two rows only: a row-2 circle can inset while movable row-1 circles shift inside the blank; the origin stays locked. `#lb-count` is the returned HexNest total and manual HowMany rect tiles are hidden. |
| 2026-08-28 | **C1 Ticker-expand-door** Blank ticker stays a readout until expanded. Its one-strip door carries field chips, Part 90° (`rotateManualPart`), and Reset (`clearManualInputs`) without requiring a program. A loaded program earns AUTO-SIZE / FLiPIT on that same strip; AUTO-SIZE remains picker-only and never opens FLiPIT. |
| 2026-08-30 | **Two-box ticker** Rip Plant 1b side rail. Two containers, 8px air. Calc in travel. Chevron last. Travel vs edit. Picker may stay. Send/bookmark → `#hud` preset morph only. No ticker/picker `__howManyOpenField`. |
| 2026-08-30 | **Look-fit** Hits/inputs 28. Pad 3 T/B and 8 L/R. Radius 10. Outer 36.2. Icons 18 / 16. Picker icon-left + word. Send `square-arrow-out-up-right` morphs `#hud` calculator presets (exit calc first); not `.param-popover` WRITE. Gap link first paint: X ≠ Y → link off. |
| 2026-08-31 | **Cut A Chrome** Picker chips are words only. Travel and picker right edges flush. Pad 6 T/B, item gap 2, and hit/input/shell radius 8; outer boxes are 42.2. |
| 2026-08-31 | **Cut D Decimals** Bed ticker and Bed Presets face inputs reuse the HUD popover sanitizer to cap typed fractional values at 3 decimal places. |
| 2026-08-31 | **CA D** Cleared ticker or preset-face fields visibly block Send, and selecting a Bed Presets row reruns the existing door-height measurement. |
| 2026-08-31 | **Cut E HUD clamp** Opening calculator or Bed Presets clamps the HUD into the visible phone webview above the ticker layer. HUD remains full-size until FLiPIT opens; FLiPIT retains the 75% composition fit. |
