# toolPath (BACKPLOT-v3) — Living SPEC

**Status:** Living (tip-sync after PASS)  
**Surface name:** **toolPath** (case-sensitive)  
**Composition HTML tip:** `f87394dbddfdc1654486fe3c62e26bc86c979cde`  
**HTML blob:** `b1cd0d13955aa42c560f7561b0cfb62371cd1c8a`  
**OPEN residuals:** _(none)_  
**DOM id:** `#backplot` (stable for isolator / child-spec) · class `.toolpath`

## Class

Non-modal path viewer card. Not a dialog. Not a drawer. Not a **FLiPIT** child.  
No resize. Open-from-HUD/FLiPIT button deferred (future residual).

## Shell

| Token | Value |
|-------|-------|
| Width | max-content · min **268px** |
| Header height | **44px** |
| Radius | 15.4px (`--radius`) |
| Shell fill | frost `#D8D6E2` |
| Outer ring | `::after` 2px ink @ 0.22 · 8px offset · drop shadow |
| z-index | 20 |
| Resize | **none** |

## Header

| Token | Value |
|-------|-------|
| Fill | `rgba(26,20,40,0.82)` |
| Left mark | Lucide **waypoints** · 28.6sq chip · white@0.12 fill · white@0.18 border |
| Wordmark | **tool** white + **Path** amber · 19.8px · weight 700 · letter-spacing -0.02em · `var(--font)` |
| Wordmark align | flex-start · **10px** gap after mark |
| Trailing | refresh-ccw · X · class `tp-head-btn` |

### Header actions (`tp-head-btn`)

| State | Border | Fill | Icon |
|-------|--------|------|------|
| Idle | white @ 0.22 | transparent | white |
| Hover | white @ 0.35 | white @ 0.12 | white |

**X** → hides whole card (`.is-hidden`; isolator checkbox syncs).  
**Refresh** → redraws path view (sandbox: restore demo fixture).

## Viewfinder (body)

| Token | Value |
|-------|-------|
| Host pad | 11px frost body (`.toolpath-body`) |
| Pane | solid **white** · 1.1px ink@0.16 border · radius 8.8px · height 200px |
| Grid | **none** (R16d removed) |
| Demo part | blue-22 rect + two holes (test fixture only) |

## Child-spec marks

`backplot` (shell) · `backplot-head` · `backplot-canvas`

## Snippets

```css
.toolpath-inner::after {
  border: 2px solid rgba(26, 20, 40, 0.22);
  border-radius: calc(var(--radius) + 8px);
  box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.38);
}
.toolpath-head .wordmark .label-tool { color: #ffffff; }
.toolpath-head .wordmark .label-path { color: #FFCE1B; font-weight: 800; }
.toolpath-canvas { background: #ffffff; }
```
