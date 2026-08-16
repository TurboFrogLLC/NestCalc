# toolPath (BACKPLOT-v3) — Living SPEC

**Status:** Living (tip-sync after PASS)  
**Surface name:** **toolPath** (case-sensitive)  
**Composition HTML tip:** `0b779cabd9adac4c2329a0a4df3ccfc95a66b049`  
**HTML blob:** `cc9ed3f8a6f11b240dcf2cb422e89599cd53e15e`  
**OPEN residuals:** _(none)_  
**DOM id:** `#backplot` (stable for isolator / child-spec) · class `.toolpath`

## Class

Non-modal path viewer card. Not a dialog. Not a drawer. Not a **FLiPIT** child.  
No resize.

## Open / close (R17 + R27)

| Path | Behavior |
|------|----------|
| FLiPIT tool-strip waypoints (Source + Output) | `toggleToolpath()` → `setToolpathOpen(on)` |
| Header **X** | `setToolpathOpen(false)` |
| Isolator checkbox | syncs via `setToolpathOpen(!!checked)` |

**R27 load contract:** card boots with `.is-hidden` · isolator toolPath checkbox **unchecked**.  
Open only via FLiPIT strip waypoints or isolator (never auto-visible on page load).

`setToolpathOpen` toggles `.is-hidden`, keeps isolator checkbox + strip `aria-pressed` in sync.  
Strip waypoints stay **black** when open (no blue engaged fill).

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
.toolpath.is-hidden { display: none !important; }
.toolpath-inner::after {
  border: 2px solid rgba(26, 20, 40, 0.22);
  border-radius: calc(var(--radius) + 8px);
  box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.38);
}
.toolpath-head .wordmark .label-tool { color: #ffffff; }
.toolpath-head .wordmark .label-path { color: #FFCE1B; font-weight: 800; }
.toolpath-canvas { background: #ffffff; }
```
