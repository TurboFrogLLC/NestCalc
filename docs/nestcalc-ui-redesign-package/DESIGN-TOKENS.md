# Design Tokens — NestCalc UI Redesign

Visual authority: `REFERENCE-PROTOTYPE-v2.html` (exact tip bytes).  
**Option B:** Tokens document what the locked shell already implements; product work hosts that shell rather than re-deriving a parallel token system in React.

## Mode accent rule (strict)

| Mode | Accent | Use |
|------|--------|-----|
| **Calculator** | `#538BEC` (blue) | Tabs active, section headers, link active/hover, presets selected fill, input focus rings, header IN\|MM |
| **G-code** | `#EE8C3C` (orange) | Tab active, section headers (`#D97830` darker fill), rotation chips, Generate/Fill opacity buttons, Source/Part IN\|MM, header IN\|MM when in G-code |

**No orange in Calculator. No blue in G-code primary chrome.**

## Core palette

| Token | Hex | Role |
|-------|-----|------|
| `--bg` | `#08060D` | App background (matte near-black) |
| `--panel` | `#0E0C14` | Side panel surface |
| `--surface` | `#16121F` | Raised cards / section bodies |
| `--raised` | `#1E1A2A` | Inputs, secondary buttons |
| `--text` | `#F5F3FF` / `#FFFFFF` | Primary text |
| `--text-muted` | `#C8CDD8` | Labels, secondary |
| Blue | `#538BEC` | Calculator accent |
| Orange | `#EE8C3C` | G-code accent |
| Orange dark | `#D97830` | G-code section header fill |
| Border soft | `rgba(200,205,216,0.2–0.25)` | Input borders, neutrals |
| Switch track | `rgba(0,0,0,0.2)` | IN\|MM track (matches Copy/Download) |

## Opacity treatments

| Control | Style |
|---------|--------|
| Generate / Fill (G-code) | `background: rgba(238,140,60,0.25); border: 1px solid rgba(238,140,60,0.45)` |
| Copy / Download icons | `background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.22)` |
| Calc section headers | `rgba(83,139,236,0.75)` fill, white label |
| G-code section headers | solid `#D97830`, white label |

## Spacing & geometry (tip)

| Token | Value |
|-------|--------|
| Panel width (calc) | Default **`500px`** via `--calc-sheet-w`; **min 300** / **max 500** (free-edge resize) |
| Panel width (gcode split) | Default **`620px`** via `--gcode-sheet-w`; **min 420** / **max 620** |
| Panel full (gcode) | `width: calc(100% - 1.5rem); left: 0.75rem` |
| Stage pad (calc open) | `padding-left: sheetWidth + 24` (default **524px** at 500); closed / full-bleed **16px** |
| Stage pad (gcode split) | `padding-right: sheetWidth + 28` (default **648px** at 620); closed / full-bleed **16px** |
| Section header height | **36px** locked |
| Input / primary button height | **36px** (`h-9`) |
| Angle chips | **36px** (match inputs) |
| Card radius | **8px** (slightly squared) |
| Bounding box stroke | **1px** solid `#FFFFFF`, radius **4px** |
| Mid-row gap (expanded) | `0.75rem` |
| Shell min-width | `900px` (page horizontal scroll instead of overlap) |

## Motion (tip CSS variables)

| Token | Tip value |
|-------|-----------|
| `--spring` | `cubic-bezier(0.25, 1.08, 0.35, 1)` (slight open bounce) |
| `--smooth` | `cubic-bezier(0.33, 0.1, 0.25, 1)` |
| `--sheet-ease` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--sheet-dur` | **`0.71s`** — sheet transform / left / right / **width** + stage padding |
| `--collapse-dur` | **`0.41s`** — section collapse open/close |
| `--view-dur` | **`0.68s`** — viewer fade |
| `--morph-dur` | **`0.3s`** — mode chrome morph |
| Sheet opacity fade | `0.34s var(--smooth)` |

**Rule:** Sheet width/left/right and stage padding use **`--sheet-dur` + `--sheet-ease`** together. Never `width: auto` for expanding panels (does not interpolate).

**Option B note:** These transitions already live in the exact HTML. Bridge code must **not** reimplement competing sheet/stage transitions.

## Typography

| Role | Spec |
|------|------|
| Wordmark | Free-standing **h** + Lucide **CircleQuestionMark** + **wMany** (HowMany) — no pill/box/outline; not Nest/Calc two-tone |
| Section labels | 11px uppercase semibold tracking-wide |
| Inputs | 13px tabular-nums |
| G-code textarea | 11px mono, `white-space: pre`, horizontal scroll OK |

## Light mode

Not implemented in this prototype wave. Tokens above are **dark-first**. Future light theme should preserve mode accent split (blue calc / orange gcode) on a light surface system — out of scope for v1 product wire unless GOAL names it.
