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
