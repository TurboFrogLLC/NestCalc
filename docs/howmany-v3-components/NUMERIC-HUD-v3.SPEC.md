# Numeric HUD V3 — Living SPEC

**Status:** Living (updated on tip-sync after PASS)  
**Composition HTML:** `COMPOSITION-HUD-DECODER-v3.html`  
**Locked sibling (standalone):** `NUMERIC-HUD-v3-LOCKED.html`  
**Branch:** `docs/howmany-v3-decoder-lock`  
**Repo:** `TurboFrogLLC/NestCalc`  
**Branch tip:** `4438c2ac81b024e01a00879178e32b7376b0f890`  
**HTML blob (tip):** `2e42cb42a9a963b3956d490c6f14b60baec1bd8a`  
**Content authority (R10c):** `1a184ea67cf1bb4578422e22056d5e9a61c60784` / blob `3cc008ab5f5f4c55dd80e0a915c9d2781c0fe7b2`  
**Class:** Exploratory composition only — not a product GOAL  

## Changelog

| Date | Tip | Residual | Spec sections touched |
|------|-----|----------|------------------------|
| 2026-08-16 | 1a184ea6 | scaffold | Header stubs only — fill on next HUD residual PASS |
| 2026-08-16 | 52b2d464 | docs-only land three SPECs | Tip header aligned to branch |
| 2026-08-16 | 4438c2ac | R11 PASS (no HUD change) | Tip header aligned |

---

## Shared tokens (from tip `:root`)

| Token | Value |
|-------|--------|
| `--frost` | `#D8D6E2` |
| `--ink` | `#1A1428` |
| `--radius` | `15.4px` |
| `--chip-r` | `6.6px` |
| `--chip-h` / `--icon-btn` | `28.6px` |
| `--motion-collapse` | `600ms` |
| Header height | `44px` |

---

## Shell / placement

**Role:** Floating frost card; primary HUD over bed; always above flipIT (`z-index: 40`).

**Visual**
| Token | Value |
|-------|--------|
| Background | `var(--frost)` |
| Outer ring | `2px solid rgba(26, 20, 40, 0.22)` via `.keypad::after` |
| Drop shadow | on outer ring, not shell |

**UX**
- Drag from header (not from tool buttons)
- Collapse via chevron — body grid `1fr` → `0fr`

**CSS (authority from tip)** — fill on next PASS that touches shell

---

## Header tools

### Calculator toggle

**Role:** Swaps HUD body ↔ classic calculator.

**Visual / UX** — stubs; fill from tip on next residual PASS.

### Chevron (collapse)

**Role:** Collapse/expand HUD body upward.

**Visual**
| Token | Value |
|-------|--------|
| Idle | solid white fill + ink icon |
| Not | active-calc blue

**CSS (authority from tip)** — `.keypad-header .tool.chevron-btn`

---

## Param rows (Part · Blank · Gap · Margin)

**Role:** Label + ticker; click ticker → smart popover.

**Visual / UX / CSS / JS** — stubs; fill per-row on residual PASS that changes them.

---

## Footer controls

### AUTO-SIZE

**Role:** Opens flipIT collapsed (toggle).

### FLiPIT wordmark chip

**Role:** Opens flipIT expanded (toggle).  
**Wordmark:** `FLiP` white · `IT` `#FFCE1B` (case-sensitive).

---

## Collapse motion

| Token | Value |
|-------|--------|
| Body | `#hud-body` grid-template-rows |
| Duration | `var(--motion-collapse)` = `600ms` |
