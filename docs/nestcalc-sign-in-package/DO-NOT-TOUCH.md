# Do Not Touch — NestCalc Sign-in Package

## Hard walls

### Active Flow NC-20260810-472606a4
- Do **not** fold this package into the dark prototype parity implement PR  
- Do **not** edit `GOAL.md` for that Flow to add sign-in files without a **new** freeze  
- Allowed Files for that Flow exclude `src/lib/clerkAppearance.ts`, sign-in routes, and request-access components  

### Clerk / auth policy (NestCalc protected surfaces)
- Clerk authentication and authorization behavior  
- **Request-access policy** and `RequestAccessForm` product presence (removal needs explicit GOAL)  
- Route shape for sign-in / proxy / middleware  
- Secrets, `.env*`, Clerk dashboard config  
- Preset owner isolation  

### Platform
- Serwist / PWA  
- Dependencies / `package.json` unless a future GOAL names Clerk theme package changes  
- Production, merge, `docs/governance/MODE`  

### Engines (irrelevant here but still walls)
- Calculator math, AutoNest, G-code algorithms  

## This package itself
- Lives under `docs/nestcalc-sign-in-package/` after intake  
- Exploratory design authority until a dedicated sign-in residual GOAL freezes it  
- `CODEX-READY-PROMPT.md` is non-executable historical draft  

## Lessons applied from UI redesign package failure
1. Package must be **in-repo** before freeze — not interpretive sandbox-only  
2. Fail-closed language: light grey page + dark card + blue primary are non-negotiable when this package is adopted  
3. Soft phrases (“inspired by”, “preserve amber”, “optional”) are forbidden in any future GOAL that adopts this package  
4. Separate residual track — do not expand active dark-shell Allowed Files silently  
5. Request-access omission is **visual** in this package; policy change is a separate human decision  
