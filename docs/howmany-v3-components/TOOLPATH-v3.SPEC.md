# FlipIt — toolPath — Living SPEC

**Status:** Living (tip-sync after PASS)  
**Product:** **FlipIt**  
**Surface name:** **toolPath** (case-sensitive)  
**HTML:** `docs/howmany-v3-components/TOOLPATH-v3.html`  
**Branch:** `docs/howmany-v3-decoder-lock`  
**Repo:** `TurboFrogLLC/NestCalc`  
**Tip commit:** `2e9e2aceb59acec4d2e7dea490c577c380c12346`  
**Tip blob:** `1ed50d650a06c260dcf135e75286adf5cdf54c10`  
**Authority (source composition):** `fb011e6b230b5f7b4d28751554257782cf9c1b51` · blob `69d0bd9a17e9c10cc716f604726c8cdeea678772`  
**Class:** Exploratory component only · not product GOAL · not bridge  

**Authority note**  
Extracted surgically from composition tip **fb011e6b** — the last completed state **before R29** introduced the real LaserBed surface.  
This is the **R16 + R27 toolPath card** (dark 44px header, waypoints mark, tool/Path wordmark, frost shell, white viewfinder, outer ring).  
Not a drawer. Not a FLiPIT child. No resize.

NO bed · NO LaserBed SVG · NO Numeric HUD · NO FLiPIT panel · NO isolator · NO child-spec.

**DOM id:** `#backplot` (stable for isolator / child-spec in composition) · class `.toolpath`  
**Surface name:** **toolPath** (case-sensitive)

---

## Class

Non-modal path viewer card. Not a dialog. Not a drawer. Not a **FLiPIT** child.  
No resize.

## Open / close

| Path | Behavior |
|------|----------|
| Standalone boot | **Visible** (so chrome is inspectable) |
| Header **X** | hides card (`.is-hidden`) · stage Re-open control appears |
| Stage **Show toolPath** | restores card |
| Composition (R27) | boots `.is-hidden` · open only via FLiPIT strip waypoints or isolator |

Composition bridges (FLiPIT tool-strip / isolator) are **absent** in this standalone.

## Shell

| Token | Value |
|-------|-------|
| Width | `max-content` · min-width **268px** |
| Header height | **44px** |
| Radius | **15.4px** (`--radius`) |
| Shell fill | `#D8D6E2` (`--frost`) |
| Outer ring | `::after` 2px solid ink@0.22 · 8px offset · drop shadow `0 18px 40px -12px` |
| z-index | 20 |
| Resize | **none** |
| Stage (standalone only) | soft 26.4px grid on `#F4F4F6` |

## Header

| Token | Value |
|-------|-------|
| Fill | `rgba(26,20,40,0.82)` |
| Left mark | Lucide **waypoints** · 28.6sq chip · white@0.12 fill · white@0.18 border · icon white |
| Wordmark | **tool** white weight **700** + **Path** amber weight **800** · 19.8px · letter-spacing -0.02em · `var(--font)` |
| Wordmark align | flex-start · **10px** gap after mark |
| Trailing | refresh-ccw · X · class `tp-head-btn` |

### Header actions (`tp-head-btn`)

| State | Border | Fill | Icon |
|-------|--------|------|------|
| Idle | white @ 0.22 | transparent | white |
| Hover | white @ 0.35 | white @ 0.12 | white |
| Press | scale 0.94 | — | white |

**X** → hides whole card.  
**Refresh** → redraws path view (sandbox: restore demo fixture).

## Viewfinder (body)

| Token | Value |
|-------|-------|
| Host pad | 11px frost body (`.toolpath-body`) |
| Pane | solid **white** · 1.1px ink@0.16 border · radius 8.8px · height **200px** |
| Grid | **none** |
| Demo part | blue-22 rect + two hole circles (test fixture only) |
| Empty state | uppercase 10px ink-30 centered “No path” |

## Behavior locks

- Drag is on the entire header (buttons stay clickable).
- Non-modal: no focus trap, no backdrop.
- No resize handles.
- Standalone starts open; composition R27 starts hidden.
- FLiPIT strip / isolator bridges are composition-only (no-ops / absent here).

## Out of scope for this file

- LaserBed / blank surface
- Numeric HUD
- FLiPIT panel
- Sandbox isolator
- Child-spec panel
- Real path geometry (demo fixture only)
- Composition host / multi-surface orchestration

## How to use

1. Open `TOOLPATH-v3.html` alone in the browser.
2. Verify: dark 44px header, waypoints mark, tool/Path wordmark, white viewfinder with demo part, outer ring, drag, refresh, X → Re-open.
3. Any residual that changes numbers or structure → update this SPEC tip fields + Changelog after PASS.
4. Do not re-introduce bed / HUD / FLiPIT into this file.

## Connections

- Shared tokens with NUMERIC-HUD-v3 and FLIPIT-v3 (frost, ink, blue, radius, chip-r, header chrome).
- Composition index: `COMPOSITION-HUD-DECODER-v3.SPEC.md`.
- Prior thin note: `BACKPLOT-v3.SPEC.md` (superseded for standalone package by this file).

## Changelog

| Date | Tip | Change |
|------|-----|--------|
| 2026-08-17 | `2e9e2ace` | Individual package first created from composition tip `fb011e6b` (pre-R29). Surgical extract of R16/R27 toolPath card. Standalone opens visible for inspection. HTML blob `1ed50d65`. |
| 2026-08-17 | — | Wordmark **Path** weight aligned to HTML **800** (was SPEC 700). |
| 2026-08-17 | — | naming unify FlipIt product · strip decoder/decalc labels |

---

**Next individual packages (suggested order)**  
1. NUMERIC-HUD-v3 ← locked  
2. FLIPIT-v3 ← locked  
3. toolPath ← **this**  
4. LaserBed-v3  
5. Composition shell (re-assemble only after individuals are stable)
