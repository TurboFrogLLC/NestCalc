# P0-F runner residual — facts

Date: 2026-08-23  
Repo: TurboFrogLLC/NestCalc  
PR: 107  
Branch: `docs/p0f-runner-residual`  
Sample Head: `025e7bb28b690c0aec30331fc846c0865db08d7d`  
Workflow (read-only): `.github/workflows/p0-f-minimum-ci.yml`  
Trace: NestCalc #107; P0-F runner residual; NCMR-MGMT-20260823-01  
job_id: NGJ-20260823-p0f

Admin land (Owner squash / bypass of required P0-F checks) is temporary until runners execute steps.

## Symptoms

- P0-F jobs (`p0f-lint`, `p0f-unit`, `p0f-build`, `p0f-governance`, `p0f-evidence`) complete as `failure` in ~2–3 s per job / ~7–9 s per run.
- GitHub Actions Jobs API reports `runner_id: 0`, empty `runner_name`, and `steps: 0` (no checkout, no `npm` commands).
- Job logs are absent (`BlobNotFound` / HTTP 404). Usage API reports `billable.UBUNTU.total_ms: 0` with five jobs at `duration_ms: 0`.
- Check-run annotations (not step logs) state the job was not started because of account payment failure or spending-limit.
- This is not a lint/test/build command failure. Commands never ran.

## YAML (not the failure)

`.github/workflows/p0-f-minimum-ci.yml` as read on this Head:

- `on: pull_request` with `permissions.contents: read`.
- Five jobs, each `runs-on: ubuntu-latest`, each with named steps (`checkout`, `setup-node`, `npm ci`, then the mapped command; evidence job uploads a head-SHA artifact).
- No `workflow_call`, path-filter, or branch-ignore in this file. Jobs are scheduled; GitHub never assigns a hosted runner.

Contrast: the same workflow file executed steps when a runner was assigned. Sample success (2026-08-22):

| Field | Value |
| --- | --- |
| run | [32551786132](https://github.com/TurboFrogLLC/NestCalc/actions/runs/32551786132) |
| conclusion | success |
| created_at | 2026-08-22T04:28:23Z |
| head_sha | `cdd9baf4ef2bac72977d4f749253c1c24194fb24` |
| p0f-lint | `runner_id` 1000001981, 8 steps |
| p0f-governance | `runner_id` 1000001982, 10 steps |
| p0f-unit | `runner_id` 1000001983, 8 steps |
| p0f-build | `runner_id` 1000001984, 8 steps |
| p0f-evidence | `runner_id` 1000001985, 6 steps |

Do not rewrite the YAML for this residual. Diagnosis does not prove YAML is the failure.

## Evidence — failed runs (sampled 2026-08-23)

Source: `gh run list` / Actions REST (`list_workflow_runs`, `list_workflow_jobs`, `GET .../jobs`, `GET .../timing`, `GET .../check-runs/{id}/annotations`).

Latest 20 listed P0-F runs: all `conclusion=failure`, wall clock 7–9 s, branches include this PR plus unrelated docs PRs. Latest 50 listed completed runs: 50 failures. Last recorded success in a 5-row success query: 2026-08-22T04:28:23Z (run 32551786132).

### This PR (107)

| run | head_sha | created → updated | wall | jobs | runner_id | steps | billable UBUNTU |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [32661407604](https://github.com/TurboFrogLLC/NestCalc/actions/runs/32661407604) | `025e7bb28b69` | 19:29:42Z → 19:29:50Z | 8 s | 5 | 0 | 0 | 0 ms |
| [32661397172](https://github.com/TurboFrogLLC/NestCalc/actions/runs/32661397172) | `01a13cc5fd73` | 19:29:31Z → 19:29:38Z | 7 s | 5 | 0 | 0 | (jobs: 0 steps) |

Run 32661407604 job rows (`GET .../runs/32661407604/jobs`):

| job | id | conclusion | started → completed | runner_id | runner_name | steps |
| --- | --- | --- | --- | --- | --- | --- |
| p0f-lint | 97248047787 | failure | 19:29:43Z → 19:29:45Z | 0 | `""` | 0 |
| p0f-build | 97248047792 | failure | 19:29:43Z → 19:29:46Z | 0 | `""` | 0 |
| p0f-governance | 97248047892 | failure | 19:29:43Z → 19:29:46Z | 0 | `""` | 0 |
| p0f-unit | 97248048074 | failure | 19:29:43Z → 19:29:46Z | 0 | `""` | 0 |
| p0f-evidence | 97248054160 | failure | 19:29:46Z → 19:29:49Z | 0 | `""` | 0 |

Timing for run 32661407604: `run_duration_ms: 8000`; five jobs `duration_ms: 0`.

Check-run annotation (p0f-lint 97248047787 and p0f-evidence 97248054160, same text):

> The job was not started because recent account payments have failed or your spending limit needs to be increased. Please check the 'Billing & plans' section in your settings

`GET .../actions/jobs/97248047787/logs` → HTTP 404, Azure `BlobNotFound`.

PR 107 `gh pr checks` at sample time: all five `p0f-*` fail (2–3 s). Unrelated checks (Socket, Vercel) pass. That split matches “no GitHub-hosted runner assigned,” not a repo lint command.

### Other recent failed P0-F runs (same signature)

| run | branch | head_sha | wall | sample job | runner_id | steps | annotation (p0f-lint) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [32660983447](https://github.com/TurboFrogLLC/NestCalc/actions/runs/32660983447) | `docs/employee-manual-mermaid-probe-6` | `221425d142da` | 8 s | all five jobs | 0 | 0 | not fetched |
| [32659136680](https://github.com/TurboFrogLLC/NestCalc/actions/runs/32659136680) | `docs/grok-thoughts-continuous` | `45e06ebc4db4` | 8 s | all five `runner_id` 0, `steps` 0 | 0 | 0 | same billing/spending text on job 97242507436 |

Runs 32658950792 through 32650014659 in the 20-row sample: `failure`, 7–9 s, same workflow name. Job-level `runner_id`/`steps` were not dumped for every row; the three fully dumped runs (427, 426, 423) are identical: no runner, no steps.

## Diagnosis (facts)

1. GitHub created the five P0-F jobs from the existing workflow YAML.
2. No hosted runner was assigned (`runner_id` 0). Steps were never instantiated.
3. GitHub annotated the check run with account payment failure **or** spending-limit, not with an `npm run lint` / test / build error.
4. The same YAML previously ran steps to success (2026-08-22, non-zero `runner_id`, 6–10 steps per job).
5. Residual is account/runner capacity (Owner billing surface), not a second CI system and not a YAML rewrite.

## Owner checklist (account; not this Worker)

Owner-only. Worker cannot read billing (Actions billing REST returned 404 for `user/settings/billing/actions` and `orgs/TurboFrogLLC/settings/billing/actions` from this token).

- [ ] GitHub Actions enabled for TurboFrogLLC/NestCalc (repo and account).
- [ ] Included Actions minutes remaining (or equivalent usage).
- [ ] Spending limit for Actions / Codespaces as applicable — increase if the account is at the cap.
- [ ] Recent account payments: no failed payment on file (annotation names this first).
- [ ] After billing is clear: re-run P0-F on PR 107 and confirm `runner_id != 0`, `steps > 0`, and job logs exist.
- [ ] Until that re-run executes steps, Owner admin land of required P0-F checks remains a temporary workaround only.

## Out of scope (this Station)

- No YAML edit.
- No second CI system.
- No product / AGENTS / WORKFLOW / GOAL edits.
- Not ready. Not merge.
