# HowMany Radar Shell — UI Research Synthesis

**Trace:** NC-FLIPIT-20260818-RADAR-SYNTH  
**Date:** 2026-08-18  
**Class:** Docs-only exploratory authority pack  
**Audience:** Grok Build (self-contained HTML host)  
**Does not touch:** `COMPOSITION-FLIPIT-v3.html`, locked individuals, `app/`

---

## 1. Mission

Build a **parallel composition host** that is as complete as V3, with:

| Layer | Authority |
|---|---|
| **Behavior** | Read-only: `COMPOSITION-FLIPIT-v3.html` + SPECs (R1–R13 contracts, blank resize, Flip IT, presets, file open, unload) |
| **Visual** | 100% color from `audience-radar-skin.png` (mint / cream / purple / pale lavender). No sidebar in the product. |
| **Interaction** | Fixed card grid. Focus modal (1 or 2-up). Drawer for HUD field edit. Calculator is the only free-float control. |

This is **not** a product GOAL and **not** a Next.js wire.

---

## 2. Frozen layout (human-locked)

- Top row: HUD · toolPath · status · settings · Auto-Size
- Bottom-left: Laser bed (blank resize / outside arc grab)
- Bottom-right: FlipIt (NC + 90° flip + output)
- No sidebar. Cards stay put. In-card edit works.
- Focus button → modal front-center. Two selected → two-up side by side.
- Calculator: only free-float; snaps home when done.
- HUD field click → drawer pushes other cards (not classic popovers).
- Boot: every card visible; FlipIt usable by typing NC without a file.

---

## 3. Color system

### 3.1 Radar skin roles (primary authority)

Pull exact hex from `audience-radar-skin.png` at build time.

| Role | Intent |
|---|---|
| Page canvas | Pale lavender |
| Card surface | White / light mint |
| Mint tile | Positive / health cards |
| Cream / peach tile | Secondary weight |
| Purple accent | Selected / primary / focus |
| Ink / muted ink | Type hierarchy |
| Success / warning bars | Green / amber |

### 3.2 Peer token systems (inspiration only)

| Source | Why useful |
|---|---|
| stylecn Superhuman | Cream `#f2f0eb` + violet `#714cb6` |
| stylecn Fly.io | Violet `#7c3aed` + lavender mist |
| stylecn Stripe | Deep violet CTA + powder cards |
| shadcn Modern Minimal | Soft purple + air |
| USWDS mint scale | Success surfaces |

**Rule:** Radar PNG wins. Peers only for radius/shadow/type.

### 3.3 CSS variable scaffold

```css
:root {
  --page: /* lavender from PNG */;
  --card: #ffffff;
  --card-mint: /* soft mint */;
  --card-cream: /* cream/peach */;
  --accent: /* purple */;
  --accent-soft: /* purple wash */;
  --ink: #1a1a1f;
  --ink-muted: #6b6b76;
  --success: #22c55e;
  --warning: #f59e0b;
  --radius-card: 14px;
  --radius-chip: 999px;
  --shadow-card: 0 1px 2px rgba(20,16,40,.04), 0 8px 24px rgba(20,16,40,.06);
  --gap: 16px;
  --pad-card: 20px;
  --dur: 280ms;
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 4. Layout patterns researched

### KPI row + chart grid (2025–2026 standard)
Top 4–6 metric cards + bottom 2 large panels. Maps 1:1 to our freeze. Sources: datawirefra.me, Art of Style Frame cockpit checklist.

### Bento / asymmetric tiles
Bed + FlipIt = heroes (larger spans). Top cards = quieter metric weight. Aceternity bento; Orbix 2026 guide.

### CSS Grid recipe

```css
.shell {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gap);
  padding: 24px;
  min-height: 100vh;
  background: var(--page);
}
.top-card { grid-column: span 2; }
.bed      { grid-column: 1 / 7;  grid-row: 2; min-height: 420px; }
.flipit   { grid-column: 7 / 13; grid-row: 2; min-height: 420px; }
```

---

## 5. Focus / modal interaction

### View Transitions API (Baseline ~Oct 2025)

```js
function focusCard(cardEl) {
  if (!document.startViewTransition) {
    openModalFrom(cardEl);
    return;
  }
  document.startViewTransition(() => openModalFrom(cardEl));
}
```

Assign `view-transition-name` per card. Fallback: V3-style 280–420ms scale+fade. Respect `prefers-reduced-motion`.

Chris Coyier in-grid expand is alternate; freeze prefers true front-center modal overlay.

### Two-up
`focused = [idA, idB]` max 2. Modal stage two columns. Escape closes.

### Drawer that pushes grid
Shell CSS grid → open drawer expands track (`1fr 360px`). Cards compress. Class toggle only. No React.

### Calculator float
Only free-position surface. Fixed near corner. Close animates home (shared name or FLIP).

---

## 6. Component sources

| Source | Use |
|---|---|
| shadcn/ui Card | Header/Content/Footer structure in plain HTML |
| shadcn theming | Token naming discipline |
| stylecn brand CSS | Cream/lavender structure, then recolor to PNG |
| Aceternity bento | Span ideas only — no React runtime |
| CodeFronts CSS demos | Pure CSS grid recipes |
| V3 host | Behavior bible |

Prefer: read patterns → rewrite vanilla. Avoid npm/React/Tailwind build in the host.

---

## 7. Micro-interaction checklist

| Must | Note |
|---|---|
| Input focus → select-all | `input.select()` |
| Preset chip click → fill | Load only |
| Edit → Confirm/Cancel | Writes preset |
| Main OK | Applies fields; never writes preset |
| Blank resize + outside arc | Port V3 geometry; radar chrome |
| Dual-display sync | Linked values |
| Output not gated | Manual edit allowed |
| Zoom in/out/fit | Front surface |
| Origin-pinned bed | Bed size control OK |

Grok decides: READY/DONE, highlight details, default part (<6×6), nest-box, glow.

---

## 8. Motion

| Motion | Target |
|---|---|
| Card → modal | View Transition or 280–420ms |
| Drawer | Grid track animate |
| Calc home | FLIP ~240ms |
| Reduced motion | Instant |

---

## 9. Accessibility

Keyboard cards/focus buttons. Modal `role=dialog` + trap + Escape. Drawer labelled. Visible purple-soft focus rings.

---

## 10. Build order for Grok Build

1. Shell grid + tokens from PNG + empty cards
2. Bed card + blank/arc (V3 behavior)
3. FlipIt source/output/flip/file/unload
4. HUD + drawer + presets
5. Auto-Size / toolPath / status / settings
6. Focus modal 1-up and 2-up + View Transitions
7. Calculator float
8. SPEC + README tip-sync
9. Open PR; do not merge; do not touch V3

---

## 11. References

- Chris Coyier — Expanding grid cards + View Transitions
- Chrome Developers — View Transitions 2025 (Baseline)
- MDN — View Transition API
- Aceternity UI — Bento grid patterns
- stylecn — Superhuman / Fly.io / Stripe light brand CSS
- shadcn/ui — Card + theming tokens
- datawirefra.me — Dashboard layout catalog
- CodeFronts — Pure CSS dashboard layouts

---

## 12. Non-goals

- Sidebar
- Social listening product features
- Dragging cards to rearrange
- Product app/ wire or GOAL freeze
- Editing V3 or locked individuals

---

**End synthesis.**  
Place beside `audience-radar-skin.png`.  
Grok Build reads this + PNG + V3 host before writing `COMPOSITION-FLIPIT-radar.html`.
