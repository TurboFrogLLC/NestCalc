# Design Tokens — NestCalc UI Redesign

Visual authority: `REFERENCE-PROTOTYPE-v2.html`

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

## Spacing & geometry

| Token | Value |
|-------|--------|
| Panel width (calc) | `300px` |
| Panel width (gcode split) | `420px` |
| Panel full | `width: calc(100% - 1.5rem); left: 0.75rem` |
| Stage pad (calc open) | `padding-left: 324px` |
| Stage pad (gcode split) | `padding-right: 448px` |
| Section header height | **36px** locked |
| Input / primary button height | **36px** (`h-9`) |
| Angle chips | **36px** (match inputs) |
| Card radius | **8px** (slightly squared) |
| Bounding box stroke | **1px** solid `#FFFFFF`, radius **4px** |
| Mid-row gap (expanded) | `0.75rem` |
| Shell min-width | `900px` (page horizontal scroll instead of overlap) |

## Motion

| Token | Value |
|-------|--------|
| Expand spring | `0.72s cubic-bezier(0.34, 1.45, 0.64, 1)` |
| Collapsible bounce | `--spring: cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Smooth | `--smooth: cubic-bezier(0.22, 1, 0.36, 1)` |
| Mode morph | ~180–280ms opacity + slight translate |

**Rule:** Sheet width/left/right and stage padding use the **same** duration and curve. Never `width: auto` for expanding panels (does not interpolate).

## Typography

| Role | Spec |
|------|------|
| Wordmark | Free-standing **h** + Lucide **CircleQuestionMark** + **wMany** (HowMany) — no pill/box/outline; not Nest/Calc two-tone |
| Section labels | 11px uppercase semibold tracking-wide |
| Inputs | 13px tabular-nums |
| G-code textarea | 11px mono, `white-space: pre`, horizontal scroll OK |

## Light mode

Not implemented in this prototype wave. Tokens above are **dark-first**. Future light theme should preserve mode accent split (blue calc / orange gcode) on a light surface system — out of scope for v1 product wire unless GOAL names it.
