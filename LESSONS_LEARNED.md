# LESSONS_LEARNED.md - NestCalc

## Purpose

Reusable lessons from merged PR closeout breakdowns for NestCalc. Advisory
execution memory only — does not override `NestCalc_Build_Spec.md`, `AGENTS.md`,
or explicit human direction.

## How To Use

Before implementation or PR closeout:

1. Read `NestCalc_Build_Spec.md`.
2. Read this file and identify relevant `L-nestcalc-*` labels.
3. Treat matching lessons as preflight checks and regression risks.

## Lesson Index

| Label | Source | Lesson | Applies when |
|---|---|---|---|
| `L-nestcalc-next16-serwist-turbopack` | [PR #1](https://github.com/TurboFrogLLC/NestCalc/pull/1) | Next.js 16 production builds default to Turbopack; PWA service workers should use @serwist/turbopack (route handler + SerwistProvider at /serwist/sw.js), not @serwist/next/webpack. With src-dir, set swSrc to src/app/sw.ts. | Scaffolding or upgrading NestCalc/Next.js 16 PWAs with Serwist. |
| `L-nestcalc-socket-transitive-triage` | [PR #1](https://github.com/TurboFrogLLC/NestCalc/pull/1) | Socket obfuscation alerts on eslint-config-next and @tailwindcss/postcss transitive dev deps are usually false positives; document dev-only triage in docs/SOCKET_SECURITY.md and post @SocketSecurity ignore comments after review — do not drop Next.js lint alignment to silence alerts. | Socket PR alerts on NestCalc or other Next.js eslint-config-next scaffolds. |
| `L-nestcalc-postcss-override` | [PR #1](https://github.com/TurboFrogLLC/NestCalc/pull/1) | Next 16 may nest postcss below GHSA-qx2v-qp2m-jg93; add package.json overrides.postcss ^8.5.10 and re-run npm audit before merge — npm audit fix --force downgrades Next and must be avoided. | npm audit reports moderate postcss via next on NestCalc or similar Next 16 repos. |
| `L-nestcalc-allowscripts-pin` | [PR #1](https://github.com/TurboFrogLLC/NestCalc/pull/1) | On npm v11+, pin allowScripts entries for @swc/core, esbuild, sharp, and unrs-resolver after reviewing install scripts; use npm approve-scripts --allow-scripts-pending to discover pending packages. | Initial Next.js 16 scaffold or dependency refresh shows allow-scripts warnings. |
| `L-nestcalc-ios-safe-area-standalone` | [PR #2](https://github.com/TurboFrogLLC/NestCalc/pull/2) | iOS standalone PWAs with viewportFit cover and black-translucent status bar need body padding-top: env(safe-area-inset-top, 0px) to clear the notch/Dynamic Island without changing internal layout spacing. | Fixing status bar overlap on iPhone home-screen PWAs where viewport-fit=cover is already set. |
| `L-nestcalc-serwist-ios-offline` | [PR #2](https://github.com/TurboFrogLLC/NestCalc/pull/2) | For Serwist + Next.js 16 offline on iOS when the origin/tunnel dies, explicitly precache / and /~offline, set navigateFallback to /, broaden document fallbacks to request.mode === navigate, and disable navigationPreload to avoid delayed offline responses. | Hardening NestCalc or similar Next.js 16 Serwist turbopack PWAs for shop-floor offline use on iPhone. |
| `L-nestcalc-clerk-pwa-public-routes` | [PR #9](https://github.com/TurboFrogLLC/NestCalc/pull/9) | When adding Clerk `clerkMiddleware`, keep `/~offline` (and `/sign-in`, `/sign-up`) in `createRouteMatcher` public routes and include `/__clerk/:path*` in the proxy `config.matcher` after `/(api|trpc)(.*)` — otherwise Serwist offline fallback and Clerk dev proxy break behind the auth gate. | Integrating Clerk auth into NestCalc or other Next.js 16 Serwist PWAs. |
| `L-nestcalc-env-example-gitignore` | [PR #10](https://github.com/TurboFrogLLC/NestCalc/pull/10) | Repos that gitignore `.env*` must add `!.env.example` before committing a Clerk `.env.example` template — otherwise `git add` silently skips the file and onboarding docs reference a missing committed artifact. | Adding `.env.example` to NestCalc or other Next.js repos with a broad `.env*` gitignore rule. |
| `L-nestcalc-clerk-header-userbutton-only` | [PR #10](https://github.com/TurboFrogLLC/NestCalc/pull/10) | When Clerk `clerkMiddleware` already redirects unsigned users to `/sign-in`, header `AuthControls` should render `UserButton` only inside `<Show when="signed-in">` — signed-out modal Sign in/Sign up buttons never mount on protected `/` and add header clutter. | Polishing Clerk header UX on NestCalc or similar server-gated Next.js apps. |
| `L-nestcalc-clerk-appearance-shared` | [PR #10](https://github.com/TurboFrogLLC/NestCalc/pull/10) | Share a single `nestcalcClerkAppearance` module (dark `#09090b`, gold `#fbbf24` primary) across `<SignIn />`, `<SignUp />`, and `UserButton`, and set `forceRedirectUrl="/"` on auth pages so post-login returns to the calculator without duplicating theme props. | Theming Clerk prebuilt components to match NestCalc shop-floor styling. |
| `L-nestcalc-clerk-input-contrast` | [PR #11](https://github.com/TurboFrogLLC/NestCalc/pull/11) | When Clerk sign-in inputs blend into NestCalc's dark page, strengthen both `variables` (`colorInputBackground`, `colorInputText`, `colorNeutral`) and `elements.formFieldInput` with explicit `borderColor` plus a gold `&:focus` ring (`#fbbf24`) — variables alone are often too subtle on `#09090b` backgrounds. | Fixing low-contrast Clerk auth inputs on NestCalc or similar dark-themed sign-in/sign-up pages. |

## Maintenance Rules

- Append new rows only from final PR closeout breakdowns or human-approved retros.
- Preserve stable `L-nestcalc-*` labels after merge; never rename existing labels.
- Skip duplicate labels when appending.
