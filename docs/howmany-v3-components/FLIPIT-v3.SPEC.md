# FLIPIT-v3 — Living SPEC (collapsed + expanded)

**Status:** Living (tip-sync after PASS)  
**Composition HTML tip:** `00b7975efea7a28ff60996b1dd09194ec0130234`  
**HTML blob:** `0158c636f1144770432bb792215b22df2cd135cc`  
**OPEN residuals:** R15  
**Detail authority:** composition host · locked layout also in `DE-CODER-v3-LOCKED.html`

## Shell (both modes)

| Token | Value |
|-------|-------|
| Width | `--panel-w` default `418px` · min `418` · max `568` |
| Radius | `15.4px` |
| Fill | `var(--frost)` |
| Outer ring | `2px solid rgba(26,20,40,0.22)` via `::after` |
| z-index | `30` |
| Default pin | top-right `16px` on first open |

## Position memory (R11)

```js
var lastGcodePos = null; // { left, top }
function openGcode(expanded) {
  if (lastGcodePos) {
    panel.style.left = lastGcodePos.left + 'px';
    panel.style.top = lastGcodePos.top + 'px';
    panel.style.right = 'auto';
  } else {
    panel.style.top = '16px';
    panel.style.right = '16px';
    panel.style.left = 'auto';
  }
  /* … */
}
function closeGcode() {
  var r = panel.getBoundingClientRect();
  lastGcodePos = { left: Math.round(r.left), top: Math.round(r.top) };
  /* hide */
}
```

## Collapsed surface row

- GC0DE expand · part group (detect · ticker · post) · no body

## Expanded body

- Source / Output tabs · tool strip · code shell · action row (FLIP IT · rot · READY/DONE · collapse)

## Rings (R9 / R10c)

| State | Border | Halo |
|-------|--------|------|
| Edit outer | `1px solid #FFCE1B` | `0 0 2px 2px rgba(255,206,27,0.55)` |
| Post / FLIP IT flash | `1px solid rgba(0,180,40,0.90)` | `0 0 2px 2px rgba(0,180,40,0.70)` · 2200ms |

## Edit mode (R9 locked)

- Yellow **outer** ring only — no yellow inside shell
- Bottom action row + tool-strip grayscale-disabled
- Stage labels stay FLIP IT / READY (no EDITING chip takeover)
- Hat/glasses residual gray highlight stripped

## Part group

| Mode | Layout |
|------|--------|
| Empty | Separate chips |
| Has dims | Connected 3-seg · blue ring on ticker only when ready · green on posted |

## Toast

Centered in panel · `rgba(26,20,40,0.60)` · amber ALL-CAPS · ~2200ms
