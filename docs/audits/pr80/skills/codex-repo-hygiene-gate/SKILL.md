---
name: codex-repo-hygiene-gate
description: Check repository hygiene before goal prep, implementation, PR closeout, or cleanup. Use when worktree state, branch state, stale refs, generated artifacts, mixed GOAL/docs/code changes, or protected-surface scope need to be classified before proceeding.
---

# Codex Repo Hygiene Gate

Classify repo state before mutation. Stop when dirty state is unclear.

## Workflow

1. **Inspect branch and refs.**
   - `git status -sb`
   - `git branch --show-current`
   - `git branch --all --verbose`
   - `git worktree list --porcelain`

2. **Sync only when safe.** If the worktree is clean or the user explicitly
   approves handling dirty state, run:
   - `git fetch origin`
   - `git pull --ff-only` on the intended base branch

3. **Classify changes.** For every modified/untracked path, assign one label:
   - goal-memory
   - implementation
   - docs/spec/mockup
   - generated artifact
   - unrelated/user-owned
   - unknown/blocker

4. **Check scope.** Compare changed files against `GOAL.md`, PR scope, and
   protected surfaces. Flag mixed commits, stale feature branches, deleted
   remote branches, untracked generated files, and authority-file drift.

5. **Decide.**
   - Proceed when state is clean or classified and in scope.
   - Commit/stage only explicitly requested file groups.
   - Stop for unknown blockers, unrelated user-owned changes that affect the
     task, or any destructive cleanup not explicitly approved.

## Output

Return branch, base/head status, worktree classification table, stale refs or
worktrees, recommended next command sequence, and any stop condition.
