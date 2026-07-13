# GOAL.md - NestCalc

## Active Goal: NestCalc Governed Goal Pipeline v1

### Objective

Adopt the first executable subset of NanoTate's autonomous governance cycle for
NestCalc.

Create an advisory, repository-local governance module that binds one active
`GOAL.md` objective to its separately committed goal memory, thin Codex CLI
handoff, feature branch intent, required ready-for-review PR, closeout
disposition, and post-merge lesson/cleanup evidence.

This is a governance-only goal. It must not change NestCalc product behavior,
runtime dependencies, deployment behavior, authentication, PWA behavior, or
calculator code.

### Why This Is Next

NestCalc already follows the NanoTate workflow in prose, but repeated execution
cycles have exposed gaps that prose cannot reliably prevent:

- completed goals can remain active after merge;
- goal-memory and implementation commit separation is manually enforced;
- CLI closeout has occasionally omitted the required open PR;
- requested read-only sub-agent models are not mechanically compared with the
  runtime's available or observed model;
- closeout, lesson persistence, and post-merge cleanup evidence are assembled
  manually.

NanoTate now has an executable golden pipeline. NestCalc should adopt the
smallest coherent subset that addresses these observed failures, beginning in
advisory mode and proving it on deterministic fixtures before any enforcement
is considered.

### Required Reading

Read these before editing:

- `AGENTS.md`
- `GOAL.md`
- `docs/WORKFLOW.md`
- `LESSONS_LEARNED.md`
- `docs/SKILL_AND_PLUGIN_RECOMMENDATIONS.md`
- `docs/architecture/ARCHITECTURE_REVIEW_TODO.md`
- `README.md`
- NanoTate `AGENTS.md`
- NanoTate `docs/governance/README.md`
- NanoTate `docs/governance/golden-pipeline-manifest.json`
- NanoTate `scripts/validate-golden-pipeline.py`
- NanoTate `scripts/validate-traceability.py`
- NanoTate `scripts/create-execution-handoff.py`
- NanoTate `scripts/validate-closeout-disposition.py`
- NanoTate `scripts/persist-lessons.py`
- NanoTate `scripts/capture-post-merge-snapshot.py`
- NanoTate `scripts/verify-post-merge-snapshot.py`
- NanoTate goal, execution-handoff, closeout-disposition, and post-merge
  snapshot schemas

Relevant NestCalc lessons:

- `L-nestcalc-goal-required-docs-commit`
- `L-nestcalc-grok-review-role-separation`
- `L-nestcalc-codex-stale-sha-guard`
- `L-nestcalc-pr-branch-main-sync`
- `L-nestcalc-goal-grilling-authority-sync`
- `L-nestcalc-readonly-subagent-model`

### Governing Design

Implement one deep repository-local governance module with a small command
interface. Prefer a single implementation entry point such as
`scripts/nestcalc-governance.py` with focused subcommands over a collection of
unrelated pass-through scripts.

The required command interface is:

- `check`: run every advisory governance validation and return one summarized
  disposition;
- `validate-goal`: validate active-goal structure and metadata;
- `create-handoff`: create a sanitized execution handoff from committed goal
  memory and a prompt file;
- `validate-closeout`: validate PR publication and closeout disposition
  evidence;
- `capture-post-merge`: capture cleanup and lesson-persistence state without
  deleting branches or changing files;
- `verify-post-merge`: revalidate captured state before destructive cleanup or
  lesson application.

Callers and tests should use this interface. Internal parsing, hashing, schema
validation, Git inspection, sanitization, and report formatting remain
implementation details.

### Required Contracts

Add a focused `docs/governance/` authority surface containing:

- a concise README explaining the NestCalc pipeline and artifact lifecycle;
- an advisory/enforce mode file, initially set to `advisory`;
- a manifest declaring the v1 contracts and required paths;
- schemas for goal metadata, execution handoff, closeout disposition, and
  post-merge snapshot;
- valid and invalid fixtures for deterministic tests.

The contracts must establish these invariants:

1. `GOAL.md` contains exactly one active objective.
2. Goal metadata identifies a NestCalc flow, active title, goal-memory commit,
   intended `codex/` feature branch, skills, protected surfaces, and agent
   roster/model requirements.
3. Goal-memory commit and implementation commit are distinct.
4. Execution handoff records a sanitized prompt hash, goal-memory commit,
   branch intent, `codex-cli` execution route, and `feature-pr` publication
   route.
5. A completed implementation closeout requires an open, non-draft,
   ready-for-review PR URL and reviewed commit SHA. A blocked closeout must
   report the exact blocker instead of claiming completion.
6. Closeout disposition is one of `merge-ready`, `suspend-merge`, or
   `rollback-required` and names required human action.
7. Post-merge evidence protects against stale-state cleanup by recording and
   rechecking branch tip, merged PR identity, main SHA, working-tree state, and
   pending lesson state before destructive commands.
8. Artifacts reject likely secrets and never copy `.env*` values, Clerk values,
   credentials, prompt plaintext, or user data.
9. Requested and observed read-only sub-agent models are recorded. A required
   model that is unavailable or mismatched is reported explicitly and cannot be
   represented as passing evidence.

Define an unambiguous hash canonicalization rule so metadata can be validated
without a self-referential file hash. Keep timestamps and generated runtime
artifacts out of committed authority unless they are deterministic fixtures.

### Scope

Required implementation work:

- Add the governance contracts, schemas, fixtures, and concise documentation.
- Add the deep governance command module and focused automated tests.
- Add package scripts for the aggregate check and targeted governance tests.
- Add a deterministic v1 goal template and migration instructions while
  preserving this active bootstrap goal unchanged during implementation.
- Ensure generated handoff, closeout, and snapshot artifacts are local-only and
  gitignored.
- Prove advisory mode reports both valid and invalid fixture outcomes
  deterministically.
- Prove enforce mode fails closed in tests without enabling enforce mode for
  normal NestCalc development.
- Prove handoff generation requires a separately committed goal-memory commit
  and `codex/` feature branch intent.
- Prove successful implementation closeout requires an open, non-draft PR.
- Document the later promotion criteria from advisory to enforce; do not perform
  that promotion in this goal.

Allowed implementation surfaces:

- `GOAL.md`
- `package.json`
- `package-lock.json` only if an already-available dependency must be recorded
- `.gitignore`
- `scripts/nestcalc-governance.py`
- narrowly scoped helper modules under `scripts/` if the single module would
  otherwise become difficult to test
- focused tests under `test/governance/` or the repository's established test
  location
- `docs/governance/**`
- `docs/WORKFLOW.md` only for the minimum durable command and lifecycle update
- `AGENTS.md` only if the executable governance routing cannot be accurately
  described without a narrow update

### Autonomous Execution Pattern

Codex CLI must act as orchestrator and begin with repo hygiene and authority
preflight.

- Use bounded parallel read-only evidence lanes only where they are distinct.
- Request `gpt-5.4-mini` for every read-only sub-agent, as required by current
  NestCalc authority.
- The orchestrator owns all writes and final decisions.
- Record requested and observed sub-agent model evidence when the runtime makes
  it available.
- If `gpt-5.4-mini` is unavailable, do not substitute another model and do not
  fabricate a passing routing receipt. Continue with orchestrator-local
  evidence gathering only when scope can still be proven, and report the model
  lane as an explicit limitation.
- Plan first, act after. Do not use plan mode.
- Keep the goal-memory commit separate from all implementation commits.

### Out Of Scope

Do not adopt NanoTate's full reference/enterprise profile in this goal:

- no nine-phase enterprise rollout framework;
- no MCP, plugin, or global skill registry;
- no LangGraph wrapper;
- no supply-chain/SBOM framework;
- no signed or multi-party approval system;
- no Git hooks, GitHub ruleset changes, branch-protection changes, or required
  status-check configuration;
- no global skill installation or edits outside this repository;
- no automatic merge, branch deletion, reset, lesson application, or other
  destructive operation;
- no committed runtime trace history or generated reports;
- no Vercel or production deployment changes.

Do not change product surfaces:

- calculator math or nesting behavior;
- AutoNest engine, settings, results, or preview;
- calculator UI layout or input behavior;
- Clerk auth, request-access policy, routes, middleware, or `.env*` values;
- PWA service worker, cache, manifest, or offline behavior;
- native iOS planning or implementation.

### Verification

Run and report:

- `git diff --check`
- governance fixture/unit tests
- the aggregate advisory governance check
- an enforce-mode negative-fixture proof
- `npm run lint`
- `npm run build`
- `npm run test`

Browser, Clerk-authenticated, and PWA proof are not required because this goal
must not change browser-visible or runtime product behavior. If implementation
touches such a surface, stop as out of scope rather than expanding verification.

Required evidence in the PR:

- separate goal-memory and implementation commit SHAs;
- exact governance commands and results;
- valid-fixture pass and invalid-fixture failure evidence;
- sanitized execution-handoff example containing no prompt plaintext or
  secrets;
- advisory-mode confirmation;
- `git diff --name-only` evidence showing no product source changes;
- an open, non-draft, ready-for-review PR URL;
- known limitations and the explicit criteria for a future enforcement goal.

This active goal is the documented bootstrap exception to the new metadata
contract because the validator and canonicalization rules do not exist at its
goal-memory commit. Do not modify `GOAL.md` in the implementation commit merely
to retrofit it. The first goal prepared after this governance PR merges must be
the first live flow validated against the v1 goal contract.

### Stopping Condition

Stop only when:

- the advisory NestCalc governance module and contracts are implemented;
- deterministic positive and negative tests pass;
- existing lint, build, and unit tests pass;
- no protected product surface changed;
- goal memory and implementation are separate commits;
- the feature branch is pushed outside the sandbox using available GitHub
  authentication;
- an open, non-draft, ready-for-review PR exists and its URL is reported;
- `@codex review` is requested on the published PR;
- any unavailable read-only sub-agent model or external publication blocker is
  reported explicitly rather than represented as success.

Do not merge the PR. Human approval remains required.

### Future Promotion Gate

Enforcement is a separate future goal. Consider promotion only after the
advisory pipeline completes at least two real NestCalc product PR cycles without
false positives, missing required evidence, secret exposure, or manual contract
workarounds.
