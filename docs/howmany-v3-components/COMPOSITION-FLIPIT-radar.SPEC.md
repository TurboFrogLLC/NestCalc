# FlipIt — Radar composition host — Living SPEC

**Status:** Living (radar residual R1 — PNG skin + V3 behavior port)  
**Product:** **FlipIt**  
**Repo:** `TurboFrogLLC/NestCalc` (do not rename)  
**HTML:** `docs/howmany-v3-components/COMPOSITION-FLIPIT-radar.html`  
**Branch:** `docs/flipit-radar-authority`  
**Trace:** `NC-FLIPIT-20260818-RADAR-R1`  
**Host tip blob:** `ddbdc0aa87f5e6ac83755c3b0d2146b7ef8cf300`  
**Class:** Exploratory docs-only composition host · not a product GOAL · not a shared import  

**Host rule**  
This file is a **parallel** host. It does not overwrite `COMPOSITION-FLIPIT-v3.html`, locked individuals, or `app/`. Behavior is ported from V3 R1–R13. Visual law is `authority/audience-radar-skin.png`. Layout law is `authority/RADAR-SHELL-SYNTHESIS.md`.

---

## Authority stack

| Layer | Source | Wins |
|-------|--------|------|
| Layout freeze | `authority/RADAR-SHELL-SYNTHESIS.md` §2 | Cards, drawer, focus, calc |
| Color | `authority/audience-radar-skin.png` (sampled HEX) | Every paint token |
| Behavior | `COMPOSITION-FLIPIT-v3.html` + `.SPEC.md` R1–R13 | Cycles, unload, presets, resize, zoom |
| Chrome | this host | Radar restyle of V3 chrome |

---

## Sampled color tokens

Sampled 2026-08-18 from `audience-radar-skin.png` (876×460, RGBA). Dominant cluster HEX, not approximations.

| Role | HEX | Sample note |
|------|-----|-------------|
| Page | `#f6f5fa` | Header / canvas lavender (n=5822) |
| Card | `#ffffff` | Chart / KPI white |
| Mint tile | `#eefdf2` | Health / metric cards |
| Mint deep | `#e9fbf2` | Health ring wash |
| Cream | `#fdf9e4` | Secondary KPI tile |
| Peach | `#f7d5b7` | Warm secondary tile |
| Blush | `#f7d7d3` | Coral sidebar chip |
| Accent | `#8500f5` | Purple selected / CTA |
| Accent mid | `#8933e7` | Purple chip / nest |
| Accent soft | `#f3edff` | Purple wash / rails / focus ring |
| Ink | `#111213` | Primary type |
| Ink deep | `#030405` | Calc dock / deepest ink |
| Muted ink | `#726f78` | Caption / labels |
| Ink-30 | `#949499` | READY lettering |
| Success | `#3fb461` | Health ring / resize glow |
| Warning | `#e4ab00` | Amber IT / Path wordmarks |

Peers (stylecn / shadcn / USWDS) informed radius 14, chip 999, and the type scale only.

---

## Frozen layout

```
Top row:  HUD · toolPath · status · settings · Auto-Size
Bottom:   Laser bed (1–6) · FlipIt (7–12)
Drawer:   CSS grid track 0 → 360px (class `drawer-open` on `#app`)
Focus:    front-center modal, 1-up or 2-up
Calc:     only free-float surface; FLIP / shared-name home
```

- No sidebar. Cards stay in the grid. No free rearrange.
- Boot: every card visible. FlipIt is **open + expanded**. Source accepts typed NC with no file.
- Output tab is **never gated**. Manual edit is always allowed.

---

## Behavior port (keep contracts, restyle chrome)

| Contract | Radar mapping |
|----------|----------------|
| R2 / R4 AUTO-SIZE | `#btn-auto-size` → `__flipitAutoSize`. First click `openGcode(false)` (collapsed). Already open+collapsed → `closeGcode()`. No source → toast `LOAD A PROGRAM TO AUTO-SIZE`. `#btn-detect` still sizes. |
| R3 FLiPIT cycle | `#btn-gcode` closed→expand / open-collapsed→expand / expanded→close. `#btn-close` closes. Card chrome stays in the grid. |
| R3 unload | `#btn-clear` and `#prog-clear` call `unloadProgram()` (source + output + name + bounds). |
| R1 file open | `#flipit-file-input` accepts `.txt` / `.nc` / `.cnc` / `text/plain`. No sample fallback. |
| R4 status | READY / DONE inset. READY uses `--ink-30`. Glow 1.7px. Output **not** gated (radar override). |
| R5–R8 blank | Dual-display `__hudSyncBlank` / `__bedSetBlank`. Outside quarter-arc ~18px, 2px stroke. Restrained green outline `0.6px / 0.14` clipped to `#lb-bed-clip`. |
| R11–R13 presets | Everyday chip **loads only**. Pencil Edit → Confirm writes armed slot from live fields. Cancel exits without write. Main **OK** (`[data-pop-save]`) applies live fields to HUD + bed and **never** writes a preset. Store: `howmany.flipit.radar.presets`. |
| R12 part | Default **1.250 × 3.375**. `#lb-part` follows HUD. Flip IT rotates. Dotted `#lb-nest-box` is the margin-inset nest. |
| R29 bed | Origin bottom-left. Fit = zoom/center only. Blank size unchanged. |
| R17 / R27 | toolPath boots **visible** (radar freeze). Source waypoint still toggles a dim state. |

HUD field click opens the **drawer** (grid track), not a classic popover.

---

## New interaction

| Surface | Rule |
|---------|------|
| Focus | `focused = [idA, idB]` max 2. Modal `role=dialog` + trap + Escape. `document.startViewTransition` when available. `view-transition-name` per card + `view-transition-class: radar-card`. Fallback 280–420ms scale+fade. `prefers-reduced-motion` is instant. |
| Drawer | `#app.drawer-open` expands column `360px`. Class toggle only. Escape closes. |
| Calculator | `#bt-calc` is the only free-position surface. Close / home uses FLIP 240ms or shared `calc-surface` name. |

---

## How to open

Human owns the viewer. Do not require the agent to start `http.server`.

```
docs/howmany-v3-components/COMPOSITION-FLIPIT-radar.html
```

From a clone, any non-colliding static port is fine, e.g. `http://127.0.0.1:<port>/docs/howmany-v3-components/COMPOSITION-FLIPIT-radar.html`.

---

## How to use

1. Open the host. All seven cards are on screen. Type NC into FlipIt Source with no file.
2. Drag the outside quarter-arc on the blank. Green outline stays on the blank (rulers unlit). HUD Blank ticker follows.
3. AUTO-SIZE collapses FlipIt. Second AUTO-SIZE closes it. FLiPIT expands / closes per R3.
4. Open a real `.nc`. Clear and the name-field X fully unload.
5. Click a HUD ticker. The drawer pushes the grid. Chip A/B loads. Pencil → Confirm writes. OK applies and does not write.
6. Focus one card (1-up). Focus a second (2-up). Escape closes.
7. Calculator chip floats the keypad. Home / close returns it to the dock.
8. Zoom in / out / fit on the bed. Fit does not change blank size.

---

## Non-goals

- Sidebar, social-listening features, dragging cards to rearrange
- Product `app/` wire, GOAL freeze, V3 or locked-individual edits
- React / Tailwind / npm runtime inside the host

---

## Changelog

| Date | Change |
|------|--------|
| 2026-08-18 | **R1** `NC-FLIPIT-20260818-RADAR-R1`. Parallel radar host. PNG tokens. Frozen KPI + hero grid. V3 R1–R13 behavior port with ungated output, drawer (not popover), focus 1-up/2-up, View Transitions, free-float calculator. |
