# FlipIt — Composition host — Living SPEC

**Status:** Living (residual R13 — preset write-mode + OK apply, single rail, XYZR 4dp, front surface)  
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
| **R29** | Full-viewport primary canvas = LaserBed | authority `LASER-BED-v3.html` under `.bed-stage` · origin BL · Fit = zoom/center only (blank size unchanged) |
| **R30** | HUD position hold | from Numeric HUD tip (collapse/expand never writes left/top) · never set `display` on `#hud-body` |
| **R1** | Boot HUD open / FLiPIT closed · HUD ↔ FLiPIT chrome · AUTO-SIZE from HUD + calc paths · real local file open · popover clamp | hide primitive `display:none` + `is-open` on `#gcode` · `#btn-gcode` toggles · `#btn-auto-size` + `#btn-detect` run Auto-Size · `#bt-calc` toggles HUD calculator · `#flipit-file-input` accepts `.txt` / `.nc` / `.cnc` / `text/plain` |
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
| **R12** | Compact single-row HUD height · 4-side frost frame · FlipIt-center / HUD-right glide · token-aware highlight · default part 1.250×3.375 + Flip visual + nest box | remasure `offsetHeight` · 420ms glide · `G`+digits only · `#lb-part` / `#lb-nest-box` |
| **R13** | Preset write-mode visible · Confirm stores armed slot only · main OK applies live fields to HUD + bed · single frost rail · XYZR 4dp black · front surface | `commitLiveFields` · `__bedSetBlank` · no lip/double-line · `.tok-axis` |

Hide primitives stay surface-owned (`ALIGNMENT-v3` §4). Host does not invent a shared hide API.

### R1 chrome contract

| Control | Host behavior |
|---------|----------------|
| Load | Numeric HUD open at (25,25). FLiPIT closed (`display: none`, no `is-open`). toolPath hidden (R27). |
| HUD **FLiPIT** (`#btn-gcode`) | Closed → open **expanded**. Open + collapsed (e.g. after AUTO-SIZE) → **expand** (do not close). Open + expanded → **close**. X closes from any state. |
| HUD **AUTO-SIZE** (`#btn-auto-size`) | First click opens FLiPIT **collapsed** (never expanded). No source → toast `LOAD A PROGRAM TO AUTO-SIZE`. If FLiPIT is already open **and** collapsed, a second click **closes** it (does not re-run detect). In-panel `#btn-detect` still sizes. Footer chips stay mounted in HUD calculator mode. Label stays **AUTO-SIZE**. |
| FLiPIT Auto-Size (`#btn-detect`) | Existing in-panel detect. Expand/collapse chrome unchanged. Arms after a real file load. |
| FLiPIT close (`#btn-close`) | `closeGcode()` + R11 `lastGcodePos`. |
| LaserBed calc chip (`#bt-calc`) | HUD collapsed → expand to **param** mode only (do not enter calculator; clear leftover classic-calc `display`). HUD already expanded → toggle calculator. After exit / collapse / expand, `#hud-body` height matches the active mode. Square side = blank ticker height (**34**). HUD header chrome language (radius / border / fill). Icon 22px. 3px gap. Hover **lightens the dark fill only** — icon and chrome stay visible (no transparent wash). |
| FLiPIT Open (`#btn-open`) | Native local file picker. Accept `.txt`, `.nc`, `.cnc`, and `text/plain`. Load into Source. **No sample / BRACKET_PLATE fallback.** |
| Source **Clear** (`#btn-clear`) and program-name **X** (`#prog-clear`) | Full unload: empty source + output, no bounds, status none, detect unarmed, process idle, program name cleared. Not name-only. |
| Output tab (`#tab-output`) | Gated (`is-gated`, `aria-disabled`) until Output has content after Flip IT. No hover, click does nothing, lighter gray than Source. Live after process. |
| Stage status (`#stage-status`) | READY / DONE are inset indicators, not raised buttons. READY lettering `--ink-30`. Glow 1.7px (was 2.2px). Not clickable. FLIP IT / START OVER unchanged. |
| HUD popovers | Keep ALIGNMENT z 50. Placement/clamp only: prefer right → left → bottom → top, then shift so the popover does not cover an open FLiPIT card or the active `#lb-blank`. Viewport inset **16px** (not flush to the edge). |
| HUD motion | Collapse uses FlipIt `240ms` `grid-template-rows` 0fr/1fr. Param↔calc: stacked `#hud-stage` height + opacity (no `display` swap). Header radius and bottom-border-color ease with the close. Calc→collapse keeps calc visible until 0fr ends. |
| Bed blank → HUD | LaserBed drag updates HUD Blank ticker + popover via `__hudSyncBlank` (`fmt3`). Host-only; no product backend. |
| Collapsed HUD part ticker | Hidden mid-close. Fade starts as 0fr finishes (`is-settled` immediate + **160ms** delay, then 240ms fade). Instant hide on expand (no mid-open flash). |
| FlipIt surface lead | GC0DE ↔ chevron+Source/Output opacity fade (`var(--dur)`). R3/R4 open/close contracts unchanged. |
| Blank z-order | `#lb-blank` lives in the world (behind cards). Ticker cluster **82** shares the front surface with zoom **82** and HUD **80**. Overlay `#lb-blank-layer` **10** is arc + hits only. |
| Free-corner grab | Outside quarter-arc (~18px, 2px stroke). `#lb-hit-corner` is a circle on the arc midpoint (XY resize). Green stroke on arc while `lb-dragging-xy`. Blank outline glow is **−50% of R9** (0.6px / 0.14) and clipped to the bed (`#lb-bed-clip`) so rulers stay unlit. |
| Card layout | FlipIt **always glides to viewport center** when opened (FLiPIT or AUTO-SIZE). HUD **always glides to the right slot** on that rearrange, even if toolPath is closed. All three: TP left · FlipIt center · HUD right, 25px top band. Travel is a 420ms ease glide (not a teleport). User drag still wins until the next open/rearrange. |
| Zoom chrome | `#lb-zoom-in` / `#lb-zoom-out` / `#lb-fit` z **82** — shares the front surface with blank ticker + calc and Numeric HUD. |
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
2. Verify LaserBed fills the viewport (BL origin, 48×48 fit, blank 12×8, right-pin ticker, Fit does not reset blank).
3. Verify Numeric HUD (16,16) is the only card open. FLiPIT and toolPath are absent.
4. HUD **FLiPIT** opens FLiPIT expanded. If FlipIt is already open and collapsed, FLiPIT expands it. If expanded, FLiPIT closes it. X closes from any state.
5. HUD **AUTO-SIZE** opens FLiPIT **collapsed** and toasts if no program. A second click while collapsed **closes** FlipIt. `#btn-detect` still sizes. HUD FLiPIT cycle from R3 is unchanged.
6. FLiPIT Open picks a real local `.txt` / `.nc` / `.cnc` file and loads Source. No sample program.
7. HUD tickers open popovers; placement stays outside the HUD and clamps off open FLiPIT and the bed blank. Collapse/expand holds left/top (R30).
8. FLiPIT waypoints still toggle toolPath (R17 / R27). When toolPath + FlipIt + HUD are all open, they re-pack in a 25px top band (toolPath · FlipIt · HUD) every time that set becomes complete. User drag wins until the next three-open rearrange.
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
