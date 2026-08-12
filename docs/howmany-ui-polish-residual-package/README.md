# HowMany UI Polish Residual — Component Authority Package

**Status:** LOCKED visual / structure authority (human accepted 2026-08-12)  
**Product:** HowMany (repo NestCalc)  
**Contract:** Option B — HTML is locked chrome target; React stays thin host + bridge  
**Package HTML sha256:** `2a1a3a5e14ead0f186947255b045f383b4a49d1b18eac9d345871124ba3b6853`  
**Do not mutate:** `docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html` (checksum `bed7567d…4475d`)

## Files

| File | Role |
|------|------|
| `HOWMANY-UI-POLISH-RESIDUAL-COMPONENTS.html` | Self-contained visual authority for **new** residual chrome |
| `README.md` | Locked decisions + residual map |
| `DO-NOT-TOUCH.md` | Hard walls — no prose redesign, no V2 mutation, no engine/fixture |

## Locked visual decisions (this package)

1. **AutoNest result card** — dense pack; no external dimension lines; 0° blue / 90° orange stroke+fill@opacity.
2. **Meta segment** — connected button-group: **Orientation** dark + **Trim / offset approx** frost; vertical divider; text only.
3. **Footer counts** — Manual: TOTAL + MANUAL only (hide AUTO). AutoNest: TOTAL + MANUAL + AUTO (diff visible).
4. **SOURCE header L→R** — Source · Lucide File · Lucide Eraser · IN|MM (v2 track) · Chevron. No “Open file” text button.
5. **Unit rule** — SOURCE IN/MM = unit of textarea numbers. Bounding box + PART SIZE follow active unit and convert on toggle.
6. **Dialogs** — compact frost cards (~168px), title only, no jargon. Lucide **Check** / **X** / **Trash**. Short names. Dark inputs.
7. **Keypad vs Calculator**
   - Keypad: toolbar (Calculator · Backspace · Pencil · drag · Close) · ←→ strip · horizontal chips · fixed number grid · full-width Enter.
   - Calculator: same toolbar · mid-slot swaps to **50px LCD** (centered in 68px slot) · numbers **do not move/resize** · right side slides orange **+ − × ÷** · Enter full-width · overall height constant · only width expands.
8. **Numeric inputs** — reject letters site-wide (digits + one decimal).
9. **Complex G-code / engine dial-in** — out of this residual (SuperBrain NC-fixture cycle / NC wReckless lab).

## Residual map (what Codex wires next)

### A — Wire from THIS package (new chrome)

| # | Item | Authority |
|---|------|-----------|
| A1 | AutoNest result card + dense pack + meta segment | This HTML §1 |
| A2 | Footer counts Manual vs AutoNest | This HTML §1B |
| A3 | SOURCE header icon order | This HTML §2 |
| A4 | Save preset / Edit quick value / Rename dialogs | This HTML §3 |
| A5 | Keypad ↔ Calculator expand (fixed numbers, slide ops, height lock, 50px LCD) | This HTML §4 |

### B — Revert / restore to V2 (do NOT invent)

| # | Item | Authority |
|---|------|-----------|
| B1 | Calculator/keypad base look + press lift where this package doesn’t override | `REFERENCE-PROTOTYPE-v2.html` numpad |
| B2 | Any PR #60 regression that broke working V2 behavior | V2 HTML + prior green proof |
| B3 | Collapsible closed → keypad inert for those fields | V2 behavior contract |
| B4 | SOURCE expand/collapse animation (right-anchored, no blink, no left→right fly-in) | V2 / prior intent — bridge presentation only |

### C — Bridge / behavior only (no new shell bytes)

| # | Item | Notes |
|---|------|-------|
| C1 | Unit toggle consistency G-code vs calculator | SOURCE unit owns program numbers; bounds display follows toggle |
| C2 | Numeric sanitize site-wide | digits + one decimal |
| C3 | Preset name multi-char; chips set value not append; blink only | |
| C4 | Collapsed MARGINS badge matches expanded fields | |

### D — Parked (not this residual)

| # | Item |
|---|------|
| D1 | Complex CALL/GOTO G-code bounds → NC fixture / engine cycle (SuperBrain lab NC wReckless) |
| D2 | Prototype checksum change / shell byte edits to V2 |
| D3 | Clerk / PWA / MODE / Production |

## How Codex should use this

1. **Visual invent? No.** New chrome → this HTML. Reverts → V2. Behavior → bridge only.
2. **Allowed Files stay honest** — prefer `HowManyBridge.tsx` / `bridge.ts` / tests / e2e. No V2 prototype edit unless human explicitly authorizes a checksum change.
3. **Codex App owns GOAL freeze** — this package is input authority, not a freeze itself.
4. **Proof** — Path A: governance, prototype checksum unchanged, unit tests, build, authenticated Playwright as required by NestCalc AGENTS.

## Next human step

Authorize a residual GOAL freeze (Codex App) that:
- Names this package + V2 as dual authority (A vs B above)
- Lists A1–A5, B1–B4, C1–C4 only
- Keeps D parked
- Path A, bridge-first Allowed Files
