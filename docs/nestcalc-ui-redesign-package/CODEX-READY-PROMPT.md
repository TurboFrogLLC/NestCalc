# Codex-ready prompt (DRAFT — use only after GOAL freeze)

> **Not executable as-is.** NestCalc root `GOAL.md` is quiet. Human must run goal-grilling, freeze a product GOAL with Flow-ID, branch intent, and allowed files. Then paste a thin `/goal` derived from this draft.

---

## Intent (for future GOAL.md)

**Title (suggested):** NestCalc UI redesign — Calculator + G-code shell (visual/UX)

**Outcome:** Ship the locked redesign from SuperGrok package `docs/nestcalc-ui-redesign-package/` (or mirrored path in SuperBrain/nerveCenter) into NestCalc on a feature branch: mode-split shell, design tokens, Calculator collapsible panel, G-code panel with Generate/Fill morph, motion springs. **No calculator math or G-code engine changes.**

## Authority to read first

1. NestCalc `AGENTS.md`  
2. Frozen `GOAL.md` (once exists)  
3. This package: `DESIGN-TOKENS.md`, `COMPONENT-MAP.md`, `WIRING.md`, `DO-NOT-TOUCH.md`  
4. Visual reference: `REFERENCE-PROTOTYPE-v2.html`  
5. `LESSONS_LEARNED.md` (esp. PR #40 fill lessons)  

## Allowed files (suggested — finalize at freeze)

- `src/app/globals.css`  
- `src/app/layout.tsx` (chrome only if needed)  
- `src/components/NestCalcApp.tsx`  
- `src/components/PresetControls.tsx`  
- `src/components/GCodeRotation.tsx`  
- `src/components/NestGrid.tsx` / `AutoNestPreview.tsx` (chrome only)  
- `src/components/NumberInput.tsx`, `QuickValuesBar.tsx`, `AuthControls.tsx` (style only)  
- Tests / Playwright under existing patterns for UI proof  

## Forbidden

- `src/lib` nesting / gcode **algorithm** modules except call-site wiring already present  
- Clerk policy, Serwist SW logic, secrets, `docs/governance/MODE`  
- Expanding scope into new product features beyond the package  

## Acceptance

- [ ] Calculator = blue system; G-code = orange system  
- [ ] Calculator: left sheet 300px, collapsibles, XY+swap/link, presets, nest viewer  
- [ ] G-code: right sheet 420px; Source → Rotation+Generate → Part size+Fill → Output  
- [ ] G-code full expand: viewer hidden; panel full width; Rotation\|Part size equal height row  
- [ ] Fill → hydrates Part X/Y and morphs to Calculator  
- [ ] Motion: 0.72s shared spring on panel width + stage padding (no width:auto snap)  
- [ ] `npm run lint` · `npm run build` · unit tests · Playwright UI proof  
- [ ] No math/engine behavior change  

## Verification

```bash
npm run lint
npm run build
npm run test:unit   # or project equivalent
# Playwright: Calculator mode, G-code generate, Fill morph, panel expand
```

## Closeout

Ready-for-review PR · B6/B7 NestCalc stages · human merge (B8) · lessons (B9)  

---

*SuperGrok skill names must never appear in the actual Codex CLI prompt.*
