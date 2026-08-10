# Wiring — NestCalc Sign-in Package

## Authority order (future freeze)

1. Frozen GOAL acceptance text  
2. `REFERENCE-PROTOTYPE.html` (visual)  
3. `DESIGN-TOKENS.md` (tokens)  
4. `COMPONENT-MAP.md` / this file / `DO-NOT-TOUCH.md`  
5. Existing NestCalc Clerk behavior (preserve unless GOAL names a change)

## Product bridges

| Concern | Current product | Package |
|---------|-----------------|---------|
| Sign-in component | `@clerk/nextjs` `<SignIn forceRedirectUrl="/" />` | Keep; appearance prop only |
| Appearance object | `nestcalcSignInAppearance` (amber + white card) | Replace variables/elements per tokens; keep footer hidden |
| Page chrome | `bg-[var(--background)]` + CSS vars | Sign-in page may use local light shell classes so global dark app tokens are not forced on the auth page |
| Request access | `RequestAccessForm` under card | **Not in visual prototype.** Wire only if GOAL keeps policy; if GOAL removes policy, delete section + form usage together |
| Redirect | `forceRedirectUrl="/"` | Preserve |
| UserButton (signed-in app) | `nestcalcUserButtonAppearance` dark popover | Independent of sign-in card; do not force light UserButton |

## Fail-closed implementation notes

- Translating prototype HTML into Clerk `appearance` + page classes is required; pasting sandbox HTML is not.
- Do not adopt prototype fake form handlers.
- Do not change Clerk publishable keys, proxy, or middleware.
- If `RequestAccessForm` remains, restyle it to sit on the light page without breaking the dark card hierarchy — or park restyle to a follow-on residual explicitly named in GOAL.
