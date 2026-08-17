# LaserBed V3 — Living SPEC

**Status:** Living (tip-sync after PASS)  
**HTML:** `docs/howmany-v3-components/LASER-BED-v3.html`  
**Branch:** `docs/howmany-v3-decoder-lock`  
**Repo:** `TurboFrogLLC/NestCalc`  
**Tip commit:** `4776519dc2ad3c410860c15eba785ff1f8d3249c`  
**Tip blob:** `0f193a4a4c277146cd157b5a7603cd1c4d058c0f`  
**Authority:** `LASER-BED-v3-v1.html` · sha256 prefix `408ce4470f2c9d4d`  
**Composition wire:** R29 @ `6a9acc76` / `f8398176` (bed under `.bed-stage`)  
**Class:** Exploratory component only · not product GOAL · not bridge  

**Authority note**  
Laser bed surface + blank-tied floating ticker (R31 residual absorbed into this package; filename **LASER-BED-v3.html** is the correct name).  
Bed: origin pinned bottom-left · free-corner · fit 48×48 · progressive labels 12 → 6 → 3 → 1.  
Ticker: right-pinned to blank · HUD popover transparent black · system amber text.

NO HUD panel · NO FLiPIT · NO toolPath · NO isolator · NO child-spec.

---

## Class

Full-viewport SVG laser bed with pan / zoom / blank resize.  
Not a floating card. Not frost chrome. Pure B&W.

## Shell / stage

| Token | Value |
|-------|-------|
| Stage | `#stage` · full viewport · white |
| World | `#world` SVG · absolute inset 0 |
| Camera | `#camera` group · translate + scale(s, −s) · origin BL |
| Bed size | **48 × 48** in |
| Fit pad | 36px inset when computing fitted scale |
| Default blank | **12 × 8** in · snap **0.125** |

## Bed geometry

| Token | Value |
|-------|-------|
| Origin | pinned **bottom-left** (0,0) |
| Bed fill | white (grid drawn as lines) |
| Bed rim | stroke `#000` · width 0.08 world · non-scaling |
| Left + bottom edges | `#000` @ **50%** · **1.75px** non-scaling |
| Origin dot | circle r 0.12 · fill `#000` |

## Grid

| Token | Value |
|-------|-------|
| Minor (1") | `#000` @ **10%** · 1px non-scaling |
| Major (label step) | `#000` @ **30%** · 1px non-scaling · drawn on top of minor |
| Overhang ticks | outside bed · `#000` @ **30%** · 1px · major ticks longer |
| Numbers | `#000` · progressive **12 → 6 → 3 → 1** · min label spacing 36px screen |
| Origin label | `0` outside corner |

## Blank

| Token | Value |
|-------|-------|
| Fill | `#ffffff` @ **80%** |
| Stroke | `#000` · **1.25px** non-scaling |
| Free corner | single indicator · 0.28 world · fill black@14% · stroke 1.25px |
| Resize hits | right edge · top edge · free corner only (no multi-handle box) |
| Snap | **0.125** in |

## Chrome (zoom tools)

| Token | Value |
|-------|-------|
| Position | top-right · 12px inset · gap 6px |
| Button | 28 × 28 · border `#a2a2a2` · radius 4px · white fill · ink icon |
| Icons | Lucide **CirclePlus** · **CircleMinus** · **Scan** (fit) · 18px · stroke 2 |
| Press | depressed — translateY(1px) · inset shadow · no color invert |

## Interaction

- **Pan** — drag empty bed / world
- **Resize X** — drag right hit
- **Resize Y** — drag top hit (Y grows upward in world coords)
- **Resize XY** — drag free corner
- **Wheel zoom** — toward cursor · zoom clamp 0.35–12
- **Fit** — Scan button · zoom 1 · center 48×48 only (blank size unchanged)
- **Zoom ±** — 1.25× steps

## Behavior locks

- Origin stays bottom-left in world space (camera Y is flipped).
- One free-corner indicator only — no four-corner handles.
- Progressive labels only; never dense 1-inch numbers at low zoom.
- Composition hosts a subset under `.bed-stage`; this file is the full standalone authority.

## Blank ticker (R31 residual · lives in this package)

| Token | Value |
|-------|-------|
| Height | **34px** |
| Pin | **20px** inset from blank **right** · **10px** above blank top |
| Shell fill | `rgba(26, 20, 40, 0.82)` — same as HUD **param-popover** |
| Border | 1.1px solid white @ 0.12 |
| Text | system amber **`#FFCE1B`** |
| Font | mono · 12.1px · weight 650 · tabular-nums |
| Calc chip | white @ 0.12 fill · white @ 0.18 border · **Lucide icon white** · hover white @ 0.22 |
| Drag | **none** |
| z-index | 22 |

Pin math:
```js
left = (panX + blankW * s) - tickerWidth - 20
top  = (panY - blankH * s) - 34 - 10
```

## Out of scope for this file

- Full NUMERIC-HUD panel / popovers / footer chips
- FLiPIT / toolPath cards
- Sandbox isolator / child-spec
- Real G-code path overlay (demo blank only)

## How to use

1. Open `LASER-BED-v3.html` alone in the browser.
2. Verify: BL origin, 48×48 fit, blank 12×8 with free corner, progressive rulers, zoom tools depressed press, pan/resize/wheel, ticker right-pin 20px, amber readout, white calc icon, snap 0.125.
3. Any residual that changes numbers or structure → update this SPEC tip fields + Changelog after PASS.
4. Do not re-introduce multi-handle boxes into this file.

## Connections

- Composition index: `COMPOSITION-HUD-DECODER-v3.SPEC.md` (R29 bed under `.bed-stage`).
- Prior lock file kept for checksum: `LASER-BED-v3-v1.html`.
- Shared with other individuals only at composition assembly time.

## Changelog

| Date | Tip | Change |
|------|-----|--------|
| 2026-08-17 | `bc247c1b` | Individual package from locked `LASER-BED-v3-v1` authority. |
| 2026-08-17 | `4776519d` | Blank ticker residual absorbed under correct name **LASER-BED-v3.html**. Right-pin 20px · no HUD · shell = HUD popover `rgba(26,20,40,0.82)` · readout amber `#FFCE1B` · calc Lucide stays white · blank snap **0.125**. |

---

**Individual packages**  
1. NUMERIC-HUD-v3 ← locked  
2. FLIPIT-v3 ← locked  
3. toolPath ← locked  
4. LaserBed ← **this**  
5. Composition shell (re-assemble only after individuals are stable)
