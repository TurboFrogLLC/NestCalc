# FlipIt — Composition host — Living SPEC

**Status:** Living (residual R1 — chrome + file open + popover clamp)  
**Product:** **FlipIt**  
**Repo:** `TurboFrogLLC/NestCalc` (do not rename)  
**HTML:** `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`  
**Branch:** `docs/flipit-v3-refinements`  
**Trace:** `NC-FLIPIT-20260817-R1`  
**Class:** Exploratory composition host only · not product GOAL · not a shared import  

**Host rule**  
This file is the **host only**. The four individual HTML tips stay standalone lock files. Do not overwrite them from this assembly. Do not add `flipit-v3-align.js` or `@import` into the tips.

Prior composition/lock archives (`COMPOSITION-HUD-DECODER-v3.*`, `DE-CODER-v3-LOCKED.*`) stay on disk. They are not this host.

---

## Surfaces

| Surface | Selector / id | Authority | z-index |
|---------|---------------|-----------|--------:|
| LaserBed world | `.bed-stage` · `#laser-bed-host` | `LASER-BED-v3.SPEC.md` · tip `40224e68` | 0 |
| LaserBed chrome (zoom) | `.lb-chrome` | same | 15 |
| toolPath | `#backplot.toolpath` | `TOOLPATH-v3.SPEC.md` · tip `2e9e2ace` | 20 |
| Blank ticker | `#blank-ticker` | `LASER-BED-v3.SPEC.md` | 22 |
| FLiPIT | `#gcode` · class `.gcode` | `FLIPIT-v3.SPEC.md` · tip `37d628e9` | 30 |
| FLiPIT toast | `#gcode-toast` | host override of standalone 40 | **35** |
| Numeric HUD | `#hud` | `NUMERIC-HUD-v3.SPEC.md` · tip `bec93ffa` | 40 |
| HUD popover | `.param-popover` | same | 50 |

Z-index scale is from `ALIGNMENT-v3.SPEC.md`. Overlay cards sit **inside** `.bed-stage` so those bands share one stacking context.

Wordmarks stay as locked: **FLiP** white 700 + **IT** amber 800 · **tool** white 700 + **Path** amber 800.

---

## Bridges wired

| ID | Behavior | Primitive |
|----|----------|-----------|
| **R17** | FLiPIT Source + Output waypoints (`#btn-toolpath-src` · `#btn-toolpath-out`) toggle toolPath | class `is-hidden` on `#backplot` · `aria-pressed` sync |
| **R27** | toolPath boots hidden | HTML `is-hidden` + `setToolpathOpen(false)` |
| **R29** | Full-viewport primary canvas = LaserBed | authority `LASER-BED-v3.html` under `.bed-stage` · origin BL · Fit = zoom/center only (blank size unchanged) |
| **R30** | HUD position hold | from Numeric HUD tip (collapse/expand never writes left/top) · never set `display` on `#hud-body` |
| **R1** | Boot HUD open / FLiPIT closed · HUD ↔ FLiPIT chrome · AUTO-SIZE from HUD + calc paths · real local file open · popover clamp | hide primitive `display:none` + `is-open` on `#gcode` · `#btn-gcode` toggles · `#btn-auto-size` + `#btn-detect` run Auto-Size · `#bt-calc` toggles HUD calculator · `#flipit-file-input` accepts `.txt` / `.nc` / `.cnc` / `text/plain` |

Hide primitives stay surface-owned (`ALIGNMENT-v3` §4). Host does not invent a shared hide API.

### R1 chrome contract

| Control | Host behavior |
|---------|----------------|
| Load | Numeric HUD open at (16,16). FLiPIT closed (`display: none`, no `is-open`). toolPath hidden (R27). |
| HUD **FLiPIT** (`#btn-gcode`) | Toggle FLiPIT open/close. `aria-pressed` + title sync. |
| HUD **AUTO-SIZE** (`#btn-auto-size`) | Open FLiPIT expanded and run Auto-Size. Works from HUD param mode **and** HUD calculator mode (footer chips stay mounted outside `#hud-mode`). No source → toast `Load a program to Auto-Size`. |
| FLiPIT Auto-Size (`#btn-detect`) | Existing calculator-path detect. Arms after a real file load. |
| FLiPIT close (`#btn-close`) | `closeGcode()` + R11 `lastGcodePos`. |
| LaserBed calc chip (`#bt-calc`) | Toggle HUD calculator mode. |
| FLiPIT Open (`#btn-open`) | Native local file picker. Accept `.txt`, `.nc`, `.cnc`, and `text/plain`. Load into Source. **No sample / BRACKET_PLATE fallback.** |
| HUD popovers | Keep ALIGNMENT z 50. Placement/clamp only: prefer right → left → bottom → top, then shift so the popover does not cover an open FLiPIT card or the active `#lb-blank`. |

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
4. HUD **FLiPIT** opens FLiPIT (top-right, expanded). X closes it. Chip toggles again.
5. HUD **AUTO-SIZE** opens FLiPIT and runs detect (toast if no program). Same chips stay live in HUD calculator mode. FLiPIT `#btn-detect` is the in-panel Auto-Size.
6. FLiPIT Open picks a real local `.txt` / `.nc` / `.cnc` file and loads Source. No sample program.
7. HUD tickers open popovers; placement stays outside the HUD and clamps off open FLiPIT and the bed blank. Collapse/expand holds left/top (R30).
8. FLiPIT waypoints still toggle toolPath (R17 / R27).
9. Any residual that changes a **surface** belongs in that surface’s individual package first; then re-assemble.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-08-17 | First FlipIt composition host. Inline four locked individuals. R17 waypoints↔toolPath · R27 toolPath hidden · R29 LaserBed canvas · R30 HUD hold from tip. Toast z 35. Isolator/child-spec omitted. |
| 2026-08-17 | **R1** `NC-FLIPIT-20260817-R1`. Boot HUD-only. HUD ↔ FLiPIT chrome. AUTO-SIZE from HUD + calculator paths. Real local file open (no sample). Popover clamp avoids FLiPIT + bed blank. Calc chip → HUD calculator. |
