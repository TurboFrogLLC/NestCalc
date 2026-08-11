# Do Not Touch — NestCalc UI Redesign Wave

Derived from NestCalc `AGENTS.md` protected surfaces + this redesign scope + **locked Option B** (exact prototype shell = product chrome).

## Hard walls (unless a future GOAL explicitly names them)

### Exact prototype shell (Option B)

- **Do not recreate, redesign, restyle, compress, modernize, or “improve” the locked prototype shell**  
- **`REFERENCE-PROTOTYPE-v2.html` exact tip bytes are authority** for product UI chrome  
- Do not invent a parallel React chrome that **replaces** the prototype as the primary product UI  
- Do not treat “match intent” restyle of `NestCalcApp` as the product path  

### Engine / math

- Calculator nesting math  
- AutoNest packing, ranking, counts, trim-edge policies, fallback guards, search budget  
- G-code parse/rotate algorithms (`analyzeGCode`, `generateRotatedGCode`, bounds math) — **UI bridge only** may call them  

### Auth / platform

- Clerk production auth policy and request-access policy  
- Sign-in routes, `proxy.ts` auth shape  
- Secrets, `.env*`, Vercel project settings  
- PWA service worker / Serwist runtime cache behavior  

### Governance

- `docs/governance/MODE`  
- Quiet `GOAL.md` content outside a dedicated freeze  
- Unrelated repo hygiene / Terra grilling docs  

### Out of product scope for this visual wave

- iOS / native  
- Changing G-code language subset or ACS dialect  
- Multi-device preset sync protocol  
- Light theme (unless GOAL adds it)  

## Soft walls (bridge / host only)

Bridge and thin host **may** bind engines and auth to the **existing prototype DOM**. They **must not** invent parallel React chrome that replaces the prototype.

| Surface | Allowed | Forbidden |
|---------|---------|-----------|
| Exact shell HTML | Host as product chrome; bind event/data bridges | Rewrite layout, motion, wordmark, or mode chrome |
| Thin host + bridge | Mount shell; call `src/lib` engines; map fields | Competing transitions / second shell tree |
| `GCodeRotation` / lib | Call Generate / bounds / Fill semantics | Changing generate diagnostics rules or engines |
| Presets storage | Bind chips/Save/Manage to existing storage | Schema / key renames without GOAL |
| Nest / AutoNest engines | Feed stage from real placement results | Packing/ranking/count changes |
| `NestCalcApp.tsx` (legacy) | Temporary bridge helpers only if GOAL names them | Restyle as primary product UI “to look like” prototype |
| Clerk / PWA | Header bind only | Policy, routes, SW cache changes |

## This package itself

- Package path: `docs/nestcalc-ui-redesign-package/` in NestCalc  
- **Not** a frozen product GOAL until human freeze + goal-grilling  
- Product wire requires human + NestCalc goal-grilling + new Flow-ID  
- Docs-only updates (this PR path) do **not** authorize engine or `src/` work  
