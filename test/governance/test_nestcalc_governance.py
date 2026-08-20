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
        self.assertEqual(result.details["valid_fixtures"], 6)
        self.assertEqual(result.details["invalid_fixtures"], 6)
        self.assertTrue(result.details["advisory_mode"])

    def test_manifest_requires_traveler_and_packslip(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            docs = root / "docs/governance"
            docs.mkdir(parents=True)
            (docs / "manifest.json").write_text(
                json.dumps(
                    {
                        "schema_version": "nestcalc-governance-manifest-v1",
                        "repository": "TurboFrogLLC/NestCalc",
                        "required_paths": [
                            "docs/templates/traveler.md",
                            "docs/templates/packslip.md",
                        ],
                        "contracts": {},
                    }
                )
                + "\n",
                encoding="utf-8",
            )
            result, _ = governance.validate_manifest(root)
            self.assertFalse(result.ok)
            joined = " ".join(result.errors)
            self.assertIn("traveler.md", joined)
            self.assertIn("packslip.md", joined)

    def test_bootstrap_exception_is_advisory_only(self) -> None:
        """Historical bootstrap title without metadata: warn in advisory, fail in enforce."""
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "GOAL.md"
            path.write_text(
                "# GOAL.md - NestCalc\n\n"
                f"## Active Goal: {governance.BOOTSTRAP_TITLE}\n",
                encoding="utf-8",
            )
            advisory = governance.validate_goal(path, allow_bootstrap=True)
            enforce = governance.validate_goal(path, allow_bootstrap=False)
            self.assertTrue(advisory.ok, advisory.errors)
            self.assertTrue(advisory.warnings)
            self.assertTrue(advisory.details.get("bootstrap_exception"))
            self.assertFalse(enforce.ok)

    def test_active_goal_with_v1_metadata_validates_in_both_modes(self) -> None:
        """Live product GOAL with full v1 metadata must pass regardless of MODE."""
        advisory = governance.validate_goal(ROOT / "GOAL.md", allow_bootstrap=True)
        enforce = governance.validate_goal(ROOT / "GOAL.md", allow_bootstrap=False)
        self.assertTrue(advisory.ok, advisory.errors)
        self.assertTrue(enforce.ok, enforce.errors)

    def test_closeout_breakdown_requires_flow_id(self) -> None:
        valid = (ROOT / "docs/governance/fixtures/valid/closeout-breakdown.md").read_text(
            encoding="utf-8"
        )
        missing_flow = valid.replace(
            "**Flow ID:** `NC-20260713-7a10e239`",
            "**Flow ID:** missing",
        )
        result = governance.validate_closeout_breakdown_text(missing_flow)
        self.assertFalse(result.ok)
        self.assertTrue(
            any("Flow ID" in error for error in result.errors),
            result.errors,
        )

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

    def test_closeout_breakdown_fixture_requires_section_eight(self) -> None:
        valid = ROOT / "docs/governance/fixtures/valid/closeout-breakdown.md"
        invalid = ROOT / "docs/governance/fixtures/invalid/closeout-breakdown-missing-disposition.md"
        self.assertTrue(governance.validate_closeout_breakdown_file(valid).ok)
        broken = governance.validate_closeout_breakdown_file(invalid)
        self.assertFalse(broken.ok)
        self.assertTrue(any("section 8" in error.lower() or "sentinel" in error.lower() for error in broken.errors))

    def test_closeout_breakdown_requires_assessment_decision(self) -> None:
        valid = (ROOT / "docs/governance/fixtures/valid/closeout-breakdown.md").read_text(encoding="utf-8")
        missing_decision = valid.replace("**Comment Only**", "Held for review")
        result = governance.validate_closeout_breakdown_text(missing_decision)
        self.assertFalse(result.ok)
        self.assertTrue(
            any("Overall Assessment must declare" in error for error in result.errors),
            result.errors,
        )

    def test_invalid_fixture_missing_file_is_not_expected_rejection(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            docs = root / "docs/governance"
            docs.mkdir(parents=True)
            (docs / "MODE").write_text("advisory\n", encoding="utf-8")
            (root / "GOAL.md").write_text(
                "# GOAL.md\n\n## Active Goal: NestCalc Governed Goal Pipeline v1\n",
                encoding="utf-8",
            )
            manifest = {
                "schema_version": "nestcalc-governance-manifest-v1",
                "repository": "TurboFrogLLC/NestCalc",
                "required_paths": [],
                "contracts": {},
                "fixtures": {
                    "valid": [],
                    "invalid": ["docs/governance/fixtures/invalid/does-not-exist.json"],
                },
            }
            (docs / "manifest.json").write_text(json.dumps(manifest) + "\n", encoding="utf-8")
            result = governance.aggregate_check(root, "advisory")
            self.assertFalse(result.ok)
            self.assertTrue(
                any("invalid fixture missing or unreadable" in error for error in result.errors),
                result.errors,
            )
            self.assertEqual(result.details.get("invalid_fixtures"), 0)
            outcomes = result.details.get("fixture_outcomes", [])
            self.assertTrue(any(item.get("outcome") == "missing" for item in outcomes), outcomes)

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
                            "requested_model": "gpt-5.6-terra",
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

            prior_artifact = output.read_text(encoding="utf-8")
            goal_path.write_text(goal_path.read_text(encoding="utf-8") + "\nDirty edit.\n", encoding="utf-8")
            dirty = governance.create_handoff(root, args)
            self.assertFalse(dirty.ok)
            self.assertTrue(
                any("uncommitted changes" in error for error in dirty.errors),
                dirty.errors,
            )
            self.assertEqual(output.read_text(encoding="utf-8"), prior_artifact)
            self.assertNotIn("output", dirty.details)

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
