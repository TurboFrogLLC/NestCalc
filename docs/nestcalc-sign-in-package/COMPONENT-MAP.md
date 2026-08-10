# Component Map — NestCalc Sign-in

## Visual surfaces (this package)

| Surface | Spec |
|---------|------|
| Page shell | Light grey full viewport; centered column `max-w-md` |
| Wordmark | Page-level above card: Nest slate + italic Calc blue |
| Tagline | One short line; no request-access CTA |
| Clerk card | Dark panel card only (mock in prototype; real `<SignIn />` in product) |
| Primary CTA | Blue filled Continue |
| Social | Dark surface Google row; subtle orange hover border allowed |

## Product file seams (future wire only)

| File | Role today | Package intent |
|------|------------|----------------|
| `src/app/sign-in/[[...sign-in]]/page.tsx` | Dark/page vars + wordmark + `<SignIn />` + **RequestAccessForm** | Restyle page shell to light grey; wordmark two-tone; **do not remove RequestAccessForm unless GOAL authorizes policy change** |
| `src/lib/clerkAppearance.ts` | White card + **amber** primary; sign-in hides footer; UserButton dark popover | Sign-in appearance → dark card + blue primary per tokens; UserButton may stay dark popover for in-app header |
| `src/components/AuthControls.tsx` | Signed-in `UserButton` only | Style-only if in-app header needs avatar chrome; not sign-in page |
| `src/components/RequestAccessForm.tsx` | Live under sign-in | **Protected policy surface.** Visual package omits it; product removal needs explicit GOAL |

## Active product GOAL boundary

Flow `NC-20260810-472606a4` (dark prototype parity chrome):

- **Does not** include `clerkAppearance.ts`, sign-in routes, or `RequestAccessForm`
- **Protects** Clerk authentication, authorization, request-access policy, route shape
- This package must **not** be mixed into that implement PR

## NanoTate reference (inspiration only)

NanoTate uses white page + white card + `#1d6ff2`. NestCalc sign-in package deliberately diverges: light grey page + **dark** card + NestCalc blue `#538BEC` to match the locked product shell accents.
