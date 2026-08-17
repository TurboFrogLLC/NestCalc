# FlipIt — Alignment Contract (copy-paste only)

**Status:** Living contract · not a runtime package  
**Product:** **FlipIt**  
**Source:** `docs/audits/HOWMANY-V3-INDIVIDUALS-AUDIT-2026-08-17.md`  
**Class:** Exploratory docs only · not product GOAL · not a shared JS/CSS import  

**Rule:** Each individual HTML stays **standalone**. This contract is documentation + paste targets. Do **not** add `flipit-v3-align.js` or `@import` into the four tips.

Surfaces covered:

| Surface | HTML | Tip (at contract write) |
|---------|------|-------------------------|
| Numeric HUD | `NUMERIC-HUD-v3.html` | `bec93ffa` |
| FLiPIT | `FLIPIT-v3.html` | `37d628e9` |
| toolPath | `TOOLPATH-v3.html` | `2e9e2ace` |
| LaserBed | `LASER-BED-v3.html` | `40224e68` |

---

## 1. Canonical tokens (paste into `:root` when syncing)

```css
:root {
  --font: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --frost: #D8D6E2;
  --ink: #1A1428;
  --ink-50: rgba(26, 20, 40, 0.50);
  --ink-30: rgba(26, 20, 40, 0.30);
  --ink-22: rgba(26, 20, 40, 0.22);
  --ink-15: rgba(26, 20, 40, 0.15);
  --ink-08: rgba(26, 20, 40, 0.08);
  --ink-82: rgba(26, 20, 40, 0.82); /* header / popover / blank ticker shell */
  --white: #ffffff;
  --blue: #538BEC;
  --blue-22: rgba(83, 139, 236, 0.22);
  --blue-28: rgba(83, 139, 236, 0.28);
  --amber: #FFCE1B;
  --radius: 15.4px;
  --chip-r: 6.6px;
  --chip-h: 28.6px;
  --icon-btn: 28.6px;
  --hairline: 1.1px;
  --motion-collapse: 600ms; /* HUD family — FLiPIT currently uses 240ms locally */
}
```

**Already matching across cards:** frost · ink · blue · radius · chip-r · header 44 · ink-82 · amber · mono 12.1/650 tabular · outer ring recipe · SF Pro stack.

**LaserBed is not frost chrome** — do not force `--frost` / 44px header onto the bed.

---

## 2. Z-index scale (composition target)

| Band | z-index | Owner |
|------|--------:|-------|
| Bed stage | 0 | LaserBed world |
| Bed chrome (zoom) | 15 | LaserBed |
| toolPath card | 20 | TOOLPATH-v3 |
| Blank ticker | 22 | LaserBed ticker |
| FLiPIT card | 30 | FLIPIT-v3 |
| FLiPIT toast (recommended) | **35** | today HTML is 40 — lower in a later residual so it does not sit in HUD band |
| HUD card | 40 | NUMERIC-HUD-v3 |
| HUD popover | 50 | NUMERIC-HUD-v3 |
| Standalone stage notes | 5–6 | demo only |

---

## 3. Wordmark weights (HTML truth)

| Mark | White half | Amber half |
|------|------------|------------|
| FLiP **IT** | 700 | **800** |
| tool **Path** | 700 | **800** |

SPECs aligned to HTML (do not restyle locks to 700).

---

## 4. Hide / collapse primitives (do not unify by force)

| Surface | Primitive |
|---------|-----------|
| HUD | class `collapsed` + `#hud-body` **grid-template-rows** 0fr↔1fr · **never set `display` on `#hud-body`** |
| FLiPIT | inline `display: none` + `is-open` (class alone is insufficient today) |
| toolPath | class `is-hidden` (`display: none !important`) |
| Blank ticker | `display: none` ↔ `.is-on` `inline-flex` |

Host code must use the surface’s own primitive.

---

## 5. Position policies (do not merge)

| Surface | Policy |
|---------|--------|
| HUD | **Position hold** — collapse/expand never writes left/top |
| FLiPIT | R11 `lastGcodePos` map on close/reopen |
| toolPath | Leave where dragged until hide |
| LaserBed | Camera pan in `state` (world, not a card) |

---

## 6. Drag clamp (composition decision deferred)

| Surface | Clamp |
|---------|-------|
| HUD | Fully on-screen |
| FLiPIT | 44px peek |
| toolPath | 40px peek |

Pick one policy before re-assembly; parameterize later. Do not leave three silent laws.

---

## 7. Safe pure helpers (optional paste into each IIFE — no export)

```js
function fmt3(n) { return (Number.isFinite(n) ? n : 0).toFixed(3); }
function snap(v, step) { return Math.round(v / step) * step; }
// dragCard(handle, card, { peekPx }) — optional later residual; not required for lock
```

---

## 8. Explicitly NOT in this contract

- Runtime shared file / build step / `window.FlipItV3`
- DOM ids, Lucide paths, markup
- Child-spec / isolator / `elementsFromPoint`
- G-code highlighter / history
- Bed camera Y-flip / ticker pin math
- Popover placement logic
- Product nest math / real toolpath geometry

---

## 9. Isolation walls (must stay)

- No cross-imports between the four HTML tips
- FLiPIT waypoints do not open toolPath in standalone
- HUD footer AUTO-SIZE / FLiPIT are no-ops in standalone
- LaserBed calc chip is chrome only
- toolPath `#backplot` id reserved for composition, unused as a bridge here

---

## Changelog

| Date | Change |
|------|--------|
| 2026-08-17 | First contract from individuals audit. Copy-paste only. Z-index scale + tokens + wordmark 800 + hide/position policies. |
| 2026-08-17 | naming unify FlipIt product · strip decoder/decalc labels |
