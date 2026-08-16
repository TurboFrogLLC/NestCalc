# Composition HUD + FLiPIT V3 — Shared Index SPEC

**Status:** Living (updated on tip-sync after PASS)  
**Composition HTML:** `COMPOSITION-HUD-DECODER-v3.html`  
**Branch:** `docs/howmany-v3-decoder-lock`  
**Repo:** `TurboFrogLLC/NestCalc`  
**Branch tip:** `9d8cade5bb9cb108845f38f40d4f41fba5272207`  
**HTML blob (tip):** `09e5448e54ed8a980b2b8d2258f879dc318849d8`  
**OPEN residuals:** _(none)_  
**Class:** Exploratory composition only — not a product GOAL  

## Locked product naming

| Name | Rule |
|------|------|
| **FLiPIT** | Case-sensitive product / panel name (not flipIT, FlipIT, FLIPIT) |
| FLiPIT wordmark | `FLiP` white + `IT` amber on dark header · left-aligned · 10px gap from mark |
| Stage action label | `FLIP IT` (button copy, uppercase) stays as UI string |
| **toolPath** | Case-sensitive path viewer name (`tool` white + `Path` amber) |

## Changelog

| Date | Tip | Event | Spec sections touched |
|------|-----|-------|------------------------|
| 2026-08-16 | 00b7975e | R14 PASS | Sandbox isolator |
| 2026-08-16 | 58ec1be0 | R15 PASS | Child-spec table · elementsFromPoint · FLiPIT children |
| 2026-08-16 | f87394db | R16 PASS | toolPath card · header icon system · READY amber · popover vs toolPath · wordmark left gap |
| 2026-08-16 | f52aa3a9 | R17 PASS | FLiPIT strip waypoints open toolPath (Source+Output) · strip unlock when idle · black strip icons · visible hover |
| 2026-08-16 | **9d8cade5** | **R26 PASS** | Child-spec Lucide copy per row + free-draggable panel (reparent under `.bed-stage`) |

---

## Surfaces

| Surface | Selector / id | Detail SPEC | z-order |
|---------|---------------|-------------|---------| 
| Numeric HUD | `#hud` | `NUMERIC-HUD-v3.SPEC.md` | 40 |
| **FLiPIT** | `#gcode` | `FLIPIT-v3.SPEC.md` | 30 |
| **toolPath** | `#backplot` · class `.toolpath` | `BACKPLOT-v3.SPEC.md` | 20 |
| Faux bed | `.bed-stage` | host only | behind |
| Sandbox isolator | `#sandbox-iso` | this index · **not production** | 90 |
| Child-spec panel | `#child-spec` (reparented under `.bed-stage`) | this index · **not production** | 25 |

## Shared header icon system (R16)

Applies to **HUD** header tools · **FLiPIT** close · **toolPath** refresh/X.

| State | Border | Fill | Icon color |
|-------|--------|------|------------|
| Idle | 1.1px solid white @ 0.22 | transparent | **white** |
| Hover | 1.1px solid white @ 0.35 | `rgba(255,255,255,0.12)` (match static mark chip) | **white** |
| Press | scale 0.94 | — | white |

Static left **mark** chip (FLiPIT binary mark · toolPath waypoints):  
`background: rgba(255,255,255,0.12)` · `border: 1.1px solid rgba(255,255,255,0.18)` · icon white.

HUD calc **engaged**: fill `--blue-28` · icon white · border blue @ 0.55.

## FLiPIT tool-strip icons (R17)

Live when **not** editing. Locked only under `:has(.surface-row.is-editing-banner)`.

| State | Border | Fill | Icon |
|-------|--------|------|------|
| Idle | 1.1px ink @ 0.22 | white-70 | **ink (black)** |
| Hover | ink @ 0.40 | ink @ 0.08 | ink |

Waypoints control opens/closes toolPath from Source and Output strips. No blue engaged paint.

## Shared outer ring

HUD · FLiPIT · toolPath: `::after` 2px solid ink @ 0.22 · offset 8px · drop shadow `0 18px 40px -12px`.

## Sandbox tools (not product)

### Isolator (R14)
Fixed BR card · toggles HUD / FLiPIT / **toolPath** / Faux bed · z-index 90.

### Child-spec panel (R15 + R26)
- Frost panel · 8px radius · shadow · absolute under `.bed-stage` (z 25)
- Template keys: `font` · `size` · `outline` · `radius` · `fill` · `shadow` · `note`
- Hydrate: `pointerdown` capture + `elementsFromPoint` · click surface → rows
- Clear: click outside composition surfaces only
- **R26 copy:** every row has Lucide copy icon (far right); click copies `"key: value"` to clipboard · green flash 900ms
- **R26 drag:** grab `.cs-head` (cursor grab/grabbing) · free move across stage · reparent + `overflow: visible` on blank so panel can leave the 280×210 host
- Non-production exploratory only

## OPEN residuals

_None. Residual wave R11–R17 + R26 closed._
