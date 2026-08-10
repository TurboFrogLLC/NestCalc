# NestCalc Sign-in — Design Authority Package

**Status:** Exploratory R&D locked · sandbox prototype promoted to package · **not** a product GOAL  
**Date:** 2026-08-10  
**Authority path (after intake):** `docs/nestcalc-sign-in-package/`

## What this is

Hard visual source of truth for NestCalc **Clerk sign-in chrome**:

- Light grey page (`#E8E8EC`)
- Dark login card (`#0E0C14` family)
- Primary blue `#538BEC` (replace product amber `#fbbf24`)
- Wordmark Nest slate + italic Calc blue
- No request-access block in the **visual** authority
- No approval footer line
- No orange glow

## Contents

| File | Purpose |
|------|---------|
| `REFERENCE-PROTOTYPE.html` | Non-negotiable visual source of truth |
| `DESIGN-TOKENS.md` | Tokens + fail-closed rules |
| `COMPONENT-MAP.md` | Surfaces + product file seams |
| `WIRING.md` | Clerk appearance / page bridges |
| `DO-NOT-TOUCH.md` | Protected surfaces + active-Flow boundary |
| `CODEX-READY-PROMPT.md` | Non-executable draft (post-freeze only) |

## Lessons applied (from UI redesign package run)

1. **In-repo before freeze** — package must live under NestCalc `docs/` before any GOAL treats it as authority (sandbox-only caused the light-theme miss).  
2. **Fail-closed language** — no “inspired by” / “preserve amber” soft wording when adopted.  
3. **Separate residual** — do not mix into Flow `NC-20260810-472606a4` (dark shell implement). Clerk + request-access are protected on that Flow.  
4. **Policy ≠ chrome** — visual omission of request-access does not authorize deleting `RequestAccessForm` without an explicit GOAL.  
5. **Seven-file canonical set** — ZIP is transport only; tracked paths are the authority.

## Governance boundary

| Item | Rule |
|------|------|
| Active dark-shell Flow | Out of scope — do not expand its Allowed Files with this package |
| Future sign-in residual | Requires new goal-grill + freeze naming this directory |
| Product push | Docs-only intake PR first; implement only after freeze |

## Tooling split

| Layer | Role |
|-------|------|
| SuperGrok | This package + design lock |
| Codex App | Future freeze / B3 handoff |
| Codex CLI | Future implement on authorized branch |

Never put SuperGrok skill names into Codex/Grok Build prompts.
