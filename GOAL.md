# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Next.js 16.2.9 to 16.3.0 Platform Bump",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": [
      {
        "lane": "goal-freeze evidence",
        "observed_model": null,
        "requested_model": "gpt-5.4-mini",
        "status": "unavailable"
      }
    ]
  },
  "branch_intent": "codex/next-16-3-platform-bump",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260809-1cf6985f",
  "goal_memory_commit": "fa1913a60f56d4500e9d9312c02af4b88bafdcb3",
  "goal_sha256": "sha256:03ca1907a57f1bfbb20f9e612677f7bf22b61b9e8206fcbafb347d76505520da",
  "protected_surfaces": [
    "calculator formulas and UI",
    "AutoNest packing, ranking, counts, trim-edge policies, fallback guards, and search budget",
    "Clerk production authentication and request-access policy",
    "PWA offline shell and Serwist runtime strategy",
    "secrets and docs/governance/MODE"
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": [
    "codex-repo-hygiene-gate",
    "nestcalc-goal-grilling",
    "codex-goal-prep",
    "vercel-plugin:nextjs",
    "vercel-plugin:verification"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: Next.js 16.2.9 to 16.3.0 Platform Bump

### Objective

Upgrade only `next` and `eslint-config-next` from exact `16.2.9` pins to exact
`16.3.0` pins. Preserve production-zero: do not introduce new production
high- or critical-severity supply-chain findings.

### Scope / Allowed Files

- `GOAL.md`
- `package.json`
- `package-lock.json`

Do not add dependencies or alter React/React DOM unless peer resolution hard
fails with recorded evidence. Prefer zero application-source changes.

### Protected Surfaces

Calculator math and UI, AutoNest behavior, Clerk production auth and
request-access policy, PWA offline shell/Serwist strategy, secrets, and
`docs/governance/MODE` are protected. `src/**` product logic, e2e fixtures,
Clerk routes, Serwist strategy, and ShopHelpers_Spec are forbidden unless a
proven break requires stopping this goal for a new freeze.

### Required Proof

- `python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md`
- `npm run governance:check`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run test:e2e` (public)

Path A is selected: authenticated G-code E2E is pre-existing baseline residual
debt, not a required merge gate for this platform-only PR. Required proof is
limited to the commands above. A required public-proof failure or a new
production critical audit finding remains a stop condition.

### Grilling Decision Record

Evidence: `main` equals requested baseline `7478125`; package pins are exact
`next@16.2.9` and `eslint-config-next@16.2.9`; the local Next 16 upgrade guide
requires no new migration for this patch bump; the existing public E2E script
builds then runs Playwright. The relevant lessons require preserving Serwist
Turbopack alignment and treating missing Clerk test credentials as blocked
proof.

Confidence: freeze-ready. Required proof is contained by Path A edit authority;
protected surfaces are explicit; exactly one goal is named.

Decision: install only `next@16.3.0` and `eslint-config-next@16.3.0` with exact
pins, preserve React `19.2.4`, make no application edits, and treat only
validate-goal, governance, lint, unit, build, and public E2E as required proof.

Flagged decision / residual risk: the mandated `gpt-5.4-mini` evidence lane is
unavailable in this runtime. Its absence is recorded in metadata; the
orchestrator performed the repository-backed evidence pass. This does not
authorize scope expansion. Authenticated G-code E2E has three baseline failures
that reproduce on `7478125` with Next `16.2.9`: `supported G-code generates
exact output, previews bounds, copies, downloads, and blocks stale output`,
`live G-code scheduling keeps only the newest source and one angle-preview
frame`, and `G-code generation fails closed with every required line-specific
diagnostic`. They are residual debt for a future product goal; do not modify
G-code code or e2e assertions here. Production audit improved from four high
findings to two high findings with zero critical; `postcss` and `nanoid` remain
documented residuals and no new production high/critical finding was introduced.

### B3-Style Handoff / B4-Style Preflight

After the goal-memory commit, create the sanitized B3-style handoff (prompt
hash only). Before install, revalidate the goal and handoff, confirm the branch
matches `branch_intent`, review the relevant lessons, and use host-first npm and
browser operations.

### Stopping Condition

Complete only when exact target pins, lockfile, required passing proof, audit
comparison, and a ready-for-review feature PR exist with no protected-surface
touches. Stop if required public proof fails or a production critical audit
finding appears. Do not merge, force-push, deploy, or change MODE.
