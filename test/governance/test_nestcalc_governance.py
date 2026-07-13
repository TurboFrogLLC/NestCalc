from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from argparse import Namespace
from pathlib import Path
from unittest import mock


ROOT = Path(__file__).resolve().parents[2]
MODULE_PATH = ROOT / "scripts/nestcalc-governance.py"
SPEC = importlib.util.spec_from_file_location("nestcalc_governance", MODULE_PATH)
assert SPEC and SPEC.loader
governance = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = governance
SPEC.loader.exec_module(governance)


class GovernanceContractsTest(unittest.TestCase):
    def test_manifest_and_all_fixtures_are_deterministic(self) -> None:
        result = governance.aggregate_check(ROOT, "advisory")
        self.assertTrue(result.ok, result.errors)
        self.assertEqual(result.details["valid_fixtures"], 5)
        self.assertEqual(result.details["invalid_fixtures"], 5)
        self.assertTrue(result.details["advisory_mode"])

    def test_active_bootstrap_goal_is_advisory_only(self) -> None:
        advisory = governance.validate_goal(ROOT / "GOAL.md", allow_bootstrap=True)
        enforce = governance.validate_goal(ROOT / "GOAL.md", allow_bootstrap=False)
        self.assertTrue(advisory.ok)
        self.assertTrue(advisory.warnings)
        self.assertFalse(enforce.ok)

    def test_valid_goal_hash_matches_canonical_contract(self) -> None:
        path = ROOT / "docs/governance/fixtures/valid/goal.md"
        result = governance.validate_goal(path, allow_bootstrap=False)
        self.assertTrue(result.ok, result.errors)
        self.assertRegex(result.details["computed_goal_sha256"], r"^sha256:[0-9a-f]{64}$")

    def test_model_mismatch_cannot_be_claimed_as_matched(self) -> None:
        path = ROOT / "docs/governance/fixtures/invalid/goal-model-mismatch.md"
        result = governance.validate_goal(path, allow_bootstrap=False)
        self.assertFalse(result.ok)
        self.assertTrue(any("claims matched" in error for error in result.errors))

    def test_handoff_rejects_prompt_plaintext(self) -> None:
        path = ROOT / "docs/governance/fixtures/invalid/execution-handoff-prompt-plaintext.json"
        result = governance.validate_json_file(path, "handoff")
        self.assertFalse(result.ok)
        self.assertTrue(any("prompt_plaintext" in error for error in result.errors))

    def test_completed_closeout_requires_distinct_commits_and_ready_pr(self) -> None:
        path = ROOT / "docs/governance/fixtures/invalid/closeout-draft-pr.json"
        result = governance.validate_json_file(path, "closeout")
        self.assertFalse(result.ok)
        self.assertTrue(any("distinct" in error for error in result.errors))
        self.assertTrue(any("ready-for-review" in error for error in result.errors))

    def test_blocked_closeout_can_truthfully_record_no_pr(self) -> None:
        path = ROOT / "docs/governance/fixtures/valid/closeout-blocked.json"
        result = governance.validate_json_file(path, "closeout")
        self.assertTrue(result.ok, result.errors)

    def test_post_merge_fixture_must_be_merged_and_clean(self) -> None:
        path = ROOT / "docs/governance/fixtures/invalid/post-merge-stale.json"
        result = governance.validate_json_file(path, "snapshot")
        self.assertFalse(result.ok)
        self.assertTrue(any("state=merged" in error for error in result.errors))
        self.assertTrue(any("clean working tree" in error for error in result.errors))

    def test_capture_and_verify_post_merge_detects_state_drift(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            base = Path(temporary)
            root = base / "repo"
            root.mkdir()
            self._git(root, "init", "-b", "main")
            self._git(root, "config", "user.name", "NestCalc Test")
            self._git(root, "config", "user.email", "test@example.invalid")
            (root / "GOAL.md").write_text("# Goal\n")
            (root / "LESSONS_LEARNED.md").write_text("# Lessons\n")
            self._git(root, "add", "GOAL.md", "LESSONS_LEARNED.md")
            self._git(root, "commit", "-m", "Seed repository")
            self._git(root, "update-ref", "refs/remotes/origin/main", "HEAD")
            self._git(root, "switch", "-c", "codex/governance-fixture")

            output = base / "artifacts/post-merge.json"
            args = Namespace(
                pr_number=99,
                branch="codex/governance-fixture",
                lesson_state="none",
                output=output,
            )
            pr = {
                "number": 99,
                "url": "https://github.com/TurboFrogLLC/NestCalc/pull/99",
                "state": "MERGED",
                "isDraft": False,
            }
            with mock.patch.object(governance, "gh_pr", return_value=pr):
                capture = governance.capture_post_merge(root, args)
            self.assertTrue(capture.ok, capture.errors)
            current = governance.verify_post_merge(root, output, live_pr=False)
            self.assertTrue(current.ok, current.errors)

            (root / "LESSONS_LEARNED.md").write_text("# Lessons\n\nDrifted.\n")
            stale = governance.verify_post_merge(root, output, live_pr=False)
            self.assertFalse(stale.ok)
            self.assertTrue(any("stale snapshot" in error for error in stale.errors))

    def test_create_handoff_checks_separate_goal_commit_and_hashes_prompt(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self._git(root, "init", "-b", "main")
            self._git(root, "config", "user.name", "NestCalc Test")
            self._git(root, "config", "user.email", "test@example.invalid")
            (root / "GOAL.md").write_text("# GOAL.md - NestCalc\n\n## Active Goal: Seed Goal\n")
            self._git(root, "add", "GOAL.md")
            self._git(root, "commit", "-m", "Seed goal memory")
            goal_memory_commit = self._git(root, "rev-parse", "HEAD")

            metadata = {
                "active_goal_title": "Governance Handoff Fixture",
                "agent_roster": {
                    "orchestrator": "codex-cli",
                    "read_only_agents": [
                        {
                            "lane": "local-evidence",
                            "observed_model": None,
                            "requested_model": "gpt-5.4-mini",
                            "status": "unavailable",
                        }
                    ],
                },
                "branch_intent": "codex/governance-handoff-fixture",
                "execution_route": "codex-cli",
                "flow_id": "NC-20260712-deadbeef",
                "goal_memory_commit": goal_memory_commit,
                "goal_sha256": "sha256:" + "0" * 64,
                "protected_surfaces": ["product source"],
                "publication_route": "feature-pr",
                "repository": "TurboFrogLLC/NestCalc",
                "schema_version": "nestcalc-goal-v1",
                "skills": ["security-audit"],
            }
            goal_text = self._goal_text(metadata)
            metadata["goal_sha256"] = governance.computed_goal_hash(goal_text, metadata)
            goal_path = root / "GOAL.md"
            goal_path.write_text(self._goal_text(metadata))
            self._git(root, "add", "GOAL.md")
            self._git(root, "commit", "-m", "Finalize goal metadata")
            self._git(root, "switch", "-c", "codex/governance-handoff-fixture")

            prompt = root / "prompt.txt"
            prompt.write_text("/goal\nRun Process_narration=false\n")
            output = root / ".nestcalc/governance/execution-handoff.json"
            args = Namespace(
                goal=goal_path,
                prompt_file=prompt,
                goal_memory_commit=goal_memory_commit,
                output=output,
            )
            result = governance.create_handoff(root, args)
            self.assertTrue(result.ok, result.errors)
            artifact = json.loads(output.read_text())
            self.assertNotIn("prompt", artifact)
            self.assertRegex(artifact["prompt_sha256"], r"^sha256:[0-9a-f]{64}$")

    @staticmethod
    def _goal_text(metadata: dict[str, object]) -> str:
        return (
            "# GOAL.md - NestCalc\n\n"
            "<!-- nestcalc-governance:start -->\n```json\n"
            + json.dumps(metadata, indent=2, sort_keys=True)
            + "\n```\n<!-- nestcalc-governance:end -->\n\n"
            "## Active Goal: Governance Handoff Fixture\n\n"
            "### Objective\n\nProve the handoff.\n"
        )

    @staticmethod
    def _git(root: Path, *args: str) -> str:
        run = subprocess.run(["git", *args], cwd=root, text=True, capture_output=True, check=True)
        return run.stdout.strip()


if __name__ == "__main__":
    unittest.main()
