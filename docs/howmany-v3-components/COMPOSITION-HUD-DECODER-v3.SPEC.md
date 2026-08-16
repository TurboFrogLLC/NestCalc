# Composition HUD + FLiPIT V3 — Shared Index SPEC

**Status:** Living (updated on tip-sync after PASS)  
**Composition HTML:** `COMPOSITION-HUD-DECODER-v3.html`  
**Branch:** `docs/howmany-v3-decoder-lock`  
**Repo:** `TurboFrogLLC/NestCalc`  
**Branch tip:** `58ec1be071ff7ff147cd66bd59d7400fe0ce1ec7`  
**HTML blob (tip):** `a585059ba7619f9df816c909841e5bf7b6b597c4`  
**OPEN residuals:** _(none)_  
**Class:** Exploratory composition only — not a product GOAL  

## Locked product naming

| Name | Rule |
|------|------|
| **FLiPIT** | Case-sensitive product / panel name (not flipIT, FlipIT, FLIPIT) |
| Wordmark | `FLiP` white + `IT` amber on dark chips |
| Stage action label | `FLIP IT` (button copy, uppercase) stays as UI string |

## Changelog

| Date | Tip | Event | Spec sections touched |
|------|-----|-------|------------------------|
| 2026-08-16 | 00b7975e | R14 PASS | Sandbox isolator |
| 2026-08-16 | 58ec1be0 | R15 PASS | Child-spec table · elementsFromPoint · FLiPIT children |

---

## Surfaces

| Surface | Selector / id | Detail SPEC | z-order |
|---------|---------------|-------------|---------| 
| Numeric HUD | `#hud` | `NUMERIC-HUD-v3.SPEC.md` | 40 |
| **FLiPIT** | `#gcode` | `FLIPIT-v3.SPEC.md` | 30 |
| Backplot | `#backplot` | `BACKPLOT-v3.SPEC.md` | 20 |
| Faux bed | `.bed-stage` | host only | behind |
| Sandbox isolator | `#sandbox-iso` | this index · **not production** | 90 |
| Child-spec table | `#child-spec` in `#bed-blank` | this index · **not production** | inside bed |

## Sandbox tools (not product)

### Isolator (R14)
Fixed BR card · toggles HUD / FLiPIT / Backplot / Faux bed · z-index 90.

### Child-spec table (R15)
- Host: faux-bed blank 280×210  
- Template keys: `font` · `size` · `outline` · `radius` · `fill` · `shadow` · `note`  
- Hydrate: `pointerdown` capture + `elementsFromPoint` (disabled FLiPIT controls still hit)  
- Clear: click outside composition surfaces only  
- Children include HUD tickers/popovers/controls + FLiPIT header/detect/post/stage/code/rot + Backplot head/canvas  

## OPEN residuals

_None. Residual wave R11–R15 closed._
