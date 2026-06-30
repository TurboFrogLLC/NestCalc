"use client";

import { useState } from "react";
import { round3 } from "@/lib/units";

interface NumberInputProps {
  label: string;
  value: number | null;
  unit?: string;
  onChange: (value: number | null) => void;
}

function formatValue(value: number | null): string {
  if (value === null) return "—";
  return Number.isFinite(value) ? String(value) : "—";
}

function parseInput(text: string): number | null {
  const trimmed = text.trim();
  if (!trimmed || trimmed === "—" || trimmed === "-" || trimmed === ".") {
    return null;
  }
  const next = parseFloat(trimmed);
  return Number.isFinite(next) ? round3(Math.max(0, next)) : null;
}

export function NumberInput({ label, value, unit, onChange }: NumberInputProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const display = focused && draft !== null ? draft : formatValue(value);

  const handleChange = (text: string) => {
    setDraft(text);
    onChange(parseInput(text));
  };

  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
        {label}
      </span>
      <div className="relative w-full min-w-0">
        {unit ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono text-[var(--muted)]">
            {unit}
          </span>
        ) : null}
        <input
          type="text"
          inputMode="decimal"
          value={display}
          onFocus={() => {
            setFocused(true);
            setDraft(value === null ? "" : formatValue(value));
          }}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={() => {
            setFocused(false);
            setDraft(null);
          }}
          className={`w-full min-w-0 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] py-3 pr-3 text-lg font-mono tabular-nums text-[var(--input-text)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] ${unit ? "pl-10" : "pl-3"}`}
        />
      </div>
    </label>
  );
}