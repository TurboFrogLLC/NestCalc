# NestCalc UI Redesign — Implementer Package

**Status:** Exploratory R&D complete · sandbox prototype locked · **not** a product GOAL  
**Date:** 2026-08-10  
**Authority:** SuperGrok sandbox only. NestCalc `AGENTS.md` / quiet `GOAL.md` win for any product execution.  
**Prototype product identity (visible):** **HowMany** — free-standing `h` + CircleQuestionMark + `wMany` (locked tip `ff8b7d61`)  
**Repo package path still uses NestCalc naming** (implementer docs / codebase seams); do not treat NestCalc as the prototype’s on-screen wordmark.  
**Product UI decision (locked):** **Option B** — the exact prototype shell **is** the product chrome; wire real engines into it. Do **not** recreate or “match intent” in React.

## What this is

A complete visual/UX redesign package for the NestCalc app lineage (calculator + nest viewer + presets + G-code rotation + auth chrome), with the locked sandbox prototype presenting the **HowMany** wordmark. Functionally the same product family; look/feel/format/ergonomics modernized.

**This package does not authorize product implementation.** It is the freeze-ready design authority for a *future* product GOAL after human approval and goal-grilling. Until that freeze, treat this package as docs-only authority — not a license to wire production.

## Contents

| File | Purpose |
|------|---------|
| `DESIGN-TOKENS.md` | Colors, radii, spacing, motion, type (aligned to tip) |
| `COMPONENT-MAP.md` | Shell map, Calculator / G-code surfaces, engine wire seams |
| `WIRING.md` | State bridges, mode morph, Fill → Calculator, units |
| `DO-NOT-TOUCH.md` | Protected surfaces + exact-shell hard wall |
| `CODEX-READY-PROMPT.md` | Draft thin Codex/Grok Build handoff (Option B; use only after GOAL freeze) |
| `REFERENCE-PROTOTYPE-v2.html` | **Exact product chrome source** (locked tip bytes) |

## Prototype authority (Option B)

`REFERENCE-PROTOTYPE-v2.html` (exact tip bytes from authority lock `ff8b7d61`: HowMany title + free-standing wordmark + evolved shell) is the **product chrome source**. Future product work **hosts that exact shell** and **wires existing engines** into it. Do **not** recreate the shell in React.

## NestCalc baseline (product facts)

- Next.js **16.3.0** · React **19.2.4** · Clerk · Serwist PWA  
- Engines / seams today: `NestCalcApp.tsx`, `PresetControls.tsx`, `GCodeRotation.tsx`, `NestGrid.tsx`, `AutoNestPreview.tsx`, `NumberInput.tsx`, `QuickValuesBar.tsx`, `AuthControls.tsx`, `src/lib/*` math modules  
- Under Option B those React components are **wire targets / legacy chrome to retire**, not a restyle canvas for “match intent”  
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

1. Review prototype + this package (Option B locked)  
2. Optional polish residuals only inside the exact HTML shell (separate authority)  
3. When ready: NestCalc goal-grilling → freeze GOAL → Codex thin `/goal` from `CODEX-READY-PROMPT.md`  
