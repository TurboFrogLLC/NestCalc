# NestCalc

Quick rectangular nesting calculator for laser job shop remnants and odd scraps. Simple sketch-pad style tool with independent four-side margins, edge-to-edge gap, and dual rotation (part + remnant for clamp margins). Built for fast shop floor use on iPhone as installable PWA.

## Quick Start & Links

- **Build Spec** → [NestCalc_Build_Spec.md](NestCalc_Build_Spec.md)
- **Security** → [SOCKET_SECURITY.md](SOCKET_SECURITY.md)
- **Lessons** → [LESSONS_LEARNED.md](LESSONS_LEARNED.md) (advisory execution memory from merged PR closeouts)

## Clerk Authentication

NestCalc uses [Clerk](https://clerk.com/) as an access gate. Signed-out users are redirected to `/sign-in`; the calculator is available after login. Public sign-up is disabled — new users submit a Request Access form on the sign-in page.

**Local development:** copy [`.env.example`](.env.example) to `.env.local` (gitignored) and fill in keys from the [Clerk Dashboard](https://dashboard.clerk.com/) or via `clerk init` / `clerk env pull`:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `RESEND_API_KEY`, `ACCESS_REQUEST_ADMIN_EMAIL` (and optional `RESEND_FROM_EMAIL`) for the Request Access form

**Deploy previews (e.g. Vercel):** add the same variables in the project environment settings. Use development keys for preview branches; configure a production Clerk instance before shipping to shop floor.

## For Coding Agents

Load `NestCalc_Build_Spec.md`, `LESSONS_LEARNED.md`, and `AGENTS.md` first. Read relevant `L-nestcalc-*` labels before implementation or PR closeout.
