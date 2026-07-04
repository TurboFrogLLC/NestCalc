# NestCalc Workflow

This repo uses a lightweight NanoTate-style verification workflow. Keep product
behavior changes separate from verification infrastructure changes.

## Authority Order

Read these first for non-trivial Codex work:

1. `AGENTS.md`
2. `docs/WORKFLOW.md`
3. `LESSONS_LEARNED.md`
4. `docs/architecture/ARCHITECTURE_REVIEW_TODO.md`
5. Relevant build specs and README material

`docs/architecture/ARCHITECTURE_REVIEW_TODO.md` guides refactor priority but
does not override the active implementation scope.

## Verification Commands

Use these checks before closeout when the touched surface warrants them:

- `npm run lint`
- `npm run build`
- `npm run test` or `npm run test:unit`
- `npm run test:e2e`
- `npm run test:e2e:auth` when valid Clerk test env is available

Treat missing Clerk authenticated E2E values as blocked auth proof, not a pass.
The public Playwright suite still covers the public PWA/offline shell and
manifest without signing in.

## Clerk Authenticated E2E Env

Use Clerk test-mode keys and a non-production test user only. Keep real values
in `.env.local` or CI secrets, never in committed files.

Required for authenticated Playwright proof:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` or `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `E2E_CLERK_USER_EMAIL`
- `E2E_CLERK_USER_PASSWORD`

Optional:

- `CLERK_TESTING_TOKEN`

`E2E_CLERK_USER_EMAIL` must be a Clerk test email containing `+clerk_test`.
The setup project creates or updates that test user, signs in through Clerk's
official Playwright helpers, and writes local storage state under
`playwright/.clerk/`.

## Browser And PWA Proof

Use Playwright for app-shell and PWA-sensitive changes. Prefer evidence from:

- desktop browser proof for normal calculator shell behavior
- mobile viewport proof for layout/touch-sensitive changes
- `/~offline` proof for Serwist/offline shell work
- authenticated `/` proof when Clerk test env is present

Do not add localhost-only production auth bypasses. If a future harness needs a
development shortcut, document it as local-only scaffolding and keep it out of
production behavior.

## Protected Surfaces

Do not change calculator math, calculator UI, PWA runtime behavior, Clerk
production auth policy, app routes, sign-up behavior, or request-access policy
unless the active goal explicitly includes that work.

For the next architecture wave, implement the Nest session module refactor only
after this verification infrastructure is green or any auth proof blocker is
clearly external.
