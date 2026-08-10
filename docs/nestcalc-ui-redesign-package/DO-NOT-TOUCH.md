# Do Not Touch — NestCalc UI Redesign Wave

Derived from NestCalc `AGENTS.md` protected surfaces + this redesign scope.

## Hard walls (unless a future GOAL explicitly names them)

### Engine / math
- Calculator nesting math  
- AutoNest packing, ranking, counts, trim-edge policies, fallback guards, search budget  
- G-code parse/rotate algorithms (`analyzeGCode`, `generateRotatedGCode`, bounds math) — **UI only** may call them  

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

## Soft walls (touch only for chrome)

| Surface | Allowed | Forbidden |
|---------|---------|-----------|
| `GCodeRotation.tsx` | Layout, chrome, section order, Fill button placement | Changing generate diagnostics rules |
| `PresetControls.tsx` | Visual chips/panel, header Save/Manage | Storage schema / key names without GOAL |
| `NestCalcApp.tsx` | Shell, sheet, tabs, section chrome | Field math / AutoNest triggers semantics |
| `globals.css` | Tokens, motion | Breaking existing CSS variable consumers carelessly |
| `NestGrid` / preview | Stroke, radius, axis labels | Placement algorithm |

## This package itself

- Lives in SuperGrok sandbox (`artifacts/docs/nestcalc-ui-redesign-package/`)  
- **Not** a NestCalc commit  
- **Not** a frozen GOAL  
- Execution requires human + NestCalc goal-grilling + new Flow-ID  
