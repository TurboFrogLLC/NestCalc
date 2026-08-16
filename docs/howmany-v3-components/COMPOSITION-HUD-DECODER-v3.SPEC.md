# Composition HUD + flipIT V3 — Shared Index SPEC

**Status:** Living (updated on tip-sync after PASS)  
**Composition HTML:** `COMPOSITION-HUD-DECODER-v3.html`  
**Branch:** `docs/howmany-v3-decoder-lock`  
**Repo:** `TurboFrogLLC/NestCalc`  
**Branch tip:** `4438c2ac81b024e01a00879178e32b7376b0f890`  
**HTML blob (tip):** `2e42cb42a9a963b3956d490c6f14b60baec1bd8a`  
**Content authority (R10c chrome):** `1a184ea67cf1bb4578422e22056d5e9a61c60784` / blob `3cc008ab5f5f4c55dd80e0a915c9d2781c0fe7b2`  
**OPEN residuals:** R12 · R13 · R14 · R15  
**Class:** Exploratory composition only — not a product GOAL  

## Changelog

| Date | Tip | Event | Spec sections touched |
|------|-----|-------|------------------------|
| 2026-08-16 | 52b2d464 | docs-only land three SPECs | Index scaffold · links to HUD + flipIT |
| 2026-08-16 | 4438c2ac | R11 PASS | Position memory · OPEN R12–R15 |

---

## Surfaces in this composition

| Surface | Selector / id | Detail SPEC | z-order |
|---------|---------------|-------------|---------| 
| Numeric HUD | `#hud` / `.keypad` | `NUMERIC-HUD-v3.SPEC.md` | 40 (front) |
| flipIT | `#gcode` / `.gcode` | `FLIPIT-v3.SPEC.md` | 30 |
| Faux bed | `.bed-stage` | (host only — not a living product LaserBed) | behind |

**Connections**

- HUD footer **AUTO-SIZE** → opens flipIT **collapsed** (toggle).
- HUD footer **FLiPIT** chip → opens flipIT **expanded** (toggle).
- flipIT **Post** → part size to HUD / bed + green outer-ring flash 2200ms.
- flipIT **FLIP IT** (process) → Output + same green outer-ring flash 2200ms.
- Part ticker posted state is independent of outer-ring flash duration.
- **R11:** flipIT close saves left/top; next open restores (first open = top-right 16px).

---

## Shared design tokens (composition `:root`)

| Token | Value | Used by |
|-------|--------|---------|
| `--frost` | `#D8D6E2` | both shells |
| `--ink` | `#1A1428` | both |
| `--radius` | `15.4px` | card shell |
| `--chip-r` | `6.6px` | chips / icon buttons |
| `--chip-h` / `--icon-btn` | `28.6px` | control height |
| `--bar-h` | `44px` | headers |
| `--blue` | `#538BEC` | arm / active |
| `--blue-border` | `rgba(47, 111, 237, 0.85)` | armed outlines |
| `--blue-glow` | `0 0 0 2.2px rgba(47, 111, 237, 0.45)` | blue rings |
| `--green` | `#00CF00` | status ready |
| `--green-border` | `rgba(0, 140, 30, 0.70)` | READY/DONE chips |
| `--green-glow` | `0 0 0 3px …70%, 0 0 0 6px …28%` | READY chip halo (not outer post flash) |
| Edit amber | `#FFCE1B` | IT wordmark · yellow edit ring · toast text |
| `--motion-collapse` | `600ms` | HUD body grid |

---

## Outer ring ownership map

| State | Owner | Border | Soft halo |
|-------|--------|--------|-----------|
| Idle | both shells `::after` | `2px solid rgba(26,20,40,0.22)` | drop shadow only |
| Yellow edit | flipIT only | `1px solid #FFCE1B` | `0 0 2px 2px` amber @ 55% |
| Green post flash | flipIT only | `1px solid rgba(0,180,40,0.90)` | `0 0 2px 2px` green @ 70% · 2200ms |

Full CSS/JS: see **Shell rings** in `FLIPIT-v3.SPEC.md`.

---

## Residual series (closed — do not reopen without human OK)

| Series | Tip / SHAs | Summary |
|--------|------------|---------|
| R1–R8 | prior | Program field, calc/chevron, toasts, early green |
| R9 | 475f2c4d · 108c9e30 · 3122e318 · a661716d · 82d08feb | Yellow outer ring only · grayscale disabled chrome · no EDITING takeover · no hat highlight |
| R10 | 1a184ea6 | Green outer ring on **Post + FLIP IT** · 1px @ 90% · soft halo match yellow |
| R11 | 4438c2ac | flipIT reopen remembers last left/top (AUTO-SIZE + FLiPIT) |

---

## Workflow (html-composition-edit)

1. **Handoff A** — residual HTML only; human downloads and pushes HTML path only.  
2. **pass / pushed** — agent verifies tip.  
3. **Handoff B** — agent patches SPEC sections touched · **agent pushes SPEC only** · human may `git pull` (never `git add *.SPEC.md`).

Detail numbers live in the two surface SPECs; this index stays the map of connections and ownership.
