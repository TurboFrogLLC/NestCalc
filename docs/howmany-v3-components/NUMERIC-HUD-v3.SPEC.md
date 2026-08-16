# NUMERIC-HUD-v3 — Living SPEC

**Status:** Living (tip-sync after PASS)  
**Composition HTML tip:** `f87394dbddfdc1654486fe3c62e26bc86c979cde`  
**HTML blob:** `b1cd0d13955aa42c560f7561b0cfb62371cd1c8a`  
**OPEN residuals:** _(none)_  

## Shell

| Token | Value |
|-------|-------|
| Width | max-content · min 268px · header 44px |
| Radius | 15.4px |
| Fill | `#D8D6E2` |
| Header fill | `rgba(26,20,40,0.82)` |
| z-index | 40 |

## Header tools (calc · chevron)

Shared dark-header icon system (R16):

| State | Border | Fill | Icon |
|-------|--------|------|------|
| Idle | white @ 0.22 | transparent | **white** |
| Hover | white @ 0.35 | white @ 0.12 | **white** |
| Calc engaged | blue @ 0.55 | `--blue-28` | **white** |

SVG size **16.5px** · padding 0 · flex-centered.

## Footer opens FLiPIT

| Chip | Behavior |
|------|----------|
| AUTO-SIZE | Opens **FLiPIT** collapsed (toggle) |
| FLiPIT chip | Wordmark FLiP white + IT amber · opens **FLiPIT** expanded |

## Popovers (R12 + R16h)

Selection: black@60% · text `#FFCE1B` · white under-layer · always select-all on focus/mouseup.

**Collision obstacles:** HUD rect · open FLiPIT · **toolPath** (`#backplot` when visible) · viewport edges.  
Placement preference: right → left → bottom → top of HUD.

## Child-spec marks

`hud-shell` · `hud-ticker` · `hud-popover` · `hud-ctl` · `hud-header-tool`
