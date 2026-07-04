# NestCalc Architecture Review Todo

Source report: [architecture-review-20260703-181022.html](./architecture-review-20260703-181022.html)

This todo comes from the `improve-codebase-architecture` rerun that used the
repo-advisory `codebase-design` skill vocabulary.

## Recommended Order

1. Deepen the Codex verification module.
2. Deepen the Nest session module.
3. Deepen the shop-floor shell module.
4. Deepen the PWA access gate module.

## 1. Deepen the Codex Verification Module

Recommendation strength: Strong

Dependency category: local-substitutable + mock

Files:
- `package.json`
- `playwright.config.ts`
- `e2e/*`
- `vitest.config.ts`
- `src/**/*.test.ts`
- `GOAL.md`
- `docs/WORKFLOW.md`
- `docs/architecture/ARCHITECTURE_REVIEW_TODO.md`

Todo:
- Add repo-local verification infrastructure patterned after NanoTate:
  Vitest, Playwright, Clerk testing helpers, and storage-state setup.
- Add a small authenticated app-shell proof that reaches the calculator after
  Clerk sign-in with test credentials.
- Add screenshot/browser proof for desktop, iPhone portrait, and iPhone
  landscape layouts.
- Add unit tests for pure in-process calculation and state-transition modules
  once the Nest session module exists.
- Document required local env values for authenticated browser proof.
- Treat missing Clerk testing env as blocked proof, not a passing substitute.

## 2. Deepen the Nest Session Module

Recommendation strength: Strong

Dependency category: in-process

Files:
- `src/components/NestCalcApp.tsx`
- `src/hooks/useNestInputs.ts`
- `src/lib/nestcalc.ts`
- `src/lib/units.ts`
- `src/lib/storage.ts`
- `src/lib/types.ts`

Todo:
- Concentrate Rem rotation, Part rotation, Link, Swap, Clear, unit conversion,
  persistence, and result calculation behind one Nest session module.
- Keep the UI module calling a smaller interface instead of applying
  `Partial<NestInputs>` patches directly.
- Preserve current V3 behavior, especially Rem X/Y swap, Gap X/Y swap, Part
  dimensions unchanged on Rem rotation, and optional margin rotation.
- Add tests at the Nest session interface for rotation, link/swap, unit
  conversion, clear, persisted legacy migration, and result calculation.
- Replace shallow helper-level tests with tests at the deepened module
  interface when they become redundant.

## 3. Deepen the Shop-Floor Shell Module

Recommendation strength: Worth exploring

Dependency category: local-substitutable

Files:
- `src/components/NestCalcApp.tsx`
- `src/components/NumberInput.tsx`
- `src/components/QuickValuesBar.tsx`
- `src/hooks/useQuickValuesFocus.tsx`
- `src/app/globals.css`
- `src/components/AuthControls.tsx`

Todo:
- Move shop-floor layout knowledge out of the broad `NestCalcApp.tsx` module
  into a deeper shell module after verification infrastructure exists.
- Keep header controls, input deck arrangement, Quick Values behavior, and
  split-layout rules locally testable through browser proof.
- Use Playwright screenshots as the interface-level proof for portrait,
  landscape, and desktop layouts.
- Preserve existing iOS safe-area and landscape-scroll lessons from
  `LESSONS_LEARNED.md`.

## 4. Deepen the PWA Access Gate Module

Recommendation strength: Worth exploring

Dependency category: mock + local-substitutable

Files:
- `src/proxy.ts`
- `src/app/layout.tsx`
- `src/app/sw.ts`
- `src/app/serwist/[path]/route.ts`
- `src/app/~offline/page.tsx`
- `src/app/sign-in/[[...sign-in]]/page.tsx`
- `.env.example`
- `README.md`
- `TUNNEL_SETUP.md`

Todo:
- Revisit after PR #17 lands locally, because that PR changes sign-up policy,
  request access, Resend env, and auth docs.
- Concentrate Clerk route policy, Serwist offline shell policy, and operator
  env/docs expectations behind a single PWA access gate module.
- Use Clerk testing as the mock adapter and offline-shell checks as the
  local-substitutable adapter.
- Keep `/~offline` public and preserve `/__clerk/:path*` matcher behavior.
- Ensure docs and `.env.example` match the active sign-up/request-access policy.

## Current Repo Status Notes

- NestCalc currently has PRs #1-#16 merged and PR #17 open.
- The local branch checked during this review was `main`.
- The global `codebase-design` skill is installed, but NestCalc has not yet
  been aligned with NanoTate's workflow/test infrastructure.
- This file is a todo list, not an implementation goal. Create a scoped
  `GOAL.md` before starting the first implementation wave.
