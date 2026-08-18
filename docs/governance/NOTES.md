# Notes — discussed, not locked

Draft review notes for the 2026-08-18 waypoint / handoff / lean-AGENTS pass.
Not standing authority. Locked text is AGENTS.md, docs/WORKFLOW.md, and
docs/templates/handoff.md.

## Discussed, not locked

- Skill registry. NestCalc has one skill
  (`.agents/skills/nestcalc-goal-grilling`). No `skill-registry.json`.
  NanoTate-style registry + validator is a later residual if wanted.
- HowMany-as-display standing deprecation doc. AGENTS no longer names HowMany.
  Old wordmark / HowMany docs packages still exist on disk.
- SuperBrain pack 06 field-for-field alignment. NestCalc template is the same
  three-band shape. Pack rewrite is not this PR.
- `docs/governance/goal-lifecycle-contract.md` not rewritten this wave.
  B3 `create-handoff` JSON artifact is still the machine handoff. The new
  `docs/templates/handoff.md` is the traveler. Two artifacts.
- `docs/goals/GOAL-TRACE-INDEX.md` and `docs/goals/history/` procedure is
  locked in WORKFLOW. This PR does not create or backfill those files.
- Clerk / PWA / security long-form from the old WORKFLOW was not copied into
  the lean file. Commands and blocked-proof rule remain. Detail still lives
  in existing tests and lessons.
- B7 still uses `pr-closeout-breakdown` in current governance contracts.
  Lean WORKFLOW names B7 closeout, not the skill filename.
- Autonomous grilling cycle (terra medium sub-agents, stop before commit)
  was not restated in lean WORKFLOW. Skill still exists.
- MODE promotion criteria unchanged. Token stays `advisory`.
- Preferred AGENTS length 90–150. This draft is in that band including the
  Next.js rules header.
- Escalation after no progress is named. Exact try-count is not locked.
- B9 command list (exact fetch/prune/worktree delete order) is not restated
  here. Old WORKFLOW had the long hygiene list; lean B9 names the outcome.
- Gate term is now wReckless, not Human. Main-branch NestCalc files outside
  this PR still say Human until they are rewritten or this PR merges.

## Known drift this PR is meant to surface

- Current main AGENTS still says HowMany is the product and locks the
  h / CircleQuestionMark / wMany wordmark. This draft says FLiPIT and does
  not mention HowMany.
- Current main WORKFLOW is a long phase→actor operating model. This draft is
  procedure only; routing moved to AGENTS Surfaces.
- Current main host-first list is Playwright, git, npm ci. This draft adds
  committed `scripts/*.py` and the re-check rule for new scripts.
- Current main opens ready-for-review PRs by default. This PR is draft by
  request.
- Current main authority list includes build specs, architecture review, and
  governance README. Lean AGENTS shortens that list. Specs still exist.
- Skill routing tables (Clerk, Vercel plugins, iOS wall) were removed from
  AGENTS. Inventory still lives in `docs/SKILL_AND_PLUGIN_RECOMMENDATIONS.md`.
- Current main B9 is always post-merge hygiene. This draft: B6–B9 ladder;
  wReckless at B9 only if confidence or criteria are not met.
- Gate name Human → wReckless on this branch.

## Out of this PR

- Product code.
- MODE flip.
- Golden-pipeline / SBOM / env-proxy import.
- Radar experiment (PR #66 stay closed unless reopened).
- Lab parser import.
- Skill-registry build.
- Sweep of every leftover Human string in older NestCalc governance contracts.
- Ultra as a callable surface or orchestration option. Not used in NestCalc
  or wReckless Toddler. Experimental elsewhere. Do not name it in handoffs.
