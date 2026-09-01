#!/usr/bin/env python3
"""NestCalc enforce-grade governance contracts for goal, handoff, closeout, and cleanup.

Contracts always fail closed. docs/governance/MODE (advisory|enforce) only controls
the historical bootstrap exception for missing v1 metadata on the pre-v1 goal title.
MODE does not make schemas, fixtures, handoff, or closeout validation optional.
Promotion criteria: docs/governance/GAP-AND-HARDENING.md. Do not flip MODE here.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable


REPOSITORY = "TurboFrogLLC/NestCalc"
GOAL_SCHEMA = "nestcalc-goal-v1"
HANDOFF_SCHEMA = "nestcalc-execution-handoff-v1"
CLOSEOUT_SCHEMA = "nestcalc-closeout-v1"
SNAPSHOT_SCHEMA = "nestcalc-post-merge-v1"
BOOTSTRAP_TITLE = "NestCalc Governed Goal Pipeline v1"
FLOW_RE = re.compile(r"^NC-[0-9]{8}-[0-9a-f]{8}$")
SHA_RE = re.compile(r"^[0-9a-f]{40}$")
HASH_RE = re.compile(r"^sha256:[0-9a-f]{64}$")
BRANCH_RE = re.compile(
    r"^[a-z0-9](?:[a-z0-9._-]{0,62}[a-z0-9_-])?"
    r"(?:/[a-z0-9](?:[a-z0-9._-]{0,62}[a-z0-9_-])?)+$"
)
SAFE_LABEL_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9 ._+:/-]{0,63}$")
PR_URL_RE = re.compile(r"^https://github\.com/TurboFrogLLC/NestCalc/pull/[0-9]+$")
META_RE = re.compile(
    r"<!-- nestcalc-governance:start -->\n```json\n(?P<data>.*?)\n```\n"
    r"<!-- nestcalc-governance:end -->",
    re.DOTALL,
)
SECRET_VALUE_RE = re.compile(
    r"(?i)(-----BEGIN [A-Z ]*PRIVATE KEY-----|(?:^|\W)(?:sk|pk)_(?:live|test)_[A-Za-z0-9_-]+|"
    r"bearer\s+[A-Za-z0-9._~+/=-]{12,}|clerk_(?:secret|publishable)|password\s*[:=])"
)
FORBIDDEN_KEYS = {
    "prompt",
    "prompt_plaintext",
    "secret",
    "secret_key",
    "token",
    "password",
    "credential",
    "credentials",
    "env",
    "environment_values",
    "user_data",
}
IMPLEMENTATION_PREFIXES = ("src/", "e2e/", "public/", "playwright/")
IMPLEMENTATION_FILES = {
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "proxy.ts",
    "src/proxy.ts",
}


@dataclass
class Result:
    subject: str
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    details: dict[str, Any] = field(default_factory=dict)

    @property
    def ok(self) -> bool:
        return not self.errors

    def merge(self, other: "Result") -> None:
        self.errors.extend(f"{other.subject}: {item}" for item in other.errors)
        self.warnings.extend(f"{other.subject}: {item}" for item in other.warnings)

    def as_dict(self) -> dict[str, Any]:
        status = "pass" if self.ok and not self.warnings else "pass-with-warnings" if self.ok else "fail"
        return {
            "subject": self.subject,
            "status": status,
            "errors": self.errors,
            "warnings": self.warnings,
            "details": self.details,
        }


def normalized_text(text: str) -> str:
    lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    return "\n".join(line.rstrip() for line in lines).rstrip("\n") + "\n"


def sha256_bytes(value: bytes) -> str:
    return "sha256:" + hashlib.sha256(value).hexdigest()


def sha256_text(value: str) -> str:
    return sha256_bytes(value.encode("utf-8"))


def is_safe_feature_branch(value: Any) -> bool:
    branch = str(value or "")
    return len(branch) <= 255 and BRANCH_RE.fullmatch(branch) is not None


def read_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("top-level JSON value must be an object")
    return data


def git(root: Path, *args: str, check: bool = True) -> str:
    run = subprocess.run(
        ["git", *args],
        cwd=root,
        text=True,
        capture_output=True,
        check=False,
    )
    if check and run.returncode:
        raise RuntimeError(f"git {' '.join(args)} failed: {run.stderr.strip()}")
    return run.stdout.strip()


def command(root: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(list(args), cwd=root, text=True, capture_output=True, check=False)


def extract_goal_metadata(text: str) -> dict[str, Any] | None:
    match = META_RE.search(normalized_text(text))
    if not match:
        return None
    data = json.loads(match.group("data"))
    if not isinstance(data, dict):
        raise ValueError("goal metadata must be a JSON object")
    return data


def canonical_goal_text(text: str, metadata: dict[str, Any]) -> str:
    canonical = dict(metadata)
    canonical["goal_sha256"] = "sha256:<canonical>"
    block = json.dumps(canonical, indent=2, sort_keys=True, ensure_ascii=True)
    normalized = normalized_text(text)
    return META_RE.sub(
        "<!-- nestcalc-governance:start -->\n```json\n"
        + block
        + "\n```\n<!-- nestcalc-governance:end -->",
        normalized,
        count=1,
    )


def computed_goal_hash(text: str, metadata: dict[str, Any]) -> str:
    return sha256_text(canonical_goal_text(text, metadata))


def check_exact_keys(
    data: dict[str, Any], required: Iterable[str], allowed: Iterable[str], result: Result
) -> None:
    required_set = set(required)
    allowed_set = set(allowed)
    for key in sorted(required_set - data.keys()):
        result.errors.append(f"missing required field: {key}")
    for key in sorted(data.keys() - allowed_set):
        result.errors.append(f"unknown field: {key}")


def scan_sensitive(value: Any, result: Result, path: str = "$") -> None:
    if isinstance(value, dict):
        for key, item in value.items():
            lowered = key.lower()
            if lowered in FORBIDDEN_KEYS or lowered.startswith("clerk_") or lowered.startswith("env_"):
                result.errors.append(f"forbidden sensitive field at {path}.{key}")
            scan_sensitive(item, result, f"{path}.{key}")
    elif isinstance(value, list):
        for index, item in enumerate(value):
            scan_sensitive(item, result, f"{path}[{index}]")
    elif isinstance(value, str) and SECRET_VALUE_RE.search(value):
        result.errors.append(f"secret-like value rejected at {path}")


def validate_agent_roster(roster: Any, result: Result) -> None:
    if not isinstance(roster, dict):
        result.errors.append("agent_roster must be an object")
        return
    check_exact_keys(roster, ("orchestrator", "read_only_agents"), ("orchestrator", "read_only_agents"), result)
    if not SAFE_LABEL_RE.fullmatch(str(roster.get("orchestrator", ""))):
        result.errors.append("agent_roster.orchestrator must be a safe named Surface")
    lanes = roster.get("read_only_agents")
    if not isinstance(lanes, list):
        result.errors.append("agent_roster.read_only_agents must be an array")
        return
    for index, lane in enumerate(lanes):
        label = f"agent_roster.read_only_agents[{index}]"
        if not isinstance(lane, dict):
            result.errors.append(f"{label} must be an object")
            continue
        check_exact_keys(
            lane,
            ("lane", "requested_model", "observed_model", "status"),
            ("lane", "requested_model", "observed_model", "status"),
            result,
        )
        requested = lane.get("requested_model")
        observed = lane.get("observed_model")
        status = lane.get("status")
        if not SAFE_LABEL_RE.fullmatch(str(lane.get("lane", ""))):
            result.errors.append(f"{label}.lane must be a safe non-empty label")
        if not SAFE_LABEL_RE.fullmatch(str(requested or "")):
            result.errors.append(f"{label}.requested_model must be a safe non-empty model label")
        if observed is not None and not SAFE_LABEL_RE.fullmatch(str(observed)):
            result.errors.append(f"{label}.observed_model must be null or a safe model label")
        if status not in {"matched", "mismatch", "unavailable"}:
            result.errors.append(f"{label}.status is invalid")
        elif status == "matched" and observed != requested:
            result.errors.append(f"{label} claims matched without matching observed_model")
        elif status == "mismatch" and (observed is None or observed == requested):
            result.errors.append(f"{label} claims mismatch without a differing observed_model")
        elif status == "unavailable" and observed is not None:
            result.errors.append(f"{label} unavailable evidence must use observed_model=null")


def validate_goal(path: Path, *, allow_bootstrap: bool) -> Result:
    result = Result(f"goal:{path}")
    try:
        text = normalized_text(path.read_text(encoding="utf-8"))
    except OSError as exc:
        result.errors.append(str(exc))
        return result

    titles = re.findall(r"^## Active Goal:\s*(.+?)\s*$", text, re.MULTILINE)
    if len(titles) != 1:
        result.errors.append(f"expected exactly one active goal; found {len(titles)}")
    try:
        metadata = extract_goal_metadata(text)
    except (ValueError, json.JSONDecodeError) as exc:
        result.errors.append(f"invalid governance metadata: {exc}")
        return result

    if metadata is None:
        if allow_bootstrap and titles == [BOOTSTRAP_TITLE]:
            result.warnings.append("bootstrap exception: active goal predates the v1 metadata contract")
            result.details["bootstrap_exception"] = True
            return result
        result.errors.append("missing nestcalc-governance v1 metadata block")
        return result

    required = {
        "schema_version", "flow_id", "repository", "active_goal_title", "goal_sha256",
        "goal_memory_commit", "branch_intent", "execution_route", "publication_route",
        "skills", "protected_surfaces", "agent_roster",
    }
    check_exact_keys(metadata, required, required, result)
    if metadata.get("schema_version") != GOAL_SCHEMA:
        result.errors.append(f"schema_version must be {GOAL_SCHEMA}")
    if not FLOW_RE.fullmatch(str(metadata.get("flow_id", ""))):
        result.errors.append("flow_id must match NC-YYYYMMDD-<8 lowercase hex>")
    if metadata.get("repository") != REPOSITORY:
        result.errors.append(f"repository must be {REPOSITORY}")
    if len(titles) == 1 and metadata.get("active_goal_title") != titles[0]:
        result.errors.append("active_goal_title must exactly match the Active Goal heading")
    if not SHA_RE.fullmatch(str(metadata.get("goal_memory_commit", ""))):
        result.errors.append("goal_memory_commit must be a full 40-character SHA")
    if not is_safe_feature_branch(metadata.get("branch_intent")):
        result.errors.append("branch_intent must be a safe slash-qualified feature branch")
    if not SAFE_LABEL_RE.fullmatch(str(metadata.get("execution_route", ""))):
        result.errors.append("execution_route must be a safe named route")
    if metadata.get("publication_route") != "feature-pr":
        result.errors.append("publication_route must be feature-pr")
    skills = metadata.get("skills")
    if not isinstance(skills, list) or not all(isinstance(item, str) and item for item in skills):
        result.errors.append("skills must be a string array")
    elif len(skills) != len(set(skills)):
        result.errors.append("skills entries must be unique")
    surfaces = metadata.get("protected_surfaces")
    if not isinstance(surfaces, list) or not surfaces or not all(
        isinstance(item, str) and item for item in surfaces
    ):
        result.errors.append("protected_surfaces must be a non-empty string array")
    elif len(surfaces) != len(set(surfaces)):
        result.errors.append("protected_surfaces entries must be unique")
    validate_agent_roster(metadata.get("agent_roster"), result)
    expected_hash = computed_goal_hash(text, metadata)
    result.details["computed_goal_sha256"] = expected_hash
    if metadata.get("goal_sha256") != expected_hash:
        result.errors.append(
            f"goal_sha256 mismatch: declared={metadata.get('goal_sha256')} computed={expected_hash}"
        )
    scan_sensitive(metadata, result)
    result.details["flow_id"] = metadata.get("flow_id")
    result.details["branch_intent"] = metadata.get("branch_intent")
    return result


def validate_handoff_data(data: dict[str, Any], subject: str = "execution-handoff") -> Result:
    result = Result(subject)
    required = {
        "schema_version", "flow_id", "repository", "goal_sha256", "goal_memory_commit",
        "branch_intent", "execution_route", "publication_route", "prompt_sha256", "agent_roster",
    }
    check_exact_keys(data, required, required, result)
    if data.get("schema_version") != HANDOFF_SCHEMA:
        result.errors.append(f"schema_version must be {HANDOFF_SCHEMA}")
    if not FLOW_RE.fullmatch(str(data.get("flow_id", ""))):
        result.errors.append("invalid flow_id")
    if data.get("repository") != REPOSITORY:
        result.errors.append(f"repository must be {REPOSITORY}")
    for key in ("goal_sha256", "prompt_sha256"):
        if not HASH_RE.fullmatch(str(data.get(key, ""))):
            result.errors.append(f"{key} must be a sha256 digest")
    if not SHA_RE.fullmatch(str(data.get("goal_memory_commit", ""))):
        result.errors.append("goal_memory_commit must be a full SHA")
    if not is_safe_feature_branch(data.get("branch_intent")):
        result.errors.append("branch_intent must be a safe slash-qualified feature branch")
    if not SAFE_LABEL_RE.fullmatch(str(data.get("execution_route", ""))):
        result.errors.append("execution_route must be a safe named route")
    if data.get("publication_route") != "feature-pr":
        result.errors.append("publication_route must be feature-pr")
    validate_agent_roster(data.get("agent_roster"), result)
    scan_sensitive(data, result)
    return result


def validate_closeout_data(data: dict[str, Any], subject: str = "closeout") -> Result:
    result = Result(subject)
    required = {
        "schema_version", "flow_id", "status", "disposition", "goal_memory_commit",
        "implementation_commit", "reviewed_commit", "pr", "limitations",
    }
    allowed = required | {"blocker", "human_action_required"}
    check_exact_keys(data, required, allowed, result)
    if data.get("schema_version") != CLOSEOUT_SCHEMA:
        result.errors.append(f"schema_version must be {CLOSEOUT_SCHEMA}")
    if not FLOW_RE.fullmatch(str(data.get("flow_id", ""))):
        result.errors.append("invalid flow_id")
    status = data.get("status")
    disposition = data.get("disposition")
    if status not in {"completed", "blocked"}:
        result.errors.append("status must be completed or blocked")
    if disposition not in {"merge-ready", "suspend-merge", "rollback-required"}:
        result.errors.append("invalid closeout disposition")
    for key in ("goal_memory_commit", "implementation_commit", "reviewed_commit"):
        if not SHA_RE.fullmatch(str(data.get(key, ""))):
            result.errors.append(f"{key} must be a full SHA")
    if data.get("goal_memory_commit") == data.get("implementation_commit"):
        result.errors.append("goal-memory and implementation commits must be distinct")
    if data.get("reviewed_commit") == data.get("goal_memory_commit"):
        result.errors.append("reviewed_commit cannot be the goal-memory commit")
    if "human_action_required" in data and (
        not isinstance(data["human_action_required"], str)
        or not data["human_action_required"].strip()
    ):
        result.errors.append("human_action_required must be non-empty when present")
    if not isinstance(data.get("limitations"), list) or not all(isinstance(item, str) for item in data.get("limitations", [])):
        result.errors.append("limitations must be a string array")
    pr = data.get("pr")
    if not isinstance(pr, dict):
        result.errors.append("pr must be an object")
    else:
        pr_required = {"number", "url", "state", "draft", "ready_for_review"}
        check_exact_keys(pr, pr_required, pr_required, result)
        if status == "completed":
            if not isinstance(pr.get("number"), int) or pr.get("number", 0) < 1:
                result.errors.append("completed closeout requires a positive pr.number")
            if not PR_URL_RE.fullmatch(str(pr.get("url", ""))):
                result.errors.append("completed closeout requires a NestCalc GitHub PR URL")
            if disposition != "merge-ready":
                result.errors.append("completed closeout must use merge-ready disposition")
            if pr.get("state") != "open" or pr.get("draft") is not False or pr.get("ready_for_review") is not True:
                result.errors.append("completed closeout requires an open, non-draft, ready-for-review PR")
            if data.get("blocker") not in (None, ""):
                result.errors.append("completed closeout cannot declare a blocker")
        elif status == "blocked":
            if pr.get("number") is not None and (
                not isinstance(pr.get("number"), int) or pr.get("number", 0) < 1
            ):
                result.errors.append("blocked closeout pr.number must be positive or null")
            if pr.get("url") is not None and not PR_URL_RE.fullmatch(str(pr.get("url"))):
                result.errors.append("blocked closeout pr.url must be a NestCalc PR URL or null")
            if disposition == "merge-ready":
                result.errors.append("blocked closeout cannot use merge-ready disposition")
            if not isinstance(data.get("blocker"), str) or not data.get("blocker", "").strip():
                result.errors.append("blocked closeout must report the exact blocker")
    scan_sensitive(data, result)
    return result


def validate_snapshot_data(data: dict[str, Any], subject: str = "post-merge-snapshot") -> Result:
    result = Result(subject)
    required = {
        "schema_version", "snapshot_id", "captured_at", "repository", "branch", "branch_tip",
        "merged_pr", "main_sha", "working_tree", "pending_lessons",
    }
    check_exact_keys(data, required, required, result)
    if data.get("schema_version") != SNAPSHOT_SCHEMA:
        result.errors.append(f"schema_version must be {SNAPSHOT_SCHEMA}")
    if not re.fullmatch(r"[0-9a-f]{16}", str(data.get("snapshot_id", ""))):
        result.errors.append("snapshot_id must be 16 lowercase hex characters")
    try:
        datetime.fromisoformat(str(data.get("captured_at", "")).replace("Z", "+00:00"))
    except ValueError:
        result.errors.append("captured_at must be an ISO-8601 timestamp")
    if data.get("repository") != REPOSITORY:
        result.errors.append(f"repository must be {REPOSITORY}")
    if not is_safe_feature_branch(data.get("branch")):
        result.errors.append("branch must be a safe slash-qualified feature branch")
    for key in ("branch_tip", "main_sha"):
        if not SHA_RE.fullmatch(str(data.get(key, ""))):
            result.errors.append(f"{key} must be a full SHA")
    merged_pr = data.get("merged_pr")
    if not isinstance(merged_pr, dict) or merged_pr.get("state") != "merged":
        result.errors.append("merged_pr must record state=merged")
    elif not PR_URL_RE.fullmatch(str(merged_pr.get("url", ""))):
        result.errors.append("merged_pr.url must be a NestCalc GitHub PR URL")
    tree = data.get("working_tree")
    if not isinstance(tree, dict) or tree.get("clean") is not True:
        result.errors.append("post-merge snapshot requires a clean working tree")
    elif not HASH_RE.fullmatch(str(tree.get("status_sha256", ""))):
        result.errors.append("working_tree.status_sha256 must be a sha256 digest")
    lessons = data.get("pending_lessons")
    if not isinstance(lessons, dict) or lessons.get("state") not in {"none", "pending", "applied"}:
        result.errors.append("pending_lessons.state is invalid")
    elif not HASH_RE.fullmatch(str(lessons.get("lessons_sha256", ""))):
        result.errors.append("pending_lessons.lessons_sha256 must be a sha256 digest")
    scan_sensitive(data, result)
    return result


def validate_json_file(path: Path, kind: str) -> Result:
    try:
        data = read_json(path)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        return Result(f"{kind}:{path}", errors=[str(exc)])
    validators = {
        "handoff": validate_handoff_data,
        "closeout": validate_closeout_data,
        "snapshot": validate_snapshot_data,
    }
    return validators[kind](data, f"{kind}:{path}")


CLOSEOUT_BREAKDOWN_SECTIONS = (
    "### 1. Summary",
    "### 2. Decision Path",
    "### 3. Responsibility Breakdown",
    "### 4. Verification Evidence",
    "### 5. Prior Findings Status",
    "### 6. Remaining Items",
    "### 7. Lessons Learned",
    "### 8. Merge Disposition",
    "### Overall Assessment",
)
CLOSEOUT_ASSESSMENT_ALIGNMENT = {
    "merge-ready": {"Approve", "Comment Only"},
    "suspend-merge": {"Comment Only"},
    "rollback-required": {"Request Changes"},
}
CLOSEOUT_BREAKDOWN_SENTINEL = "END OF PR CLOSEOUT BREAKDOWN"


def classify_fixture(path: Path) -> str:
    name = path.name
    if name.startswith("goal-") or name == "goal.md":
        return "goal"
    if name.startswith("execution-handoff"):
        return "handoff"
    if name.startswith("closeout-breakdown"):
        return "closeout-breakdown"
    if name.startswith("closeout"):
        return "closeout"
    if name.startswith("post-merge"):
        return "snapshot"
    raise ValueError(f"unknown fixture kind: {path}")


def extract_closeout_breakdown_field(section: str, label: str) -> str:
    match = re.search(rf"\*\*{re.escape(label)}:\*\*\s*(.+)", section)
    return match.group(1).strip() if match else ""


def extract_closeout_breakdown_assessment(text: str) -> str | None:
    if "### Overall Assessment" not in text:
        return None
    section = text.split("### Overall Assessment", 1)[1]
    for stop in (CLOSEOUT_BREAKDOWN_SENTINEL, "---"):
        if stop in section:
            section = section.split(stop, 1)[0]
    match = re.search(r"\*\*(Approve|Request Changes|Comment Only)\*\*", section)
    return match.group(1) if match else None


def validate_closeout_breakdown_text(text: str, subject: str = "closeout-breakdown") -> Result:
    result = Result(subject)
    if "## PR Closeout Breakdown" not in text:
        result.errors.append("missing ## PR Closeout Breakdown header")
    for heading in CLOSEOUT_BREAKDOWN_SECTIONS:
        if heading not in text:
            result.errors.append(f"missing required section: {heading}")
    if CLOSEOUT_BREAKDOWN_SENTINEL not in text:
        result.errors.append(f"missing sentinel: {CLOSEOUT_BREAKDOWN_SENTINEL}")

    flow_match = re.search(r"\*\*Flow ID:\*\*\s*`(NC-[0-9]{8}-[0-9a-f]{8})`", text)
    if flow_match:
        result.details["flow_id"] = flow_match.group(1)
    else:
        result.errors.append("closeout breakdown missing required Flow ID")

    commit_match = re.search(r"\*\*Reviewed commit:\*\*\s*`([0-9a-f]{7,40})`", text)
    if commit_match:
        result.details["reviewed_commit"] = commit_match.group(1)
    else:
        result.errors.append("missing Reviewed commit SHA")

    assessment = extract_closeout_breakdown_assessment(text)
    if assessment is None:
        result.errors.append(
            "Overall Assessment must declare **Approve**, **Request Changes**, or **Comment Only**"
        )
    else:
        result.details["assessment"] = assessment

    if "### 8. Merge Disposition" in text:
        section = text.split("### 8. Merge Disposition", 1)[1]
        for stop in ("### Overall Assessment", CLOSEOUT_BREAKDOWN_SENTINEL, "---"):
            if stop in section:
                section = section.split(stop, 1)[0]
        signal = extract_closeout_breakdown_field(section, "Signal")
        rationale = extract_closeout_breakdown_field(section, "Rationale")
        if signal not in CLOSEOUT_ASSESSMENT_ALIGNMENT:
            result.errors.append("section 8 Signal must be merge-ready, suspend-merge, or rollback-required")
        if not rationale:
            result.errors.append("section 8 Rationale is required")
        if signal == "rollback-required" and "**Rollback steps:**" not in section:
            result.errors.append("rollback-required closeout must include Rollback steps")
        if signal and assessment:
            allowed = CLOSEOUT_ASSESSMENT_ALIGNMENT.get(signal, set())
            if assessment not in allowed:
                result.errors.append(
                    f"Overall Assessment {assessment!r} is incompatible with signal {signal!r}"
                )
        result.details["signal"] = signal
    return result


def validate_closeout_breakdown_file(path: Path) -> Result:
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        return Result(f"closeout-breakdown:{path}", errors=[str(exc)])
    return validate_closeout_breakdown_text(text, subject=f"closeout-breakdown:{path}")


def validate_fixture(path: Path) -> Result:
    kind = classify_fixture(path)
    if kind == "goal":
        return validate_goal(path, allow_bootstrap=False)
    if kind == "closeout-breakdown":
        return validate_closeout_breakdown_file(path)
    return validate_json_file(path, kind)


def validate_manifest(root: Path) -> tuple[Result, dict[str, Any] | None]:
    result = Result("manifest")
    path = root / "docs/governance/manifest.json"
    try:
        manifest = read_json(path)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        result.errors.append(str(exc))
        return result, None
    if manifest.get("schema_version") != "nestcalc-governance-manifest-v1":
        result.errors.append("unsupported manifest schema_version")
    if manifest.get("repository") != REPOSITORY:
        result.errors.append(f"repository must be {REPOSITORY}")
    required_authority = {
        "glossary": "docs/GLOSSARY.md",
        "traveler": "docs/templates/traveler.md",
        "packet": "docs/templates/packet.md",
        "packslip": "docs/templates/packslip.md",
        "nonconformance": "docs/templates/nonconformance.md",
    }
    for label, relative_path in required_authority.items():
        if not (root / relative_path).is_file():
            result.errors.append(f"missing required authority: {relative_path}")
        else:
            result.details[label] = "required"
    result.details["execution_sidecar"] = "optional"
    for rel in manifest.get("required_paths", []):
        if not (root / rel).is_file():
            result.errors.append(f"missing required path: {rel}")
    contracts = manifest.get("contracts", {})
    if not isinstance(contracts, dict):
        result.errors.append("contracts must be an object")
    else:
        for rel in contracts.values():
            target = root / str(rel)
            try:
                schema = read_json(target)
            except (OSError, ValueError, json.JSONDecodeError) as exc:
                result.errors.append(f"invalid schema {rel}: {exc}")
                continue
            if schema.get("$schema") != "https://json-schema.org/draft/2020-12/schema":
                result.errors.append(f"schema {rel} must declare JSON Schema 2020-12")
    return result, manifest


def aggregate_check(root: Path, mode: str) -> Result:
    result = Result("nestcalc-governance-check", details={"mode": mode})
    mode_path = root / "docs/governance/MODE"
    configured_mode = mode_path.read_text(encoding="utf-8").strip() if mode_path.is_file() else ""
    if configured_mode not in {"advisory", "enforce"}:
        result.errors.append("docs/governance/MODE must be advisory or enforce")
    manifest_result, manifest = validate_manifest(root)
    result.merge(manifest_result)
    result.details.update(manifest_result.details)
    if manifest:
        fixtures = manifest.get("fixtures", {})
        valid_count = 0
        invalid_count = 0
        fixture_outcomes: list[dict[str, str]] = []
        for rel in fixtures.get("valid", []):
            checked = validate_fixture(root / rel)
            if not checked.ok:
                result.errors.append(f"valid fixture rejected: {rel}: {'; '.join(checked.errors)}")
                fixture_outcomes.append({"fixture": rel, "expected": "valid", "outcome": "rejected"})
            else:
                fixture_outcomes.append({"fixture": rel, "expected": "valid", "outcome": "accepted"})
            valid_count += 1
        for rel in fixtures.get("invalid", []):
            fixture_path = root / rel
            access = fixture_access_check(fixture_path)
            if not access.ok:
                result.errors.append(
                    f"invalid fixture missing or unreadable: {rel}: {'; '.join(access.errors)}"
                )
                fixture_outcomes.append(
                    {"fixture": rel, "expected": "invalid", "outcome": "missing"}
                )
                continue
            checked = validate_fixture(fixture_path)
            if checked.ok:
                result.errors.append(f"invalid fixture accepted: {rel}")
                fixture_outcomes.append({"fixture": rel, "expected": "invalid", "outcome": "accepted"})
            else:
                fixture_outcomes.append({"fixture": rel, "expected": "invalid", "outcome": "rejected"})
                invalid_count += 1
        listed = {
            str(rel)
            for category in ("valid", "invalid")
            for rel in fixtures.get(category, [])
        }
        supplemental_outcomes: list[dict[str, str]] = []
        for expected in ("valid", "invalid"):
            fixture_dir = root / "docs/governance/fixtures" / expected
            if not fixture_dir.is_dir():
                continue
            for fixture_path in sorted(path for path in fixture_dir.iterdir() if path.is_file()):
                rel = fixture_path.relative_to(root).as_posix()
                if rel in listed:
                    continue
                checked = validate_fixture(fixture_path)
                accepted = checked.ok
                correct = accepted if expected == "valid" else not accepted
                outcome = "accepted" if accepted else "rejected"
                supplemental_outcomes.append(
                    {"fixture": rel, "expected": expected, "outcome": outcome}
                )
                if not correct:
                    detail = "; ".join(checked.errors) if checked.errors else "fixture unexpectedly passed"
                    result.errors.append(
                        f"supplemental {expected} fixture produced {outcome}: {rel}: {detail}"
                    )
        result.details["valid_fixtures"] = valid_count
        result.details["invalid_fixtures"] = invalid_count
        result.details["fixture_outcomes"] = fixture_outcomes
        result.details["supplemental_fixture_outcomes"] = supplemental_outcomes
    active = validate_goal(root / "GOAL.md", allow_bootstrap=mode == "advisory")
    result.merge(active)
    result.details["advisory_mode"] = configured_mode == "advisory"
    return result


def fixture_access_check(path: Path) -> Result:
    """Distinguish missing/unreadable fixtures from semantic validation failures."""
    result = Result(f"fixture-access:{path}")
    if not path.is_file():
        result.errors.append("fixture path is missing or not a regular file")
        return result
    try:
        with path.open("rb"):
            pass
    except OSError as exc:
        result.errors.append(str(exc))
    return result


def goal_commit_check(root: Path, commit: str) -> Result:
    result = Result(f"goal-memory-commit:{commit}")
    if not SHA_RE.fullmatch(commit):
        result.errors.append("goal-memory commit must be a full 40-character SHA")
        return result
    exists = command(root, "git", "cat-file", "-e", f"{commit}^{{commit}}")
    if exists.returncode:
        result.errors.append(f"goal-memory commit does not exist: {exists.stderr.strip()}")
        return result
    paths = git(root, "diff-tree", "--root", "--no-commit-id", "--name-only", "-r", commit).splitlines()
    if "GOAL.md" not in paths:
        result.errors.append("goal-memory commit must contain GOAL.md")
    implementation = [
        path for path in paths
        if path in IMPLEMENTATION_FILES or path.startswith(IMPLEMENTATION_PREFIXES)
    ]
    if implementation:
        result.errors.append(f"goal-memory commit contains implementation paths: {', '.join(implementation)}")
    ancestor = command(root, "git", "merge-base", "--is-ancestor", commit, "HEAD")
    if ancestor.returncode:
        result.errors.append("goal-memory commit must be an ancestor of HEAD")
    result.details["paths"] = paths
    return result


def require_committed_goal(root: Path, goal_path: Path) -> Result:
    """Reject create-handoff when GOAL.md is dirty or not committed at HEAD.

    goal_memory_commit may predate a later metadata-only commit; handoff still
    must hash the committed worktree goal, not an uncommitted edit.
    """
    result = Result("committed-goal")
    try:
        rel = goal_path.resolve().relative_to(root.resolve()).as_posix()
    except ValueError:
        result.errors.append("goal path must be inside the repository")
        return result
    status = command(root, "git", "status", "--porcelain=v1", "--untracked-files=all", "--", rel)
    if status.returncode:
        result.errors.append(f"unable to inspect goal status: {status.stderr.strip()}")
        return result
    if status.stdout.strip():
        result.errors.append(
            f"goal has uncommitted changes ({rel}); commit the goal before create-handoff"
        )
        return result
    show = command(root, "git", "show", f"HEAD:{rel}")
    if show.returncode:
        result.errors.append(f"goal is not committed at HEAD: {rel}")
        return result
    try:
        worktree = goal_path.read_text(encoding="utf-8")
    except OSError as exc:
        result.errors.append(str(exc))
        return result
    if normalized_text(worktree) != normalized_text(show.stdout):
        result.errors.append(
            f"worktree goal content does not match committed HEAD content ({rel})"
        )
    result.details["goal_path"] = rel
    return result


def create_handoff(root: Path, args: argparse.Namespace) -> Result:
    result = Result("create-handoff")
    # Fail closed on dirty/uncommitted goals before hashing worktree content into artifacts.
    result.merge(require_committed_goal(root, args.goal))
    goal_result = validate_goal(args.goal, allow_bootstrap=False)
    result.errors.extend(goal_result.errors)
    result.warnings.extend(goal_result.warnings)
    result.details.update(goal_result.details)
    if not result.ok:
        return result
    metadata = extract_goal_metadata(args.goal.read_text(encoding="utf-8")) or {}
    result.merge(goal_commit_check(root, args.goal_memory_commit))
    if metadata.get("goal_memory_commit") != args.goal_memory_commit:
        result.errors.append("supplied goal-memory commit does not match goal metadata")
    current_branch = git(root, "branch", "--show-current")
    if current_branch != metadata.get("branch_intent"):
        result.errors.append(
            f"current branch {current_branch!r} does not match branch_intent {metadata.get('branch_intent')!r}"
        )
    prompt = args.prompt_file.read_bytes()
    decoded = prompt.decode("utf-8", errors="replace")
    if SECRET_VALUE_RE.search(decoded):
        result.errors.append("prompt file appears to contain a secret")
    artifact = {
        "schema_version": HANDOFF_SCHEMA,
        "flow_id": metadata.get("flow_id"),
        "repository": REPOSITORY,
        "goal_sha256": metadata.get("goal_sha256"),
        "goal_memory_commit": args.goal_memory_commit,
        "branch_intent": metadata.get("branch_intent"),
        "execution_route": metadata.get("execution_route"),
        "publication_route": "feature-pr",
        "prompt_sha256": sha256_bytes(prompt),
        "agent_roster": metadata.get("agent_roster"),
    }
    result.merge(validate_handoff_data(artifact))
    if result.ok:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(artifact, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        result.details["output"] = str(args.output)
        result.details["artifact"] = artifact
    return result


def gh_pr(root: Path, pr_number: int) -> dict[str, Any]:
    run = command(root, "gh", "pr", "view", str(pr_number), "--json", "number,url,state,isDraft")
    if run.returncode:
        raise RuntimeError(f"gh pr view failed: {run.stderr.strip()}")
    data = json.loads(run.stdout)
    return data


def capture_post_merge(root: Path, args: argparse.Namespace) -> Result:
    result = Result("capture-post-merge")
    try:
        pr = gh_pr(root, args.pr_number)
        if str(pr.get("state", "")).upper() != "MERGED":
            result.errors.append("post-merge capture requires a merged PR")
            return result
        branch_tip = git(root, "rev-parse", args.branch)
        main_sha = git(root, "rev-parse", "origin/main")
        status = git(root, "status", "--porcelain=v1", "-uall")
        lessons_hash = sha256_bytes((root / "LESSONS_LEARNED.md").read_bytes())
    except (OSError, RuntimeError, ValueError, json.JSONDecodeError) as exc:
        result.errors.append(str(exc))
        return result
    canonical = json.dumps(
        {"branch": args.branch, "branch_tip": branch_tip, "main_sha": main_sha, "pr": pr["number"]},
        sort_keys=True,
        separators=(",", ":"),
    )
    artifact = {
        "schema_version": SNAPSHOT_SCHEMA,
        "snapshot_id": hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:16],
        "captured_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "repository": REPOSITORY,
        "branch": args.branch,
        "branch_tip": branch_tip,
        "merged_pr": {"number": pr["number"], "url": pr["url"], "state": "merged"},
        "main_sha": main_sha,
        "working_tree": {"clean": status == "", "status_sha256": sha256_text(status)},
        "pending_lessons": {"state": args.lesson_state, "lessons_sha256": lessons_hash},
    }
    result.merge(validate_snapshot_data(artifact))
    if result.ok:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(artifact, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        result.details["output"] = str(args.output)
    return result


def verify_post_merge(root: Path, path: Path, *, live_pr: bool = True) -> Result:
    try:
        data = read_json(path)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        return Result("verify-post-merge", errors=[str(exc)])
    result = validate_snapshot_data(data, "verify-post-merge")
    if not result.ok:
        return result
    comparisons = {
        "branch_tip": git(root, "rev-parse", data["branch"]),
        "main_sha": git(root, "rev-parse", "origin/main"),
    }
    status = git(root, "status", "--porcelain=v1", "-uall")
    comparisons["status_sha256"] = sha256_text(status)
    comparisons["lessons_sha256"] = sha256_bytes((root / "LESSONS_LEARNED.md").read_bytes())
    expected = {
        "branch_tip": data["branch_tip"],
        "main_sha": data["main_sha"],
        "status_sha256": data["working_tree"]["status_sha256"],
        "lessons_sha256": data["pending_lessons"]["lessons_sha256"],
    }
    for key, current in comparisons.items():
        if current != expected[key]:
            result.errors.append(f"stale snapshot: {key} changed since capture")
    if live_pr:
        try:
            pr = gh_pr(root, int(data["merged_pr"]["number"]))
            if str(pr.get("state", "")).upper() != "MERGED" or pr.get("url") != data["merged_pr"]["url"]:
                result.errors.append("stale snapshot: merged PR identity/state changed")
        except (RuntimeError, ValueError, json.JSONDecodeError) as exc:
            result.errors.append(str(exc))
    result.details["rechecked"] = sorted(comparisons)
    return result


def emit(result: Result, json_output: bool) -> int:
    payload = result.as_dict()
    if json_output:
        print(json.dumps(payload, indent=2, sort_keys=True))
    else:
        print(f"NESTCALC_GOVERNANCE_{'OK' if result.ok else 'FAIL'} subject={result.subject} status={payload['status']}")
        for warning in result.warnings:
            print(f"WARN {warning}")
        for error in result.errors:
            print(f"FAIL {error}")
        if result.details:
            print("DETAILS " + json.dumps(result.details, sort_keys=True))
    return 0 if result.ok else 1


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", type=Path, default=Path.cwd())
    parser.add_argument("--mode", choices=("advisory", "enforce"), default=None)
    parser.add_argument("--json", action="store_true")
    sub = parser.add_subparsers(dest="subcommand", required=True)

    sub.add_parser("check")
    goal = sub.add_parser("validate-goal")
    goal.add_argument("--goal", type=Path, default=Path("GOAL.md"))

    handoff = sub.add_parser("create-handoff")
    handoff.add_argument("--goal", type=Path, default=Path("GOAL.md"))
    handoff.add_argument("--prompt-file", type=Path, required=True)
    handoff.add_argument("--goal-memory-commit", required=True)
    handoff.add_argument("--output", type=Path, required=True)

    closeout = sub.add_parser("validate-closeout")
    closeout.add_argument("--input", type=Path, required=True)

    breakdown = sub.add_parser("validate-closeout-breakdown")
    breakdown.add_argument("--input", type=Path, required=True)

    capture = sub.add_parser("capture-post-merge")
    capture.add_argument("--pr-number", type=int, required=True)
    capture.add_argument("--branch", required=True)
    capture.add_argument("--lesson-state", choices=("none", "pending", "applied"), required=True)
    capture.add_argument("--output", type=Path, required=True)

    verify = sub.add_parser("verify-post-merge")
    verify.add_argument("--input", type=Path, required=True)
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    root = args.repo_root.resolve()
    mode_file = root / "docs/governance/MODE"
    mode = args.mode or (mode_file.read_text(encoding="utf-8").strip() if mode_file.is_file() else "advisory")

    if args.subcommand == "check":
        result = aggregate_check(root, mode)
    elif args.subcommand == "validate-goal":
        goal_path = args.goal if args.goal.is_absolute() else root / args.goal
        result = validate_goal(goal_path, allow_bootstrap=mode == "advisory")
    elif args.subcommand == "create-handoff":
        args.goal = args.goal if args.goal.is_absolute() else root / args.goal
        args.prompt_file = args.prompt_file if args.prompt_file.is_absolute() else root / args.prompt_file
        args.output = args.output if args.output.is_absolute() else root / args.output
        result = create_handoff(root, args)
    elif args.subcommand == "validate-closeout":
        path = args.input if args.input.is_absolute() else root / args.input
        result = validate_json_file(path, "closeout")
    elif args.subcommand == "validate-closeout-breakdown":
        path = args.input if args.input.is_absolute() else root / args.input
        result = validate_closeout_breakdown_file(path)
    elif args.subcommand == "capture-post-merge":
        args.output = args.output if args.output.is_absolute() else root / args.output
        result = capture_post_merge(root, args)
    else:
        path = args.input if args.input.is_absolute() else root / args.input
        result = verify_post_merge(root, path)
    return emit(result, args.json)


if __name__ == "__main__":
    raise SystemExit(main())
