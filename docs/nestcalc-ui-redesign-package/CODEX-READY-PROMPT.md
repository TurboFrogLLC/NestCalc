# Codex-ready prompt (DRAFT — use only after GOAL freeze)

> **Not executable as-is.** NestCalc root `GOAL.md` is quiet. Human must run goal-grilling, freeze a product GOAL with Flow-ID, branch intent, and allowed files. Then paste a thin `/goal` derived from this draft.  
> **Product decision locked: Option B** — exact prototype shell is product UI chrome.

---

## Intent (for future GOAL.md)

**Title (suggested):** HowMany / NestCalc — host exact prototype shell + wire engines (Option B)

**Outcome:** Host exact `docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html` (locked tip bytes) as the **product UI chrome**. Wire existing engines into that shell: `calculateNest` / nesting math, AutoNest, gcode (`analyzeGCode` / `generateRotatedGCode` / bounds / Fill), presets, units, and Clerk auth chrome. **No calculator math or G-code algorithm changes. No React recreation of the shell.**

## Authority to read first

1. NestCalc `AGENTS.md`  
2. Frozen `GOAL.md` (once exists)  
3. This package: `README.md`, `DESIGN-TOKENS.md`, `COMPONENT-MAP.md`, `WIRING.md`, `DO-NOT-TOUCH.md`  
4. Visual + chrome authority: **exact** `REFERENCE-PROTOTYPE-v2.html` (do not rewrite)  
5. `LESSONS_LEARNED.md` (esp. PR #40 fill lessons)  

## Allowed files (suggested — finalize at freeze)

- Thin **host** entry (route/page) that mounts the exact prototype shell  
- Thin **bridge** glue (event/data binding from shell controls → engines)  
- Call sites only into existing `src/lib` engines (nest, AutoNest, gcode, presets)  
- Auth header bind to existing Clerk UI seams (policy unchanged)  
- Tests / Playwright under existing patterns for UI proof  

Finalize the exact path list at GOAL freeze. Prefer smallest host + bridge surface.

## Forbidden

- **React recreation** of the prototype shell as primary product UI  
- **“Match intent” restyle** of `NestCalcApp` (or parallel chrome) as the product path  
- Changing nesting / AutoNest / gcode **algorithms** (call only)  
- Clerk policy, Serwist SW logic, secrets, `docs/governance/MODE`  
- Expanding scope into new product features beyond hosting + wiring  

## Acceptance

- [ ] Product UI is the **exact** prototype shell (HowMany wordmark + tip geometry), not a React lookalike  
- [ ] Calculator blue / G-code orange accents preserved as in tip  
- [ ] Calculator: left sheet default **500** (min 300 / max 500); collapsibles; XY+swap/link; presets; nest stage  
- [ ] G-code: right sheet default **620** (min 420 / max 620); Source → Rotation+Generate → Part size+Fill → Output  
- [ ] G-code full expand + Fill → Calculator morph semantics preserved  
- [ ] Shell motion remains tip-owned (`--sheet-dur` / `--sheet-ease` etc.); bridge does not fight it  
- [ ] **Same click-through feel as prototype** + **real engine numbers** (nest / AutoNest / gcode)  
- [ ] `npm run lint` · `npm run build` · unit tests · Playwright UI proof  
- [ ] No math/engine behavior change  

## Verification

```bash
npm run lint
npm run build
npm run test:unit   # or project equivalent
# Playwright: Calculator mode, G-code generate, Fill morph, panel expand/resize
# Proof: visual parity with REFERENCE-PROTOTYPE-v2.html + engine-backed values
```

## Closeout

Ready-for-review PR · B6/B7 NestCalc stages · human merge (B8) · lessons (B9)  

---

*SuperGrok skill names must never appear in the actual Codex CLI prompt.*
