# FlipIt — Composition host — Living SPEC

**Status:** Living (first host residual)  
**Product:** **FlipIt**  
**Repo:** `TurboFrogLLC/NestCalc` (do not rename)  
**HTML:** `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`  
**Branch:** `docs/howmany-v3-decoder-lock`  
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

Hide primitives stay surface-owned (`ALIGNMENT-v3` §4). Host does not invent a shared hide API.

---

## Not wired

- HUD footer **AUTO-SIZE** / **FLiPIT** chips — still no-ops (individual isolation wall)
- LaserBed **calc chip** — chrome-only (no HUD calc bridge)
- FLiPIT **Post → HUD/bed** part-size hydrate
- Real toolpath geometry (demo fixture only)
- Drag-clamp unification (ALIGNMENT §6 still deferred)
- Runtime shared module / `window.FlipItV3`

### Sandbox tools — omitted

Sandbox **isolator** (z 90) and **child-spec** panel are **not** in this host. They remain optional non-product tools on the historical composition archive. This residual is assembly + listed bridges only.

---

## How to open

From the NestCalc clone (any non-colliding port; **8090** used here):

```bash
cd /Users/computer/wrecklesstoddler/vibe/projects/NestCalc
python3 -m http.server 8090
```

Then: [http://127.0.0.1:8090/docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html](http://127.0.0.1:8090/docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html)

Do not require `file://`.

---

## How to use

1. Open the composition URL above.
2. Verify LaserBed fills the viewport (BL origin, 48×48 fit, blank 12×8, right-pin ticker, Fit does not reset blank).
3. Verify Numeric HUD (16,16) · FLiPIT (top-right) · toolPath **absent** until waypoints.
4. Click FLiPIT waypoints → toolPath appears; X hides it; waypoints toggle again.
5. HUD collapse/expand holds left/top; popovers 4-way; footer chips do nothing.
6. Any residual that changes a **surface** belongs in that surface’s individual package first; then re-assemble.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-08-17 | First FlipIt composition host. Inline four locked individuals. R17 waypoints↔toolPath · R27 toolPath hidden · R29 LaserBed canvas · R30 HUD hold from tip. Toast z 35. Isolator/child-spec omitted. |
