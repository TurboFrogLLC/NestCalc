# flipIT V3 — Living SPEC

**Status:** Living (updated on tip-sync after PASS)  
**Composition HTML:** `COMPOSITION-HUD-DECODER-v3.html`  
**Surface name:** flipIT (wordmark case-sensitive: `FLiP` + `IT`)  
**Branch:** `docs/howmany-v3-decoder-lock`  
**Repo:** `TurboFrogLLC/NestCalc`  
**Branch tip:** `4438c2ac81b024e01a00879178e32b7376b0f890`  
**HTML blob (tip):** `2e42cb42a9a963b3956d490c6f14b60baec1bd8a`  
**Content authority (R10c rings):** `1a184ea67cf1bb4578422e22056d5e9a61c60784` / blob `3cc008ab5f5f4c55dd80e0a915c9d2781c0fe7b2`  
**Class:** Exploratory composition only — not a product GOAL  

## Changelog

| Date | Tip | Residual | Spec sections touched |
|------|-----|----------|------------------------|
| 2026-08-16 | 1a184ea6 | scaffold + R10c | Shell rings (green post flash) — numbers from tip |
| 2026-08-16 | 52b2d464 | docs-only land three SPECs | Tip header aligned to branch |
| 2026-08-16 | 4438c2ac | R11 PASS | Position memory on close/reopen |

---

## Shared tokens (from tip `:root` / `.gcode`)

| Token | Value |
|-------|--------|
| `--frost` | `#D8D6E2` |
| `--panel-w` | `418px` (min); max `568px` |
| `--radius` | `15.4px` |
| `--chip-r` | `6.6px` |
| `--chip-h` / icon | `28.6px` |
| `--bar-h` | `44px` |
| `--green` | `#00CF00` |
| `--green-border` | `rgba(0, 140, 30, 0.70)` |
| `--green-glow` (READY chip) | `0 0 0 3px rgba(0, 180, 40, 0.70), 0 0 0 6px rgba(0, 180, 40, 0.28)` |
| Edit amber | `#FFCE1B` |

---

## Shell rings (outer `::after`)

**Role:** Floating ring outside the frost card; bed shows in the gap.

### Default (idle)

| Token | Value |
|-------|--------|
| Border | `2px solid rgba(26, 20, 40, 0.22)` |
| Halo | drop shadow only: `0 18px 40px -12px rgba(0, 0, 0, 0.38)` |

```css
.gcode::after {
  border: 2px solid rgba(26, 20, 40, 0.22);
  box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.38);
}
```

### Yellow — edit mode (R9 locked)

| Token | Value |
|-------|--------|
| When | `:has(.surface-row.is-editing-banner)` |
| Border | `1px solid #FFCE1B` |
| Halo / glow | soft `0 0 2px 2px rgba(255, 206, 27, 0.55)` |

```css
.gcode:has(.surface-row.is-editing-banner)::after {
  border-width: 1px;
  border-color: #FFCE1B;
  box-shadow:
    0 0 2px 2px rgba(255, 206, 27, 0.55),
    0 18px 40px -12px rgba(0, 0, 0, 0.38);
}
```

### Green — Post + FLIP IT flash (R10c locked)

| Token | Value |
|-------|--------|
| When | `.is-post-flash` for **2200ms** (matches toast) |
| Triggers | `btn-post` click · stage **FLIP IT** (`data-state="process"`) |
| Border | `1px solid rgba(0, 180, 40, 0.90)` |
| Halo / glow | soft `0 0 2px 2px rgba(0, 180, 40, 0.70)` (matched to yellow shape) |

```css
.gcode.is-post-flash::after {
  border-width: 1px;
  border-color: rgba(0, 180, 40, 0.90);
  box-shadow:
    0 0 2px 2px rgba(0, 180, 40, 0.70),
    0 18px 40px -12px rgba(0, 0, 0, 0.38);
}
```

```js
function flashGreenRing() {
  panel.classList.add('is-post-flash');
  /* clear after 2200ms */
}
/* called from btn-post and stage FLIP IT process path */
```

---

## Position memory (R11 locked)

**Role:** After close, next AUTO-SIZE or FLiPIT open restores last left/top.

**UX**
- First open this session → default top-right `16px`
- Close (X or toggle) → capture `getBoundingClientRect()` before hide
- Reopen → restore `left` + `top` (`right: auto`)

```js
var lastGcodePos = null; // { left, top } px
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
}
function closeGcode() {
  if (panel open) lastGcodePos = { left: Math.round(r.left), top: Math.round(r.top) };
  // then hide
}
```

---

## § Auto-size collapsed

**Role:** Header + surface row only; G-code body grid closed.

### Header

**Role:** Mark · FLiPIT wordmark · program field · status-dot · close.

**Wordmark:** `FLiP` white · `IT` `#FFCE1B`.

**Program field:** always white fill on dark header; open · download · clear X at end.

### Surface row

**Role:** GC0DE expand · part group (detect · ticker · post).

### Part group

| State | Treatment |
|-------|-----------|
| Empty | separate chips |
| Has dims | connected 3-seg; blue ring only on ticker when ready |
| Posted | green fill + inset green edge when connected |
| Edit mode | grayscale / muted; no residual hat highlight (R9) |

**CSS stubs** — expand on residual PASS that touches part-group.

---

## § Expanded

**Role:** Full pipeline — Source / Output, tool-strip, code shell, stage footer.

### Source / Output tabs + tool-strip

**Role:** Undo/redo, clear, units; output adds edit/copy/download.

**Edit mode:** yellow outer ring; body grayscale-disabled; accept/cancel stay live.

### Stage footer

| Chip | States |
|------|--------|
| Left action | FLIP IT · START OVER (labels kept in edit — no EDITING takeover) |
| Right status | READY · DONE · NOT READY |
| READY / DONE | green border + `--green-glow` when not editing |

**UX**
- FLIP IT → Output + `flashGreenRing()` + toast `OUTPUT READY`
- Post → toast `PART POSTED` + `flashGreenRing()`
- Edit → labels preserved; chips disabled + grayscale (R9)

### Toast

| Token | Value |
|-------|--------|
| Position | card center |
| Fill | ink @ 60% |
| Text | amber ALL-CAPS |
| Duration | 2200ms |

---

## Walls

- Docs / exploratory only — not product GOAL or bridge wire  
- Locked standalone authorities remain: `DE-CODER-v3-LOCKED.html`, `NUMERIC-HUD-v3-LOCKED.html`  
- Spec numbers must match tip HTML; tip wins on conflict  
