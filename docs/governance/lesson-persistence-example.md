# Lesson Persistence Example

**Canonical store:** `LESSONS_LEARNED.md` in the primary checkout
(`/Users/computer/wrecklesstoddler/vibe/projects/NestCalc/LESSONS_LEARNED.md`),
not Grok Build worktrees.

**Global skill:** `pr-closeout-breakdown` at
`~/.grok/skills/pr-closeout-breakdown/SKILL.md`

NestCalc does not ship NanoTate's `stage-lessons-payload.sh` or
`persist-lessons.py`. Use the global fallback helper after composing section 7
lessons in the closeout breakdown.

## Trace-dir staging

Stage lesson JSON under the flow trace directory (never `/tmp`):

```bash
FLOW_ID="NC-20260713-7a10e239"
PR_NUMBER=28
TRACE_DIR="$HOME/.grok/trace/flows/$FLOW_ID/lessons-pending"
mkdir -p "$TRACE_DIR"

cat > "$TRACE_DIR/pr${PR_NUMBER}.json" <<'EOF'
[
  {
    "label": "L-nestcalc-example-lesson",
    "source_pr": 28,
    "source_url": "https://github.com/TurboFrogLLC/NestCalc/pull/28",
    "lesson": "Example lesson text.",
    "applies_when": "When demonstrating lesson persistence."
  }
]
EOF
```

## Preview or apply

```bash
python3 ~/.grok/skills/pr-closeout-breakdown/scripts/persist_lessons.py \
  --lessons-json "$TRACE_DIR/pr${PR_NUMBER}.json" \
  --canonical-path "/Users/computer/wrecklesstoddler/vibe/projects/NestCalc/LESSONS_LEARNED.md" \
  --worktree-path "$(pwd)/LESSONS_LEARNED.md" \
  --dry-run
```

Remove `--dry-run` only when:

- the PR is approved for merge or has already merged;
- the canonical path is outside the active Grok Build worktree; and
- the human has approved durable lesson capture.

## Post-merge integration

1. Run `capture-post-merge` and `verify-post-merge` before destructive cleanup.
2. Persist approved lesson rows to canonical `LESSONS_LEARNED.md`.
3. Commit lesson updates on `main` with a message citing the source PR.

**Do not** write lessons only inside a Grok Build worktree when the canonical
checkout is available.