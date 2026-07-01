# NestCalc

Quick rectangular nesting calculator for laser job shop remnants and odd scraps. Simple sketch-pad style tool with independent four-side margins, edge-to-edge gap, and dual rotation (part + remnant for clamp margins). Built for fast shop floor use on iPhone as installable PWA.

## Quick Start & Links

- **Build Spec** → [NestCalc_Build_Spec.md](NestCalc_Build_Spec.md)
- **Security** → [SOCKET_SECURITY.md](SOCKET_SECURITY.md)
- **Lessons** → [LESSONS_LEARNED.md](LESSONS_LEARNED.md) (advisory execution memory from merged PR closeouts)

## Clerk Authentication

NestCalc uses [Clerk](https://clerk.com/) as an access gate. Signed-out users are redirected to `/sign-in` or `/sign-up`; the calculator is available after login.

**Local development:** create `.env.local` (gitignored) with keys from the [Clerk Dashboard](https://dashboard.clerk.com/) or via `clerk init`:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`

**Deploy previews (e.g. Vercel):** add the same variables in the project environment settings. Use development keys for preview branches; configure a production Clerk instance before shipping to shop floor.

## For Coding Agents

Load `NestCalc_Build_Spec.md`, `LESSONS_LEARNED.md`, and `AGENTS.md` first. Read relevant `L-nestcalc-*` labels before implementation or PR closeout.
