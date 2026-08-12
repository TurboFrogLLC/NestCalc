# DO NOT TOUCH — HowMany UI Polish Residual Authority

**Paramount. No exceptions without explicit human decision.**

## Forbidden for Codex / any agent

1. **Do not redesign anything from prose.**  
   UI is already designed. Authority is only:
   - `docs/howmany-ui-polish-residual-package/HOWMANY-UI-POLISH-RESIDUAL-COMPONENTS.html` (new residual chrome)
   - `docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html` (locked Option B shell + revert targets)

2. **Do not invent UI.**  
   If a control is not in those two HTML authorities, stop and ask. No "close enough." No improvisation.

3. **Do not edit either HTML authority file** as part of product implementation.  
   Wire *to* them. Do not mutate them. Changing `REFERENCE-PROTOTYPE-v2.html` changes the locked checksum and requires explicit human authorization before any freeze.

4. **Do not touch engine / analysis / G-code bounds algorithms.**  
   Complex CALL/GOTO bounds and NC fixture dial-in are **out of scope**.  
   NC fixture work lives in SuperBrain lab (**NC wReckless**) — separate cycle, not HowMany polish.

5. **Do not touch** Clerk, PWA, MODE, Production, deploy, or shell redesign.

6. **Do not expand Allowed Files** beyond bridge/portal/presentation wiring unless the frozen GOAL says so.

## Allowed pattern

- Read the locked HTML.
- Match it exactly via bridge / portal / host presentation.
- Prefer bridge capture/runtime DOM over shell byte edits.
- Reverts → match V2. New chrome → match residual package HTML.

## Package identity

| Item | Value |
|------|--------|
| Residual HTML | `docs/howmany-ui-polish-residual-package/HOWMANY-UI-POLISH-RESIDUAL-COMPONENTS.html` |
| Residual HTML sha256 | `2a1a3a5e14ead0f186947255b045f383b4a49d1b18eac9d345871124ba3b6853` |
| Locked V2 shell | `docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html` |
| Locked V2 checksum | `bed7567d093b73c08e2538f3e5939c32bc8765ae2cfbe9d43e7b2848d3f4475d` |

If authority and implementation disagree, **stop**. Do not "fix" by redesigning.
