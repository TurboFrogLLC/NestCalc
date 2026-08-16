# NUMERIC-HUD-v3 — Living SPEC

**Status:** Living (tip-sync after PASS)  
**Composition HTML tip:** `fb011e6b230b5f7b4d28751554257782cf9c1b51`  
**HTML blob:** `69d0bd9a17e9c10cc716f604726c8cdeea678772`  
**OPEN residuals:** _(none)_  

## Shell

| Token | Value |
|-------|-------|
| Width | max-content · min 268px · header 44px |
| Radius | 15.4px |
| Fill | `#D8D6E2` |
| Header fill | `rgba(26,20,40,0.82)` |
| z-index | 40 |

## Type (R20)

| Role | Font | Notes |
|------|------|-------|
| Header / wordmarks / labels / control chips / popover titles | **Wordmark** `var(--font)` (SF Pro Text) | `.hud-ctl` · `.param-label` · `.pop-title` · section labels |
| Numbers / dimensions / tickers / editor / calculator LCD | **mono** `var(--font-mono)` | `.param-ticker` · part-group inputs · pop fields · classic-lcd |

Child-spec REG: `hud-ctl` font = `Wordmark (SF Pro) 11px · weight 700 · uppercase` · `hud-popover` title Wordmark 11px · fields mono 12.1px.

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
| AUTO-SIZE | Opens **FLiPIT** collapsed (toggle) · Wordmark 11px / 700 / uppercase |
| FLiPIT chip | Wordmark FLiP white + IT amber · opens **FLiPIT** expanded |

## Popovers (R12 + R16h + R20)

Selection: black@60% · text `#FFCE1B` · white under-layer · always select-all on focus/mouseup.  
Titles: Wordmark 11px. Fields: mono 12.1px.

**Collision obstacles:** HUD rect · open FLiPIT · **toolPath** (`#backplot` when visible) · viewport edges.  
Placement preference: right → left → bottom → top of HUD.

## Child-spec marks

`hud-shell` · `hud-ticker` · `hud-popover` · `hud-ctl` · `hud-header-tool`
