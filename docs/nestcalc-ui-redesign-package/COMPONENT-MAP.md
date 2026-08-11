# Component Map — NestCalc UI Redesign

**Option B:** Host **exact** `REFERENCE-PROTOTYPE-v2.html` as product UI chrome. Bridge real engines into its DOM. Do **not** restyle `NestCalcApp` to “look like” the prototype as the primary UI path.

## Shell (shared) — exact prototype

```
┌─ App header ──────────────────────────────────────────────────────┐
│ [h ? wMany]  [Calculator|G-code tabs]  [IN|MM] [theme] [auth]     │
├─ Stage ───────────────────────────┬─ Sheet (side panel) ──────────┤
│ Viewer (nest grid OR bounds)      │ Mode-specific inputs          │
│                                   │ Collapsible sections          │
└───────────────────────────────────┴───────────────────────────────┘
```

### Header wordmark (locked)

| Control | Spec |
|---------|------|
| Wordmark | Free-standing **h** + Lucide **CircleQuestionMark** + **wMany** (**HowMany**) — no pill/box/outline; **not** Nest+Calc two-tone |

### Mode layouts (tip geometry)

| Mode | Sheet side | Sheet width | Viewer |
|------|------------|-------------|--------|
| Calculator | **Left** | Default **500px** (min **300** / max **500**, resizable) | Nest grid (right) |
| G-code split | **Right** | Default **620px** (min **420** / max **620**, resizable) | Single-part bounds (left) |
| G-code full | Full width | `calc(100% - 1.5rem)` | Hidden (fade out) |

Stage padding tracks live sheet width + edge gap (tip: calc open ≈ `width + 24`; gcode split ≈ `width + 28`; closed full-bleed `16px`).

### Header chrome → product seams (wire into exact shell)

| Control | Prototype | Wire target (existing) |
|---------|-----------|------------------------|
| Wordmark h[?]wMany | Exact HTML | Keep prototype mark; host only |
| Calculator \| G-code tabs | Mode switch in shell | Bridge mode state; engines stay in `src/lib` |
| IN \| MM switch | Mode-accent colored | Global units seam already in app |
| Theme / settings | Stub buttons | Existing settings surface when GOAL allows |
| Auth avatar | Stub `RT` | `AuthControls.tsx` + Clerk (policy unchanged) |

## Calculator mode — panel sections (top → bottom)

| Section | Collapsible | Contents | Wire target |
|---------|-------------|----------|-------------|
| Presets | Yes | Chips, Save/Manage in header when open | `PresetControls` / preset storage seams |
| Part | Yes (default open) | Part #, X/Y, swap\|link group | Calculator inputs → `calculateNest` / field state |
| Rem | Yes | X/Y, swap\|link | blank/rem fields |
| Gap | Yes | X/Y, swap\|link | gap fields |
| Margins | Yes | L · R · B · T single row | four margin fields |

### Calculator viewer chrome

- Part 90° / Rem 90° rotate controls  
- Axis counts (cols above, rows right of nest)  
- Parts total (no waste/utilization clutter)  
- AutoNest \| Manual  
- Collapsed badges on closed sections (e.g. `600 × 400`)

Wire targets: nest placement / AutoNest engines and preview data — **into** the shell’s stage, not a parallel React chrome tree.

### XY control pattern (as in tip)

```
[ X input ] [ Y input ] | [ Swap ] [ Link ]
```

- Horizontal button group, same height as inputs  
- Vertical separator between fields and buttons  
- Link active = mode accent fill  

## G-code mode — panel sections

| Section | Notes | Wire target |
|---------|-------|-------------|
| **Source** | Textarea + IN\|MM (program units) | G-code source state |
| **Rotation** | 0 / 90 / −90 / 180 chips + Generate | angle + `generateRotatedGCode` / analyze |
| **Part size** | X/Y hydrate + independent IN\|MM + Fill → Calculator | PR #40 fill bridge semantics |
| **Output** | Collapsible; auto-open on Generate; Copy/Download icons in header | generated output |

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

## Engine / product seam table (wire into exact shell)

| Prototype surface | Primary wire targets (existing) |
|-------------------|----------------------------------|
| Host / entry | Thin host page (or route) that mounts exact shell HTML — **finalize at GOAL freeze** |
| Calculator math | `src/lib/nestcalc.ts` / `calculateNest` (and related) — call only, no algorithm change |
| AutoNest | AutoNest engine modules — packing/ranking/counts **untouched** |
| Presets | Preset storage + chip UX already in app family |
| Nest preview data | Feed shell stage from placement results (`NestGrid` / `AutoNestPreview` as data sources or replaceable renderers) |
| G-code | `src/lib/gcodeRotation*` — `analyzeGCode`, `generateRotatedGCode`, bounds |
| Numbers / quick values | Numeric field + pad behavior; product pad optional |
| Auth | `AuthControls.tsx` + Clerk — policy and routes **unchanged** |
| PWA | `SerwistRegistration.tsx`, `src/app/sw.ts` — **do not expand** |

Legacy React chrome (`NestCalcApp.tsx`, restyled panels, etc.) is **not** the Option B product UI. It may remain as temporary bridge helpers only if a frozen GOAL names that path; the **visible product shell is the exact prototype**.

## Implementation shape (Option B)

1. **Host** the exact `REFERENCE-PROTOTYPE-v2.html` shell (bytes authority — do not redesign).  
2. Add a **thin bridge layer** that binds existing `src/lib` engines (nest, AutoNest, gcode, presets, units, Clerk) to shell controls and stage.  
3. Preserve shell motion, resize, mode morph, and chrome already in the HTML.  
4. Do **not** restyle `NestCalcApp` to approximate the prototype as the primary UI.  
5. Browser proof: same click-through feel as prototype + real engine numbers.  

Prefer binding engines over rewriting chrome or engines.
