# NestCalc UI Redesign — Implementer Package

**Status:** Exploratory R&D complete · sandbox prototype locked · **not** a product GOAL  
**Date:** 2026-08-10  
**Authority:** SuperGrok sandbox only. NestCalc `AGENTS.md` / quiet `GOAL.md` win for any product execution.  
**Prototype product identity (visible):** **HowMany** — free-standing `h` + CircleQuestionMark + `wMany` (locked tip `ff8b7d61`)  
**Repo package path still uses NestCalc naming** (implementer docs / codebase seams); do not treat NestCalc as the prototype’s on-screen wordmark.

## What this is

A complete visual/UX redesign package for the NestCalc app lineage (calculator + nest viewer + presets + G-code rotation + auth chrome), with the locked sandbox prototype presenting the **HowMany** wordmark. Functionally the same product family; look/feel/format/ergonomics modernized.

**This package does not authorize product implementation.** It is the freeze-ready design authority for a *future* product GOAL after human approval and goal-grilling.

## Contents

| File | Purpose |
|------|---------|
| `DESIGN-TOKENS.md` | Colors, radii, spacing, motion, type |
| `COMPONENT-MAP.md` | Shell map, Calculator / G-code surfaces, product file seams |
| `WIRING.md` | State bridges, mode morph, Fill → Calculator, units |
| `DO-NOT-TOUCH.md` | Protected surfaces (NestCalc AGENTS + this wave) |
| `CODEX-READY-PROMPT.md` | Draft thin Codex/Grok Build handoff (use only after GOAL freeze) |
| `REFERENCE-PROTOTYPE-v2.html` | Living visual authority (sandbox HTML) |

## Prototype authority

`REFERENCE-PROTOTYPE-v2.html` is the visual source of truth for this wave (exact tip bytes from authority lock `ff8b7d61`: HowMany title + free-standing wordmark + evolved shell). Product code must match its **intent** (layout, tokens, motion, mode behaviors), not paste CDN Tailwind HTML into Next.js.

## NestCalc baseline (product facts)

- Next.js **16.3.0** · React **19.2.4** · Clerk · Serwist PWA  
- Components: `NestCalcApp.tsx`, `PresetControls.tsx`, `GCodeRotation.tsx`, `NestGrid.tsx`, `AutoNestPreview.tsx`, `NumberInput.tsx`, `QuickValuesBar.tsx`, `AuthControls.tsx`  
- PR #40 on main: G-code bounds → Fill calculator part size  
- Pilot continuum `WF-20260731-nestcalc-shop-helpers`: **COMPLETED_ON_MAIN**  
- Root `GOAL.md`: quiet — no active product objective  

## Tooling split (do not mix)

| Layer | Role |
|-------|------|
| SuperGrok chat | Plan, design, this package |
| Codex App/CLI | Future product GOAL freeze + implementation |
| Grok Build CLI | Local product execution when GOAL allows |

**Never** put SuperGrok skill names into Codex or Grok Build prompts.

## Next step (human)

1. Review prototype + this package  
2. Optional polish residuals in sandbox  
3. When ready: NestCalc goal-grilling → freeze GOAL → Codex thin `/goal` from `CODEX-READY-PROMPT.md`  
