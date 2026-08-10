# Component Map — NestCalc UI Redesign

## Shell (shared)

```
┌─ App header ─────────────────────────────────────────────────┐
│ [logo NestCalc] [Calculator|G-code tabs]  [IN|MM] [theme] [auth] │
├─ Stage ──────────────────────────┬─ Sheet (side panel) ──────┤
│ Viewer (nest grid OR bounds)     │ Mode-specific inputs      │
│                                  │ Collapsible sections      │
└──────────────────────────────────┴───────────────────────────┘
```

### Mode layouts

| Mode | Sheet side | Sheet width | Viewer |
|------|------------|-------------|--------|
| Calculator | **Left** | 300px | Nest grid (right) |
| G-code split | **Right** | 420px | Single-part bounds (left) |
| G-code full | Full width | `calc(100% - 1.5rem)` | Hidden (fade out) |

### Header chrome (stubs → product)

| Control | Prototype | Product seam |
|---------|-----------|--------------|
| Wordmark Nest+Calc | Two-tone | `layout` / app chrome |
| Calculator \| G-code tabs | Mode switch | Route or in-app mode in `NestCalcApp` |
| IN \| MM switch | Mode-accent colored | Global units; already exists — restyle |
| Theme / settings | Stub buttons | Existing settings surface |
| Auth avatar | Stub `RT` | `AuthControls.tsx` + Clerk |

## Calculator mode — panel sections (top → bottom)

| Section | Collapsible | Contents | Product seam |
|---------|-------------|----------|--------------|
| Presets | Yes | Chips, Save/Manage in header when open | `PresetControls.tsx` |
| Part | Yes (default open) | Part #, X/Y, swap\|link group | `NestCalcApp` + `NumberInput` |
| Rem | Yes | X/Y, swap\|link | blank/rem fields |
| Gap | Yes | X/Y, swap\|link | gap fields |
| Margins | Yes | L · R · B · T single row | four margin fields |

### Calculator viewer chrome

- Part 90° / Rem 90° rotate controls  
- Axis counts (cols above, rows right of nest)  
- Parts total (no waste/utilization clutter)  
- AutoNest \| Manual  
- Collapsed badges on closed sections (e.g. `600 × 400`)

### XY control pattern

```
[ X input ] [ Y input ] | [ Swap ] [ Link ]
```

- Horizontal button group, same height as inputs (`h-9`)  
- Vertical separator between fields and buttons  
- Link active = mode accent fill  

## G-code mode — panel sections

| Section | Notes | Product seam |
|---------|-------|--------------|
| **Source** | Textarea + IN\|MM (program units) | `GCodeRotation.tsx` source |
| **Rotation** | 0 / 90 / −90 / 180 chips + Generate | angle + `handleGenerate` |
| **Part size** | X/Y readonly hydrate + independent IN\|MM + Fill → Calculator | PR #40 fill bridge |
| **Output** | Collapsible; auto-open on Generate; Copy/Download **icons** in header | generated output |

### Expanded full-panel layout

```
Source (full width)
┌ Rotation ──────┐ ┌ Part size ─────┐   equal height cards
│ chips + Generate│ │ X/Y + Fill     │
└────────────────┘ └────────────────┘
Output (full width)
```

### G-code viewer

- Single white 1px bounding box, 4px radius  
- Label `X × Y` + angle  
- Hidden when panel full  

## Product file map (plug-in points)

| Prototype surface | Primary files |
|-------------------|---------------|
| App shell / mode | `src/components/NestCalcApp.tsx`, `src/app/page.tsx`, `src/app/layout.tsx` |
| Globals / tokens | `src/app/globals.css` |
| Presets | `src/components/PresetControls.tsx` |
| Nest preview | `src/components/NestGrid.tsx`, `src/components/AutoNestPreview.tsx` |
| G-code | `src/components/GCodeRotation.tsx`, `src/lib/gcodeRotation*` |
| Numbers | `src/components/NumberInput.tsx`, `src/components/QuickValuesBar.tsx` |
| Auth | `src/components/AuthControls.tsx` |
| PWA | `SerwistRegistration.tsx`, `src/app/sw.ts` — **do not expand** |

## Implementation shape (recommended)

1. Token layer in `globals.css` (mode CSS variables)  
2. Shell layout (sheet + stage) with mode classes  
3. Restyle Calculator sections without changing field math  
4. Restyle G-code to match section order + Fill bridge (already on main)  
5. Motion: shared spring on sheet + stage padding  
6. Browser proof Calculator + G-code + Fill morph  

Prefer composition over rewriting engine modules.
